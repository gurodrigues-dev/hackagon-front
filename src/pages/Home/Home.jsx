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
import LoadingAnimation from "../../components/Loading/LoadingAnimation";
import Navbar from "../../components/Navbar/Navbar";

// MdClose
import { MdDone, MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";

export default function Home() {
  const [expandedItems, setExpandedItems] = useState([]);

  const [code, setCode] = useState(`function main() {\n    // Escreva seu código aqui!\n};\n\nmodule.exports = main;`);

  const [tests, setTests] = useState({
    firstTest: null,
    secondTest: null,
    thirdTest: null,
  });

  const dispatch = useDispatch();

  const { loading, success, question } = useSelector((state) => state.question);

  const handleToggleItem = (index) => {
    const newExpandedItems = [...expandedItems];
    newExpandedItems[index] = !newExpandedItems[index];
    setExpandedItems(newExpandedItems);
  };

  const handleClick = async () => {
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
          console.log(data.toString())
        }
      })
    );

    await install.exit

    const start = await webContainer.spawn('npm', ['test'])

    start.output.pipeTo(
      new WritableStream({

        write(data) {
          const output = data.toString();
          console.log(output)

          const regex = /(First|Second|Third)/gm;

          if (output.includes("✓") || output.includes("✕")) {
            const match = output.match(regex)

            setTests(prevState => ({
              ...prevState,
              [`${match[0].toLowerCase()}Test`]: output.includes("✓") ? true : false
            }));
          }
        }
      })
    )
  };

  useEffect(() => {
    dispatch(getQuestion());
  }, []);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (tests.firstTest && tests.secondTest && tests.thirdTest) {
      alert("Parabens! sua solução está correta.");

      setTests({
        firstTest: null,
        secondTest: null,
        thirdTest: null,
      })

    } else if (tests.firstTest === false || tests.secondTest === false || tests.thirdTest === false) {
      alert("Solução incorreta, tente novamente!");

      setTests({
        firstTest: null,
        secondTest: null,
        thirdTest: null,
      })

    }
  }, [tests]);

  return (
    <div className="home">
      <Navbar />
      {
        loading ? (
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

                      <MdDone className="toggle-menu__icon toggle-menu__icon-status" />
                      <h2 className="toggle-menu__item-text">Instalação de dependências</h2>
                    </div>
                    {expandedItems[0] && (
                      <div className="toggle-menu__content"></div>
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

                      <MdDone className="toggle-menu__icon toggle-menu__icon-status" />
                      <h2 className="toggle-menu__item-text">Primeiro teste</h2>
                    </div>
                    {expandedItems[1] && (
                      <div className="toggle-menu__content"></div>
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

                      <MdDone className="toggle-menu__icon toggle-menu__icon-status" />
                      <h2 className="toggle-menu__item-text">Segundo teste</h2>
                    </div>
                    {expandedItems[2] && (
                      <div className="toggle-menu__content"></div>
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

                      <MdDone className="toggle-menu__icon toggle-menu__icon-status" />
                      <h2 className="toggle-menu__item-text">Terceiro teste</h2>
                    </div>
                    {expandedItems[3] && (
                      <div className="toggle-menu__content"></div>
                    )}
                  </li>
                </ul>
                <div className="wrapper-btn">
                  <button className="btn-editor" onClick={handleClick}>Enviar</button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}
