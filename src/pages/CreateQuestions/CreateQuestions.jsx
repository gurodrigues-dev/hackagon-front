import "./CreateQuestions.css";

import { useState, useRef, useEffect } from "react";

import Flatpickr from "flatpickr";
import 'flatpickr/dist/themes/material_blue.css';

// import Notification from "../../components/Notification/Notification";

// // Utils
// import formValidation from "../../utils/formValidation";

export default function CreateQuestions() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [inputErrors, setInputErrors] = useState({});

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [level, setLevel] = useState("");

  const [testCase, setTestCase] = useState([
    { params: ["", ""], response: "" },
    { params: ["", ""], response: "" },
    { params: ["", ""], response: "" },
  ]);

  const flatpickrRef = useRef(null);

  useEffect(() => {
    flatpickrRef.current = Flatpickr('.datepicker', {
      dateFormat: 'd-m-Y',
      onChange: function (selectedDates, dateStr) {
        setDate(dateStr);
      }
    });

    return () => {
      flatpickrRef.current.destroy();
    };
  }, []);

  const handleParamChange = (testCaseIndex, paramIndex, value) => {
    setTestCase((prevTestCase) => {
      const updatedTestCase = [...prevTestCase];
      updatedTestCase[testCaseIndex].params[paramIndex] = value;
      return updatedTestCase;
    });
  };

  const handleResponseChange = (testCaseIndex, value) => {
    setTestCase((prevTestCase) => {
      const updatedTestCase = [...prevTestCase];
      updatedTestCase[testCaseIndex].response = value;
      return updatedTestCase;
    });
  };

  const handleAddParams = (e) => {
    e.preventDefault();

    setTestCase((prevTestCase) => {
      const updatedTestCase = prevTestCase.map(testCase => {
        const updatedParams = [...testCase.params];
        updatedParams.push("");
        return { params: updatedParams, response: testCase.response };
      })

      return [...updatedTestCase];
    });
  };

  const handleRemoveParam = (e, paramIndex, testCaseIndex) => {
    e.preventDefault();

    setTestCase(prevTestCase => {
      if (testCase[testCaseIndex].params.length > 1) {
        const updatedTestCase = prevTestCase.map(testCase => {
          const updatedParams = [...testCase.params];
          updatedParams.splice(paramIndex, 1);
          return { ...testCase, params: updatedParams };
        });
        return updatedTestCase;
      } else {
        return testCase;
      }
    });
  };


  const handleClick = (e) => {
    e.preventDefault();

    // const newErrors = formValidation({
    //   title,
    //   description,
    //   date,
    //   level,
    //   testCase
    // })

    const question = {
      email,
      password,
      title,
      description,
      level,
      date,
      inputs: {
        test1: { ...testCase[0] },
        test2: { ...testCase[1] },
        test3: { ...testCase[2] },
      }
    };

    console.log(question)
  }

  return (
    <div className="create-question">
      <form className="question-form" onSubmit={handleClick}>
        <label className="label-input">
          E-mail
          <input
            className="inputs" 
            type="email"
            name="email"
            placeholder="E-mail"
            onChange={(e) => setEmail(e.target.value)}
            value={email || ""}
          />
        </label>
        <label className="label-input">
          Senha
          <input
            className="inputs" 
            type="password"
            name="password"
            placeholder="Senha"
            onChange={(e) => setPassword(e.target.value)}
            value={password || ""}
          />
        </label>

        <span className="divider"></span>

        <label className="label-input">
          Título
          <input
            className="question-form__title inputs"
            type="text"
            name="title"
            placeholder="Titulo da questão"
            value={title || ""}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="label-input">
          Descrição
          <textarea
            className="question-form__description inputs"
            cols="30"
            rows="10"
            placeholder="Digite o enunciado da questão"
            value={description || ""}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </label>
        <div className="question-form-inner">
          <label className="label-input label-date">
            Data
            <input
              className="datepicker inputs"
              placeholder="Selecione uma data"
              type="text"
              onChange={(e) => setDate(e.target.value)}
              value={date || ""}
            />
          </label>
          <label className="label-input label-difficulty">
            Dificuldade
            <select
              className="select-level inputs"
              onChange={(e) => setLevel(e.target.value)}
              value={level || ""}
            >
              <option className="select-level__option" value="Easy">Fácil</option>
              <option className="select-level__option" value="Medium">Média</option>
              <option className="select-level__option" value="Hard">Difícil</option>
            </select>
          </label>
        </div>
        <div className="test">
          {
            testCase.map((testCaseItem, testCaseIndex) => (
              <div key={`teste${testCaseIndex}`} className="case-test">
                <div className="test-params">
                  <label className="label-input">
                    {`${testCaseIndex + 1}° caso de teste`}
                    {
                      testCaseItem.params.map((param, paramIndex) => (
                        <div key={paramIndex} className="wrapper-input">
                          {
                            testCaseIndex === 0 && (
                              <button
                                className="test-params__btn test-params__btn--remove"
                                onClick={(e) => handleRemoveParam(e, paramIndex, testCaseIndex)}
                              >
                                -
                              </button>
                            )
                          }

                          <input
                            className="test-params__input inputs"
                            type="text"
                            onChange={(e) => handleParamChange(testCaseIndex, paramIndex, e.target.value)}
                            value={testCaseItem.params[paramIndex] || ""}
                          />
                        </div>
                      ))
                    }
                  </label>
                  <button
                    className="test-params__btn test-params__btn--add"
                    onClick={handleAddParams}
                  >
                    +
                  </button>
                </div>
                <label className="label-input">
                  {`${testCaseIndex + 1}° Resultado`}
                  <input
                    className="test__response inputs"
                    type="text"
                    onChange={(e) => handleResponseChange(testCaseIndex, e.target.value)}
                    value={testCaseItem.response || ""}
                  />
                </label>
              </div>
            ))
          }
        </div>
        <input className="question-form__btn" type="submit" value="Enviar" />
      </form>
    </div>
  )
}