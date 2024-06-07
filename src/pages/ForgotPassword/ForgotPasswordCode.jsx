import "./ForgotPassword.css";

// Hooks
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { verificationCode, reset } from "../../slices/passwordSlice";

// Utils
// import formValidation from "../../utils/formValidation"

// Components
import Notification from "../../components/Notification/Notification";
import ButtonReturnToLogin from "../../components/ButtonReturnToLogin/ButtonReturnToLogin";

// Icons
import { CiLock } from "react-icons/ci";

function ForgotPasswordCode() {
  const length = 6;

  const [codeDigit, setCodeDigit] = useState(Array(length).fill(""));

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, successCode, email  } = useSelector((state) => state.password);

  const handleChange = (value, index) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCodeDigit = [...codeDigit];
      newCodeDigit[index] = value;
      setCodeDigit(newCodeDigit);
      // Mover foco para o próximo input automaticamente
      if (value && index < length - 1) {
        const nextInput = document.getElementById(`input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  }

  const handleKeyDown = (element, index) => {
    if (element.key === 'Backspace' && !codeDigit[index] && index > 0) {
      const prevInput = document.getElementById(`input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };


  const handleClick = (e) => {
    e.preventDefault();

    const code = codeDigit.join("");

    if(code.length === length) {
      console.log("entrou")
      if(email) {
        dispatch(verificationCode({ code, email }));
      }
    } else {
      const codeInputs = document.querySelectorAll(".verification-code__input")
      
      codeInputs.forEach((input) => {
        input.classList.add("inputs--error");
      })
    }
  }

  useEffect(() => {
    if(successCode) {
      navigate("/forgot-password/new-password");
    }
  }, [successCode]);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);


  return (
    <div className="forgot-password">
      <div className="forgot-password-header">
        <div className="forgot-password-wrapper-icon">
          <CiLock className="forgot-password__icon" />
        </div>
        <h1 className="forgot-password__title">Código de verificação</h1>
        <span>insira o código de verificação que acabamos de enviar em seu endereço de e-mail.</span>
      </div>

      <form onSubmit={handleClick} className="form" noValidate>
        <div className="verification-code">
          {codeDigit.map((digit, index) => (
            <input
              key={index}
              className="verification-code__input inputs"
              id={`input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              autoComplete="off"
            />
          ))}
        </div>
        { 
          !loading ? (
            <input className="form__btn" type="submit" value="Enviar" />
          ) : (
            <input className="form__btn btn--disabled" type="submit" value="Aguarde..." disabled/>
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

export default ForgotPasswordCode;

