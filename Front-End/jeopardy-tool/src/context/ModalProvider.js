import React, { useState } from "react";
import ModalContext from "./ModalContext";

const ModalProvider = ({ children }) => {
  const [show, setShow] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  function handleClose() {
    setShow(false);
  }
  function handleShow() {
    setShow(true);
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
