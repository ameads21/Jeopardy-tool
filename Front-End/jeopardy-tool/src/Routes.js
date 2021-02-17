import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components//Register Login/Login";
import Register from "./components/Register Login/Register";
import Template from "./components/Project/Template";
import ColBoard from "./components/Project/ColBoard";
import Project from "./components/Project/Project";

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
      <Route path="/template" exact>
        <Template />
      </Route>
      <Route path="/col-display" exact>
        <ColBoard />
      </Route>
      <Route path="/project" exact>
        <Project />
      </Route>
      <Redirect to="/"></Redirect>
    </Switch>
  );
}

export default Routes;
