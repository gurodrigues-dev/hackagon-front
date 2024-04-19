import "./Modal.css";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { addPoints } from "../../slices/authSlice";
import { answerQuestion, reset } from "../../slices/questionSlice";

import { PiCoinVerticalFill } from "react-icons/pi";

export default function Modal() {
  const [points, setPoints] = useState();

  const { question, success } = useSelector((state) => state.question);

  const dispatch = useDispatch();

  const handleClick = () => {
    const answer = {
      status: "SUCCESS",
      questionid: question.id,
      points,
    };
    
    dispatch(addPoints(points));
    dispatch(answerQuestion(answer));

    const modal =  document.querySelector("#modal");
    modal.classList.add("hide");
  }

  useEffect(() => {
    if(success) {
      if(question.level === "easy") {
        setPoints(25);
      } else if(question.level === "medium") {
        setPoints(50);
      } else {
        setPoints(100);
      }
    }

  }, [question, success]);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <div id="modal" className="wrapper-modal hide">
      <div className="fade">
        <div className="modal">
          <div className="wrapper-text">
            <h1 className="modal__title">Parabéns você acertou!</h1>
            <span className="modal__subtitle">
              Você ganhou 
              <span className="modal__subtitle-points">{points} <PiCoinVerticalFill /></span>
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
