import React from "react";

function BtnPadding({ handleChange }) {
  return (
    <div>
      <div className="custom-control custom-radio custom-control-inline mx-auto">
        <button
          className={`btn btn-primary p-1`}
          name={`BTNpadding`}
          onClick={handleChange}
          value={`p-1`}
          id={`BTNpadding_1`}
        >
          Padding 1
        </button>
      </div>

      <div className="custom-control custom-radio custom-control-inline mx-auto">
        <button
          className={`btn btn-primary p-2`}
          name={`BTNpadding`}
          onClick={handleChange}
          value={`p-2`}
          id={`BTNpadding_2`}
        >
          Padding 2
        </button>
      </div>

      <div className="custom-control custom-radio custom-control-inline mx-auto">
        <button
          className={`btn btn-primary p-3`}
          name={`BTNpadding`}
          onClick={handleChange}
          value={`p-3`}
          id={`BTNpadding_3`}
        >
          Padding 3
        </button>
      </div>

      <div className="custom-control custom-radio custom-control-inline mx-auto">
        <button
          className={`btn btn-primary p-4`}
          name={`BTNpadding`}
          onClick={handleChange}
          value={`p-4`}
          id={`BTNpadding_4`}
        >
          Padding 4
        </button>
      </div>

      <div className="custom-control custom-radio custom-control-inline mx-auto">
        <button
          className={`btn btn-primary p-5`}
          name={`BTNpadding`}
          onClick={handleChange}
          value={`p-5`}
          id={`BTNpadding_5`}
        >
          Padding 5
        </button>
      </div>
    </div>
  );
}

export default BtnPadding;
