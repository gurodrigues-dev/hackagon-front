import "./Home.css";

import axios from "axios";

// Hooks
import { useEffect, useState } from "react";

import CodeEditor from "@uiw/react-textarea-code-editor";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [code, setCode] = useState(``);

  useEffect(() => {
    async function getQuestion () {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
    
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/question`, {
          headers: {
            "Authorization": user.token,
          }
        });
    
        setQuestion(response.data)
    
      } catch (error) {
        console.log(error.response)
      }
    }

    getQuestion();

  }, []);

  return (
    <div className="home">
      <div className="question">
        <div className="question-header">
          <h1 className="question__title">{ question.title }</h1>
          <span className={`difficulty difficulty--${ question.level }`}>{ question.level }</span>
        </div>
        <p className="question__text"> { question.description } </p>
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
          }}
        />
        <button className="btn-editor">Enviar</button>
      </div>
      
    </div>
  )
}
