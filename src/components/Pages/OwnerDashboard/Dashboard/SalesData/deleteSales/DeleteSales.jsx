import React, { useState, useCallback } from "react";
import { getDatabase, ref, remove } from "firebase/database";
import app from "../../../../../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DeleteSales.css";

const DeleteSales = () => {
  const [invoiceNumber, setInvoiceNumber] = useState("");

  const handleDelete = useCallback(async () => {
    const database = getDatabase(app);
    const salesRef = ref(database, `sales/${invoiceNumber}`);

    try {
      await remove(salesRef);
      toast.success("Sales data deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete sales data!");
    }
  }, [invoiceNumber]);

  return (
    <div className="unique-delete-sales-section">
      <h2>Delete Sales</h2>
      <input
        type="text"
        placeholder="Invoice Number"
        value={invoiceNumber}
        onChange={(e) => setInvoiceNumber(e.target.value)}
        className="unique-delete-invoice-input"
      />
      <button onClick={handleDelete} className="unique-delete-button">
        Delete Sales
      </button>
    </div>
  );
};

export default DeleteSales;
