import React from "react";
import { Link } from "react-router-dom";

function Template() {
  return (
    <div>
      <h1>Select A Template</h1>
      <Link to={`/col-display`}>
        <button>Create Your Own</button>
      </Link>
    </div>
  );
}

export default Template;
