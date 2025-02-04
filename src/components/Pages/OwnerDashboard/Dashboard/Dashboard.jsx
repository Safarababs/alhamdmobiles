import React, { useState, useEffect } from "react";
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

const Dashboard = ({
  totalSales,
  totalProfit,
  totalLoss,
  dailySalesCount,
  dailyNewCustomersCount,
  selectedTimePeriod,
  setSelectedTimePeriod,
}) => {
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    const database = getDatabase(app);
    const expensesRef = ref(database, "expenses");

    onValue(expensesRef, (snapshot) => {
      let expenses = 0;
      snapshot.forEach((childSnapshot) => {
        const expense = childSnapshot.val();
        expenses += expense.amount;
      });
      setTotalExpenses(expenses);
    });
  }, []);

  // Calculate adjusted total sales
  const adjustedTotalSales = totalSales - totalExpenses;

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
          <p>₨ {adjustedTotalSales.toFixed(2)}</p>
        </div>
        <div className="card">
          <h4>Total Profit</h4>
          <p>₨ {totalProfit.toFixed(2)}</p>
        </div>
        <div className="card">
          <h4>Total Loss</h4>
          <p>₨ {totalLoss.toFixed(2)}</p>
        </div>
        <div className="card">
          <h4>Orders</h4>
          <p>{dailySalesCount}</p>
        </div>
        <div className="card">
          <h4>New Customers</h4>
          <p>{dailyNewCustomersCount}</p>
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
