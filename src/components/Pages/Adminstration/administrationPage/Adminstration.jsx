import React from "react";
import { useNavigate } from "react-router-dom";
import "./Administration.css";

const Administration = () => {
  const navigate = useNavigate();

  const handleOwnerLogin = () => {
    navigate("/owner-login");
  };

  const handleManagerLogin = () => {
    navigate("/manager-login");
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1 className="admin-header">Welcome to the Alhamd Dashboard</h1>
        <div className="admin-buttons">
          <button onClick={handleOwnerLogin}>Login as Owner</button>
          <button onClick={handleManagerLogin}>Login as Manager</button>
        </div>
      </div>
    </div>
  );
};

export default Administration;
