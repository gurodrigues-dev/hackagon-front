
function formValidation ({
  nickname = null, 
  email = null, 
  password = null, 
  username = null,
  title = null, 
  description = null, 
  date = null, 
  level = null, 
  testCase = null
}) {
  const errors = {};
  const regularExpression = /^(?=.*[0-9])[a-zA-Z0-9]{6,}$/;

  if(nickname !== null) {
    if(!nickname.trim()) {
      errors.nickname = "Nickname é obrigatório";
    }
  }

  if(email !== null) {
    if (!email.trim()) {
      errors.email = 'Email é obrigatório!';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'O campo Email inválido!';
    }
  }

  if(password !== null) {
    if (!password.trim()) {
      errors.password = 'Senha é obrigatória';
    } else if (!regularExpression.test(password)) {
      errors.password = "A senha deve conter no mínimo 6 caracteres e um número"
    }
  }

  if(username !== null) {
    if(!username.trim()) {
      errors.username = "Usuário é obrigatório";
    }
  }

  if(title !== null) {
    if(!title.trim()) {
      errors.title = "Título é obrigatório!";
    }
  }

  if(description !== null) {
    if(!description.trim()) {
      errors.description = "Descrição é obrigatório!";
    }
  }

  if(date !== null) {
    if(!date.trim()) {
      errors.date = "Data é obrigatória!";
    }
  }

  if(level !== null) {
    if(!level.trim()) {
      errors.level = "Dificuldade é obrigatório!";
    }
  }

  if(testCase !== null) {
    testCase.forEach((element, index) => {
      errors[`testCase${index + 1}`] = {}

      const params = element.params.map((param) => {
        if(!param.trim()) {
          return "Obrigatório!"
        } else {
          return null
        }
      })
      
      errors[`testCase${index + 1}`].params = [...params];
      
      if(!element.response.trim()) {
        errors[`testCase${index + 1}`].response = "Obrigatório!"
      }
    });
  }

  return Object.keys(errors).length === 0 ? null : errors
}

export default formValidation;