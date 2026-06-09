import { AUTH_REDIRECT_URLS } from '@/core/constants/authRoutes';
import { supabase } from '@/services/supabaseClient';

export function getPasswordRecoveryRedirectUrl() {
  return AUTH_REDIRECT_URLS.passwordRecovery;
}

export async function requestPasswordRecovery(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getPasswordRecoveryRedirectUrl(),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function getRecoverySession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return data.session;
}

export function subscribeToPasswordRecovery(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      callback(session);
    }
  });

  return () => subscription.unsubscribe();
}

export async function updateRecoveredPassword(password) {
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    throw new Error(error.message);
  }
}

export function getRecoveryUrlError() {
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));

  return (
    searchParams.get('error_description') ||
    hashParams.get('error_description') ||
    ''
  );
}
