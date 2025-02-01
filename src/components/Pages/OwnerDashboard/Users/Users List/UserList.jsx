import React from "react";
import "./UserList.css";

const UserList = ({ users, onEditUser, onDeleteUser }) => {
  return (
    <div className="responsive-table">
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td data-label="Username">{user.username}</td>
              <td data-label="Address">{user.shopAddress}</td>
              <td data-label="Phone Number">{user.phoneNumber}</td>
              <td data-label="Email">{user.email}</td>
              <td data-label="Actions">
                <button onClick={() => onEditUser(user)}>Edit</button>
                <button onClick={() => onDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
