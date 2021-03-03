import React, { useContext } from "react";
import { Redirect, useParams } from "react-router-dom";
import UserInfoContext from "../../context/UserInfoContext";
import Api from "../../Api";
import AuthContext from "../../context/AuthContext";

function Account() {
  const { currentUser } = useContext(UserInfoContext);
  const { username } = useParams();
  const { logout } = useContext(AuthContext);

  async function deleteUser() {
    await Api.delete(currentUser.username);
    logout();
  }

  if (currentUser.username !== username)
    return <Redirect to={`/${currentUser.username}/projects`} />;
  return (
    <div>
      <h1>Profile</h1>
      <h5>Username</h5>
      <p>{currentUser.username}</p>
      <h5>Email</h5>
      <p>{currentUser.email}</p>
      <button className="btn btn-danger mt-5" onClick={deleteUser}>
        Delete Account
      </button>
    </div>
  );
}

export default Account;
