import React, { useState } from "react";
import "./Dashboard.css";
import Card from "./Card/Card"; // Import the Card component
import Chart from "./Chart/Chart"; // Import the Chart component
import Sales from "./Sales/sales";
import ProfitChart from "./ProfitChart/ProfitChart";
import PieChart from "./PieChart/PieChart";
import ViewInventory from "../Inventory/ViewInventory/ViewInventory";
import ShowExpenses from "../Inventory/Expenses/Show Expensis/Show Expenses";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("daily");

  return (
    <div>
      <div className="dashboard-time-period">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
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
        <Card
          title="Total Sales"
          type="totalSales"
          selectedTimePeriod={selectedPeriod}
        />
        <Card
          title="Total Profit"
          type="totalProfit"
          selectedTimePeriod={selectedPeriod}
        />
        <Card
          title="Total Loss"
          type="totalLoss"
          selectedTimePeriod={selectedPeriod}
        />
        <Card
          title="Total Expenses"
          type="totalExpenses"
          selectedTimePeriod={selectedPeriod}
        />
        <Card
          title="Total Available"
          type="totalAvailable"
          selectedTimePeriod={selectedPeriod}
        />
        <Card
          title="Total Monthly Profit"
          type="totalMonthlyProfit"
          selectedTimePeriod={selectedPeriod}
        />
        <Card
          title="Total Monthly Loss"
          type="totalMonthlyLoss"
          selectedTimePeriod={selectedPeriod}
        />
        <Card
          title="Total Pending"
          type="totalPendingAmount"
          selectedTimePeriod={selectedPeriod}
        />
      </div>
      <div className="charts-section">
        <Chart selectedTimePeriod={selectedPeriod} />
        <ProfitChart selectedTimePeriod={selectedPeriod} />
        <PieChart selectedTimePeriod={selectedPeriod} />
      </div>
      <Sales selectedTimePeriod={selectedPeriod} />
      <ShowExpenses />
      <ViewInventory />
    </div>
  );
};

export default Dashboard;
