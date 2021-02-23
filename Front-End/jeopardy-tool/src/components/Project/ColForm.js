import React, { useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import UserInfoContext from "../../context/UserInfoContext";
import Api from "../../Api";
import ProjectContext from "../../context/ProjectContext";

function ColForm() {
  const history = useHistory();
  const { currentUser } = useContext(UserInfoContext);
  const {
    updateColumnCount,
    columnCount,
    questionCount,
    updateQuestionCount,
  } = useContext(ProjectContext);
  const { proj_id } = useParams();
  const dispatch = useDispatch();

  const incrementCol = () => {
    if (columnCount < 5) {
      updateColumnCount(columnCount + 1);
    }
  };
  const decrementCol = () => {
    if (columnCount > 1) {
      updateColumnCount(columnCount - 1);
    }
  };

  const incrementQues = () => {
    if (questionCount < 5) {
      updateQuestionCount(questionCount + 1);
    }
  };
  const decrementQues = () => {
    if (questionCount > 1) {
      updateQuestionCount(questionCount - 1);
    }
  };

  async function handleSubmit(evt) {
    evt.preventDefault();
    const data = { columns: columnAssist(), questionCount };
    console.log("Data questioncount");
    console.log(data.questionCount);
    try {
      await Api.saveColumns({ currentUser, proj_id, data });
      dispatch({ type: "EDITACCESS" });
      history.push(`/${currentUser.username}/project/${proj_id}/project`);
    } catch (err) {
      console.error(err);
    }
  }

  function columnAssist() {
    let data = [];
    for (let i = 0; i < columnCount; i++) {
      let res = `(${i + 1}, 'Column ${i + 1}', ${proj_id})`;
      data.push(res);
    }
    return data.toString();
  }

  return (
    <div className="container">
      <div className="row mb-5">
        <div className="col">
          <h3>Number of categories</h3>
          <button onClick={decrementCol} className="btn btn-danger">
            -
          </button>
          <h3 className="ml-3 mr-3 d-inline text-center">{columnCount}</h3>
          <button onClick={incrementCol} className="btn btn-success">
            +
          </button>
        </div>
        <div className="col">
          <h3>Number of questions</h3>
          <button onClick={decrementQues} className="btn btn-danger">
            -
          </button>
          <h3 className="ml-3 mr-3 d-inline text-center">{questionCount}</h3>
          <button onClick={incrementQues} className="btn btn-success">
            +
          </button>
        </div>
      </div>
      <button className="btn btn-success mb-3" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default ColForm;
