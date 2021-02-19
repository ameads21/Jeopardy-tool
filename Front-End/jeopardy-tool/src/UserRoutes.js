import React, { useContext } from "react";
import UserInfoContext from "./context/UserInfoContext";
import { Redirect, Route } from "react-router-dom";

function UserRoutes({ exact, path, children }) {
  const { currentUser } = useContext(UserInfoContext);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  return (
    <Route exact={exact} path={path}>
      {children}
    </Route>
  );
}

export default UserRoutes;
