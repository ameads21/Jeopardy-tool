import React from "react";

/*Function will take the following arguments
   -element: will be either BTN or TEXT
   -styleName: will be the name of style (background_color, color, etc.)
   -values: will be the beginning value for the style element. (bg, text, etc.)
*/
function Background({ handleChange, element, styleName, values, colors }) {
  return (
    <div>
      {colors.map((c) => (
        <div
          className="custom-control custom-radio custom-control-inline"
          data-toggle="buttons"
        >
          <input
            className="custom-conrol-inputs d-none "
            name={`${element}${styleName}`}
            type="radio"
            onChange={handleChange}
            value={`${values}-${c}`}
            id={`${element}${styleName}-${c}`}
          />
          <label
            htmlFor={`${element}${styleName}-${c}`}
            className={`btn border rounded ${values}-${c}`}
          >
            {styleName.charAt(0).toUpperCase() +
              styleName.slice(1).replace("-", " ")}
          </label>
        </div>
      ))}
    </div>
  );
}

export default Background;
