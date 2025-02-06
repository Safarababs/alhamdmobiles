import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import { getDatabase, ref, onValue } from "firebase/database";
import app from "../../../../firebase";
import "./Dashboard.css";
import Sales from "./Sales/sales";
import { getStartDateForPeriod } from "./Sort Data/dateUtils";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
);

const normalizeSale = (sale) => {
  return {
    code: sale.code || "",
    name: sale.name || "",
    price: sale.price || sale.salePrice || 0,
    purchasePrice: sale.purchasePrice || 0,
    quantity: sale.quantity || 0,
    total:
      sale.total || (sale.quantity || 1) * (sale.price || sale.salePrice || 0),
    phoneNumber: sale.phoneNumber || "",
    totalProfit: sale.totalProfit || sale.profit || 0,
    totalLoss: sale.totalLoss || sale.loss || 0,
    date: sale.date || new Date().toISOString(),
  };
};

const filterSalesData = (salesData, selectedTimePeriod) => {
  const startDate = getStartDateForPeriod(selectedTimePeriod);
  const now = new Date();

  return salesData.filter((sale) => {
    const saleDate = new Date(sale.date);
    return saleDate >= startDate && saleDate <= now;
  });
};

const Dashboard = ({ selectedTimePeriod, setSelectedTimePeriod }) => {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalPendingAmount, setTotalPendingAmount] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const database = getDatabase(app);
    const expensesRef = ref(database, "expenses");
    const pendingRef = ref(database, "pendingAmounts");

    setLoading(true);

    onValue(expensesRef, (snapshot) => {
      let expenses = 0;
      snapshot.forEach((childSnapshot) => {
        const expense = childSnapshot.val();
        expenses += expense.amount;
      });
      setTotalExpenses(expenses);
    });

    onValue(pendingRef, (snapshot) => {
      let pendingAmount = 0;
      snapshot.forEach((childSnapshot) => {
        const pending = childSnapshot.val();
        pendingAmount += pending.pendingAmount;
      });
      setTotalPendingAmount(pendingAmount);
    });

    const salesRef = ref(database, "sales");
    onValue(salesRef, (snapshot) => {
      const salesArray = [];
      snapshot.forEach((childSnapshot) => {
        const sale = normalizeSale(childSnapshot.val());
        salesArray.push(sale);
      });
      setSalesData(salesArray);
      setLoading(false);
    });
  }, []);

  const filteredSalesData = filterSalesData(salesData, selectedTimePeriod);

  const calculateTotals = () => {
    let totalSales = 0;
    let totalProfit = 0;
    let totalLoss = 0;
    let dailySalesCount = 0;
    let dailyNewCustomersCount = 0;
    const today = new Date();

    filteredSalesData.forEach((sale) => {
      const saleDate = new Date(sale.date);
      if (saleDate.toDateString() === today.toDateString()) {
        dailySalesCount += sale.quantity;
        if (sale.phoneNumber) dailyNewCustomersCount += 1;
      }
      totalSales += sale.total;
      totalProfit += sale.totalProfit;
      totalLoss += sale.totalLoss;
    });

    return {
      totalSales,
      totalProfit,
      totalLoss,
      dailySalesCount,
      dailyNewCustomersCount,
    };
  };

  const {
    totalSales,
    totalProfit,
    totalLoss,
    dailySalesCount,
    dailyNewCustomersCount,
  } = calculateTotals();

  const adjustedTotalSales = totalSales;
  const totalAvailable = adjustedTotalSales - totalExpenses;

  const pieChartData = {
    labels: ["Total Profit"],
    datasets: [
      {
        label: "Total Profit",
        data: [totalProfit],
        backgroundColor: ["#ff6384"],
        borderColor: ["#ff6384"],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: ["Total Sales"],
    datasets: [
      {
        label: "Total Sales",
        data: [adjustedTotalSales],
        backgroundColor: ["#36a2eb"],
        borderColor: ["#36a2eb"],
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: ["Total Loss"],
    datasets: [
      {
        label: "Total Loss",
        data: [totalLoss],
        backgroundColor: "rgba(255, 205, 86, 0.2)",
        borderColor: "#ffcd56",
        borderWidth: 1,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <div className="dashboard-time-period">
        <select
          value={selectedTimePeriod}
          onChange={(e) => setSelectedTimePeriod(e.target.value)}
          className="dashboard-time-period-select"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="all-time">All Time</option>
        </select>
      </div>
      <div className="dashboard-cards">
        <div className="card">
          <h4>Total Sales</h4>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <p>₨ {adjustedTotalSales.toFixed(2)}</p>
          )}
        </div>
        <div className="card">
          <h4>Total Profit</h4>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <p>₨ {totalProfit.toFixed(2)}</p>
          )}
        </div>
        <div className="card">
          <h4>Total Loss</h4>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <p>₨ {totalLoss.toFixed(2)}</p>
          )}
        </div>
        <div className="card">
          <h4>Total Expenses</h4>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <p>₨ {totalExpenses.toFixed(2)}</p>
          )}
        </div>
        <div className="card">
          <h4>Total Available</h4>{" "}
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <p>₨ {totalAvailable.toFixed(2)}</p>
          )}
        </div>
        <div className="card">
          <h4>Orders</h4>{" "}
          {loading ? <div className="spinner"></div> : <p>{dailySalesCount}</p>}
        </div>
        <div className="card">
          <h4>New Customers</h4>{" "}
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <p>{dailyNewCustomersCount}</p>
          )}
        </div>
        <div className="card">
          <h4>Total Pending</h4>{" "}
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <p>₨ {totalPendingAmount.toFixed(2)}</p>
          )}
        </div>
      </div>
      <div className="charts-section">
        <div className="chart-container">
          <h3>Profit Distribution (Pie Chart)</h3>
          <Pie data={pieChartData} options={chartOptions} />
        </div>
        <div className="chart-container">
          <h3>Sales Distribution (Bar Chart)</h3>
          <Bar data={barChartData} options={chartOptions} />
        </div>
        <div className="chart-container">
          <h3>Loss Distribution (Line Chart)</h3>
          <Line data={lineChartData} options={chartOptions} />
        </div>
      </div>
      <Sales selectedTimePeriod={selectedTimePeriod} />
    </div>
  );
};

export default Dashboard;
