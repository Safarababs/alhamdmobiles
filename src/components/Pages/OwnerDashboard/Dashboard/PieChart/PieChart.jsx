import React, { useEffect, useState } from "react";
import app from "../../../../../firebase"; // Adjust the path as needed
import { getDatabase, ref, onValue } from "firebase/database";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const db = getDatabase(app);

const PieChart = ({ selectedTimePeriod }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = () => {
      const salesRef = ref(db, "sales");
      onValue(salesRef, (snapshot) => {
        const data = snapshot.val();
        const now = new Date();

        let totalSales = 0;
        let totalProfit = 0;
        let totalLoss = 0;
        let totalAvailable = 0;
        let totalMonthlyProfit = 0;

        Object.keys(data).forEach((key) => {
          const saleDate = new Date(data[key].date);
          const isValid = validateDate(saleDate, selectedTimePeriod, now);

          if (isValid) {
            totalSales += data[key].total;
            totalProfit += data[key].totalProfit;
            totalLoss += data[key].totalLoss;
            totalAvailable += data[key].total - data[key].totalLoss;
            totalMonthlyProfit += data[key].totalProfit; // Adjust this calculation as needed
          }
        });

        setChartData({
          labels: ["Sales", "Profit", "Loss", "Available", "Monthly Profit"],
          datasets: [
            {
              data: [
                totalSales,
                totalProfit,
                totalLoss,
                totalAvailable,
                totalMonthlyProfit,
              ],
              backgroundColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(241, 9, 9, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 206, 86, 1)",
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 206, 86, 1)",
              ],
              borderWidth: 2,
            },
          ],
        });
      });
    };

    fetchData();
  }, [selectedTimePeriod]);

  const validateDate = (saleDate, period, now) => {
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    switch (period) {
      case "daily":
        return (
          saleDate >= startOfToday &&
          saleDate < new Date(startOfToday.getTime() + 86400000)
        ); // Today
      case "weekly":
        return (
          saleDate >= startOfWeek &&
          saleDate < new Date(startOfWeek.getTime() + 7 * 86400000)
        ); // Last 7 days
      case "monthly":
        return (
          saleDate >= startOfMonth &&
          saleDate <
            new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 1)
        ); // Current month
      case "yearly":
        return (
          saleDate >= startOfYear &&
          saleDate < new Date(startOfYear.getFullYear() + 1, 0, 1)
        ); // Current year
      case "all-time":
        return true;
      default:
        return true;
    }
  };

  return (
    <div className="chart-container">
      <h3>Summary Data ({selectedTimePeriod})</h3>
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;
