import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import UserInfoContext from "../context/UserInfoContext";

function Nav() {
  const { currentUser } = useContext(UserInfoContext);
  const { logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-light bg-dark">
      <Link to="/" className="navbar-brand text-light">
        Jeopardy Tool Name
      </Link>
      {currentUser ? (
        <ul>
          <li>
            <Link to="/template" className="navbar-brand text-light">
              Pick Template
            </Link>
          </li>
          <li>
            <Link to="/" onClick={logout}>
              Logout
            </Link>
          </li>
        </ul>
      ) : (
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
        </ul>
      )}
    </nav>
  );
}

export default Nav;
