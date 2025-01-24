import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, set, remove, push } from "firebase/database";
import app from "../../../firebase";

const OwnerAdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(true);

  const database = getDatabase(app);
  const adminsRef = ref(database, "admins");

  // Fetch admins from Firebase
  useEffect(() => {
    setLoading(true);
    get(adminsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setAdmins(
            Object.entries(snapshot.val()).map(([id, data]) => ({
              id,
              ...data,
            }))
          );
        }
      })
      .catch((err) => console.error("Error fetching admins:", err))
      .finally(() => setLoading(false));
  }, [adminsRef]); // Add adminsRef to the dependency array

  // Add a new admin
  const handleAddAdmin = () => {
    if (!newAdmin.username || !newAdmin.email || !newAdmin.password) {
      setError("All fields are required!");
      return;
    }

    // Check if email already exists
    const emailExists = admins.some((admin) => admin.email === newAdmin.email);
    if (emailExists) {
      setError("Email already registered!");
      return;
    }

    setError("");
    setLoading(true);
    setIsLoadingData(true);

    const newAdminRef = push(adminsRef); // Generate a unique ID
    set(newAdminRef, newAdmin)
      .then(() => {
        setAdmins([...admins, { id: newAdminRef.key, ...newAdmin }]);
        setNewAdmin({ username: "", email: "", password: "" });
      })
      .catch((err) => console.error("Error adding admin:", err))
      .finally(() => setLoading(false));
  };

  // Delete an admin
  const handleDeleteAdmin = (id) => {
    remove(ref(database, `admins/${id}`))
      .then(() => {
        setAdmins(admins.filter((admin) => admin.id !== id));
      })
      .catch((err) => console.error("Error deleting admin:", err));
  };

  return (
    <div className="owner-admins-page">
      <h2>Manage Admins</h2>

      {/* Add Admin Form */}
      <div className="add-admin-form">
        <input
          type="text"
          placeholder="Username"
          value={newAdmin.username}
          onChange={(e) =>
            setNewAdmin({ ...newAdmin, username: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Email"
          value={newAdmin.email}
          onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={newAdmin.password}
          onChange={(e) =>
            setNewAdmin({ ...newAdmin, password: e.target.value })
          }
        />
        <button onClick={handleAddAdmin} disabled={loading}>
          {loading ? "Adding..." : "Add Admin"}
        </button>
        {error && <p className="error">{error}</p>}
      </div>

      {/* Admin List */}
      {isLoadingData ? (
        <p>Loading admins...</p>
      ) : (
        <ul className="admin-list">
          {admins.map((admin) => (
            <li key={admin.id}>
              {admin.username} ({admin.email})
              <button onClick={() => handleDeleteAdmin(admin.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OwnerAdminsPage;
