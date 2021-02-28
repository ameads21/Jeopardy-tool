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
        <div>
          <Link to="/" onClick={logout} className="navbar-brand text-light">
            Logout
          </Link>
        </div>
      ) : (
        <div>
          <Link to="/login" className="navbar-brand text-light">
            Login
          </Link>
          <Link to="/register" className="navbar-brand text-light">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Nav;
