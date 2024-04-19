import "./CreateQuestions.css";

import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { createQuestion, reset } from "../../slices/questionSlice";

// Date
import Flatpickr from "flatpickr";
import 'flatpickr/dist/themes/material_blue.css';

// Components
import Notification from "../../components/Notification/Notification";

// Utils
import formValidation from "../../utils/formValidation";

export default function CreateQuestions() {
  const initialValueTestCase = [
    { params: ["", ""], response: "" },
    { params: ["", ""], response: "" },
    { params: ["", ""], response: "" },
  ]

  const initialValuesInputErrors = {
    title: "",
    description: "",
    level: "",
    date: "",
    testCase1: { params: [], response: ""},
    testCase2: { params: [], response: ""},
    testCase3: { params: [], response: ""}
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [level, setLevel] = useState("");
  
  const [testCase, setTestCase] = useState(initialValueTestCase);
  const [inputErrors, setInputErrors] = useState(initialValuesInputErrors);

  const dispatch = useDispatch();

  const { success, error, loading } = useSelector((state) => state.question);

  const flatpickrRef = useRef(null);

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

    const newErrors = formValidation({
      username,
      cognitoPassword: password,
      title,
      description,
      date,
      level,
      testCase
    });

    // const verifyParams = Object.values(newErrors)
    //   .filter(item => item.params)
    //   .every((item) => {
    //     return item.params.every((param) => param === null)
    //   })

    if(newErrors ) {
      setInputErrors(newErrors);
    } else {
      const question = {
        username,
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
      console.log("Entrou no create")
      dispatch(createQuestion(question));
    }

  }

  useEffect(() => {
    flatpickrRef.current = Flatpickr('.datepicker', {
      dateFormat: 'Y-m-d',
      onChange: function (selectedDates, dateStr) {
        setDate(dateStr);
      }
    });

    return () => {
      flatpickrRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (success) {
      setTitle("")
      setDescription("")
      setDate("")
      setLevel("")
      setTestCase(initialValueTestCase)
    }

    setTimeout(() => {
      dispatch(reset());
    }, 4000)

  }, [dispatch, success]);

  return (
    <div className="create-question">
      <form className="question-form" onSubmit={handleClick}>
        <label className="label-input">
          Nome de usuário
          <input
            className={!inputErrors.username ? "inputs" : "inputs inputs--error"}
            type="text"
            name="userame"
            placeholder="Nome de usuário"
            onChange={(e) => setUsername(e.target.value)}
            value={username || ""}
          />
          { inputErrors.username && <Notification message={inputErrors.username} type="error" /> }
        </label>
        <label className="label-input">
          Senha
          <input
            className={!inputErrors.password ? "inputs" : "inputs inputs--error"}
            type="password"
            name="password"
            placeholder="Senha"
            onChange={(e) => setPassword(e.target.value)}
            value={password || ""}
          />
          { inputErrors.password && <Notification message={inputErrors.password} type="error" /> }
        </label>

        <span className="divider"></span>

        <label className="label-input">
          Título
          <input
            className={!inputErrors.title ? "question-form__title inputs" : "question-form__title inputs inputs--error"}
            type="text"
            name="title"
            placeholder="Titulo da questão"
            value={title || ""}
            onChange={(e) => setTitle(e.target.value)}
          />
          { inputErrors.title && <Notification message={inputErrors.title} type="error" /> }
        </label>
        <label className="label-input">
          Descrição
          <textarea
            className={!inputErrors.description ? "question-form__description inputs" : "question-form__title inputs inputs--error"}
            cols="30"
            rows="10"
            name="description"
            placeholder="Digite o enunciado da questão"
            value={description || ""}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          { inputErrors.description && <Notification message={inputErrors.description} type="error" /> }
        </label>
        <div className="question-form-inner">
          <label className="label-input label-date">
            Data
            <input
              className={!inputErrors.date ? "datepicker inputs" : "datepicker inputs inputs--error"}
              placeholder="Selecione uma data"
              type="text"
              name="date"
              onChange={(e) => setDate(e.target.value)}
              value={date || ""}
            />
            { inputErrors.date && <Notification message={inputErrors.date} type="error" /> }
          </label>
          <label className="label-input label-difficulty">
            Dificuldade
            <select
              className={!inputErrors.level ? "select-level inputs" : "select-level inputs inputs--error"}
              name="level"
              onChange={(e) => setLevel(e.target.value)}
              value={level || ""}
            >
              <option className="select-level__option" value="">Defult</option>
              <option className="select-level__option" value="easy">Fácil</option>
              <option className="select-level__option" value="medium">Média</option>
              <option className="select-level__option" value="hard">Difícil</option>
            </select>
            { inputErrors.level && <Notification message={inputErrors.level} type="error" /> }
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
                            className={
                              !inputErrors[`testCase${testCaseIndex + 1}`].params[paramIndex] ? (
                                "test-params__input inputs"
                              ) : (
                                "test-params__input inputs inputs--error"
                              ) 
                            }
                            type="text"
                            name="testParam"
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
                    className={
                      !inputErrors[`testCase${testCaseIndex + 1}`].response ? (
                        "test__response inputs"
                      ) : (
                        "test__response inputs inputs--error"
                      ) 
                    }
                    type="text"
                    name="response"
                    onChange={(e) => handleResponseChange(testCaseIndex, e.target.value)}
                    value={testCaseItem.response || ""}
                  />
                  
                  { inputErrors[`testCase${testCaseIndex + 1}`].response && <Notification message={inputErrors[`testCase${testCaseIndex + 1}`].response} type="error" /> }
                </label>
              </div>
            ))
          }
        </div>
        { !loading ? 
          <input className="question-form__btn" type="submit" value="Enviar" /> 
          :
          <input className="question-form__btn" type="submit" value="Aguarde..." disabled/> 
        }
        { success && <Notification message="Questão cadastrada com sucesso" type="success" />}
        { error && <Notification message={error.message} type="error-box"/> }
      </form>
    </div>
  )
}