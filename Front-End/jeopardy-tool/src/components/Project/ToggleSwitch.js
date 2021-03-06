import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Api from "../../Api";
import ProjectContext from "../../context/ProjectContext";
import UserInfoContext from "../../context/UserInfoContext";

function ToggleSwitch() {
  const { edit } = useSelector((state) => state.columnAndQuestion);
  const { currentUser } = useContext(UserInfoContext);
  const { startGame } = useContext(ProjectContext);
  const dispatch = useDispatch();
  const { proj_id } = useParams();
  async function handleChange() {
    dispatch({ type: "EDITACCESS" });
    if (!edit) {
      const btnsDisabled = document.querySelectorAll("[disabled]");
      btnsDisabled.forEach((btn) => {
        btn.disabled = false;
      });
    } else {
      const quesandAnswers = await Api.getAllQuesandAnswers({
        currentUser,
        proj_id,
      });
      startGame(quesandAnswers);
    }
  }
  return (
    <div className="custom-control custom-switch">
      <input
        type="checkbox"
        className="custom-control-input"
        id="customSwitch1"
        defaultChecked={edit}
        onChange={handleChange}
      />
      <label className="custom-control-label" htmlFor="customSwitch1">
        {edit ? "Click to play" : "Click to edit"}
      </label>
    </div>
  );
}

export default ToggleSwitch;
