import "./Navbar.css";

import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


// Redux
import { logout, reset } from "../../slices/authSlice";

// Icons
import { FiLogOut } from "react-icons/fi";
import { PiCoinVerticalFill } from "react-icons/pi";
import { LuTrophy } from "react-icons/lu";

// Components
import UserIcon from "../UserIcon/UserIcon";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());

    navigate("/login")
  }

  const handleBtnRankingClick = () => {
    navigate("/ranking")
  }
  
  const handleProfileClick = () => {
    console.log("Ola")
    navigate("/profile");
  }

  return (
    <nav className="navbar">
      <Link to="/">
        <img src="/logo.png" className="navbar__logo" alt="Logo Hackagon"/>
      </Link>
      <div className="menu">
        <button className="menu__btn" onClick={handleBtnRankingClick}>
          <LuTrophy className="menu__icon"/>
        </button>
        <div className="user-infos" onClick={handleProfileClick}>
          <span className="user-infos__points">{user.points} <PiCoinVerticalFill /></span>
          <div className="user-infos-inner">
            <span className="user-infos__nickname">{ user.nickname }</span>
            <UserIcon />
          </div>
        </div>
        <button className="menu__btn" onClick={handleLogout}>
          <FiLogOut className="menu__icon"/>
        </button>
      </div>
    </nav>
  )
}
