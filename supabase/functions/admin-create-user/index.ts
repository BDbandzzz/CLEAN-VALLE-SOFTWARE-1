import { createClient } from 'npm:@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

const ADMIN_ROLE_ID = 5;
const ACTIVE_STATE_ID = 1;
const OPERATOR_ROLE_ID = 3;

const ERROR_CODES = {
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  FUNCTION_NOT_CONFIGURED: 'FUNCTION_NOT_CONFIGURED',
  SESSION_REQUIRED: 'SESSION_REQUIRED',
  SESSION_INVALID: 'SESSION_INVALID',
  ADMIN_REQUIRED: 'ADMIN_REQUIRED',
  INVALID_PAYLOAD: 'INVALID_PAYLOAD',
  INVALID_EMAIL: 'INVALID_EMAIL',
  ADMIN_ROLE_NOT_ALLOWED: 'ADMIN_ROLE_NOT_ALLOWED',
  OPERATOR_SPECIALIZATION_REQUIRED: 'OPERATOR_SPECIALIZATION_REQUIRED',
  REDIRECT_MISMATCH: 'REDIRECT_MISMATCH',
  EMAIL_ALREADY_REGISTERED: 'EMAIL_ALREADY_REGISTERED',
  USER_CODE_ALREADY_REGISTERED: 'USER_CODE_ALREADY_REGISTERED',
  USER_DOCUMENT_ALREADY_REGISTERED: 'USER_DOCUMENT_ALREADY_REGISTERED',
  INVITATION_FAILED: 'INVITATION_FAILED',
  PROFILE_CREATION_FAILED: 'PROFILE_CREATION_FAILED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

class AppError extends Error {
  code: ErrorCode;
  status: number;

  constructor(code: ErrorCode, status = 400) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

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

function requiredString(value: unknown) {
  const normalized = String(value ?? '').trim();
  if (!normalized) {
    throw new AppError(ERROR_CODES.INVALID_PAYLOAD);
  }
  return normalized;
}

function requiredId(value: unknown) {
  const normalized = Number(value);
  if (!Number.isInteger(normalized) || normalized <= 0) {
    throw new AppError(ERROR_CODES.INVALID_PAYLOAD);
  }
  return normalized;
}

function normalizePayload(payload: CreateUserPayload) {
  const email = requiredString(payload.email).toLowerCase();
  if (!/\S+@\S+\.\S+/.test(email)) {
    throw new AppError(ERROR_CODES.INVALID_EMAIL);
  }

  const roleId = requiredId(payload.roleId);
  if (roleId === ADMIN_ROLE_ID) {
    throw new AppError(ERROR_CODES.ADMIN_ROLE_NOT_ALLOWED);
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
    throw new AppError(ERROR_CODES.OPERATOR_SPECIALIZATION_REQUIRED);
  }

  return {
    codeUser: requiredString(payload.codeUser),
    roleId,
    typeDniId: requiredId(payload.typeDniId),
    genderId: requiredId(payload.genderId),
    firstName: requiredString(payload.firstName),
    lastName: requiredString(payload.lastName),
    dniUser: requiredString(payload.dniUser),
    email,
    specializationIds,
  };
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ code: ERROR_CODES.METHOD_NOT_ALLOWED }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const invitationRedirectUrl = Deno.env.get(
    'APP_INVITATION_REDIRECT_URL'
  );

  if (!supabaseUrl || !serviceRoleKey || !invitationRedirectUrl) {
    return jsonResponse(
      { code: ERROR_CODES.FUNCTION_NOT_CONFIGURED },
      500
    );
  }

  const authorization = request.headers.get('Authorization') ?? '';
  const accessToken = authorization.replace(/^Bearer\s+/i, '').trim();

  if (!accessToken) {
    return jsonResponse({ code: ERROR_CODES.SESSION_REQUIRED }, 401);
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
      return jsonResponse({ code: ERROR_CODES.SESSION_INVALID }, 401);
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
      throw new AppError(ERROR_CODES.INTERNAL_ERROR, 500);
    }

    if (!adminProfile) {
      return jsonResponse(
        { code: ERROR_CODES.ADMIN_REQUIRED },
        403
      );
    }

    let requestPayload: CreateUserPayload;
    try {
      requestPayload = (await request.json()) as CreateUserPayload;
    } catch {
      throw new AppError(ERROR_CODES.INVALID_PAYLOAD);
    }

    const requestedRedirectUrl = requiredString(requestPayload.redirectTo);

    if (requestedRedirectUrl !== invitationRedirectUrl) {
      throw new AppError(ERROR_CODES.REDIRECT_MISMATCH);
    }

    const payload = normalizePayload(requestPayload);

    const { data: validationCode, error: validationError } =
      await adminClient.rpc('rpc_admin_validate_new_user', {
        p_code_user: payload.codeUser,
        p_dni_user: payload.dniUser,
      });

    if (validationError) {
      throw new AppError(ERROR_CODES.INTERNAL_ERROR, 500);
    }

    if (validationCode === ERROR_CODES.USER_CODE_ALREADY_REGISTERED) {
      throw new AppError(ERROR_CODES.USER_CODE_ALREADY_REGISTERED);
    }

    if (validationCode === ERROR_CODES.USER_DOCUMENT_ALREADY_REGISTERED) {
      throw new AppError(ERROR_CODES.USER_DOCUMENT_ALREADY_REGISTERED);
    }

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
      throw new AppError(
        invitationError.code === 'email_exists'
          ? ERROR_CODES.EMAIL_ALREADY_REGISTERED
          : ERROR_CODES.INVITATION_FAILED
      );
    }

    const invitedUser = invitationData.user;
    if (!invitedUser) {
      throw new AppError(ERROR_CODES.INVITATION_FAILED);
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
      throw new AppError(ERROR_CODES.PROFILE_CREATION_FAILED);
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
    if (error instanceof AppError) {
      return jsonResponse({ code: error.code }, error.status);
    }

    return jsonResponse({ code: ERROR_CODES.INTERNAL_ERROR }, 500);
  }
});
