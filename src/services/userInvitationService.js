import { supabase } from '@/services/supabaseClient';

function isPendingInvitation(session) {
  return session?.user?.user_metadata?.invitation_pending === true;
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
  const { data: currentUser, error: userError } =
    await supabase.auth.getUser();

  if (
    userError ||
    !currentUser.user ||
    currentUser.user.user_metadata?.invitation_pending !== true
  ) {
    throw new Error('La invitación no es válida o ya fue utilizada.');
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
