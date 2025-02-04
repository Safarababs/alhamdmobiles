import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./Main";
import OwnerLogin from "./components/Pages/Adminstration/LoginPage/OwnerLogin";
import ManagerLogin from "./components/Pages/Adminstration/LoginPage/ManagerLogin";
import OwnerSignUp from "./components/Pages/Adminstration/administrationPage/OwnerSignup/OwnerSignUp";
import OwnerDashboard from "./components/Pages/OwnerDashboard/OwnerDashboard";
import OwnerAdminsPage from "./components/Pages/OwnerDashboard/OwnerAdminsPage";

const App = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/owner-login" element={<OwnerLogin />} />
        <Route path="/manager-login" element={<ManagerLogin />} />
        <Route path="/owner-signup" element={<OwnerSignUp />} />

        {/* Main Dashboard Routes */}
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />

        {/* Admin Dashboard Route */}
        <Route path="/owner-admins" element={<OwnerAdminsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
