import "./Home.css";

import CodeEditor from "@uiw/react-textarea-code-editor";
import { getWebContainerInstance } from "../../lib/web-container";

// Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { getQuestion, reset } from "../../slices/questionSlice";

// Components
import LoadingAnimation from "../../components/Loading/LoadingAnimation";


export default function Home() {
  const [code, setCode] = useState(`function main() {\n    // Escreva seu código aqui!\n};\n\nmodule.exports = main;`);
  const [tests, setTests] = useState({
    firstTest: null,
    secondTest: null,
    thirdTest: null,
  });

  const dispatch = useDispatch();

  const { loading, success, question } = useSelector((state) => state.question);

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

          if(output.includes("✓") || output.includes("✕")) {
            const match = output.match(regex)

            setTests(prevState => ({
              ...prevState,
              [`${match[0].toLowerCase()}Test`]: output.includes("✓") ? "passed" : "failed"
            }));
          }
        }
      })
    )
  }

  useEffect(() => {
    dispatch(getQuestion());
  }, [dispatch]);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if(tests.firstTest === "passed" && tests.secondTest === "passed" && tests.thirdTest === "passed") {
      alert("Parabens! sua solução está correta.")
    }
  }, [tests]);

  return (
    <div className="home">
      {
        loading ? (
          <LoadingAnimation />
        ) : (
          <>
            {/* <div>
              <h1>Test Progress</h1>
              <svg width="100" height="100">
                <circle cx="50" cy="50" r="40" stroke="#ccc" strokeWidth="10" fill="none" />
                <circle cx="50" cy="50" r="40" stroke="#007bff" strokeWidth="10" fill="none"
                  strokeDasharray={`${progress} 100`} transform="rotate(-90 50 50)" />
              </svg>
              <p>{`${progress.toFixed(2)}% completo`}</p> 
            </div>
            */}
            <div className="question">
              <div className="question-header">
                <h1 className="question__title">{success && question.title}</h1>
                <span className={`difficulty difficulty--${success && question.level}`}>{success && question.level}</span>
              </div>
              <p className="question__text"> {success && question.description} </p>
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
              <button className="btn-editor" onClick={handleClick}>Enviar</button>
            </div>
          </>
        )
      }
    </div>
  )
}
