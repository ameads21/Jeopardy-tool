import React, { useState } from "react";
import { useSelector } from "react-redux";
import Board from "./Board";
import EditBar from "./EditBar";
import Modal from "./Modal";
import "./Styling/Board.css";
import ToggleSwitch from "./ToggleSwitch";

function ProjectMain() {
  const { colEditName, edit } = useSelector((state) => state.columnAndQuestion);

  return (
    <div className="container-fluid project-container">
      <div className="row">
        <div className="col">
          <Board />
          <ToggleSwitch />
        </div>
        {colEditName !== "category-0" && edit ? (
          <div className="col-md-5">
            <EditBar />
          </div>
        ) : (
          <div>
            <Modal />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectMain;
