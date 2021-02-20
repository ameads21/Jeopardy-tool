import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import UserInfoContext from "../context/UserInfoContext";

function Home() {
  const { currentUser } = useContext(UserInfoContext);

  if (currentUser) return <Redirect to={`/${currentUser.username}/projects`} />;
  return (
    <div>
      <h1>Welcome to Jeopardy Tool!</h1>
    </div>
  );
}

export default Home;
