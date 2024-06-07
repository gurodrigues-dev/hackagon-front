import "./UserIcon.css";

import { FaUser } from "react-icons/fa";

function UserIcon() {
  return (
    <div className="user-icon">
      <FaUser className="user-icon__icon" />
    </div>
  )
}

export default UserIcon;