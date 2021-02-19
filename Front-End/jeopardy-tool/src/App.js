import "./App.css";
import React from "react";
import Routes from "./Routes";
import Nav from "./components/Nav";
import Api from "./Api";
import useLocalStorage from "./hooks/useLocalStorage";

export const TOKEN_STORAGE_ID = "authorization";

function App() {
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  async function login(loginData) {
    try {
      let token = await Api.login(loginData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }
  return (
    <div className="App">
      <Nav />
      <Routes login={login} />
    </div>
  );
}

export default App;
