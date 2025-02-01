import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OwnerDashboard.css";
import "./Sidebar/Sidebar.css";
import "./Header/Header.css";
import Dashboard from "./Dashboard/Dashboard";
import Orders from "./Orders/Orders";
import Inventory from "./Inventory/Inventory";
import Users from "./Users/Users";
import Settings from "./Settings/Settings";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";
import AddSales from "./Sales/AddSales";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [ownerName, setOwnerName] = useState(
    localStorage.getItem("ownerName") || ""
  );
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [sidebarActive, setSidebarActive] = useState(false);
  const [totalSales, setTotalSales] = useState(0); // New state for total sales
  const [totalProfit, setTotalProfit] = useState(0); // New state for total profit
  const [totalLoss, setTotalLoss] = useState(0); // New state for total loss
  const [dailySalesCount, setDailySalesCount] = useState(0); // State for daily sales count
  const [dailyNewCustomersCount, setDailyNewCustomersCount] = useState(0); // State for daily new customers count
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("daily"); // State for selected time period

  const handleSetActivePage = (page) => {
    setActiveComponent(page); // Set active component
    setSidebarActive(false); // Close sidebar on page change
  };

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const closeSidebarOnScroll = () => {
    if (window.innerWidth <= 768) {
      setSidebarActive(false);
    }
  };

  useEffect(() => {
    document.body.className = theme; // Adding theme class directly to body

    // Add scroll event listener
    window.addEventListener("scroll", closeSidebarOnScroll);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("scroll", closeSidebarOnScroll);
    };
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem("ownerToken");

    if (!token) {
      navigate("/owner-login");
    } else if (!ownerName && token) {
      fetchOwnerData(token);
    }

    fetchSalesData(selectedTimePeriod);
  }, [navigate, ownerName, selectedTimePeriod]);

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
      toast.error("Failed to fetch owner data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesData = async (timePeriod) => {
    const database = getDatabase(app);
    const salesRef = ref(database, "sales");
    const today = new Date();
    const startDate = new Date();

    // Adjust startDate based on the selected time period
    switch (timePeriod) {
      case "weekly":
        startDate.setDate(today.getDate() - 7);
        break;
      case "monthly":
        startDate.setMonth(today.getMonth() - 1);
        break;
      case "yearly":
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      case "all-time":
        startDate.setFullYear(today.getFullYear() - 100);
        break;
      default:
        startDate.setDate(today.getDate() - 1);
        break;
    }

    try {
      const snapshot = await get(salesRef);
      if (snapshot.exists()) {
        let salesCount = 0;
        let newCustomersCount = 0;
        let totalSalesAmount = 0;
        let totalProfitAmount = 0;
        let totalLossAmount = 0;
        const existingPhoneNumbers = new Set(); // Set to store existing phone numbers

        // Fetch existing phone numbers from the customer database
        const customersRef = ref(database, "customers");
        const customersSnapshot = await get(customersRef);
        if (customersSnapshot.exists()) {
          customersSnapshot.forEach((childSnapshot) => {
            const customer = childSnapshot.val();
            if (customer.phoneNumber) {
              existingPhoneNumbers.add(customer.phoneNumber);
            }
          });
        }

        snapshot.forEach((childSnapshot) => {
          const sale = childSnapshot.val();
          const saleDate = new Date(sale.date);
          if (saleDate >= startDate && saleDate <= today) {
            salesCount += 1;
            totalSalesAmount += sale.total || 0;
            if (!existingPhoneNumbers.has(sale.phoneNumber)) {
              newCustomersCount += 1;
              existingPhoneNumbers.add(sale.phoneNumber); // Add new customer phone number to the set
            }
            if (sale.items && Array.isArray(sale.items)) {
              sale.items.forEach((item) => {
                totalProfitAmount += item.profit || 0; // Default to 0 if profit is undefined
                totalLossAmount += item.loss || 0; // Default to 0 if loss is undefined
              });
            }
          }
        });

        setDailySalesCount(salesCount);
        setDailyNewCustomersCount(newCustomersCount);
        setTotalSales(totalSalesAmount); // Set total sales amount in state
        setTotalProfit(totalProfitAmount); // Set total profit in state
        setTotalLoss(totalLossAmount); // Set total loss in state
        toast.success("Sales data loaded successfully!");
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

  return (
    <div className={`owner-dashboard ${theme}`}>
      <Header
        ownerName={ownerName}
        theme={theme}
        toggleTheme={toggleTheme}
        handleLogout={handleLogout}
        toggleSidebar={toggleSidebar}
      />

      <div className="dashboard-layout">
        <Sidebar
          activeComponent={activeComponent}
          handleSetActivePage={handleSetActivePage}
          sidebarActive={sidebarActive}
          handleLogout={handleLogout}
        />

        <main className="main-content">
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <div className="welcome-message">
              <h2>Welcome, {ownerName}! 🎉</h2>
              <p>Here’s a quick overview of your store.</p>
            </div>
          )}
          <select
            value={selectedTimePeriod}
            onChange={(e) => setSelectedTimePeriod(e.target.value)}
            className="time-period-select"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="all-time">All Time</option>
          </select>
          {activeComponent === "dashboard" && (
            <Dashboard
              totalSales={totalSales} // Pass total sales as a prop
              totalProfit={totalProfit} // Pass total profit as a prop
              totalLoss={totalLoss} // Pass total loss as a prop
              dailySalesCount={dailySalesCount} // Pass daily sales count as a prop
              dailyNewCustomersCount={dailyNewCustomersCount} // Pass daily new customers count as a prop
            />
          )}
          {activeComponent === "orders" && <Orders />}
          {activeComponent === "inventory" && <Inventory />}
          {activeComponent === "users" && <Users />}
          {activeComponent === "settings" && <Settings />}
          {activeComponent === "addsales" && <AddSales />}{" "}
          {/* AddSales component */}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OwnerDashboard;
