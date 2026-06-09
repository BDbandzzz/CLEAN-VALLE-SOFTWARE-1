const MIN_PASSWORD_LENGTH = 8;

export const PASSWORD_REQUIREMENTS = [
  {
    id: 'length',
    label: `Minimo ${MIN_PASSWORD_LENGTH} caracteres`,
    validate: (password) => password.length >= MIN_PASSWORD_LENGTH,
  },
  {
    id: 'letter',
    label: 'Al menos una letra',
    validate: (password) => /[a-zA-Z]/.test(password),
  },
  {
    id: 'number',
    label: 'Al menos un numero',
    validate: (password) => /\d/.test(password),
  },
];

export function validateNewPassword(password, confirmation) {
  if (!password) {
    return 'Ingresa una nueva contrasena.';
  }

  const failedRequirement = PASSWORD_REQUIREMENTS.find(
    (requirement) => !requirement.validate(password)
  );

  if (failedRequirement) {
    return `La contrasena debe cumplir: ${failedRequirement.label.toLowerCase()}.`;
  }

  if (!confirmation) {
    return 'Confirma la nueva contrasena.';
  }

  if (password !== confirmation) {
    return 'Las contrasenas no coinciden.';
  }

  return '';
}
