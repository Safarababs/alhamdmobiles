import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManagerLogin.css";

const ManagerLogin = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "manager" && password === "manager") {
      navigate("/manager-dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="manager-login-page">
      <div className="manager-login-form">
        <h2 className="manager-login-header">Welcome Manager</h2>
        <input
          type="text"
          className="manager-login-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="manager-login-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="manager-login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default ManagerLogin;
