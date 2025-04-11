// FILE: src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedLoginState = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(storedLoginState);
  }, []);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const signup = (name, email, password) => {
    // Check if user already exists
    if (users.some(user => user.email === email)) {
      return false;
    }

    // Add new user
    const newUser = { name, email, password };
    setUsers(prevUsers => [...prevUsers, newUser]);
    return true;
  };

  const login = (email, password) => {
    // Check for test credentials
    if (email === "test11@gmail.com" && password === "pass123") {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      return true;
    }
    
    // Check against registered users
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}; 