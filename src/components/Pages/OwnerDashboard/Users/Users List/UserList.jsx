import React from "react";
import "./UserList.css";

const UserList = ({ users, onEditUser, onDeleteUser }) => {
  return (
    <div className="alhamd-responsive-table">
      <table className="alhamd-user-table">
        <thead className="alhamd-table-head">
          <tr>
            <th className="alhamd-table-header">Username</th>
            <th className="alhamd-table-header">Address</th>
            <th className="alhamd-table-header">Phone Number</th>
            <th className="alhamd-table-header">Email</th>
            <th className="alhamd-table-header">Actions</th>
          </tr>
        </thead>
        <tbody className="alhamd-table-body">
          {users.map((user) => (
            <tr key={user.id} className="alhamd-table-row">
              <td className="alhamd-table-cell" data-label="Username">
                {user.username}
              </td>
              <td className="alhamd-table-cell" data-label="Address">
                {user.shopAddress}
              </td>
              <td className="alhamd-table-cell" data-label="Phone Number">
                {user.phoneNumber}
              </td>
              <td className="alhamd-table-cell" data-label="Email">
                {user.email}
              </td>
              <td className="alhamd-table-cell" data-label="Actions">
                <button
                  className="alhamd-edit-button"
                  onClick={() => onEditUser(user)}
                >
                  Edit
                </button>
                <button
                  className="alhamd-delete-button"
                  onClick={() => onDeleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
