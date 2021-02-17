import React from "react";

function BtnPadding({ handleChange }) {
  return (
    <div>
      <div className="custom-control mx-auto custom-radio custom-control-inline">
        <input
          className="custom-conrol-inputs d-none"
          name="BTNpadding"
          type="radio"
          onChange={handleChange}
          value="p-1"
          id="BTNpadding_1"
        />
        <label
          htmlFor="BTNpadding_1"
          className="form-check-label btn btn-primary p-1"
        >
          Padding
        </label>
      </div>

      <div className="custom-control mx-auto custom-radio custom-control-inline">
        <input
          className="custom-conrol-inputs d-none"
          name="BTNpadding"
          type="radio"
          onChange={handleChange}
          value="p-2"
          id="BTNpadding_2"
        />
        <label
          htmlFor="BTNpadding_2"
          className="form-check-label btn btn-primary p-2"
        >
          Padding
        </label>
      </div>

      <div className="custom-control mx-auto custom-radio custom-control-inline">
        <input
          className="custom-conrol-inputs d-none"
          name="BTNpadding"
          type="radio"
          onChange={handleChange}
          value="p-3"
          id="BTNpadding_3"
        />
        <label
          htmlFor="BTNpadding_3"
          className="form-check-label btn btn-primary p-3"
        >
          Padding
        </label>
      </div>

      <div className="custom-control mx-auto custom-radio custom-control-inline">
        <input
          className="custom-conrol-inputs d-none"
          name="BTNpadding"
          type="radio"
          onChange={handleChange}
          value="p-4"
          id="BTNpadding_4"
        />
        <label
          htmlFor="BTNpadding_4"
          className="form-check-label btn btn-primary p-4"
        >
          Padding
        </label>
      </div>

      <div className="custom-control mx-auto custom-radio custom-control-inline">
        <input
          className="custom-conrol-inputs d-none"
          name="BTNpadding"
          type="radio"
          onChange={handleChange}
          value="p-5"
          id="BTNpadding_5"
        />
        <label
          htmlFor="BTNpadding_5"
          className="form-check-label btn btn-primary p-5"
        >
          Padding
        </label>
      </div>
    </div>
  );
}

export default BtnPadding;
