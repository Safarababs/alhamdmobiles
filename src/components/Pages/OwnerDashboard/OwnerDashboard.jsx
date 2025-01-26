import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../../firebase";
import { FaSun, FaMoon } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OwnerDashboard.css";
import Dashboard from "./Dashboard/Dashboard";
import Orders from "./Orders/Orders";
import Inventory from "./Inventory/Inventory";
import Users from "./Users/Users";
import Settings from "./Settings/Settings";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [ownerName, setOwnerName] = useState(
    localStorage.getItem("ownerName") || ""
  );
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [activeComponent, setActiveComponent] = useState("dashboard");

  const handleSetActivePage = (page) => {
    setActiveComponent(page); // Set active component
  };

  useEffect(() => {
    document.body.className = theme; // Adding theme class directly to body
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem("ownerToken");

    if (!token) {
      navigate("/owner-login");
    } else if (!ownerName && token) {
      fetchOwnerData(token);
    }

    fetchSalesData();
  }, [navigate, ownerName]);

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

  const fetchSalesData = async () => {
    const database = getDatabase(app);
    const salesRef = ref(database, "sales");

    try {
      const snapshot = await get(salesRef);
      if (snapshot.exists()) {
        const salesArray = Object.values(snapshot.val());
        toast.success("Sales data loaded successfully!");
        console.log(salesArray);
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
      toast.error("Failed to load sales data!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ownerToken");
    localStorage.removeItem("ownerName");
    toast.info("You have logged out successfully!");
    setTimeout(() => navigate("/owner-login"), 500);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const pieChartData = {
    labels: ["Sales A", "Sales B", "Sales C"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor:
          theme === "light"
            ? ["#36a2eb", "#ff6384", "#ffcd56"] // Light Mode colors
            : ["#36a2eb", "#ff6384", "#ffcd56"], // Dark Mode colors
        hoverBackgroundColor:
          theme === "dark"
            ? ["#36a2eb", "#ff6384", "#ffcd56"]
            : ["#4e73df", "#1cc88a", "#36b9cc"],
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
        titleColor: theme === "dark" ? "white" : "black",
        bodyColor: theme === "dark" ? "white" : "black",
      },
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
          },
          color: theme === "dark" ? "white" : "black",
        },
      },
      datalabels: {
        display: true,
        color: theme === "dark" ? "white" : "black",
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value) => value,
      },
    },
  };

  return (
    <div className={`owner-dashboard ${theme}`}>
      <header className="dashboard-header">
        <h2>Alhamd Mobiles Admin Panel</h2>
        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${
              theme === "light" ? "dark" : "light"
            } theme`}
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <h3>Menu</h3>
          <ul>
            <li
              className={activeComponent === "dashboard" ? "active" : ""}
              onClick={() => handleSetActivePage("dashboard")}
            >
              <span className="icon">📊</span> Dashboard
            </li>
            <li
              className={activeComponent === "orders" ? "active" : ""}
              onClick={() => handleSetActivePage("orders")}
            >
              <span className="icon">🛒</span> Orders
            </li>
            <li
              className={activeComponent === "inventory" ? "active" : ""}
              onClick={() => handleSetActivePage("inventory")}
            >
              <span className="icon">📦</span> Inventory
            </li>
            <li
              className={activeComponent === "users" ? "active" : ""}
              onClick={() => handleSetActivePage("users")}
            >
              <span className="icon">👥</span> Users
            </li>
            <li
              className={activeComponent === "settings" ? "active" : ""}
              onClick={() => handleSetActivePage("settings")}
            >
              <span className="icon">⚙️</span> Settings
            </li>
          </ul>
        </aside>

        <main className="main-content">
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <div className="welcome-message">
              <h2>Welcome, {ownerName}! 🎉</h2>
              <p>Here’s a quick overview of your store.</p>
            </div>
          )}

          {activeComponent === "dashboard" && (
            <Dashboard
              pieChartData={pieChartData}
              pieChartOptions={pieChartOptions}
            />
          )}

          {activeComponent === "orders" && <Orders />}

          {activeComponent === "inventory" && <Inventory />}

          {activeComponent === "users" && <Users />}

          {activeComponent === "settings" && <Settings />}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OwnerDashboard;
