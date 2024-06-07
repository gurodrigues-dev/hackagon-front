import "./ForgotPassword.css";

// Hooks
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { changePassword, reset } from "../../slices/passwordSlice";

// Utils
import formValidation from "../../utils/formValidation"

// Components
import Notification from "../../components/Notification/Notification";
import ButtonReturnToLogin from "../../components/ButtonReturnToLogin/ButtonReturnToLogin";

// Icons
import { LuKeyRound } from "react-icons/lu";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

function NewPassword() {
  const [inputErrors, setInputErrors] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisiblee] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, successNewPassword, email } = useSelector((state) => state.password);

  const handleClick = (e) => {
    e.preventDefault();

    const newErrors = formValidation({ password: newPassword, confirmPassword });

    if (!newErrors && email) {
      dispatch(changePassword({ newPassword, email }));
    } else {
      setInputErrors(newErrors);
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisiblee(!confirmPasswordVisible);
  };

  useEffect(() => {
    if (successNewPassword) {
      navigate("/forgot-password/message")
    }
  }, [successNewPassword]);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <div className="forgot-password new-password">
      <div className="forgot-password-header">
        <div className="forgot-password-wrapper-icon">
          <LuKeyRound className="forgot-password__icon" />
        </div>
        <h1 className="forgot-password__title">definir nova senha</h1>
        <span>Sua nova senha deve ser diferente da senha usada anteriormente.</span>
      </div>
      <form className="form" onSubmit={handleClick} noValidate>
        <div>
          <div className={!inputErrors.password ? "password-container password" : "password-conatiner password inputs--error"}>
            <input
              className="password__input"
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Nova senha"
              required
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword || ''}
            />
            {
              passwordVisible ?
                <FaEyeSlash className="password__icon" onClick={togglePasswordVisibility} />
                :
                <FaEye className="password__icon" onClick={togglePasswordVisibility} />
            }
          </div>
          {inputErrors.password && <Notification message={inputErrors.password} type="error" />}
        </div>
        <div>
          <div className={!inputErrors.confirmPassword ? "password-container password" : "password-conatiner password inputs--error"}>
            <input
              className="password__input"
              type={confirmPasswordVisible ? "text" : "password"}
              name="password"
              placeholder="Confirmar senha"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword || ''}
            />
            {
              confirmPasswordVisible ?
                <FaEyeSlash className="password__icon" onClick={toggleConfirmPasswordVisibility} />
                :
                <FaEye className="password__icon" onClick={toggleConfirmPasswordVisibility} />
            }
          </div>
          {inputErrors.confirmPassword && <Notification message={inputErrors.confirmPassword} type="error" />}
        </div>
        {
          !loading ? (
            <input className="form__btn" type="submit" value="Alterar senha" />
          ) : (
            <input className="form__btn btn--disabled" type="submit" value="Aguarde..." disabled />
          )
        }
      </form>
      <div>
        <ButtonReturnToLogin />
      </div>
    </div>
  )
}

export default NewPassword;

