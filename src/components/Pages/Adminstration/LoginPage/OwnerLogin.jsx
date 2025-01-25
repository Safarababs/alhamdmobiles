import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../../../firebase";
import { toast, ToastContainer } from "react-toastify"; // Import both 'toast' and 'ToastContainer'
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import "./LoginPage.css";

const OwnerLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastShown, setToastShown] = useState(false);
  const navigate = useNavigate();

  // 🔹 Redirect to dashboard if already logged in
  useEffect(() => {
    if (localStorage.getItem("ownerToken")) {
      navigate("/owner-dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // ✅ Clear previous errors before new login attempt

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

        // Trigger success toast
        toast.success("Login successful!", { autoClose: 2000 });

        setToastShown(true); // Mark toast as shown
      } else {
        toast.error("Invalid username or password.", { autoClose: 2000 }); // ✅ Ensure toast fires
      }
    } catch (err) {
      console.error("Error fetching owner data:", err);
      toast.error("Error logging in. Please try again.", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  // Redirect after toast is shown
  useEffect(() => {
    if (toastShown) {
      setTimeout(() => {
        navigate("/owner-dashboard");
      }, 2000); // Ensure navigation after the toast stays visible
    }
  }, [toastShown, navigate]);

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

      {/* Add ToastContainer here */}
      <ToastContainer />
    </div>
  );
};

export default OwnerLogin;
