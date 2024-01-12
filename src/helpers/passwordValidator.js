export function passwordValidator(password) {
  if (!password) return "Password can't be empty."
  if (password.length < 8) return 'Password must be at least 8 characters long.'

  // Vérification de la présence de majuscules
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.'
  }

  // Vérification de la présence de minuscules
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter.'
  }

  // Vérification de la présence de chiffres
  if (!/\d/.test(password)) {
    return 'Password must contain at least one digit.'
  }

  // Vérification de la présence de caractères spéciaux
  if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)) {
    return 'Password must contain at least one special character.'
  }

  return ''
}
