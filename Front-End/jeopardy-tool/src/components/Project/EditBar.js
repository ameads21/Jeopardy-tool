import React, { useContext } from "react";
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

function EditBar() {
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
        <hr />
        <h3>Buttons</h3>
        <div className="row">
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
        <hr></hr>
        <h3>Category</h3>
        <div className="custom-control mx-auto custom-radio custom-control-inline">
          <label htmlFor="TEXTinnerHTML">Category Name</label>
          <input
            className="custom-conrol-inputs"
            name="TEXTinnerText"
            type="text"
            onChange={handleChangeText}
            value={textData["innerText"]}
            id="TEXTinnerText"
          />
        </div>
        <div className="row">
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
        <div className="col-12">
          <hr></hr>
          <QuesAnswersForm
            column_id={colEditName.match(/\d+/)[0]}
            quesCount={questionCount + 1}
          />
        </div>
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
