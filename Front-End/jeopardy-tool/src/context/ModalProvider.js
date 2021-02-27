import React, { useContext, useState } from "react";
import ModalContext from "./ModalContext";
import ProjectContext from "./ProjectContext";

const ModalProvider = ({ children }) => {
  const [show, setShow] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const { pickQuestion } = useContext(ProjectContext);

  function handleClose() {
    setShow(false);
  }
  function handleShow({ key, value }) {
    setShow(true);
    const data = pickQuestion(key, value);
  }
  return (
    <ModalContext.Provider
      value={{ handleClose, handleShow, show, question, answer }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
