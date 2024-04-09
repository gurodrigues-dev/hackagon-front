import "./Modal.css";

import { PiCoinVerticalFill } from "react-icons/pi";

export default function Modal() {
  const handleClick = () => {
    const modal =  document.querySelector("#modal");
    modal.classList.add("hide");
  }

  return (
    <div id="modal" className="wrapper-modal hide">
      <div className="fade">
        <div className="modal">
          <div className="wrapper-text">
            <h1 className="modal__title">Parabéns você acertou!</h1>
            <span className="modal__subtitle">
              Você ganhou 
              <span className="modal__subtitle-points">100 <PiCoinVerticalFill /></span>
            </span>
          </div>
          <div className="wrapper-btn">
            <button className="modal__btn" onClick={handleClick}>Fechar</button>
          </div>
        </div>
      </div>
    </div>
  )
}
