import React, { useContext, useEffect, useState } from "react";
import Api from "../../../Api";
import { useParams } from "react-router-dom";
import UserInfoContext from "../../../context/UserInfoContext";
import LoadingSpinner from "../../../helpers/LoadingSpinner";
import { useSelector } from "react-redux";

function QuesAnswersForm({ column_id, quesCount }) {
  const INITIAL_STATE = {
    question: "",
    answer: "",
    filter: [],
  };
  const QUES_DATA_STATE = [];
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [quesData, setQuesData] = useState(QUES_DATA_STATE);
  const [currColumn, setCurrColumn] = useState("none");
  const { proj_id } = useParams();
  const { currentUser } = useContext(UserInfoContext);
  const { colEditName } = useSelector((state) => state.columnAndQuestion);
  const [quesArray] = useState([...Array(quesCount - 1).fill()]);

  useEffect(
    function loadQuestionAnswers() {
      async function getQuestionData() {
        setCurrColumn(colEditName);

        if (!isLoaded || currColumn !== colEditName) {
          setQuesData([]);
          setFormData({
            question: "",
            answer: "",
            filter: [],
          });
          try {
            const data = await Api.getQuesandAnswers({
              proj_id,
              currentUser,
              column_id,
            });
            const questions = JSON.parse(data.results.questions);
            const answers = JSON.parse(data.results.answers);
            const filters = JSON.parse(data.results.filters);
            if (answers.length) {
              const results = [];
              for (let i = 0; i < questions.length; i++) {
                results.push({
                  question: questions[i],
                  answer: answers[i],
                  filter: JSON.parse(filters[i]),
                });
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
    [column_id, currentUser, isLoaded, proj_id, colEditName, currColumn]
  );

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  }

  function handleFilterChange(e) {
    const { name, value } = e.target;
    const tempData = Object.assign({}, formData);
    if (tempData.filter.includes(value)) {
      tempData.filter.splice(tempData.filter.indexOf(value), 1);
    } else {
      tempData.filter.push(value);
    }
    setFormData((data) => ({
      ...data,
      [name]: tempData.filter,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let dataCopy = quesData.slice();
    dataCopy.push(formData);
    setQuesData(dataCopy);
    setFormData(INITIAL_STATE);
    const data = { column_id, dataCopy };
    await Api.saveQuesandAnswers({ data, proj_id, currentUser });
  }

  async function handleDelete(id) {
    const dataCopy = quesData.slice();
    dataCopy.splice(id, 1);
    setQuesData(dataCopy);
    const data = { column_id, dataCopy };
    await Api.saveQuesandAnswers({ data, proj_id, currentUser });
  }

  function filterValues(num) {
    return (
      <div className="form-check form-check-inline" key={`FilterValue-${num}`}>
        <input
          className="form-check-input"
          type="checkbox"
          value={num * 100}
          name="filter"
          id={`filter-${num * 100}`}
          checked={formData.filter.includes(`${num * 100}`)}
          onChange={handleFilterChange}
        />
        <label className="form-check-label" htmlFor={`filter-${num * 100}`}>
          {num * 100}
        </label>
      </div>
    );
  }

  if (!isLoaded || currColumn !== colEditName) return <LoadingSpinner />;
  return (
    <div>
      <h3>Add Question and Answer</h3>
      <div className="form-group container">
        <label htmlFor="question">Question</label>
        <input
          type="text"
          value={formData.question}
          placeholder="What is 2+2?"
          name="question"
          id="question"
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="form-group container">
        <label htmlFor="answer">Answer</label>
        <input
          type="text"
          value={formData.answer}
          placeholder="4"
          name="answer"
          id="answer"
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <p>Filter</p>
      <div className="form-check container">
        {quesArray.map((k, i) => filterValues(i + 1))}
      </div>
      <br />
      <button className="btn btn-primary" onClick={handleSubmit}>
        Add
      </button>
      <table className="table mt-3">
        <thead>
          <tr>
            <th scope="col">Question</th>
            <th scope="col">Answer</th>
            <th scope="col">Filters</th>
          </tr>
        </thead>
        <tbody>
          {quesData.map((q, v) => (
            <tr key={`tableValue${v}`}>
              <td>{q.question}</td>
              <td>{q.answer}</td>
              <td>{q.filter.toString()}</td>
              <td>
                <button type="button" onClick={() => handleDelete(v)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QuesAnswersForm;
