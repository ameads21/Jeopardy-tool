import React, { useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import UserInfoContext from "../context/UserInfoContext";

function Home() {
  const { currentUser } = useContext(UserInfoContext);

  if (currentUser) return <Redirect to={`/${currentUser.username}/projects`} />;
  return (
    <div className="hero" style={{ backgroundImage: "/HomeBackground.jpg" }}>
      <div className="hero-text">
        <h1>Welcome</h1>
        <p>
          <i>Where designing a game is fun!</i>
        </p>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
        <Link to="/register" className="btn btn-primary ml-2">
          Register
        </Link>
      </div>
    </div>
  );
}

export default Home;
