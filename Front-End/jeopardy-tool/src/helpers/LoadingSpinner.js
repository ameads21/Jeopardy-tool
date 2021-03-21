import React from "react";
import { Spinner } from "react-bootstrap";

/** Loading message used by components that fetch API data. */

function LoadingSpinner() {
  return (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  );
}

export default LoadingSpinner;
