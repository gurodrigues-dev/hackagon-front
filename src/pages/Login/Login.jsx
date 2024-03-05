import "./Login.css";

import { Link } from "react-router-dom"

// Components
import FormRegisterAndLogin from "../../components/FormRegisterAndLogin/FormRegisterAndLogin";

function LoginAndRegister() {

  return (
    <div className="wrapper-login-and-register login">
      <div className="login-header">
        <h1 className="login__title">bem vindo de volta</h1>
        <span>
          Não possue uma conta ainda? <Link to="/register">cadastre-se</Link>
        </span>
      </div>
      <FormRegisterAndLogin />
    </div>
  )
}

export default LoginAndRegister;