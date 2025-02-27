import React, { useEffect, useState, useCallback } from "react";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../../../../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./viewSales.css";
import { getStartDateForPeriod } from "../../Sort Data/dateUtils";

const ViewSales = () => {
  const [salesData, setSalesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("dateNewest");
  const [selectedPeriod, setSelectedPeriod] = useState("daily");
  const [totals, setTotals] = useState({
    totalSales: 0,
    totalProfit: 0,
    totalLoss: 0,
  });

  const fetchSalesData = useCallback(async () => {
    const database = getDatabase(app);
    const salesRef = ref(database, "sales");
    const adjustedStartDate = getStartDateForPeriod(selectedPeriod);
    const endDate = new Date();

    try {
      const snapshot = await get(salesRef);
      if (snapshot.exists()) {
        const salesArray = [];
        snapshot.forEach((childSnapshot) => {
          const sale = childSnapshot.val();
          const saleDate = sale.date ? new Date(sale.date) : null;
          if (
            saleDate &&
            saleDate >= adjustedStartDate &&
            saleDate <= endDate
          ) {
            salesArray.push(sale);
          }
        });
        setSalesData(salesArray);

        // Calculate totals
        const totalSales = salesArray.reduce(
          (acc, sale) => acc + (sale.total || 0),
          0
        );
        const totalProfit = salesArray.reduce(
          (acc, sale) => acc + (sale.totalProfit || 0),
          0
        );
        const totalLoss = salesArray.reduce(
          (acc, sale) => acc + (sale.totalLoss || 0),
          0
        );
        setTotals({ totalSales, totalProfit, totalLoss });

        toast.success("Sales data loaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to load sales data!");
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSortChange = (e) => setSortOption(e.target.value);

  const getSortedData = (data) => {
    switch (sortOption) {
      case "dateNewest":
        return data.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "dateOldest":
        return data.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "profitHighest":
        return data.sort((a, b) => b.totalProfit - a.totalProfit);
      case "profitLowest":
        return data.sort((a, b) => a.totalProfit - b.totalProfit);
      default:
        return data;
    }
  };

  const filteredSalesData = salesData.filter((sale) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      sale.invoiceNumber?.toLowerCase().includes(searchTerm) ||
      sale.customerName?.toLowerCase().includes(searchTerm) ||
      sale.phoneNumber?.toLowerCase().includes(searchTerm) ||
      sale.items.some((item) => item.name?.toLowerCase().includes(searchTerm))
    );
  });

  const sortedAndFilteredSalesData = getSortedData(filteredSalesData);

  return (
    <div className="unique-sales-section">
      <h2>Sales</h2>
      <div className="dashboard-time-period">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="sort-dropdown"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="all-time">All Time</option>
        </select>
      </div>

      <select
        value={sortOption}
        onChange={handleSortChange}
        className="sort-dropdown"
      >
        <option value="dateNewest">Date: Newest First</option>
        <option value="dateOldest">Date: Oldest First</option>
        <option value="profitHighest">Profit: Highest First</option>
        <option value="profitLowest">Profit: Lowest First</option>
      </select>
      <input
        type="text"
        placeholder="Search by Invoice Number, Customer Name, Phone Number, or Item Name"
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-bar"
      />

      <table className="unique-sales-table">
        <thead>
          <tr>
            <th>Invoice Number</th>
            <th>Customer Name</th>
            <th>Phone Number</th>
            <th>Total</th>
            <th>Total Profit</th>
            <th>Total Loss</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {sortedAndFilteredSalesData.map((sale, index) => (
            <tr key={index}>
              <td className="serial-number">{index + 1}</td>
              <td data-label="Invoice Number">{sale.invoiceNumber}</td>
              <td data-label="Customer Name">{sale.customerName || "N/A"}</td>
              <td data-label="Phone Number">{sale.phoneNumber || "N/A"}</td>
              <td data-label="Total">
                ₨ {parseFloat(sale.total || 0).toFixed(2)}
              </td>
              <td data-label="Total Profit">
                ₨ {parseFloat(sale.totalProfit || 0).toFixed(2)}
              </td>
              <td data-label="Total Loss">
                ₨ {parseFloat(sale.totalLoss || 0).toFixed(2)}
              </td>
              <td data-label="Items">
                <ul>
                  {sale.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {item.name} - {item.quantity} x ₨{" "}
                      {parseFloat(item.price || 0).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="4">
              <strong>Totals</strong>
            </td>
            <td>
              <strong>₨ {totals.totalSales.toFixed(2)}</strong>
            </td>
            <td>
              <strong>₨ {totals.totalProfit.toFixed(2)}</strong>
            </td>
            <td>
              <strong>₨ {totals.totalLoss.toFixed(2)}</strong>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ViewSales;
