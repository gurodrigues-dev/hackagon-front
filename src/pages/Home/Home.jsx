import "./Home.css";

// Editor
import CodeEditor from "@uiw/react-textarea-code-editor";

// Web container
import { getWebContainerInstance } from "../../lib/web-container";

// Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { getQuestion, reset } from "../../slices/questionSlice";

// Components
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";
import Navbar from "../../components/Navbar/Navbar";

import { MdDone, MdClose, MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";

import ANSIToHTML from "ansi-to-html";
import Modal from "../../components/Modal/Modal";
const ANSIConverter = new ANSIToHTML({ newline: true });

export default function Home() {
  const [expandedItems, setExpandedItems] = useState([]);
  const [code, setCode] = useState(`function main() {\n    // Escreva seu código aqui!\n};\n\nmodule.exports = main;`);
  
  const [outputDependencies, setOutputDependencies] = useState([]);
  const [loadingDependencies, setLoadingDependencies] = useState(false);
  const [dependenciesResult, setDependenciesResult] = useState(false);

  const [outputTests, setOutputTests] = useState([[], [], []]);
  const [loadingTests, setLoadingTests] = useState(false);
  const [testsResults, setTestsResults] = useState([]);


  const dispatch = useDispatch();

  const { loading, success, error, question } = useSelector((state) => state.question);

  const handleToggleItem = (index) => {
    const newExpandedItems = [...expandedItems];
    newExpandedItems[index] = !newExpandedItems[index];
    setExpandedItems(newExpandedItems);
  };

  const addOutputTests = (prevOutputTests, data, index) => {
    const updatedOutputTests = [...prevOutputTests];

    if (!Array.isArray(updatedOutputTests[index])) {
      updatedOutputTests[index] = [];
    }

    const arrayToUpdate = [...updatedOutputTests[index]];
    arrayToUpdate.push(ANSIConverter.toHtml(data))

    updatedOutputTests[index] = arrayToUpdate;

    return updatedOutputTests;
  }

  const handleClick = async () => {
    setLoadingDependencies(true);
    setLoadingTests(true);

    setOutputDependencies([]);
    setOutputTests([[], [], []]);
    setTestsResults([])
    setDependenciesResult(false)

    const webContainer = await getWebContainerInstance();

    await webContainer.mount({
      "index.js": {
        file: {
          contents: code,
        }
      },
      "package.json": {
        file: {
          contents: `
            {
              "name": "Test",
              "main": "index.js",
              "scripts": {
                "test": "jest"
              },
              "devDependencies": {
                "jest": "^29.7.0"
              }
            }
          `
        }
      },
      "jest.config.js": {
        file: {
          contents: `
            module.exports = {
              testEnvironment: 'node',
              testMatch: ['**/?(*.)+(spec|test).js?(x)']
            };
          `
        }
      },
      'index.spec.js': {
        file: {
          contents: `
            const main = require('./index')
          
            describe("Testes", () => {
              it("First teste", () => {
                const inputValues = [${question.inputs.test1.params}].map(str => Number(str));
              
                let result = main(...inputValues);
              
                expect(result).toEqual(${question.inputs.test1.response});
              })

              it("Second teste", () => {
                const inputValues = [${question.inputs.test2.params}].map(str => Number(str));
              
                let result = main(...inputValues);
              
                expect(result).toEqual(${question.inputs.test2.response});
              })

              it("Third teste", () => {
                const inputValues = [${question.inputs.test3.params}].map(str => Number(str));
              
                let result = main(...inputValues);
              
                expect(result).toEqual(${question.inputs.test3.response});
              })
            })
          `,
        },
      },
    });

    const install = await webContainer.spawn("npm", ["i"]);

    install.output.pipeTo(
      new WritableStream({
        write(data) {
          setOutputDependencies((state) => [...state, ANSIConverter.toHtml(data)])
        }
      })
    );

    await install.exit;
    setLoadingDependencies(false);
    setDependenciesResult(true)

    const start = await webContainer.spawn('npm', ['test'])

    start.output.pipeTo(
      new WritableStream({

        write(data) {
          const output = data.toString();
          const regex = /[✓✕]/gm;

          if(regex.test(output)) {
            if (output.includes("First")) {
              setOutputTests((prevState) => addOutputTests(prevState, data, 0));
              setTestsResults((prevState) => [...prevState, output.includes("✓") ? true : false]);
              
            }
            else if (output.includes("Second")) {
              setOutputTests((prevState) => addOutputTests(prevState, data, 1));
              setTestsResults((prevState) => [...prevState, output.includes("✓") ? true : false]);
          
            } 
            else if (output.includes("Third")) {
              setOutputTests((prevState) => addOutputTests(prevState, data, 2));
              setTestsResults((prevState) => [...prevState, output.includes("✓") ? true : false]);
            }
          }

          if(output.includes("Testes ›")) {
            const regex = /(?=^.*?Testes ›)/gm;
            const testErrors = data.split(regex);
            
            setOutputTests((prevState) => ([
              [...prevState[0], ANSIConverter.toHtml(testErrors[0])],
              [...prevState[1], ANSIConverter.toHtml(testErrors[1])],
              [...prevState[2], ANSIConverter.toHtml(testErrors[2])]
            ]));
          }
        }
      })
    );

    await start.exit;
    setLoadingTests(false);
  };

  useEffect(() => {
    dispatch(getQuestion());
  }, []);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if(testsResults[0] && testsResults[1] && testsResults[2]) {
      const modal = document.querySelector("#modal");
      modal.classList.remove("hide");
    }
  }, [testsResults]);

  return (
    <div className="home">
      <Modal />
      <Navbar />
      {
        loading || error ? (
          <LoadingAnimation />
        ) : (
          <div className="content">
            <div className="question">
              <div className="question-header">
                <h1 className="question__title">{success && question.title}</h1>
                <span className={`difficulty difficulty--${success && question.level}`}>{success && question.level}</span>
              </div>
              <p className="question__text"> {success && question.description} </p>
            </div>
            <div className="wrapper-editor">
              <div className="container-editor">
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
              </div>
              <div className="aside-editor">
                <ul className="toggle-menu">
                  <li className="toggle-menu__item" onClick={() => handleToggleItem(0)}>
                    <div className="toggle-menu-title">
                      {
                        !expandedItems[0] ?
                          <MdOutlineKeyboardArrowDown className="toggle-menu__icon-arrow" />
                          :
                          <MdOutlineKeyboardArrowUp className="toggle-menu__icon--arrow" />
                      }
                      {
                        !loadingDependencies ? (
                          !dependenciesResult ? (
                            <MdDone className="toggle-menu__icon toggle-menu__icon-status toggle-menu__icon-status--default" />
                          ) : (
                            <MdDone className="toggle-menu__icon toggle-menu__icon-status toggle-menu__icon-status--success" />
                          )
                         ) : (
                          <div className="loader"></div>
                        )
                      }
                      <h2 className="toggle-menu__item-text">Instalação de dependências</h2>
                    </div>
                    {expandedItems[0] && (
                      <div className="toggle-menu__content">
                        {outputDependencies.map((line, index) => (
                          <p key={index} dangerouslySetInnerHTML={{ __html: line }} />
                        ))}
                      </div>
                    )}
                  </li>
                  <li className="toggle-menu__item" onClick={() => handleToggleItem(1)}>
                    <div className="toggle-menu-title">
                      {
                        !expandedItems[1] ?
                          <MdOutlineKeyboardArrowDown className="toggle-menu__icon-arrow" />
                          :
                          <MdOutlineKeyboardArrowUp className="toggle-menu__icon--arrow" />
                      }
                      {
                        !loadingTests ? (
                          testsResults.length === 0 ? (
                            <MdDone className="toggle-menu__icon toggle-menu__icon-status toggle-menu__icon-status--default" />
                          ) : (
                            testsResults[0] === true ? (
                              <MdDone className="toggle-menu__icon toggle-menu__icon-status toggle-menu__icon-status--success" />
                            ) : (
                              <MdClose className="toggle-menu__icon toggle-menu__icon-status toggle-menu__icon-status--error" />
                            )
                          )
                        ) : (
                          <div className="loader"></div>
                        )
                      }
                      <h2 className="toggle-menu__item-text">Primeiro teste</h2>
                    </div>
                    {expandedItems[1] && (
                      <div className="toggle-menu__content">
                        {loadingTests && <p>Executando os tests...</p>}
                        {outputTests[0].map((line, index) => (
                          <p key={index} dangerouslySetInnerHTML={{ __html: line }} />
                        ))}
                      </div>
                    )}
                  </li>
                  <li className="toggle-menu__item" onClick={() => handleToggleItem(2)}>
                    <div className="toggle-menu-title">
                      {
                        !expandedItems[2] ?
                          <MdOutlineKeyboardArrowDown className="toggle-menu__icon-arrow" />
                          :
                          <MdOutlineKeyboardArrowUp className="toggle-menu__icon--arrow" />
                      }
                      {
                        !loadingTests ? (
                          testsResults.length === 0 ? (
                            <MdDone className="toggle-menu__icon toggle-menu__icon-status toggle-menu__icon-status--default" />
                          ) : (
                            testsResults[1] === true ? (
                              <MdDone className="toggle-menu__icon toggle-menu__icon-status toggle-menu__icon-status--success" />
                            ) : (
                              <MdClose className="toggle-menu__icon toggle-menu__icon-status toggle-menu__icon-status--error" />
                            )
                          )
                        ) : (
                          <div className="loader"></div>
                        )
                      }
                      <h2 className="toggle-menu__item-text">Segundo teste</h2>
                    </div>
                    {expandedItems[2] && (
                      <div className="toggle-menu__content">
                        {loadingTests && <p>Executando os tests...</p>}
                        {outputTests[1].map((line, index) => (
                          <p key={index} dangerouslySetInnerHTML={{ __html: line }} />
                        ))}
                      </div>
                    )}
                  </li>
                  <li className="toggle-menu__item" onClick={() => handleToggleItem(3)}>
                    <div className="toggle-menu-title">
                      {
                        !expandedItems[3] ?
                          <MdOutlineKeyboardArrowDown className="toggle-menu__icon-arrow" />
                          :
                          <MdOutlineKeyboardArrowUp className="toggle-menu__icon--arrow" />
                      }
                      {
                        !loadingTests ? (
                          testsResults.length === 0 ? (
                            <MdDone className="toggle-menu__icon toggle-menu__icon-status toggle-menu__icon-status--default" />
                          ) : (
                            testsResults[2] === true ? (
                              <MdDone className="toggle-menu__icon toggle-menu__icon-status toggle-menu__icon-status--success" />
                            ) : (
                              <MdClose className="toggle-menu__icon toggle-menu__icon-status toggle-menu__icon-status--error" />
                            )
                          )
                        ) : (
                          <div className="loader"></div>
                        )
                      }
                      <h2 className="toggle-menu__item-text">Terceiro teste</h2>
                    </div>
                    {expandedItems[3] && (
                      <div className="toggle-menu__content">
                        {loadingTests && <p>Executando os tests...</p>}
                        {outputTests[2].map((line, index) => (
                          <p key={index} dangerouslySetInnerHTML={{ __html: line }} />
                        ))}
                      </div>
                    )}
                  </li>
                </ul>
                <div className="wrapper-btn">
                  {!loadingDependencies && !loadingTests ?
                    <button className="btn-editor" onClick={handleClick}>Enviar</button>
                    :
                    <button className="btn-editor" onClick={handleClick} disabled>Execultando...</button>
                  }
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}
