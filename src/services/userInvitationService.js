import { supabase } from '@/services/supabaseClient';

const INVITE_TYPE = 'invite';

const USER_METADATA = {
  INVITATION_PENDING: 'invitation_pending',
};

function parseBoolean(value) {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return null;
}

function getParams() {
  return {
    search: new URLSearchParams(window.location.search),
    hash: new URLSearchParams(
      window.location.hash.replace(/^#/, '')
    ),
  };
}

function getUrlParams() {
  const { search, hash } = getParams();

  return {
    token:
      search.get('token') ||
      hash.get('token') ||
      '',
    email:
      search.get('email') ||
      hash.get('email') ||
      '',
    type: (
      search.get('type') ||
      hash.get('type') ||
      ''
    ).toLowerCase(),
  };
}

function normalizeEmail(email) {
  try {
    return decodeURIComponent(email)
      .trim()
      .toLowerCase();
  } catch {
    return email.trim().toLowerCase();
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isInvitationSession(session) {
  const invitationPending = parseBoolean(
    session?.user?.user_metadata?.[
      USER_METADATA.INVITATION_PENDING
    ]
  );

  return invitationPending === true;
}

function getInvitationLinkData() {
  const { token, email, type } = getUrlParams();

  if (!token || !email || type !== INVITE_TYPE) {
    return null;
  }

  const normalizedEmail = normalizeEmail(
    email.replace(/ /g, '+')
  );

  if (!isValidEmail(normalizedEmail)) {
    return null;
  }

  return {
    token,
    email: normalizedEmail,
    type: INVITE_TYPE,
  };
}

async function verifyInvitation(invitation) {
  const { data, error } = await supabase.auth.verifyOtp({
    email: invitation.email,
    token: invitation.token,
    type: invitation.type,
  });

  if (error || !isInvitationSession(data?.session)) {
    throw new Error(
      error?.message ||
        'La invitación venció, ya fue utilizada o no está disponible.'
    );
  }

  return data.session;
}

export async function getInvitationSession() {
  const { data, error } =
    await supabase.auth.getSession();

  if (error) {
    throw new Error(
      error?.message ||
        'No fue posible obtener la sesión.'
    );
  }

  return isInvitationSession(data?.session)
    ? data.session
    : null;
}

export async function validateInvitationAccess() {
  const urlError = getInvitationUrlError();
  if (urlError) {
    throw new Error(urlError);
  }

  const invitation = getInvitationLinkData();
  const session = await getInvitationSession();

  if (session) {
    if (!invitation) return session;

    const sessionEmail = normalizeEmail(
      session.user?.email || ''
    );

    if (sessionEmail === invitation.email) {
      return session;
    }
  }

  if (!invitation) {
    throw new Error(
      'La invitación no es válida o ya fue utilizada.'
    );
  }

  return verifyInvitation(invitation);
}

export function subscribeToInvitationSession(
  callback
) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      if (!isInvitationSession(session)) {
        return;
      }

      try {
        callback(session);
      } catch (err) {
        console.error(
          'Error en callback de invitación:',
          err
        );
      }
    }
  );

  return () => subscription.unsubscribe();
}

export async function createInvitedUserPassword(
  password
) {
  const session = await validateInvitationAccess();

  if (!isInvitationSession(session)) {
    throw new Error(
      'La invitación ya fue utilizada o no está disponible.'
    );
  }

  const { error } =
    await supabase.auth.updateUser({
      password,
      data: {
        [USER_METADATA.INVITATION_PENDING]:
          false,
      },
    });

  if (error) {
    throw new Error(
      error?.message ||
        'No fue posible actualizar la contraseña.'
    );
  }

  return true;
}

function getInvitationUrlError() {
  const { search, hash } = getParams();

  return (
    search.get('error_description') ||
    hash.get('error_description') ||
    ''
  );
}
