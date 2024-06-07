import "./ButtonReturnToLogin.css";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Redux
import { reset, resetEmail } from "../../slices/passwordSlice";

import { GoArrowLeft } from "react-icons/go";

function ButtonReturnToLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    dispatch(reset());
    dispatch(resetEmail());
    navigate("/login");
  }

  return (
    <button onClick={handleClick} className="return-login">
      <GoArrowLeft className="return-login__icon" /> voltar para a tela de login
    </button>
  )
}

export default ButtonReturnToLogin;
