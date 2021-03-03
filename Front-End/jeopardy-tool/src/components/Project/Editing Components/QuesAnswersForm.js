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
    filters: [],
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [quesData, setQuesData] = useState([]);
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
            filters: [],
          });
          try {
            const { results } = await Api.getQuesandAnswers({
              proj_id,
              currentUser,
              column_id,
            });
            if (results.length) {
              const data = [];
              for (let i = 0; i < results.length; i++) {
                data.push({
                  id: results[i].id,
                  question: results[i].question,
                  answer: results[i].answer,
                  filters: JSON.parse(results[i].filters),
                });
              }
              setQuesData(data);
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
    if (tempData.filters.includes(value)) {
      tempData.filters.splice(tempData.filters.indexOf(value), 1);
    } else {
      tempData.filters.push(value);
    }
    setFormData((data) => ({
      ...data,
      [name]: tempData.filters,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { results } = await Api.saveQuesandAnswers({
      formData,
      column_id,
      proj_id,
      currentUser,
    });
    results.filters = JSON.parse(results.filters);
    let dataCopy = quesData.slice();
    dataCopy.push(results);
    console.log(dataCopy);
    setQuesData(dataCopy);
    setFormData(INITIAL_STATE);
  }

  async function handleDelete(id, idPosition) {
    const dataCopy = quesData.slice();
    dataCopy.splice(idPosition, 1);
    setQuesData(dataCopy);
    await Api.deleteQuesandAnswer({ id, proj_id, currentUser });
  }

  function filterValues(num) {
    return (
      <div className="form-check form-check-inline" key={`FilterValue-${num}`}>
        <input
          className="form-check-input"
          type="checkbox"
          value={num * 100}
          name="filters"
          id={`filters-${num * 100}`}
          checked={formData.filters.includes(`${num * 100}`)}
          onChange={handleFilterChange}
        />
        <label className="form-check-label" htmlFor={`filters-${num * 100}`}>
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
            <th scope="col">Deletion</th>
          </tr>
        </thead>
        <tbody>
          {quesData.map((q, v) => (
            <tr key={`tableValue${v}`}>
              <td>{q.question}</td>
              <td>{q.answer}</td>
              <td>{q.filters.toString()}</td>
              <td>
                <button
                  type="button"
                  onClick={() => handleDelete(q.id, v)}
                  className="btn btn-danger"
                >
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
