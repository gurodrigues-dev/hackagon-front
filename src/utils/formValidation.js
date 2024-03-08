
function formValidation ({nickname, email = null, password}) {
  const errors = {};
  const regularExpression = /^(?=.*[0-9])[a-zA-Z0-9]{6,}$/;

  if(!nickname.trim()) {
    errors.nickname = "Nickname é obrigatório";
  }

  if(email !== null ) {
    if (!email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'O campo Email inválido';
    }
  }

  if (!password.trim()) {
    errors.password = 'Senha é obrigatória';
  } else if (!regularExpression.test(password)) {
    errors.password = "A senha deve conter no mínimo 6 caracteres e um número"
  }

  return Object.keys(errors).length === 0 ? null : errors
}

export default formValidation;