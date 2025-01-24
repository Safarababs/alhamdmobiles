import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../../../firebase";
import "./LoginPage.css";

const OwnerLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Redirect to dashboard if already logged in
  useEffect(() => {
    if (localStorage.getItem("ownerToken")) {
      navigate("/owner-dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();

    const database = getDatabase(app);
    const ownersRef = ref(database, "owners");

    try {
      const snapshot = await get(ownersRef);
      const ownersData = snapshot.val();
      let ownerFound = null;

      for (let key in ownersData) {
        if (
          ownersData[key].username === username &&
          ownersData[key].password === password
        ) {
          ownerFound = ownersData[key];
          break;
        }
      }

      if (ownerFound) {
        localStorage.setItem("ownerToken", "true"); // Dummy token for now
        localStorage.setItem("ownerName", ownerFound.username); // Store owner's name
        navigate("/owner-dashboard");
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      setError("Error logging in. Please try again.");
      console.error("Error fetching owner data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h2 className="login-header">Welcome, Owner</h2>
        <form onSubmit={handleLogin}>
          <div className="input-container">
            <input
              className="login-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button className="login-button" type="submit" disabled={loading}>
            {loading ? <div className="spinner"></div> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OwnerLogin;
