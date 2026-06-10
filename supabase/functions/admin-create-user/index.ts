import { createClient } from 'npm:@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

const ADMIN_ROLE_ID = 5;
const ACTIVE_STATE_ID = 1;
const OPERATOR_ROLE_ID = 3;

type CreateUserPayload = {
  codeUser?: string;
  roleId?: number;
  typeDniId?: number;
  genderId?: number;
  firstName?: string;
  lastName?: string;
  dniUser?: string;
  email?: string;
  specializationIds?: number[];
  redirectTo?: string;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json',
    },
  });
}

function requiredString(value: unknown, field: string) {
  const normalized = String(value ?? '').trim();
  if (!normalized) {
    throw new Error(`El campo ${field} es obligatorio.`);
  }
  return normalized;
}

function requiredId(value: unknown, field: string) {
  const normalized = Number(value);
  if (!Number.isInteger(normalized) || normalized <= 0) {
    throw new Error(`El campo ${field} no es valido.`);
  }
  return normalized;
}

function normalizePayload(payload: CreateUserPayload) {
  const email = requiredString(payload.email, 'correo').toLowerCase();
  if (!/\S+@\S+\.\S+/.test(email)) {
    throw new Error('El correo electronico no es valido.');
  }

  const roleId = requiredId(payload.roleId, 'rol');
  if (roleId === ADMIN_ROLE_ID) {
    throw new Error('No se puede registrar otro administrador desde este modulo.');
  }

  const specializationIds = [
    ...new Set(
      (Array.isArray(payload.specializationIds)
        ? payload.specializationIds
        : []
      )
        .map(Number)
        .filter((id) => Number.isInteger(id) && id > 0)
    ),
  ];

  if (roleId === OPERATOR_ROLE_ID && specializationIds.length === 0) {
    throw new Error('Selecciona al menos una especialidad para el operador.');
  }

  return {
    codeUser: requiredString(payload.codeUser, 'codigo institucional'),
    roleId,
    typeDniId: requiredId(payload.typeDniId, 'tipo de documento'),
    genderId: requiredId(payload.genderId, 'genero'),
    firstName: requiredString(payload.firstName, 'nombres'),
    lastName: requiredString(payload.lastName, 'apellidos'),
    dniUser: requiredString(payload.dniUser, 'documento'),
    email,
    specializationIds,
  };
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Metodo no permitido.' }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const invitationRedirectUrl = Deno.env.get(
    'APP_INVITATION_REDIRECT_URL'
  );

  if (!supabaseUrl || !serviceRoleKey || !invitationRedirectUrl) {
    return jsonResponse(
      { error: 'La funcion de invitacion no esta configurada.' },
      500
    );
  }

  const authorization = request.headers.get('Authorization') ?? '';
  const accessToken = authorization.replace(/^Bearer\s+/i, '').trim();

  if (!accessToken) {
    return jsonResponse({ error: 'No se encontro una sesion valida.' }, 401);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  try {
    const {
      data: { user: requestingUser },
      error: authError,
    } = await adminClient.auth.getUser(accessToken);

    if (authError || !requestingUser) {
      return jsonResponse({ error: 'La sesion no es valida.' }, 401);
    }

    const { data: adminProfile, error: adminError } = await adminClient
      .from('users')
      .select('auth_id')
      .eq('auth_id', requestingUser.id)
      .eq('id_role', ADMIN_ROLE_ID)
      .eq('id_state', ACTIVE_STATE_ID)
      .is('deleted_at', null)
      .maybeSingle();

    if (adminError) {
      throw new Error(adminError.message);
    }

    if (!adminProfile) {
      return jsonResponse(
        { error: 'Esta operacion requiere un administrador activo.' },
        403
      );
    }

    const requestPayload = (await request.json()) as CreateUserPayload;
    const requestedRedirectUrl = requiredString(
      requestPayload.redirectTo,
      'URL de invitacion'
    );

    if (requestedRedirectUrl !== invitationRedirectUrl) {
      throw new Error(
        'La URL de invitacion no coincide con la configuracion de la funcion:' + requestedRedirectUrl + invitationRedirectUrl

      );
    }

    const payload = normalizePayload(requestPayload);

    const { data: invitationData, error: invitationError } =
      await adminClient.auth.admin.inviteUserByEmail(payload.email, {
        redirectTo: invitationRedirectUrl,
        data: {
          first_name: payload.firstName,
          last_name: payload.lastName,
          invitation_pending: true,
        },
      });

    if (invitationError) {
      throw new Error(invitationError.message);
    }

    const invitedUser = invitationData.user;
    if (!invitedUser) {
      throw new Error('Supabase no retorno el usuario invitado.');
    }

    const { data: profile, error: profileError } = await adminClient.rpc(
      'rpc_admin_create_user_profile',
      {
        p_auth_id: invitedUser.id,
        p_code_user: payload.codeUser,
        p_role_id: payload.roleId,
        p_type_dni_id: payload.typeDniId,
        p_gender_id: payload.genderId,
        p_first_name: payload.firstName,
        p_last_name: payload.lastName,
        p_dni_user: payload.dniUser,
        p_specialization_ids: payload.specializationIds,
      }
    );

    if (profileError) {
      await adminClient.auth.admin.deleteUser(invitedUser.id);
      throw new Error(profileError.message);
    }

    return jsonResponse(
      {
        user: {
          ...profile,
          email: payload.email,
        },
        invitationSent: true,
      },
      201
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'No fue posible registrar al usuario.';

    return jsonResponse({ error: message }, 400);
  }
});
