import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, push, remove, update } from "firebase/database";
import app from "../../../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Users.css";
import usePagination from "./Users List/usePagination";
import UserList from "./Users List/UserList";
import UserForm from "./Users List/UserForm";
import Pagination from "./Pagination";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUserType, setNewUserType] = useState("");
  const [viewType, setViewType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [usersPerPage] = useState(10);
  const [defaultOptionSelected, setDefaultOptionSelected] = useState(true);

  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    shopName: "",
    shopAddress: "",
    phoneNumber: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    const database = getDatabase(app);
    const userRef = ref(database, `users/${userId}`);

    try {
      await remove(userRef);
      toast.success("User deleted successfully!");
      fetchUsers();
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
      password: "",
    });
  };

  const handleSaveUser = async () => {
    const database = getDatabase(app);
    const userRef = ref(database, `users/${editingUser.id}`);

    try {
      await update(userRef, newUserData);
      toast.success("User updated successfully!");
      setEditingUser(null);
      fetchUsers();
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
      setNewUserType("");
      setNewUserData({
        username: "",
        email: "",
        password: "",
        role: "",
        shopName: "",
        shopAddress: "",
        phoneNumber: "",
      });
      fetchUsers();
    } catch (error) {
      toast.error("Failed to add user!");
    }
  };

  const filteredUsers = users.filter((user) => {
    if (viewType === "shopkeepers") {
      return user.role === "Shopkeeper";
    } else if (viewType === "employees") {
      return user.role === "Employee";
    }
    return (
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const {
    currentData: currentUsers,
    totalPages,
    paginate,
  } = usePagination(filteredUsers, usersPerPage);

  const totalShopkeepers = users.filter(
    (user) => user.role === "Shopkeeper"
  ).length;
  const totalEmployees = users.filter(
    (user) => user.role === "Employee"
  ).length;

  const handleOptionsChange = (e) => {
    const selectedOption = e.target.value;

    if (selectedOption === "default") {
      setDefaultOptionSelected(true);
    } else {
      setDefaultOptionSelected(false);
    }

    if (selectedOption === "add-shopkeeper") {
      setNewUserType("Shopkeeper");
    } else if (selectedOption === "add-employee") {
      setNewUserType("Employee");
    } else if (selectedOption === "view-shopkeepers") {
      setViewType("shopkeepers");
    } else if (selectedOption === "view-employees") {
      setViewType("employees");
    } else if (selectedOption === "view-all") {
      setViewType("all");
    }
  };

  return (
    <div className="alhamd-users-section">
      <h3 className="alhamd-users-title">Users</h3>
      <div className="alhamd-user-summary">
        <p className="alhamd-user-summary-text">
          Total Shopkeepers: {totalShopkeepers}
        </p>
        <p className="alhamd-user-summary-text">
          Total Employees: {totalEmployees}
        </p>
      </div>
      <div className="alhamd-view-buttons-container">
        <div className="alhamd-dropdown-options">
          <select
            onChange={handleOptionsChange}
            className={
              defaultOptionSelected ? "alhamd-default-option-selected" : ""
            }
            defaultValue="default"
          >
            <option value="default" disabled>
              Select an Option
            </option>
            <option value="add-shopkeeper">Add Shopkeeper</option>
            <option value="add-employee">Add Employee</option>
            <option value="view-shopkeepers">View Shopkeepers</option>
            <option value="view-employees">View Employees</option>
            <option value="view-all">View All Users</option>
          </select>
        </div>
        <div className="alhamd-view-buttons">
          <button onClick={() => setNewUserType("Shopkeeper")}>
            Add Shopkeeper
          </button>
          <button onClick={() => setNewUserType("Employee")}>
            Add Employee
          </button>
          <button onClick={() => setViewType("shopkeepers")}>
            All Shopkeepers
          </button>
          <button onClick={() => setViewType("employees")}>
            All Employees
          </button>
          <button onClick={() => setViewType("all")}>View All Users</button>
        </div>
      </div>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="alhamd-search-input"
      />
      {loading ? (
        <div className="alhamd-spinner">Loading...</div>
      ) : (
        <UserList
          users={currentUsers}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      )}
      <Pagination totalPages={totalPages} paginate={paginate} />
      {(newUserType || editingUser) && (
        <UserForm
          newUserType={newUserType}
          newUserData={newUserData}
          setNewUserData={setNewUserData}
          onSaveUser={editingUser ? handleSaveUser : handleAddUser}
          editingUser={editingUser}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Users;
