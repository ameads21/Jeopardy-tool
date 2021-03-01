//Use Bootstrap Collapse for style
import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import ColorStyles from "./Editing Components/ColorStyles";
import BtnPadding from "./Editing Components/BtnPadding";
import "./Styling/Board.css";
import Api from "../../Api";
import { useParams } from "react-router-dom";
import UserInfoContext from "../../context/UserInfoContext";
import ProjectContext from "../../context/ProjectContext";
import LoadingSpinner from "../../helpers/LoadingSpinner";
import QuesAnswersForm from "./Editing Components/QuesAnswersForm";
import { Collapse } from "react-bootstrap";

function EditBar() {
  const [buttonOpen, setButtonOpen] = useState(false);
  const [textOpen, setTextOpen] = useState(false);
  const [quesOpen, setQuesOpen] = useState(false);
  const {
    isLoaded,
    updateColumnNames,
    btnData,
    textData,
    handleChangeBtn,
    handleChangeText,
    exitEdit,
    questionCount,
  } = useContext(ProjectContext);
  const { colEditName } = useSelector((state) => state.columnAndQuestion);

  const { proj_id } = useParams();
  const { currentUser } = useContext(UserInfoContext);
  const colors = [
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "light",
    "dark",
  ];

  async function handleSubmit(evt) {
    evt.preventDefault();
    const data = {
      title: textData.TEXTinnerText,
      id: colEditName.split("-")[1],
    };
    const styleData = {
      btnData,
      textData,
      id: colEditName.split("-")[1],
    };
    await Api.saveCategoryName({ proj_id, currentUser, data });
    updateColumnNames({ proj_id });
    await Api.saveStyleButtons({
      proj_id,
      currentUser,
      styleData,
    });
  }

  if (!isLoaded) return <LoadingSpinner />;

  return (
    <div>
      <button
        className="float-right mt-3 mr-4"
        onClick={() => exitEdit({ proj_id })}
      >
        X
      </button>
      <h1>
        {colEditName.charAt(0).toUpperCase() +
          colEditName.slice(1).replace("-", " ")}
      </h1>

      <form onSubmit={handleSubmit} className="editToolBar">
        <div className="card">
          <div className="card-header" id="buttonHeading">
            <h5 className="mb-0">
              <button
                onClick={() => setButtonOpen(!buttonOpen)}
                aria-controls="ques-collapse-text"
                aria-expanded={buttonOpen}
                className="btn btn-link"
              >
                Buttons
              </button>
            </h5>
          </div>
        </div>
        <Collapse in={buttonOpen}>
          <div className="row mt-3">
            <div className="col-6 mb-5">
              <ColorStyles
                handleChange={handleChangeBtn}
                element="BTN"
                styleName="background_color"
                values="btn"
                colors={colors}
              />
            </div>
            <div className="col-6">
              <ColorStyles
                handleChange={handleChangeBtn}
                element="BTN"
                styleName="text_color"
                values="text"
                colors={colors}
              />
            </div>
            <div className="col">
              <BtnPadding handleChange={handleChangeBtn} />
            </div>
          </div>
        </Collapse>
        <div className="card">
          <div className="card-header" id="textHeading">
            <h5 className="mb-0">
              <button
                onClick={() => setTextOpen(!textOpen)}
                aria-controls="ques-collapse-text"
                aria-expanded={textOpen}
                className="btn btn-link"
              >
                Category
              </button>
            </h5>
          </div>
        </div>
        <Collapse in={textOpen}>
          <div id="edit-collapse-text">
            <div className="card card-body">
              <div className="form-group container">
                <label htmlFor="TEXTinnerHTML">Name: </label>
                <input
                  className="form-control"
                  name="TEXTinnerText"
                  type="text"
                  onChange={handleChangeText}
                  value={textData["innerText"]}
                  id="TEXTinnerText"
                />
              </div>
              <div className="row mt-3">
                <div className="col-6">
                  <ColorStyles
                    handleChange={handleChangeText}
                    element="TEXT"
                    styleName="background_color"
                    values="bg"
                    colors={colors}
                  />
                </div>

                <div className="col-6">
                  <ColorStyles
                    handleChange={handleChangeText}
                    element="TEXT"
                    styleName="text_color"
                    values="text"
                    colors={colors}
                  />
                </div>
              </div>
            </div>
          </div>
        </Collapse>

        <div className="card">
          <div className="card-header" id="quesHeader">
            <h5 className="mb-0">
              <button
                onClick={() => setQuesOpen(!quesOpen)}
                aria-controls="ques-collapse-text"
                aria-expanded={quesOpen}
                className="btn btn-link"
              >
                Question and Answers
              </button>
            </h5>
          </div>
        </div>

        <Collapse in={quesOpen}>
          <div id="ques-collapse-text">
            <div className="card card-body">
              <div className="col-12">
                <QuesAnswersForm
                  column_id={colEditName.match(/\d+/)[0]}
                  quesCount={questionCount + 1}
                />
              </div>
            </div>
          </div>
        </Collapse>
      </form>
      <button
        className="btn btn-success mt-3"
        onClick={() => exitEdit({ proj_id })}
      >
        Update
      </button>
    </div>
  );
}

export default EditBar;
