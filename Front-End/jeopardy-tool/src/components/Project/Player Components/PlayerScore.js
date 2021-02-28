import React, { useState } from "react";

function PlayerScore({ username, removeUser }) {
  const [score, setScore] = useState(0);

  function minusScore() {
    setScore(score - 100);
  }

  function addScore() {
    setScore(score + 100);
  }

  return (
    <div className="col-sm-4">
      <div className="card">
        <div className="card-body">
          <button
            className="btn btn-danger float-right"
            onClick={(i) => removeUser(username)}
          >
            X
          </button>
          <br></br>
          <h5 className="card-title">{username}</h5>
          <p className="card-text">
            <button className="btn btn-danger mr-3" onClick={minusScore}>
              -
            </button>
            <span>{score}</span>
            <button className="btn btn-success ml-3" onClick={addScore}>
              +
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PlayerScore;
