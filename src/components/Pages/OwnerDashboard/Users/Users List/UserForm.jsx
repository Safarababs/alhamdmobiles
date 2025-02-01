import React from "react";
import AddShopkeeper from "../AddShopkeeper/AddShopkeeper";
import AddEmployee from "../AddEmployee/AddEmployee";

const UserForm = ({
  newUserType,
  newUserData,
  setNewUserData,
  onSaveUser,
  editingUser,
}) => {
  return (
    <div className="user-form">
      <h4>{editingUser ? "Edit User" : `Add ${newUserType}`}</h4>
      {newUserType === "Shopkeeper" && <AddShopkeeper onSave={onSaveUser} />}
      {newUserType === "Employee" && <AddEmployee onSave={onSaveUser} />}
      {newUserType !== "Shopkeeper" && newUserType !== "Employee" && (
        <>
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
          <button onClick={onSaveUser}>{editingUser ? "Save" : "Add"}</button>
        </>
      )}
    </div>
  );
};

export default UserForm;
