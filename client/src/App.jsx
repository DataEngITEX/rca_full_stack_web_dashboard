import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./pages/Home";
import Process from "./pages/Process";
import Login from "./pages/LogIn";
import ProtectedRoute from "./globals/ProtectedRoute";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";

const DashboardLayout = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className={"flex-1 overflow-y-auto bg-gray-50 p-6 ml-20"}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/process"
            element={
              <ProtectedRoute>
                <Process />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public route: Login */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes use dashboard layout */}
          <Route path="/*" element={<DashboardLayout />} />
        </Routes>
      </AuthProvider>
      <ToastContainer position="top-center" autoClose={2500} />
    </BrowserRouter>
  );
};

export default App;
