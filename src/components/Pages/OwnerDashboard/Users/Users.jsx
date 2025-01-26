import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, push, remove, update } from "firebase/database";
import app from "../../../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUserType, setNewUserType] = useState("");
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    shopName: "", // Added field for shopkeeper
    shopAddress: "", // Added field for shopkeeper
    phoneNumber: "", // Added field for shopkeeper
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const database = getDatabase(app);
    const usersRef = ref(database, "users");

    try {
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const usersData = Object.entries(snapshot.val()).map(([id, user]) => ({
          id,
          ...user,
        }));
        setUsers(usersData);
      }
    } catch (error) {
      toast.error("Failed to load users!");
    }
  };

  const handleDeleteUser = async (userId) => {
    const database = getDatabase(app);
    const userRef = ref(database, `users/${userId}`);

    try {
      await remove(userRef);
      toast.success("User deleted successfully!");
      fetchUsers(); // Refresh user list
    } catch (error) {
      toast.error("Failed to delete user!");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUserData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: "", // Avoid pre-filling password for security reasons
    });
  };

  const handleSaveUser = async () => {
    const database = getDatabase(app);
    const userRef = ref(database, `users/${editingUser.id}`);

    try {
      await update(userRef, newUserData);
      toast.success("User updated successfully!");
      setEditingUser(null);
      fetchUsers(); // Refresh user list
    } catch (error) {
      toast.error("Failed to update user!");
    }
  };

  const handleAddUser = async () => {
    const database = getDatabase(app);
    const usersRef = ref(database, "users");

    try {
      await push(usersRef, newUserData);
      toast.success("User added successfully!");
      setNewUserType(""); // Reset user type selection
      setNewUserData({
        username: "",
        email: "",
        password: "",
        role: "",
        shopName: "", // Reset form field for shopkeeper
        shopAddress: "", // Reset form field for shopkeeper
        phoneNumber: "", // Reset form field for shopkeeper
      }); // Reset form data
      fetchUsers(); // Refresh user list
    } catch (error) {
      toast.error("Failed to add user!");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="users-section">
      <h3>Users</h3>
      <div className="user-types">
        <button onClick={() => setNewUserType("Shopkeeper")}>
          Add Shopkeeper
        </button>
        <button onClick={() => setNewUserType("Employee")}>Add Employee</button>
        <button onClick={() => setNewUserType("Walking Customer")}>
          Add Walking Customer
        </button>
      </div>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="user-list">
        {filteredUsers.map((user) => (
          <li key={user.id}>
            <span>{user.username}</span> <span>({user.email})</span>
            <button onClick={() => handleEditUser(user)}>Edit</button>
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {(newUserType || editingUser) && (
        <div className="user-form">
          <h4>{editingUser ? "Edit User" : `Add ${newUserType}`}</h4>
          <label>
            Username:
            <input
              type="text"
              value={newUserData.username}
              onChange={(e) =>
                setNewUserData({ ...newUserData, username: e.target.value })
              }
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={newUserData.email}
              onChange={(e) =>
                setNewUserData({ ...newUserData, email: e.target.value })
              }
            />
          </label>
          {(!editingUser || newUserType === "Shopkeeper") && (
            <>
              <label>
                Password:
                <input
                  type="password"
                  value={newUserData.password}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, password: e.target.value })
                  }
                />
              </label>
              <label>
                Role:
                <input
                  type="text"
                  value={newUserData.role}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, role: e.target.value })
                  }
                />
              </label>
              {newUserType === "Shopkeeper" && (
                <>
                  <label>
                    Shop Name:
                    <input
                      type="text"
                      value={newUserData.shopName}
                      onChange={(e) =>
                        setNewUserData({
                          ...newUserData,
                          shopName: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    Shop Address:
                    <input
                      type="text"
                      value={newUserData.shopAddress}
                      onChange={(e) =>
                        setNewUserData({
                          ...newUserData,
                          shopAddress: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    Phone Number:
                    <input
                      type="text"
                      value={newUserData.phoneNumber}
                      onChange={(e) =>
                        setNewUserData({
                          ...newUserData,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </label>
                </>
              )}
            </>
          )}
          <button onClick={editingUser ? handleSaveUser : handleAddUser}>
            {editingUser ? "Save" : "Add"}
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Users;
