/* eslint-disable react/prop-types */
import "./Notification.css";

// Icons
import { MdOutlineReport , MdOutlineCheck } from "react-icons/md";

export default function Notification({ message, type }) {
  return (
    <div className={`message message--${type}`}>
      <div className="wrapper-icon">
        {
          type === "error" || type === "error-box" ? (
            <MdOutlineReport  className="message__icon message__icon--error" />
          ) : (
            <MdOutlineCheck className="message__icon message__icon--sucess" />
          )
        }
      </div>
      <span className={`message__text message__text--${type}`}>{ message }</span>
    </div>
  )
}
