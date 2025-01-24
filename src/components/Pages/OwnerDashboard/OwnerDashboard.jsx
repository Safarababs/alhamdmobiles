import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../../firebase"; // ✅ Updated Firebase Import
import "./Dashboard.css";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // ✅ Import Chart.js
import { FaSun, FaMoon } from "react-icons/fa"; // ✅ Import Icons for Theme Toggle

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [ownerName, setOwnerName] = useState(
    localStorage.getItem("ownerName") || ""
  );
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const token = localStorage.getItem("ownerToken");

    if (!token) {
      navigate("/owner-login");
    } else if (!ownerName) {
      fetchOwnerData(token);
    }

    fetchSalesData();
  }, [navigate, ownerName]);

  // 🔹 Fetch Owner Data
  const fetchOwnerData = async (token) => {
    setLoading(true);
    const database = getDatabase(app);
    const ownersRef = ref(database, "owners");

    try {
      const snapshot = await get(ownersRef);
      const ownersData = snapshot.val();

      for (let key in ownersData) {
        if (ownersData[key].token === token) {
          setOwnerName(ownersData[key].username);
          localStorage.setItem("ownerName", ownersData[key].username);
          break;
        }
      }
    } catch (error) {
      console.error("Error fetching owner data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch Sales Data
  const fetchSalesData = async () => {
    const database = getDatabase(app);
    const salesRef = ref(database, "sales");

    try {
      const snapshot = await get(salesRef);
      if (snapshot.exists()) {
        const salesArray = Object.values(snapshot.val());
        setSalesData(salesArray);
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  // 🔹 Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("ownerToken");
    localStorage.removeItem("ownerName");
    navigate("/owner-login");
  };

  // 🔹 Toggle Theme Mode
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // 🔹 Chart Data for Sales Graph
  const salesChartData = {
    labels: salesData.map((_, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: "Daily Sales",
        data: salesData,
        fill: false,
        borderColor: "#007bff",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className={`owner-dashboard ${theme}`}>
      {/* 🔹 Top Navigation Bar */}
      <header className="dashboard-header">
        <h2>Alhamd Mobiles Admin Panel</h2>
        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* 🔹 Dashboard Layout */}
      <div className="dashboard-layout">
        {/* Sidebar Navigation */}
        <aside className="sidebar">
          <h3>Menu</h3>
          <ul>
            <li>📊 Dashboard</li>
            <li>🛒 Orders</li>
            <li>📦 Inventory</li>
            <li>👥 Users</li>
            <li>⚙️ Settings</li>
          </ul>
        </aside>

        {/* Main Dashboard Content */}
        <main className="main-content">
          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : (
            <div className="welcome-message">
              <h2>Welcome, {ownerName}! 🎉</h2>
              <p>Here’s a quick overview of your store.</p>
            </div>
          )}

          {/* Sales Graph */}
          <div className="sales-graph">
            <h3>📊 Sales Overview</h3>
            <Line data={salesChartData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;
