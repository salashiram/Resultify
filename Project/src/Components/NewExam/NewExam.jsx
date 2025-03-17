import React from "react";
import SideBar from "../SideBar/Sidebar";
import "./NewExam.css";
import { useState } from "react";

const NewExam = () => {
  const [questions, setQuestions] = useState([]);
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), text: "", answers: [], maxAnswers: 4 },
    ]);
  };

  const handleQuestionChange = (id, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, text: value } : q))
    );
  };

  const addAnswer = (questionId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId && q.answers.length < q.maxAnswers
          ? {
              ...q,
              answers: [
                ...q.answers,
                { id: Date.now(), text: "", isCorrect: false },
              ],
            }
          : q
      )
    );
  };

  const handleAnswerChange = (questionId, answerId, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId ? { ...a, text: value } : a
              ),
            }
          : q
      )
    );
  };

  const toggleCorrectAnswer = (questionId, answerId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId ? { ...a, isCorrect: !a.isCorrect } : a
              ),
            }
          : q
      )
    );
  };

  return (
    <div>
      <SideBar />
      <div className="option-content">
        <button>Guardar</button>
        <button>Limpiar</button>
      </div>
      <div className="exam-container">
        <div className="left-content">
          <div className="input-bx">
            <label>Nombre</label>
            <input type="text" />
          </div>
          <div className="input-bx">
            <label>Descripción</label>
            <input type="text" />
          </div>
          <div className="input-bx">
            <label>Tipo de examen</label>
            <select>
              <option value=""></option>
              <option>Opción múltiple</option>
            </select>
          </div>
          <div className="input-bx">
            <label>Grupo</label>
            <input type="text" />
          </div>
          <div className="input-bx">
            <label>Carrera</label>
            <select>
              <option value=""></option>
              <option value="">LMAD</option>
              <option value="">LCC</option>
              <option value="">LM</option>
              <option value="">LF</option>
              <option value="">LSTI</option>
              <option value="">LA</option>
            </select>
          </div>
        </div>

        <div className="right-content">
          <button className="add-btn" onClick={addQuestion}>
            + Agregar pregunta
          </button>
          {questions.map((question) => (
            <div key={question.id} className="question-box">
              <input
                type="text"
                placeholder="Escribe la pregunta"
                value={question.text}
                onChange={(e) =>
                  handleQuestionChange(question.id, e.target.value)
                }
              />
              <button
                className="add-answer-btn"
                onClick={() => addAnswer(question.id)}
              >
                + Agregar respuesta
              </button>
              {question.answers.map((answer) => (
                <div key={answer.id} className="answer-box">
                  <input
                    type="text"
                    placeholder="Escribe la respuesta"
                    value={answer.text}
                    onChange={(e) =>
                      handleAnswerChange(question.id, answer.id, e.target.value)
                    }
                  />
                  <input
                    type="checkbox"
                    checked={answer.isCorrect}
                    onChange={() => toggleCorrectAnswer(question.id, answer.id)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewExam;
