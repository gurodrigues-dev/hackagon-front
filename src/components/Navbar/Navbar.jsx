import "./Navbar.css";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { FiLogOut } from "react-icons/fi";

// import logo from "../../assets/logo.png";

// Redux
import { logout, reset } from "../../slices/authSlice";


export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());

    navigate("/login")
  }

  return (
    <nav className="navbar">
      <div>
        Logo
        {/* <img src={logo} className="navbar__logo" alt="Logo Hackagon"/> */}
      </div>

      <button className="navbar__btn-logout" onClick={handleLogout}>
        <FiLogOut className="icon-logout"/>
      </button>
    </nav>
  )
}
