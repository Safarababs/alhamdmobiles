import React from "react";
import { FaSun, FaMoon, FaBars } from "react-icons/fa";
import "./Header.css"; // Import the CSS file

const Header = ({ theme, toggleTheme, toggleSidebar }) => {
  return (
    <header className="alhamd-dashboard-header">
      <h2>Alhamd Mobiles Admin Panel</h2>
      <div className="alhamd-header-actions">
        <button className="alhamd-sidebar-toggle" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <button
          className="alhamd-theme-toggle"
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
