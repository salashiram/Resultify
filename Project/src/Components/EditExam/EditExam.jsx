import React, { useRef } from "react";
import SideBar from "../SideBar/Sidebar";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import useAuthCheck from "../../hooks/useAuthCheck";

import "./EditExam.css";

const EditExam = () => {
  const navigate = useNavigate();
  useAuthCheck([1, 2]);
  // const { examId } = useParams();
  // const { examId } = useParams();
  const [examData, setExamData] = useState({
    title: "",
    description: "",
    exam_type_id: "",
    school_group: "",
    school_career: "",
    questions: [],
  });

  useEffect(() => {
    const fetchExamData = async () => {
      const token = localStorage.getItem("token");
      const exam_Id = localStorage.getItem("examId");

      console.log(exam_Id);
      if (token) {
        try {
          const response = await fetch(
            `http://localhost:3001/api/v1/exams/details/${exam_Id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          console.log(data);

          // Mapear datos al formato esperado por el formulario
          const mappedQuestions = data.questions.map((q) => ({
            id: Date.now() + Math.random(),
            text: q.question_text,
            number: q.question_number,
            score: q.score_value,
            maxAnswers: 1,
            answers: data.options
              .filter((a) => a.question_id === q.question_id)
              .map((a) => ({
                id: Date.now() + Math.random(),
                text: a.option_text,
                isCorrect: a.is_correct,
              })),
          }));

          setExamData({
            title: data.exam.title,
            description: data.exam.description,
            exam_type_id: data.exam.exam_type_id,
            school_group: data.exam.school_group,
            school_career: data.exam.school_career,
            questions: mappedQuestions,
          });

          setQuestions(mappedQuestions);
        } catch (err) {
          console.error("Error al cargar el examen:", err);
        }
      } else {
        // error
      }
    };
    fetchExamData();
  }, []);

  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    const newQuestions = [
      ...questions,
      {
        id: Date.now(),
        text: "",
        number: "",
        score: "",
        answers: [],
        maxAnswers: 1,
      },
    ];

    setQuestions(newQuestions);

    setExamData((prevData) => ({
      ...prevData,
      questions: newQuestions,
    }));
  };

  const handleQuestionChange = (id, field, value) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, [field]: value } : q
    );

    setQuestions(updatedQuestions);

    setExamData((prevData) => ({
      ...prevData,
      questions: updatedQuestions,
    }));
  };

  const addAnswer = (questionId) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId && q.answers.length < q.maxAnswers
        ? {
            ...q,
            answers: [
              ...q.answers,
              { id: Date.now(), text: "", isCorrect: false },
            ],
          }
        : q
    );

    setQuestions(updatedQuestions);

    setExamData((prevData) => ({
      ...prevData,
      questions: updatedQuestions,
    }));
  };

  const handleAnswerChange = (questionId, answerId, value) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId
        ? {
            ...q,
            answers: q.answers.map((a) =>
              a.id === answerId ? { ...a, text: value } : a
            ),
          }
        : q
    );

    setQuestions(updatedQuestions);

    setExamData((prevData) => ({
      ...prevData,
      questions: updatedQuestions,
    }));
  };

  const toggleCorrectAnswer = (questionId, answerId) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId
        ? {
            ...q,
            answers: q.answers.map((a) =>
              a.id === answerId ? { ...a, isCorrect: !a.isCorrect } : a
            ),
          }
        : q
    );

    setQuestions(updatedQuestions);

    setExamData((prevData) => ({
      ...prevData,
      questions: updatedQuestions,
    }));
  };

  const formRef = useRef();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      submitExam();
      setIsSubmitting(false);
    }
  }, [isSubmitting]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  };

  const submitExam = async (e) => {
    const { questions } = examData;

    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const examPayload = {
        ...examData,
        created_by: userId,
        questions: questions.map((q) => ({
          question_number: q.number,
          score_value: q.score,
          question_text: q.text,
          question_type_id: 1,
          options: q.answers.map((a) => ({
            option_text: a.text,
            is_correct: a.isCorrect,
          })),
        })),
      };
      console.log("datos enviados:", examPayload);
      console.log("Datos a enviar:", examData);

      try {
        const response = await fetch(
          "http://localhost:3001/api/v1/exams/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(examPayload),
          }
        );

        const data = await response.json();
        if (response.status === 201) {
          alert("Examen creado con éxito");
          handleClear();
          navigate("/Exams");
        } else {
          alert(`Error al crear el examen: ${data.message}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al enviar los datos");
      }
    }
  };

  const handleClear = () => {
    setExamData({
      title: "",
      description: "",
      exam_type_id: "",
      school_group: "",
      school_career: "",
      questions: [],
    });
    setQuestions([]);
  };
  return (
    <div>
      <SideBar />
      <div className="option-content">
        <button
          type="button"
          onClick={() => {
            formRef.current.requestSubmit();
          }}
        >
          Guardar
        </button>
        {/* <button onClick={handleClear} type="button">
          Limpiar
        </button> */}
        <button>Desactivar</button>
      </div>
      <form ref={formRef} onSubmit={handleSubmit} action="">
        <div className="exam-container">
          <div className="left-content">
            <div className="input-bx">
              <label>
                Nombre <span>*</span>
              </label>
              <input
                required
                type="text"
                value={examData.title}
                onChange={(e) =>
                  setExamData({ ...examData, title: e.target.value })
                }
              />
            </div>
            <div className="input-bx">
              <label>
                Descripción <span>*</span>
              </label>
              <input
                required
                type="text"
                value={examData.description}
                onChange={(e) =>
                  setExamData({ ...examData, description: e.target.value })
                }
              />
            </div>
            <div className="input-bx">
              <label>
                Tipo de examen <span>*</span>
              </label>
              <select
                required
                value={examData.exam_type_id}
                onChange={(e) =>
                  setExamData({ ...examData, exam_type_id: e.target.value })
                }
              >
                <option value=""></option>
                <option value="1">General</option>
              </select>
            </div>
            <div className="input-bx">
              <label>
                Grupo <span>*</span>
              </label>
              <input
                required
                type="text"
                value={examData.school_group}
                onChange={(e) =>
                  setExamData({ ...examData, school_group: e.target.value })
                }
              />
            </div>
            <div className="input-bx">
              <label>
                Carrera <span>*</span>
              </label>
              <select
                required
                value={examData.school_career}
                onChange={(e) =>
                  setExamData({ ...examData, school_career: e.target.value })
                }
              >
                <option value=""></option>
                <option value="LMAD">LMAD</option>
                <option value="LCC">LCC</option>
                <option value="LM">LM</option>
                <option value="LF">LF</option>
                <option value="LSTI">LSTI</option>
                <option value="LA">LA</option>
              </select>
            </div>
          </div>
          <div className="right-content">
            <button type="button" className="add-btn" onClick={addQuestion}>
              + Agregar pregunta
            </button>
            {questions.map((question) => (
              <div key={question.id} className="question-box">
                <div className="question-detail">
                  <input
                    required
                    type="number"
                    placeholder="ID"
                    value={question.number}
                    onChange={(e) =>
                      handleQuestionChange(
                        question.id,
                        "number",
                        e.target.value
                      )
                    }
                  />
                  <input
                    type="number"
                    required
                    placeholder="Valor"
                    value={question.score}
                    onChange={(e) =>
                      handleQuestionChange(question.id, "score", e.target.value)
                    }
                  />
                </div>
                <input
                  required
                  type="text"
                  placeholder="Escribe la pregunta"
                  value={question.text}
                  onChange={(e) =>
                    handleQuestionChange(question.id, "text", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="add-answer-btn"
                  onClick={() => addAnswer(question.id)}
                >
                  + Agregar respuesta
                </button>
                {question.answers.map((answer) => (
                  <div key={answer.id} className="answer-box">
                    <input
                      required
                      type="text"
                      placeholder="Escribe la respuesta"
                      value={answer.text}
                      onChange={(e) =>
                        handleAnswerChange(
                          question.id,
                          answer.id,
                          e.target.value
                        )
                      }
                    />
                    <div className="chbx">
                      <label htmlFor="">Marcar correcta</label>
                      <input
                        type="checkbox"
                        checked={answer.isCorrect}
                        onChange={() =>
                          toggleCorrectAnswer(question.id, answer.id)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditExam;
