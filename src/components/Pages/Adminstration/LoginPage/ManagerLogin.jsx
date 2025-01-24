import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const ManagerLogin = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Handle the login logic here
    if (username === "manager" && password === "manager") {
      navigate("/manager-dashboard"); // Redirect to the manager dashboard after successful login
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h2 className="login-header">Welcome Manager</h2>
        <input
          type="text"
          className="login-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default ManagerLogin;
