import {
  CONTROLLED_ERROR_MESSAGES,
  SERVICE_ERROR_MESSAGES,
} from '@/core/constants/errorMessages';

export function getControlledErrorMessage(code, fallback) {
  return (
    CONTROLLED_ERROR_MESSAGES[String(code ?? '')] ??
    fallback ??
    SERVICE_ERROR_MESSAGES.fallback
  );
}

export function createUserError(message, options = {}) {
  const userError = new Error(
    options.code
      ? getControlledErrorMessage(options.code, message)
      : message || SERVICE_ERROR_MESSAGES.fallback
  );

  userError.code = options.code ?? '';
  userError.isUserFacing = true;
  userError.cause = options.cause;
  return userError;
}

export function createServiceError(error, fallback, controlledMessages = {}) {
  const code = String(error?.code ?? '');
  const message =
    controlledMessages[code] ??
    CONTROLLED_ERROR_MESSAGES[code] ??
    fallback ??
    SERVICE_ERROR_MESSAGES.fallback;

  return createUserError(message, { code, cause: error });
}

export function getUserErrorMessage(error, fallback) {
  if (typeof error === 'string' && error.trim()) return error.trim();
  if (error?.isUserFacing && error.message) return error.message;
  return fallback ?? SERVICE_ERROR_MESSAGES.fallback;
}
