import React, { useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import UserInfoContext from "../../context/UserInfoContext";

function UserProjects() {
  const { username } = useParams();
  const { currentUser } = useContext(UserInfoContext);
  const history = useHistory();
  if (username !== currentUser) {
    history.push("/");
  }

  return (
    <div className="container-fluid project-container">
      <h1>My Projects</h1>
    </div>
  );
}

export default UserProjects;
