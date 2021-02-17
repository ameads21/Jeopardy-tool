import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function ColForm() {
  const history = useHistory();
  const { numCol, numQues } = useSelector((store) => store.columnAndQuestion);
  const dispatch = useDispatch();
  const incrementCol = () => {
    if (numCol < 5) {
      dispatch({ type: "INCREMENTCOL" });
    }
  };
  const decrementCol = () => {
    if (numCol > 1) {
      dispatch({ type: "DECREMENTCOL" });
    }
  };

  const incrementQues = () => {
    if (numQues < 5) {
      dispatch({ type: "INCREMENTQUES" });
    }
  };
  const decrementQues = () => {
    if (numQues > 1) {
      dispatch({ type: "DECREMENTQUES" });
    }
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    dispatch({ type: "EDITACCESS" });
    history.push("/project");
  };

  return (
    <div className="container">
      <div className="row mb-5">
        <div className="col">
          <h3>Number of categories</h3>
          <button onClick={decrementCol} className="btn btn-danger">
            -
          </button>
          <h3 className="ml-3 mr-3 d-inline text-center">{numCol}</h3>
          <button onClick={incrementCol} className="btn btn-success">
            +
          </button>
        </div>
        <div className="col">
          <h3>Number of questions</h3>
          <button onClick={decrementQues} className="btn btn-danger">
            -
          </button>
          <h3 className="ml-3 mr-3 d-inline text-center">{numQues}</h3>
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
