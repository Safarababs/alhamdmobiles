import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OwnerDashboard.css";
import Dashboard from "./Dashboard/Dashboard";
import Orders from "./Orders/Orders";
import Inventory from "./Inventory/Inventory";

import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";
import AddSales from "./Sales/AddSales";
import Pending from "./Dashboard/Pending/Pending";
import Sales from "./Dashboard/SalesData/Sales";

import ShowExpenses from "./Inventory/Expenses/Show Expensis/Show Expenses";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [ownerName, setOwnerName] = useState(
    localStorage.getItem("ownerName") || ""
  );
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [sidebarActive, setSidebarActive] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalLoss, setTotalLoss] = useState(0);
  const [dailySalesCount, setDailySalesCount] = useState(0);
  const [dailyNewCustomersCount, setDailyNewCustomersCount] = useState(0);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("daily");

  const handleSetActivePage = (page) => {
    setActiveComponent(page);
    setSidebarActive(false);
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
    document.documentElement.setAttribute("data-theme", theme);
    window.addEventListener("scroll", closeSidebarOnScroll);
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
        const existingPhoneNumbers = new Set();

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
              existingPhoneNumbers.add(sale.phoneNumber);
            }
            if (sale.items && Array.isArray(sale.items)) {
              sale.items.forEach((item) => {
                totalProfitAmount += item.profit || 0;
                totalLossAmount += item.loss || 0;
              });
            }
          }
        });

        setDailySalesCount(salesCount);
        setDailyNewCustomersCount(newCustomersCount);
        setTotalSales(totalSalesAmount);
        setTotalProfit(totalProfitAmount);
        setTotalLoss(totalLossAmount);
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
      <div className="alhamd-dashboard-layout">
        <Sidebar
          activeComponent={activeComponent}
          handleSetActivePage={handleSetActivePage}
          sidebarActive={sidebarActive}
          handleLogout={handleLogout}
        />
        <main className="alhamd-main-content">
          {loading ? (
            <div className="alhamd-loading-text">Loading...</div>
          ) : (
            <div className="alhamd-welcome-message">
              <h2>Welcome, {ownerName}! 🎉</h2>
              <p>Here’s a quick overview of your store.</p>
            </div>
          )}
          {activeComponent === "dashboard" && (
            <Dashboard
              totalSales={totalSales}
              totalProfit={totalProfit}
              totalLoss={totalLoss}
              dailySalesCount={dailySalesCount}
              dailyNewCustomersCount={dailyNewCustomersCount}
              selectedTimePeriod={selectedTimePeriod}
              setSelectedTimePeriod={setSelectedTimePeriod}
            />
          )}
          {activeComponent === "orders" && <Orders />}
          {activeComponent === "inventory" && <Inventory />}
          {activeComponent === "expenses" && <ShowExpenses />}
          {activeComponent === "addsales" && <AddSales />}
          {activeComponent === "pendingAmount" && <Pending />}
          {activeComponent === "sales" && <Sales />}
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;
