import React from "react";
import "./Sidebar.css";

const Sidebar = ({
  activeComponent,
  handleSetActivePage,
  sidebarActive,
  handleLogout,
}) => {
  return (
    <aside className={`alhamd-sidebar ${sidebarActive ? "active" : ""}`}>
      <h3>Menu</h3>
      <ul>
        <li
          className={activeComponent === "dashboard" ? "active" : ""}
          onClick={() => handleSetActivePage("dashboard")}
        >
          <span className="alhamd-icon">📊</span> Dashboard
        </li>
        <li
          className={activeComponent === "orders" ? "active" : ""}
          onClick={() => handleSetActivePage("orders")}
        >
          <span className="alhamd-icon">🛒</span> Orders
        </li>
        <li
          className={activeComponent === "inventory" ? "active" : ""}
          onClick={() => handleSetActivePage("inventory")}
        >
          <span className="alhamd-icon">📦</span> Inventory
        </li>
        <li
          className={activeComponent === "users" ? "active" : ""}
          onClick={() => handleSetActivePage("users")}
        >
          <span className="alhamd-icon">👥</span> Users
        </li>
        <li
          className={activeComponent === "settings" ? "active" : ""}
          onClick={() => handleSetActivePage("settings")}
        >
          <span className="alhamd-icon">⚙️</span> Settings
        </li>
        <li
          className={activeComponent === "addsales" ? "active" : ""}
          onClick={() => handleSetActivePage("addsales")}
        >
          <span className="alhamd-icon">➕</span> Add Sales
        </li>
        <li className="alhamd-logout-button mobile-only" onClick={handleLogout}>
          <span className="alhamd-icon">➡️</span> Logout
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
