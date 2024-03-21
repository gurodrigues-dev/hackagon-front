import "./Home.css";

import CodeEditor from "@uiw/react-textarea-code-editor";

// Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { getQuestion, reset } from "../../slices/questionSlice";

// Components
import LoadingAnimation from "../../components/Loading/LoadingAnimation";


export default function Home() {
  const [code, setCode] = useState(``);

  const dispatch = useDispatch();

  const { loading, success, question } = useSelector((state) => state.question);

  const handleClick = () => {
  }
  
  useEffect(() => {
    dispatch(getQuestion());
  }, []);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <div className="home">
      {
        loading ? (
          <LoadingAnimation />
        ) : (
          <>
            <div className="question">
              <div className="question-header">
                <h1 className="question__title">{ success && question.title }</h1>
                <span className={`difficulty difficulty--${ success && question.level }`}>{ success && question.level }</span> 
              </div>
              <p className="question__text"> { success && question.description } </p>
            </div>
            <div className="wrapper-editor">
              <CodeEditor 
                className="editor"
                value={code}
                language="js"
                placeholder="Digite o código"
                onChange={(e) => setCode(e.target.value)}
                padding={25}
                style={{
                  fontSize: 16,
                  overflowY: "auto",
                  backgroundColor: "#f5f5f5",
                  color: "#333333"
                }}
              />
              <button className="btn-editor" onClick={handleClick}>Enviar</button>
            </div>
          </>
        )
      }
    </div>
  )
}
