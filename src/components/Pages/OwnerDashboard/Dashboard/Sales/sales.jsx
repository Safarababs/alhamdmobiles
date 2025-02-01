import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../../../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Sales.css";

const Sales = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    const database = getDatabase(app);
    const salesRef = ref(database, "sales");

    try {
      const snapshot = await get(salesRef);
      if (snapshot.exists()) {
        const salesArray = [];
        snapshot.forEach((childSnapshot) => {
          const sale = childSnapshot.val();
          salesArray.push(sale);
        });
        setSalesData(salesArray);
        toast.success("Sales data loaded successfully!");
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
      toast.error("Failed to load sales data!");
    }
  };

  return (
    <div className="unique-sales-section">
      <h2>Sales</h2>
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
          {salesData.map((sale, index) => (
            <tr key={index}>
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
              <div className="serial-number">{`${index + 1}`}</div>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default Sales;
