import React, { useContext } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components//Register Login/Login";
import Register from "./components/Register Login/Register";
import Template from "./components/Project/Template";
import ColBoard from "./components/Project/ColBoard";
import Project from "./components/Project/Project";
import UserProjects from "./components/Project/UserProjects";
import UserRoutes from "./UserRoutes";
import StartProjectForm from "./components/Project/New Project/StartProjectForm";
import UserInfoContext from "./context/UserInfoContext";
import Account from "./components/Account/Account";

function Routes() {
  const { currentUser } = useContext(UserInfoContext);
  return (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/login" exact>
        <Login />
      </Route>
      <Route path="/register" exact>
        <Register />
      </Route>
      {currentUser && (
        <>
          <UserRoutes path={`/:username/profile`} exact>
            <Account />
          </UserRoutes>
          <UserRoutes
            path={`/${currentUser.username}/project/new-project/0`}
            exact
          >
            <StartProjectForm />
          </UserRoutes>
          <UserRoutes path={`/${currentUser.username}/project/:proj_id`} exact>
            <Template />
          </UserRoutes>
          <UserRoutes
            path={`/${currentUser.username}/project/:proj_id/col-display`}
            exact
          >
            <ColBoard />
          </UserRoutes>
          <UserRoutes
            path={`/${currentUser.username}/project/:proj_id/project`}
            exact
          >
            <Project />
          </UserRoutes>
          <UserRoutes path="/:username/projects" exact>
            <UserProjects />
          </UserRoutes>
        </>
      )}

      <Redirect to="/"></Redirect>
    </Switch>
  );
}

export default Routes;
