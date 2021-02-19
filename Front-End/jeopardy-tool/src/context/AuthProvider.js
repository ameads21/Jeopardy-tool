import AuthContext from "./AuthContext";
import React, { useContext, useState } from "react";
import UserInfoContext from "./UserInfoContext";
import Api from "../Api";

const AuthProvider = ({ children }) => {
  const { setToken, setCurrentUser } = useContext(UserInfoContext);

  async function login(loginData) {
    try {
      let { data } = await Api.login(loginData);
      let { token } = data;
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  async function register(registerData) {
    try {
      let { data } = await Api.register(registerData);
      let { token } = data;
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.err("Registeration failed", errors);
      return { success: false, errors };
    }
  }
  function logout() {
    setCurrentUser(null);
    setToken(null);
  }
  return (
    <AuthContext.Provider value={{ login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
