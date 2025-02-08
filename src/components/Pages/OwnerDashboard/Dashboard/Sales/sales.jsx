import React, { useEffect, useState, useCallback, useMemo } from "react";
import { getDatabase, ref, get, update } from "firebase/database";
import app from "../../../../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Sales.css";
import { getStartDateForPeriod } from "../Sort Data/dateUtils";

const Sales = ({ selectedTimePeriod }) => {
  const [salesData, setSalesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("dateNewest");
  const [endDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const [totals, setTotals] = useState({
    totalSales: 0,
    totalProfit: 0,
    totalLoss: 0,
  });

  const fetchSalesData = useCallback(async () => {
    setIsLoading(true);
    const database = getDatabase(app);
    const salesRef = ref(database, "sales");

    const adjustedStartDate = getStartDateForPeriod(selectedTimePeriod);

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
    } finally {
      setIsLoading(false);
    }
  }, [selectedTimePeriod, endDate]);

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const getSortedData = useCallback(
    (data) => {
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
    },
    [sortOption]
  );

  const filteredSalesData = useMemo(() => {
    return salesData.filter((sale) => {
      return (
        sale.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.items.some((item) =>
          item.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    });
  }, [salesData, searchQuery]);

  const sortedAndFilteredSalesData = useMemo(() => {
    return getSortedData(filteredSalesData);
  }, [filteredSalesData, getSortedData]);

  const updateItemQuantity = async (itemCode, quantitySold) => {
    const database = getDatabase(app);
    const itemRef = ref(database, `items/${itemCode}`);

    try {
      const snapshot = await get(itemRef);
      if (snapshot.exists()) {
        const currentItem = snapshot.val();
        const newQuantity = currentItem.quantity - quantitySold;
        await update(itemRef, { quantity: newQuantity });
        console.log(`Quantity updated successfully for item ${itemCode}`);
      } else {
        console.error(`Item with code ${itemCode} not found`);
      }
    } catch (error) {
      console.error("Failed to update item quantity", error);
    }
  };

  const addSale = async () => {
    const sale = {
      invoiceNumber: "INV123456",
      customerName: "John Doe",
      phoneNumber: "+1234567890",
      date: new Date().toISOString(),
      total: 1000,
      totalProfit: 200,
      totalLoss: 0,
      items: [
        {
          code: "ITEM001",
          name: "Sample Item",
          quantity: 2,
          price: 500,
          purchasePrice: 400,
        },
      ],
    };

    const database = getDatabase(app);
    const salesRef = ref(database, "sales");

    try {
      await update(salesRef, { [sale.invoiceNumber]: sale });
      sale.items.forEach(async (item) => {
        await updateItemQuantity(item.code, item.quantity);
      });
      toast.success("Sale added successfully!");
      fetchSalesData(); // Refresh sales data after adding a new sale
    } catch (error) {
      toast.error("Failed to add sale!");
    }
  };

  return (
    <div className="unique-sales-section">
      <h2>Sales</h2>

      <button onClick={addSale}>Add Sale</button>

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

      {isLoading ? (
        <p>Loading...</p>
      ) : (
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
                <td data-label="Total">₨ {(sale.total || 0).toFixed(2)}</td>
                <td data-label="Total Profit">
                  ₨ {(sale.totalProfit || 0).toFixed(2)}
                </td>
                <td data-label="Total Loss">
                  ₨ {(sale.totalLoss || 0).toFixed(2)}
                </td>
                <td data-label="Items">
                  <ul>
                    {sale.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        {item.name} - {item.quantity} x ₨{" "}
                        {(item.price || 0).toFixed(2)}
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
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Sales;
