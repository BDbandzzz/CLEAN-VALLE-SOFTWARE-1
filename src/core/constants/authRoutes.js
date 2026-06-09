export const APP_BASE_URL = 'http://localhost:5173';

export const AUTH_PATHS = Object.freeze({
  login: '/login',
  recoverPassword: '/recover-pass',
  resetPassword: '/reset-password',
});

export const AUTH_REDIRECT_URLS = Object.freeze({
  passwordRecovery: `${APP_BASE_URL}${AUTH_PATHS.resetPassword}`,
  emailConfirmation: `${APP_BASE_URL}${AUTH_PATHS.login}`,
  userInvitation: `${APP_BASE_URL}${AUTH_PATHS.resetPassword}`,
});
