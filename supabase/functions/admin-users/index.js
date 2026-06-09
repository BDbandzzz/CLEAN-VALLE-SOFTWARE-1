/* global Deno */
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ACTIVE_STATE_ID = 1;
const INACTIVE_STATE_ID = 2;
const OPERATOR_ROLE_ID = 3;
const ADMIN_ROLE_ID = 5;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function cleanSearch(value) {
  return String(value ?? '').trim().replace(/[,%()]/g, ' ');
}

function requiredString(value, field) {
  const normalized = String(value ?? '').trim();
  if (!normalized) throw new Error(`El campo ${field} es obligatorio.`);
  return normalized;
}

async function verifyAdmin(request, adminClient) {
  const authorization = request.headers.get('Authorization');
  if (!authorization) throw new Error('Sesión no encontrada.');

  const userClient = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_ANON_KEY'),
    { global: { headers: { Authorization: authorization } } }
  );
  const { data: authData, error: authError } = await userClient.auth.getUser();
  if (authError || !authData.user) throw new Error('Sesión inválida.');

  const { data: profile, error: profileError } = await adminClient
    .from('users')
    .select('auth_id,id_role,id_state,deleted_at')
    .eq('auth_id', authData.user.id)
    .single();

  if (profileError) throw profileError;
  if (
    profile.id_role !== ADMIN_ROLE_ID ||
    profile.id_state !== ACTIVE_STATE_ID ||
    profile.deleted_at
  ) {
    throw new Error('Esta operación requiere una cuenta de administrador activa.');
  }

  return authData.user;
}

async function enrichUsers(adminClient, users) {
  const authIds = users.map((user) => user.auth_id);
  if (!authIds.length) return [];

  const [profilesResult, specializationsResult, authResults] = await Promise.all([
    adminClient
      .from('operator_profile')
      .select('operator_uuid,current_active_reports,max_active_reports')
      .in('operator_uuid', authIds),
    adminClient
      .from('operator_specialization')
      .select(`
        operator_uuid,
        id_type_specialization,
        type_specialization(
          id_type_specialization,
          id_category,
          name_specialization,
          type_category(id_category,name,color_hex)
        )
      `)
      .in('operator_uuid', authIds),
    Promise.all(authIds.map((authId) => adminClient.auth.admin.getUserById(authId))),
  ]);

  if (profilesResult.error) throw profilesResult.error;
  if (specializationsResult.error) throw specializationsResult.error;

  const profileById = new Map(
    (profilesResult.data ?? []).map((profile) => [profile.operator_uuid, profile])
  );
  const specializationsById = (specializationsResult.data ?? []).reduce(
    (groups, assignment) => {
      const current = groups.get(assignment.operator_uuid) ?? [];
      if (assignment.type_specialization) {
        current.push(assignment.type_specialization);
      }
      groups.set(assignment.operator_uuid, current);
      return groups;
    },
    new Map()
  );
  const emailById = new Map(
    authResults
      .filter((result) => !result.error && result.data.user)
      .map((result) => [result.data.user.id, result.data.user.email ?? ''])
  );

  return users.map((user) => ({
    ...user,
    email: emailById.get(user.auth_id) ?? '',
    operator_profile: profileById.get(user.auth_id) ?? null,
    specializations: specializationsById.get(user.auth_id) ?? [],
  }));
}

async function getUser(adminClient, authId) {
  const { data, error } = await adminClient
    .from('users')
    .select(`
      code_user,
      auth_id,
      id_role,
      id_type_dni,
      id_gender,
      id_state,
      first_name,
      last_name,
      dni_user,
      deleted_at,
      roles(role_id,role_name,color_hex),
      type_dni(id_type_dni,dni_type),
      gender(id_gender,gender),
      state_element(id_state,type_state)
    `)
    .eq('auth_id', authId)
    .single();

  if (error) throw error;
  const [enriched] = await enrichUsers(adminClient, [data]);
  return enriched;
}

