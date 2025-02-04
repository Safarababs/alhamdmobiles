import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../../../firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OwnerLogin.css";

const OwnerLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastShown, setToastShown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("ownerToken")) {
      navigate("/owner-dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
        localStorage.setItem("ownerToken", "true");
        localStorage.setItem("ownerName", ownerFound.username);
        toast.success("Login successful!", { autoClose: 2000 });
        setToastShown(true);
      } else {
        toast.error("Invalid username or password.", { autoClose: 2000 });
      }
    } catch (err) {
      console.error("Error fetching owner data:", err);
      toast.error("Error logging in. Please try again.", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (toastShown) {
      setTimeout(() => {
        navigate("/owner-dashboard");
      }, 2000);
    }
  }, [toastShown, navigate]);

  return (
    <div className="owner-login-page">
      <div className="owner-login-form">
        <h2 className="owner-login-header">Welcome, Owner</h2>
        <form onSubmit={handleLogin}>
          <div className="owner-input-container">
            <input
              className="owner-login-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="owner-input-container">
            <input
              className="owner-login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="owner-error-message">{error}</p>}
          <button
            className="owner-login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? <div className="owner-spinner"></div> : "Login"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OwnerLogin;
