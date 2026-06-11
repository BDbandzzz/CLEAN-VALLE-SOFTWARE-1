import { supabase } from '@/services/supabaseClient';

function isInvitationSession(session) {
  const invitationPending =
    session?.user?.user_metadata?.invitation_pending;
  const isPending =
    invitationPending === true || invitationPending === 'true';
  const isCompleted =
    invitationPending === false || invitationPending === 'false';

  return (
    isPending ||
    (!isCompleted && Boolean(session?.user?.invited_at))
  );
}

function getUrlParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));

  return {
    token: searchParams.get('token') || hashParams.get('token') || '',
    email: searchParams.get('email') || hashParams.get('email') || '',
    type: (
      searchParams.get('type') ||
      hashParams.get('type') ||
      ''
    ).toLowerCase(),
  };
}

function getInvitationLinkData() {
  const { token, email, type } = getUrlParams();

  if (!token || !email || type !== 'invite') return null;

  return {
    token,
    email: email.replace(/ /g, '+').trim().toLowerCase(),
    type: 'invite',
  };
}

export function hasInvitationToken() {
  return Boolean(getInvitationLinkData());
}

export async function getInvitationSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw new Error(error.message);
  return isInvitationSession(data.session) ? data.session : null;
}

export function subscribeToInvitationSession(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (isInvitationSession(session)) callback(session);
  });

  return () => subscription.unsubscribe();
}

export async function createInvitedUserPassword(password) {
  let session = await getInvitationSession();

  if (!session) {
    const invitation = getInvitationLinkData();

    if (!invitation) {
      throw new Error('La invitacion no es valida o ya fue utilizada.');
    }

    const { data, error } = await supabase.auth.verifyOtp({
      email: invitation.email,
      token: invitation.token,
      type: invitation.type,
    });

    if (error || !data.session?.user) {
      throw new Error(
        error?.message || 'La invitacion vencio o ya fue utilizada.'
      );
    }

    session = data.session;
  }

  const { error } = await supabase.auth.updateUser({
    password,
    data: {
      invitation_pending: false,
    },
  });

  if (error) throw new Error(error.message);
}

export function getInvitationUrlError() {
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));

  return (
    searchParams.get('error_description') ||
    hashParams.get('error_description') ||
    ''
  );
}
