import React from "react";
import { useDispatch, useSelector } from "react-redux";

function ToggleSwitch() {
  const { edit } = useSelector((state) => state.columnAndQuestion);
  const dispatch = useDispatch();
  function handleChange() {
    dispatch({ type: "EDITACCESS" });
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
        Toggle this switch element
      </label>
    </div>
  );
}

export default ToggleSwitch;
