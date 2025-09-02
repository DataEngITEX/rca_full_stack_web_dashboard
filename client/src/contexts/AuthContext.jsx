// src/contexts/AuthContext.js
import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthContext = createContext();
const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_WEB_BASE_URL,
});

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    const stored = localStorage.getItem("authData");
    return stored ? JSON.parse(stored) : null;
  });

  // keep track of timer so we can cancel it
  const logoutTimerRef = useRef(null);

  const login = async (username, password) => {
    try {
      const res = await axiosApi.post("/api/auth/login", {
        username,
        password,
      });
      const token = res.data.token;
      if (!token) throw new Error("No token received");

      const seconds = 1800; // 30 min
      const expiry = Date.now() + seconds * 1000;
      const newAuthData = { token, expiry };

      setAuthData(newAuthData);
      localStorage.setItem("authData", JSON.stringify(newAuthData));
      return { success: true };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: err.response?.data?.message || "Invalid credentials",
      };
    }
  };

  const logout = () => {
    // clear any existing timer when logging out manually
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    setAuthData(null);
    localStorage.removeItem("authData");
  };

  useEffect(() => {
    if (!authData) return;

    // clear old timer first (in case of re-login)
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    // check immediately
    if (Date.now() > authData.expiry) {
      toast.error("⚠️ Session expired. Logging out...");
      setTimeout(() => logout(), 3000);
      return;
    }

    const timeLeft = authData.expiry - Date.now();

    logoutTimerRef.current = setTimeout(() => {
      toast.error("⚠️ Session expired. Logging out...");
      setTimeout(() => logout(), 3000);
    }, timeLeft);

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, [authData]);

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
