import "./ForgotPassword.css";

// Hooks
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { sendCodeToEmail, reset, saveEmail } from "../../slices/passwordSlice";

// Utils
import formValidation from "../../utils/formValidation"

// Components
import Notification from "../../components/Notification/Notification";
import ButtonReturnToLogin from "../../components/ButtonReturnToLogin/ButtonReturnToLogin";

// Icons
import { CiLock } from "react-icons/ci";

function ForgotPasswordEmail() {
  const [inputErrors, setInputErrors] = useState({});
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, successEmail } = useSelector((state) => state.password);

  const handleClick = (e) => {
    e.preventDefault();

    const newErrors = formValidation({ email });
    
    if (!newErrors) {
      dispatch(sendCodeToEmail(email));
    } else {
      setInputErrors(newErrors);
    }
  }

  useEffect(() => {
    if(successEmail) {
      dispatch(saveEmail(email));
      navigate("/forgot-password/code");
    } 
  }, [successEmail]);


  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <div className="forgot-password">
      <div className="forgot-password-header">
        <div className="forgot-password-wrapper-icon">
          <CiLock className="forgot-password__icon"/>
        </div>
        <h1 className="forgot-password__title">Esqueceu sua senha?</h1>
        <span>Insira o seu e-mail e enviaremos um código para recuperar sua senha.</span>
      </div>

      <form className="form" onSubmit={handleClick} noValidate>
        <input
          className={!inputErrors.email ? "form__input inputs" : "form__input inputs inputs--error"}
          type="email"
          name="email"
          placeholder="E-mail"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email || ''}
        />
        { inputErrors.email && <Notification message={inputErrors.email} type="error"/> }
        { 
          !loading ? (
            <input className="form__btn" type="submit" value="Enviar código" />
          ) : (
            <input className="form__btn btn--disabled" type="submit" value="Enviando código..." disabled/>
          )
        }
        { error && <Notification message={error.message} type="error-box"/> }
      </form>
      <div>
        <ButtonReturnToLogin />
      </div>
    </div>
  )
}

export default ForgotPasswordEmail;

