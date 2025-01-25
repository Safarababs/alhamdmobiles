import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../../firebase";
import { Pie } from "react-chartjs-2"; // Importing only Pie from 'react-chartjs-2'
import "chart.js/auto";
import { FaSun, FaMoon } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [ownerName, setOwnerName] = useState(
    localStorage.getItem("ownerName") || ""
  );
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [activePages, setActivePages] = useState(["dashboard"]);

  const handleSetActivePage = (page) => {
    setActivePages([page]); // Set active page
  };

  // In OwnerDashboard.js
  useEffect(() => {
    // Apply the theme globally
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
            ? ["#36a2eb", "#ff6384", "#ffcd56"] // Dark Mode colors
            : ["#36a2eb", "#ff6384", "#ffcd56"], // Light Mode colors
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
        enabled: true, // Disable tooltip on hover
        titleColor: theme === "dark" ? "white" : "black", // Tooltip title color
        bodyColor: theme === "dark" ? "white" : "black", // Tooltip body color
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
        display: true, // Always show values
        color: theme === "dark" ? "white" : "black",
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value) => value, // Show the data values
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
              className={activePages.includes("dashboard") ? "active" : ""}
              onClick={() => handleSetActivePage("dashboard")}
            >
              <NavLink to="/owner-dashboard" activeClassName="active">
                <span className="icon">📊</span> Dashboard
              </NavLink>
            </li>
            <li
              className={activePages.includes("orders") ? "active" : ""}
              onClick={() => handleSetActivePage("orders")}
            >
              <NavLink to="/inventory">
                {" "}
                <span className="icon">🛒</span>Orders
              </NavLink>
            </li>
            <li
              className={activePages.includes("inventory") ? "active" : ""}
              onClick={() => handleSetActivePage("inventory")}
            >
              <NavLink to="/inventory">
                {" "}
                <span className="icon">📦</span> Inventory
              </NavLink>
            </li>
            <li
              className={activePages.includes("users") ? "active" : ""}
              onClick={() => handleSetActivePage("users")}
            >
              <NavLink to="/inventory">
                <span className="icon">👥</span> Users
              </NavLink>
            </li>
            <li
              className={activePages.includes("settings") ? "active" : ""}
              onClick={() => handleSetActivePage("settings")}
            >
              <NavLink to="/inventory">
                <span className="icon">⚙️</span> Settings
              </NavLink>
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

          <div className="dashboard-cards">
            <div className="card">
              <h4>Total Sales</h4>
              <p>₨ 500,000</p>
            </div>

            <div className="card">
              <h4>Orders Today</h4>
              <p>50</p>
            </div>
            <div className="card">
              <h4>New Customers</h4>
              <p>10</p>
            </div>
          </div>

          <div className="dashboard-cards">
            <div className="sales-pie-chart">
              <h3>Sales Distribution</h3>
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>

            <div className="sales-pie-chart">
              <h3>Revenue Breakdown</h3>
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>

            <div className="sales-pie-chart">
              <h3>Orders Per Day</h3>
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OwnerDashboard;
