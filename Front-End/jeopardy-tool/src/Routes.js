import React from "react";
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

function Routes() {
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
      <UserRoutes path="/template" exact>
        <Template />
      </UserRoutes>
      <UserRoutes path="/col-display" exact>
        <ColBoard />
      </UserRoutes>
      <UserRoutes path="/project" exact>
        <Project />
      </UserRoutes>
      <UserRoutes path="/projects/:username" exact>
        <UserProjects />
      </UserRoutes>
      <UserRoutes path="/projects/:username/0" exact>
        <StartProjectForm />
      </UserRoutes>
      <Redirect to="/"></Redirect>
    </Switch>
  );
}

export default Routes;
