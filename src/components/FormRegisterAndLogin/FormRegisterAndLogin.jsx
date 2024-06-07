/* eslint-disable react/prop-types */
import "./FormRegisterAndLogin.css";

// Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

// Utils
import formValidation from "../../utils/formValidation"

// Components
import Notification from "../Notification/Notification";

// Redux
import { register, reset, login } from "../../slices/authSlice";

// Icons
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";


function FormRegisterAndLogin({ registerForm }) {

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [inputErrors, setInputErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const { loading, error, success } = useSelector((state) => state.auth);

  const handleRegister = (e) => {
    e.preventDefault();

    const user = {
      nickname,
      email,
      password
    };

    const newErrors = formValidation(user);

    if (!newErrors) {
      dispatch(register(user))
      navigate("/login")
    } else {
      setInputErrors(newErrors);
    }

  };

  const handleLogin = (e) => {
    e.preventDefault()

    const user = {
      nickname,
      password
    };

    const newErrors = formValidation(user);

    if (!newErrors) {
      dispatch(login(user));
    } else {
      setInputErrors(newErrors);
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    if(error) {
      setNickname("");
      setEmail("");
      setPassword("");
    }
  }, [dispatch, error])

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <form onSubmit={registerForm ? handleRegister : handleLogin} className="form" noValidate>
      <div>
        <input
          className={!inputErrors.nickname ? "form__input inputs" : "form__input inputs inputs--error"}
          type="text"
          name="nickname"
          placeholder="Nickname"
          required
          onChange={(e) => setNickname(e.target.value)}
          value={nickname || ''}
        />
        { inputErrors.nickname && <Notification message={inputErrors.nickname} type="error"/> }
      </div>
      {
        registerForm &&
        <div>
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
        </div>
      }
      <div>
        <div className={!inputErrors.password ? "password-container password" : "password-conatiner password inputs--error"}>
          <input
            className="password__input"
            type={passwordVisible ? "text" : "password" }
            name="password"
            placeholder="Senha"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password || ''}
          />
          {
            passwordVisible ?
              <FaEyeSlash className="password__icon" onClick={togglePasswordVisibility}/>  
            :
              <FaEye className="password__icon" onClick={togglePasswordVisibility}/>
          }
        </div>
        { inputErrors.password && <Notification message={inputErrors.password} type="error"/> }
      </div>
      { !registerForm && <Link to="/forgot-password/email" className="form__forgot-password">Esqueceu sua senha?</Link>}

      { !loading && <input className="form__btn" type="submit" value={registerForm ? "Cadastrar" : "Entrar"} /> }
      { loading && <input className="form__btn" type="submit" value="Aguarde..." disabled/> }

      { success.message && <Notification message="Usuário cadastrado com sucesso" type="success"/> }
      { error && <Notification message={error.message} type="error-box"/> }
    </form>

  )
}

export default FormRegisterAndLogin;