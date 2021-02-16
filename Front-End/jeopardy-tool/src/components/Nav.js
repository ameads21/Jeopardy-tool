import React from "react";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav className="navbar navbar-light bg-dark">
      <Link to="/" className="navbar-brand text-light">
        Jeopardy Tool Name
      </Link>
      <ul>
        <li>
          <Link to="/login" className="navbar-brand text-light">
            Login
          </Link>
        </li>

        <li>
          <Link to="/register" className="navbar-brand text-light">
            Register
          </Link>
        </li>
        <li>
          <Link to="/template" className="navbar-brand text-light">
            Pick Template
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
