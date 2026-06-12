import {
  ALERT_DEFAULTS,
  ALERT_TYPES,
} from '@/core/constants/alertMessages';

const ALERT_EVENT = 'cleanvalle:alert';

function getMessage(value, fallback = ALERT_DEFAULTS.fallbackError) {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (typeof value?.message === 'string' && value.message.trim()) {
    return value.message.trim();
  }
  if (typeof value?.error_description === 'string') {
    return value.error_description.trim();
  }
  if (typeof value?.error === 'string' && value.error.trim()) {
    return value.error.trim();
  }
  if (typeof value?.msg === 'string' && value.msg.trim()) {
    return value.msg.trim();
  }
  return fallback;
}

export function showAlert({
  type = ALERT_TYPES.INFO,
  title,
  message,
  duration = ALERT_DEFAULTS.duration,
}) {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent(ALERT_EVENT, {
      detail: {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type,
        title,
        message: getMessage(message, ''),
        duration,
      },
    })
  );
}

export function showErrorAlert(error, options = {}) {
  showAlert({
    type: ALERT_TYPES.ERROR,
    title: options.title ?? ALERT_DEFAULTS.errorTitle,
    message: getMessage(error, options.fallback),
    duration: options.duration,
  });
}

export function showSuccessAlert(message, options = {}) {
  showAlert({
    type: ALERT_TYPES.SUCCESS,
    title: options.title ?? ALERT_DEFAULTS.successTitle,
    message,
    duration: options.duration,
  });
}

export function showWarningAlert(message, options = {}) {
  showAlert({
    type: ALERT_TYPES.WARNING,
    title: options.title ?? ALERT_DEFAULTS.warningTitle,
    message,
    duration: options.duration,
  });
}

export function showValidationAlert(errors, fallback = ALERT_DEFAULTS.validationTitle) {
  const messages = Object.values(errors ?? {}).flatMap((value) => {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object') return Object.values(value);
    return [];
  });

  showWarningAlert(messages.find(Boolean) ?? ALERT_DEFAULTS.validationTitle, {
    title: fallback,
  });

  window.requestAnimationFrame(() => {
    const invalidField = document.querySelector(
      '[aria-invalid="true"], input:invalid, select:invalid, textarea:invalid'
    );
    invalidField?.focus({ preventScroll: true });
    invalidField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

export function subscribeToAlerts(listener) {
  const handler = (event) => listener(event.detail);
  window.addEventListener(ALERT_EVENT, handler);
  return () => window.removeEventListener(ALERT_EVENT, handler);
}
