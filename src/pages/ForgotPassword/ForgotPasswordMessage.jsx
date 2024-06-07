import "./ForgotPassword.css";

// Components
import ButtonReturnToLogin from "../../components/ButtonReturnToLogin/ButtonReturnToLogin";

// Icons
import { MdCheck } from "react-icons/md";

function ForgotPasswordMessage() {
  return (
    <div className="forgot-password forgot-password--small-size">
      <div className="forgot-password-header">
        <div className="forgot-password-wrapper-icon">
          <MdCheck className="forgot-password__icon" />
        </div>
        <h1 className="forgot-password__title">Senha alterada com sucesso</h1>
      </div>
      <div>
        <ButtonReturnToLogin />
      </div>
    </div>
  )
}

export default  ForgotPasswordMessage