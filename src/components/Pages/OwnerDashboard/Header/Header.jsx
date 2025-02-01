import React from "react";
import { FaSun, FaMoon, FaBars } from "react-icons/fa";
import "./Header.css";

const Header = ({
  ownerName,
  theme,
  toggleTheme,
  handleLogout,
  toggleSidebar,
}) => {
  return (
    <header className="dashboard-header">
      <h2>Alhamd Mobiles Admin Panel</h2>
      <div className="header-actions">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
      </div>
    </header>
  );
};

export default Header;
