import "./App.css";
import React, { useEffect, useState } from "react";
import Routes from "./Routes";
import Nav from "./components/Nav";
import Api from "./Api";
import useLocalStorage from "./hooks/useLocalStorage";
import jwt from "jsonwebtoken";
import LoadingSpinner from "./helpers/LoadingSpinner";
import UserInfoContext from "./context/UserInfoContext";
import AuthProvider from "./context/AuthProvider";

export const TOKEN_STORAGE_ID = "authorization";

function App() {
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [currentUser, setCurrentUser] = useState(null);
  const [infoLoaded, setInfoLoaded] = useState(false);

  useEffect(
    function loadUserInfo() {
      async function getCurrentUser() {
        if (token) {
          try {
            let { username } = jwt.decode(token);
            setCurrentUser(username);
            Api.token = token;
          } catch (err) {
            console.error("Problem loading user", err);
            setCurrentUser(null);
          }
        }
        setInfoLoaded(true);
      }
      setInfoLoaded(false);
      getCurrentUser();
    },
    [token]
  );

  if (!infoLoaded) return <LoadingSpinner />;
  return (
    <UserInfoContext.Provider
      value={{ token, setToken, currentUser, setCurrentUser }}
    >
      <AuthProvider>
        <div className="App">
          <Nav />
          <Routes />
        </div>
      </AuthProvider>
    </UserInfoContext.Provider>
  );
}

export default App;
