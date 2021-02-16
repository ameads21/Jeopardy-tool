import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
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
      <h1>Number of categories</h1>
      <button onClick={decrementCol}>-</button>
      <span>{numCol}</span>
      <button onClick={incrementCol}>+</button>

      <h1>Number of questions per category</h1>
      <button onClick={decrementQues}>-</button>
      <span>{numQues}</span>
      <button onClick={incrementQues}>+</button>
      <hr></hr>
      <button className="btn btn-success" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default ColForm;
