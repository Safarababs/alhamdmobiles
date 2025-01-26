import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import "./Dashboard.css";

// Register the necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ pieChartData, pieChartOptions }) => {
  return (
    <div>
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
      <div className="charts-section">
        <div className="sales-pie-chart">
          <h3>Sales Distribution</h3>
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
        <div className="sales-pie-chart">
          <h3>Sales Distribution</h3>
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
        <div className="sales-pie-chart">
          <h3>Sales Distribution</h3>
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
