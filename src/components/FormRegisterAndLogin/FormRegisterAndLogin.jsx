/* eslint-disable react/prop-types */
import "./FormRegisterAndLogin.css";

function FormRegisterAndLogin({ registerForm }) {
  const handleSubmit = () => {

  };

  return (
    <form onSubmit={handleSubmit} className="form">
      { registerForm && <input className="form__input" type="text" placeholder="Nickname" required/>}
      <input className="form__input" type="email" placeholder="E-mail" required/>
      <input className="form__input" type="password" placeholder="Senha" required/>

      <input className="form__btn" type="submit" value={registerForm ? "Cadastrar" : "Entrar"} />
    </form>

  )
}

export default FormRegisterAndLogin;