import "./App.css";
import React from "react";
import Routes from "./Routes";
import Nav from "./components/Nav";

function App() {
  return (
    <div className="App">
      <Nav />
      <Routes />
    </div>
  );
}

export default App;
