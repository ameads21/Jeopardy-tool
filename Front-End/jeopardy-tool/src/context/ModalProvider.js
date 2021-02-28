import React, { useContext, useState } from "react";
import ModalContext from "./ModalContext";
import ProjectContext from "./ProjectContext";

const ModalProvider = ({ children }) => {
  const [show, setShow] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [value, setValue] = useState("");
  const [questionSwitch, setQuestionSwitch] = useState(false);

  const { pickQuestion } = useContext(ProjectContext);

  function handleClose() {
    setShow(false);
  }
  function handleShow({ key, value }) {
    setShow(true);
    setValue(value);
    setQuestionSwitch(false);
    const data = pickQuestion(key, value);
    setQuestion(data.question);
    setAnswer(data.answer);
  }
  function handleSwitch() {
    const temp_switch = !questionSwitch;
    setQuestionSwitch(temp_switch);
  }
  return (
    <ModalContext.Provider
      value={{
        handleClose,
        handleShow,
        handleSwitch,
        questionSwitch,
        show,
        question,
        answer,
        value,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
