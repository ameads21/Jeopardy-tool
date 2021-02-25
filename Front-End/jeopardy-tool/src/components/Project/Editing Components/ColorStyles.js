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
          className="custom-control custom-radio custom-control-inline mx-auto"
          key={`${element}${styleName}-${c}`}
        >
          <button
            className={`btn border rounded ${values}-${c}`}
            name={`${element}${styleName}`}
            type="button"
            onClick={handleChange}
            value={`${values}-${c}`}
            id={`${element}${styleName}-${c}`}
          >
            {styleName.charAt(0).toUpperCase() +
              styleName.slice(1).replace("-", " ")}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Background;
