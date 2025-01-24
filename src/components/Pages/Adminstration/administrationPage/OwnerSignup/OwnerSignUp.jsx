import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For page navigation
import { getDatabase, ref, set, push, get } from "firebase/database";
import app from "../../../../../firebase"; // Firebase initialization
import "./OwnerSignUp.css";

function OwnerSignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Owner's name
  const [username, setUsername] = useState(""); // Owner's username
  const [error, setError] = useState(""); // Error state
  const [success, setSuccess] = useState(false); // Success state
  const [loading, setLoading] = useState(false); // Loading state for spinner

  const navigate = useNavigate();
  const database = getDatabase(app); // Initialize Firebase Database

  // Function to handle saving owner data to Firebase
  const saveData = () => {
    setLoading(true); // Start spinner when the button is clicked

    const ownersRef = ref(database, "owners"); // Root reference for owners

    // Check if an owner with the same email or username already exists
    get(ownersRef).then((snapshot) => {
      let exists = false;
      snapshot.forEach((childSnapshot) => {
        const owner = childSnapshot.val();
        if (owner.email === email || owner.username === username) {
          exists = true;
        }
      });

      if (exists) {
        setLoading(false); // Stop spinner after checking
        setError("An owner with this email or username already exists.");
      } else {
        // Pushing new owner data to Firebase with a unique key
        const newOwnerRef = push(ownersRef); // `push` will generate a unique ID for the new owner

        set(newOwnerRef, {
          email,
          password,
          name,
          username,
        })
          .then(() => {
            setLoading(false); // Stop spinner after successful signup
            setSuccess(true);
            alert("Owner signed up successfully!");
            setEmail("");
            setPassword("");
            setName("");
            setUsername("");
            navigate("/owner-login"); // Navigate to another page after success (optional)
          })
          .catch((error) => {
            setLoading(false); // Stop spinner in case of error
            setError("Error signing up. Please try again.");
            console.error(
              "Error writing new owner data to Firebase",
              error.message
            ); // More detailed error
          });
      }
    });
  };

  return (
    <div className="owner-signup">
      <div className="signup-container">
        {error && <div className="error">{error}</div>}
        {success && <div className="success">Signed up successfully!</div>}
        <h2>New Owner Registration</h2>
        <div>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter owner's name"
          />
        </div>

        <div>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </div>

        <div>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </div>

        <div>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        {/* Sign Up Button */}
        <button onClick={saveData} disabled={loading}>
          {loading ? <div className="spinner"></div> : "Sign Up"}
        </button>
      </div>
    </div>
  );
}

export default OwnerSignUp;
