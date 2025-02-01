import React from "react";
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
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import "./Dashboard.css";
import Sales from "./Sales/sales";

// Register the necessary Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const Dashboard = ({
  totalSales,
  totalProfit,
  totalLoss,
  dailySalesCount,
  dailyNewCustomersCount,
}) => {
  // Data for Pie Chart (Total Profit)
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

  // Data for Bar Chart (Total Sales)
  const barChartData = {
    labels: ["Total Sales"],
    datasets: [
      {
        label: "Total Sales",
        data: [totalSales],
        backgroundColor: ["#36a2eb"],
        borderColor: ["#36a2eb"],
        borderWidth: 1,
      },
    ],
  };

  // Data for Line Chart (Total Loss)
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
      <div className="dashboard-cards">
        <div className="card">
          <h4>Total Sales</h4>
          <p>₨ {totalSales.toFixed(2)}</p>
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
          <h4>Orders Today</h4>
          <p>{dailySalesCount}</p>
        </div>
        <div className="card">
          <h4>New Customers Today</h4>
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
      <Sales />
    </div>
  );
};

export default Dashboard;