async function listUsers(adminClient, payload) {
  const page = Math.max(1, Number(payload.page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(payload.pageSize) || 10));
  const from = (page - 1) * pageSize;
  const search = cleanSearch(payload.search);

  let query = adminClient
    .from('users')
    .select(`
      code_user,
      auth_id,
      id_role,
      id_type_dni,
      id_gender,
      id_state,
      first_name,
      last_name,
      dni_user,
      deleted_at,
      roles(role_id,role_name,color_hex),
      type_dni(id_type_dni,dni_type),
      gender(id_gender,gender),
      state_element(id_state,type_state)
    `, { count: 'exact' })
    .order('first_name', { ascending: true })
    .range(from, from + pageSize - 1);

  if (payload.stateId) query = query.eq('id_state', Number(payload.stateId));
  if (payload.roleId) query = query.eq('id_role', Number(payload.roleId));
  if (search) {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,code_user.ilike.%${search}%,dni_user.ilike.%${search}%`
    );
  }

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    users: await enrichUsers(adminClient, data ?? []),
    total: count ?? 0,
  };
}

async function ensureUniqueCode(adminClient, codeUser, currentAuthId = null) {
  let query = adminClient
    .from('users')
    .select('auth_id')
    .ilike('code_user', codeUser);

  if (currentAuthId) query = query.neq('auth_id', currentAuthId);

  const { data, error } = await query.limit(1);
  if (error) throw error;
  if (data?.length) throw new Error('Ya existe un usuario con este código.');
}

async function replaceSpecializations(adminClient, authId, specializationIds) {
  const normalizedIds = [...new Set((specializationIds ?? []).map(Number))];

  if (normalizedIds.length) {
    const { data, error } = await adminClient
      .from('type_specialization')
      .select('id_type_specialization')
      .in('id_type_specialization', normalizedIds);
    if (error) throw error;
    if ((data ?? []).length !== normalizedIds.length) {
      throw new Error('Una o más especializaciones no existen.');
    }
  }

  const { error: deleteError } = await adminClient
    .from('operator_specialization')
    .delete()
    .eq('operator_uuid', authId);
  if (deleteError) throw deleteError;

  if (normalizedIds.length) {
    const { error: insertError } = await adminClient
      .from('operator_specialization')
      .insert(
        normalizedIds.map((specializationId) => ({
          operator_uuid: authId,
          id_type_specialization: specializationId,
        }))
      );
    if (insertError) throw insertError;
  }
}

async function ensureOperatorProfile(adminClient, authId) {
  const { data, error } = await adminClient
    .from('operator_profile')
    .select('operator_uuid')
    .eq('operator_uuid', authId)
    .maybeSingle();
  if (error) throw error;

  if (!data) {
    const { error: insertError } = await adminClient
      .from('operator_profile')
      .insert({ operator_uuid: authId, current_active_reports: 0 });
    if (insertError) throw insertError;
  }
}

async function removeOperatorProfile(adminClient, authId) {
  const { error: specializationError } = await adminClient
    .from('operator_specialization')
    .delete()
    .eq('operator_uuid', authId);
  if (specializationError) throw specializationError;

  const { error: profileError } = await adminClient
    .from('operator_profile')
    .delete()
    .eq('operator_uuid', authId);
  if (profileError) {
    throw new Error(
      `No se puede retirar el perfil de operador mientras tenga relaciones activas. ${profileError.message}`
    );
  }
}

async function createUser(adminClient, payload) {
  const codeUser = requiredString(payload.codeUser, 'code_user');
  const email = requiredString(payload.email, 'email').toLowerCase();
  const password = requiredString(payload.password, 'password');
  const roleId = Number(payload.roleId);

  if (password.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres.');
  }
  if (roleId === OPERATOR_ROLE_ID && !(payload.specializationIds ?? []).length) {
    throw new Error('Selecciona al menos una especialización para el operador.');
  }

  await ensureUniqueCode(adminClient, codeUser);

  const { data: authData, error: authError } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: requiredString(payload.firstName, 'first_name'),
        last_name: requiredString(payload.lastName, 'last_name'),
      },
    });
  if (authError) throw authError;

  const authId = authData.user.id;
  try {
    const { error: userError } = await adminClient.from('users').insert({
      code_user: codeUser,
      auth_id: authId,
      id_role: roleId,
      id_type_dni: Number(payload.typeDniId),
      id_gender: Number(payload.genderId),
      id_state: ACTIVE_STATE_ID,
      first_name: requiredString(payload.firstName, 'first_name'),
      last_name: requiredString(payload.lastName, 'last_name'),
      dni_user: requiredString(payload.dniUser, 'dni_user'),
      deleted_at: null,
    });
    if (userError) throw userError;

    if (roleId === OPERATOR_ROLE_ID) {
      await ensureOperatorProfile(adminClient, authId);
      await replaceSpecializations(
        adminClient,
        authId,
        payload.specializationIds
      );
    }

    return { user: await getUser(adminClient, authId) };
  } catch (error) {
    await adminClient
      .from('operator_specialization')
      .delete()
      .eq('operator_uuid', authId);
    await adminClient.from('operator_profile').delete().eq('operator_uuid', authId);
    await adminClient.from('users').delete().eq('auth_id', authId);
    await adminClient.auth.admin.deleteUser(authId);
    throw error;
  }
}

async function updateUser(adminClient, payload) {
  const authId = requiredString(payload.authId, 'auth_id');
  const codeUser = requiredString(payload.codeUser, 'code_user');
  const roleId = Number(payload.roleId);

  if (roleId === OPERATOR_ROLE_ID && !(payload.specializationIds ?? []).length) {
    throw new Error('Selecciona al menos una especialización para el operador.');
  }

  await ensureUniqueCode(adminClient, codeUser, authId);

  const authChanges = {};
  if (payload.email) authChanges.email = String(payload.email).trim().toLowerCase();
  if (payload.password) {
    if (String(payload.password).length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres.');
    }
    authChanges.password = payload.password;
  }

  if (Object.keys(authChanges).length) {
    const { error } = await adminClient.auth.admin.updateUserById(
      authId,
      authChanges
    );
    if (error) throw error;
  }

  const { error: userError } = await adminClient
    .from('users')
    .update({
      code_user: codeUser,
      id_role: roleId,
      id_type_dni: Number(payload.typeDniId),
      id_gender: Number(payload.genderId),
      first_name: requiredString(payload.firstName, 'first_name'),
      last_name: requiredString(payload.lastName, 'last_name'),
      dni_user: requiredString(payload.dniUser, 'dni_user'),
    })
    .eq('auth_id', authId);
  if (userError) throw userError;

  if (roleId === OPERATOR_ROLE_ID) {
    await ensureOperatorProfile(adminClient, authId);
    await replaceSpecializations(adminClient, authId, payload.specializationIds);
  } else {
    await removeOperatorProfile(adminClient, authId);
  }

  return { user: await getUser(adminClient, authId) };
}

async function setUserActive(adminClient, caller, payload, active) {
  const authId = requiredString(payload.authId, 'auth_id');
  if (!active && authId === caller.id) {
    throw new Error('No puedes desactivar tu propia cuenta.');
  }

  if (!active) {
    const { data: operatorProfile, error: profileError } = await adminClient
      .from('operator_profile')
      .select('current_active_reports')
      .eq('operator_uuid', authId)
      .maybeSingle();
    if (profileError) throw profileError;
    if ((operatorProfile?.current_active_reports ?? 0) > 0) {
      throw new Error(
        'El operador tiene reportes activos. Reasígnalos antes de desactivar la cuenta.'
      );
    }
  }

  const { error } = await adminClient
    .from('users')
    .update({
      id_state: active ? ACTIVE_STATE_ID : INACTIVE_STATE_ID,
      deleted_at: active ? null : new Date().toISOString(),
    })
    .eq('auth_id', authId);
  if (error) throw error;

  return { user: await getUser(adminClient, authId) };
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
    const caller = await verifyAdmin(request, adminClient);
    const { action, payload = {} } = await request.json();

    if (action === 'list') return json(await listUsers(adminClient, payload));
    if (action === 'create') return json(await createUser(adminClient, payload), 201);
    if (action === 'update') return json(await updateUser(adminClient, payload));
    if (action === 'deactivate') {
      return json(await setUserActive(adminClient, caller, payload, false));
    }
    if (action === 'reactivate') {
      return json(await setUserActive(adminClient, caller, payload, true));
    }

    return json({ error: 'Operación no soportada.' }, 400);
  } catch (error) {
    return json({ error: error.message || 'No se pudo completar la operación.' }, 400);
  }
});
