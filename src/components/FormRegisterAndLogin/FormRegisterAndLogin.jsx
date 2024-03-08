/* eslint-disable react/prop-types */
import "./FormRegisterAndLogin.css";

// Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// Utils
import formValidation from "../../utils/formValidation"

// Components
import Notification from "../Notification/Notification";

// Redux
import { register, reset, login } from "../../slices/authSlice";


function FormRegisterAndLogin({ registerForm }) {

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [inputErrors, setInputErrors] = useState({});

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
    } else {
      setInputErrors(newErrors);
    }

  };

  useEffect(() => {
    if(success) {
      dispatch(login({ nickname, password }));
    }
  }, [success, dispatch, nickname, password]);

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

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    console.log(error)
  }, [error])

  return (
    <form onSubmit={registerForm ? handleRegister : handleLogin} className="form" noValidate>
      <div>
        <input
          className={!inputErrors.nickname ? "form__input" : "form__input form__input--error"}
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
            className={!inputErrors.email ? "form__input" : "form__input form__input--error"}
            type="email"
            name="email"
            placeholder="E-mail"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email || ''}
          />
          {
            inputErrors.email && <Notification message={inputErrors.email} type="error"/>
          }
        </div>
      }
      <div>
        <input
          className={!inputErrors.password ? "form__input" : "form__input form__input--error"}
          type="password"
          name="password"
          placeholder="Senha"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password || ''}
        />
        { inputErrors.password && <Notification message={inputErrors.password} type="error"/> }
      </div>

      { !loading && <input className="form__btn" type="submit" value={registerForm ? "Cadastrar" : "Entrar"} /> }
      { loading && <input className="form__btn" type="submit" value="Aguarde..." disabled/> }

      {/* { success && <Notification message="Usuário cadastrado com sucesso" type="success"/> } */}
      { error && <Notification message="E-mail ou senhas inválidos" type="error-box"/> }
    </form>

  )
}

export default FormRegisterAndLogin;