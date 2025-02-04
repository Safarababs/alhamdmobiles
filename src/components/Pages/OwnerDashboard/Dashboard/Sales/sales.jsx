import React, { useEffect, useState, useCallback } from "react";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../../../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Sales.css";

const Sales = ({ selectedTimePeriod }) => {
  const [salesData, setSalesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("dateNewest");

  const fetchSalesData = useCallback(async () => {
    const database = getDatabase(app);
    const salesRef = ref(database, "sales");
    const today = new Date();
    const startDate = new Date();

    // Adjust startDate based on the selected time period
    switch (selectedTimePeriod) {
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
        const salesArray = [];
        snapshot.forEach((childSnapshot) => {
          const sale = childSnapshot.val();
          const saleDate = new Date(sale.date); // Parse the sale date
          if (saleDate >= startDate && saleDate <= today) {
            salesArray.push(sale);
          }
        });

        setSalesData(salesArray);
        toast.success("Sales data loaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to load sales data!");
    }
  }, [selectedTimePeriod]); // Add selectedTimePeriod as a dependency

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]); // Use fetchSalesData as a dependency

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

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

  const filteredSalesData = salesData
    .filter((sale) => {
      return (
        sale.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.items.some((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    })
    .map((sale) => ({ ...sale }));
  const sortedAndFilteredSalesData = getSortedData(filteredSalesData);

  return (
    <div className="unique-sales-section">
      <h2>Sales</h2>

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
              <td data-label="Customer Name">{sale.customerName}</td>
              <td data-label="Phone Number">{sale.phoneNumber}</td>
              <td data-label="Total">₨ {sale.total.toFixed(2)}</td>
              <td data-label="Total Profit">₨ {sale.totalProfit.toFixed(2)}</td>
              <td data-label="Total Loss">₨ {sale.totalLoss.toFixed(2)}</td>
              <td data-label="Items">
                <ul>
                  {sale.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {item.name} - {item.quantity} x ₨ {item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sales;
