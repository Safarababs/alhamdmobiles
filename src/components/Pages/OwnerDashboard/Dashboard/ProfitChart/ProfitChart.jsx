import React, { useEffect, useState } from "react";
import app from "../../../../../firebase"; // Adjust the path as needed
import { getDatabase, ref, onValue } from "firebase/database";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const db = getDatabase(app);

const ProfitChart = ({ selectedTimePeriod }) => {
  const [profitData, setProfitData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchProfitData = () => {
      const salesRef = ref(db, "sales");
      onValue(salesRef, (snapshot) => {
        const data = snapshot.val();
        const labels = [];
        const profits = [];
        const now = new Date();

        Object.keys(data).forEach((key) => {
          const saleDate = new Date(data[key].date);
          const isValid = validateDate(saleDate, selectedTimePeriod, now);

          if (isValid) {
            labels.push(saleDate.toLocaleDateString()); // Convert date to readable format
            profits.push(data[key].totalProfit); // Use 'totalProfit' for profit data
          }
        });

        setProfitData({
          labels: labels,
          datasets: [
            {
              label: "Profit",
              data: profits,
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
            },
          ],
        });
      });
    };

    fetchProfitData();
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
      <h3>Profit Data ({selectedTimePeriod})</h3>
      <Line data={profitData} />
    </div>
  );
};

export default ProfitChart;
