import React, { useContext, useEffect, useState } from "react";
import Api from "../../../Api";
import { useParams } from "react-router-dom";
import UserInfoContext from "../../../context/UserInfoContext";
import LoadingSpinner from "../../../helpers/LoadingSpinner";

function QuesAnswersForm({ column_id }) {
  const INITIAL_STATE = { question: "", answer: "" };
  const QUES_DATA_STATE = [];
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [quesData, setQuesData] = useState(QUES_DATA_STATE);
  const { proj_id } = useParams();
  const { currentUser } = useContext(UserInfoContext);

  useEffect(
    function loadQuestionAnswers() {
      async function getQuestionData() {
        if (!isLoaded) {
          try {
            const data = await Api.getQuesandAnswers({
              proj_id,
              currentUser,
              column_id,
            });
            const questions = JSON.parse(data.results.questions);
            const answers = JSON.parse(data.results.answers);
            if (answers.length) {
              const results = [];
              for (let i = 0; i < questions.length; i++) {
                results.push({ question: questions[i], answer: answers[i] });
              }
              setQuesData(results);
            }
          } catch (err) {
            console.error("Problem Loading Questions and Answers", err);
          }
        }
        setIsLoaded(true);
      }
      setIsLoaded(false);
      getQuestionData();
    },
    [column_id, currentUser, isLoaded, proj_id]
  );

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    let dataCopy = quesData.slice();
    dataCopy.push(formData);
    setQuesData(dataCopy);
  }
  if (!isLoaded) return <LoadingSpinner />;
  return (
    <div>
      <h3>Add Question and Answer</h3>
      <label htmlFor="question">Question</label>
      <input
        type="text"
        value={formData.question}
        placeholder="What is 2+2?"
        name="question"
        id="question"
        onChange={handleChange}
      />

      <label htmlFor="answer">Answer</label>
      <input
        type="text"
        value={formData.answer}
        placeholder="4"
        name="answer"
        id="answer"
        onChange={handleChange}
      />
      <button className="btn btn-success" onClick={handleSubmit}>
        Add
      </button>
    </div>
  );
}

export default QuesAnswersForm;
