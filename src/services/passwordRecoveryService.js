import { AUTH_REDIRECT_URLS } from '@/core/constants/authRoutes';
import { SERVICE_ERROR_MESSAGES } from '@/core/constants/errorMessages';
import { createServiceError } from '@/core/services/errorMessageService';
import { supabase } from '@/services/supabaseClient';

export function getPasswordRecoveryRedirectUrl() {
  return AUTH_REDIRECT_URLS.passwordRecovery;
}

export async function requestPasswordRecovery(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getPasswordRecoveryRedirectUrl(),
  });

  if (error) {
    throw createServiceError(
      error,
      SERVICE_ERROR_MESSAGES.auth.recoveryEmail
    );
  }
}

export async function getRecoverySession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw createServiceError(error, SERVICE_ERROR_MESSAGES.auth.recovery);
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
    throw createServiceError(error, SERVICE_ERROR_MESSAGES.auth.password);
  }
}

export function getRecoveryUrlError() {
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));

  const hasUrlError = Boolean(
    searchParams.get('error_description') ||
      hashParams.get('error_description')
  );

  return hasUrlError ? SERVICE_ERROR_MESSAGES.auth.recovery : '';
}
