import React from "react";
import { useSelector } from "react-redux";
import Board from "./Board";
import EditBar from "./EditBar";
import Modal from "./Modal";
import "./Styling/Board.css";

function ProjectMain() {
  const { colEditName } = useSelector((state) => state.columnAndQuestion);
  return (
    <div className="container-fluid project-container">
      {colEditName === "None" ? (
        <Board />
      ) : (
        <div className="row">
          <div className="col-md-7">
            <Board />
          </div>
          <div className="col-md-5">
            <EditBar />
          </div>
          <Modal />
        </div>
      )}
    </div>
  );
}

export default ProjectMain;
