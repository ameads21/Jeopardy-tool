import React, { useCallback, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ColorStyles from "./Editing Components/ColorStyles";
import BtnPadding from "./Editing Components/BtnPadding";
import "./Styling/Board.css";
import Api from "../../Api";
import { useParams } from "react-router-dom";
import UserInfoContext from "../../context/UserInfoContext";
import ProjectContext from "../../context/ProjectContext";

function EditBar() {
  const BTN_INITAL_STATE = {
    BTNcolor: "",
    BTNbackground_color: "",
    BTNpadding: "",
  };
  const TEXT_INITAL_STATE = {
    TEXTcolor: "",
    TEXTbackground_color: "",
    TEXTinnerText: "",
  };
  const [btnData, setBtnData] = useState(BTN_INITAL_STATE);
  const [textData, setTextData] = useState(TEXT_INITAL_STATE);
  const dispatch = useDispatch();
  const { proj_id } = useParams();
  const { colEditName } = useSelector((state) => state.columnAndQuestion);
  const { currentUser } = useContext(UserInfoContext);
  const { updateColumnNames } = useContext(ProjectContext);
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

  function handleChangeBtn(evt) {
    const { name, value } = evt.target;

    let categoryButtons = document.querySelectorAll(`.btn.${colEditName}`);
    for (let c of categoryButtons) {
      if (c.classList.contains(btnData[name])) {
        c.classList.remove(btnData[name]);
      }
      c.classList.add(value);
    }

    setBtnData((data) => ({
      ...data,
      [name]: value,
    }));
  }

  function handleChangeText(evt) {
    const { name, value } = evt.target;
    let category = document.querySelectorAll(`th.${colEditName}`);
    for (let c of category) {
      if (name === "TEXTinnerText") {
        c.innerText = value;
      } else {
        if (c.classList.contains(textData[name])) {
          c.classList.remove(textData[name]);
        }
        c.classList.add(value);
      }
    }

    setTextData((data) => ({
      ...data,
      [name]: value,
    }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    console.log(btnData);
    console.log(textData);
    console.log(colEditName.split("-")[1]);
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

  function exitEdit() {
    dispatch({ type: "CURRENTEDIT", key: "None" });
  }

  return (
    <div>
      <button className="float-right mt-3 mr-4" onClick={exitEdit}>
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
              values="bg"
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
        <button type="submit" className="btn btn-primary mt-5 ">
          Update
        </button>
      </form>
    </div>
  );
}

export default EditBar;
