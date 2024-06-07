import "./Register.css";

import { Link } from "react-router-dom";

// Components
import FormRegisterAndLogin from "../../components/FormRegisterAndLogin/FormRegisterAndLogin";

function Register() {
  return (
    <div className="wrapper-form">
      <div className="register-header">
        <h1>Crie uma nova conta<span className="register__title-dot">.</span></h1>
        <span>
          Já possui uma conta? <Link to="/login" className="register__link">Entrar</Link>
        </span>
      </div>
      <FormRegisterAndLogin registerForm={true}/>
    </div>

  )
}

export default Register;