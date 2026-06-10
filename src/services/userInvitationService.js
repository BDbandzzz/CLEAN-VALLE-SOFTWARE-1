import { supabase } from '@/services/supabaseClient';

function isPendingInvitation(session) {
  return session?.user?.user_metadata?.invitation_pending === true;
}

function getInvitationToken() {
  const searchParams = new URLSearchParams(window.location.search);
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');

  if (!tokenHash || type !== 'invite') return null;
  return tokenHash;
}

export function hasInvitationToken() {
  return Boolean(getInvitationToken());
}

export async function getInvitationSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw new Error(error.message);
  return isPendingInvitation(data.session) ? data.session : null;
}

export function subscribeToInvitationSession(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (isPendingInvitation(session)) callback(session);
  });

  return () => subscription.unsubscribe();
}

export async function createInvitedUserPassword(password) {
  let session = await getInvitationSession();

  if (!session) {
    const tokenHash = getInvitationToken();

    if (!tokenHash) {
      throw new Error('La invitación no es válida o ya fue utilizada.');
    }

    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'invite',
    });

    if (error || !isPendingInvitation(data.session)) {
      throw new Error('La invitación venció o ya fue utilizada.');
    }

    session = data.session;
    window.history.replaceState(
      window.history.state,
      '',
      window.location.pathname
    );
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
  const hashParams = new URLSearchParams(
    window.location.hash.replace(/^#/, '')
  );

  return (
    searchParams.get('error_description') ||
    hashParams.get('error_description') ||
    ''
  );
}
