import React, { useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import ModalContext from "../../context/ModalContext";
function ModalDisplay() {
  const {
    handleClose,
    show,
    value,
    question,
    answer,
    questionSwitch,
    handleSwitch,
  } = useContext(ModalContext);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{value}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{!questionSwitch ? question : answer}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSwitch}>
            {!questionSwitch ? "Answer" : "Question"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalDisplay;
