import React, { useEffect, useState } from "react";
import { getDatabase, ref, push, onValue, remove } from "firebase/database";
import app from "../../../../../firebase"; // Adjust the import path as needed
import "./Pending.css"; // Create and include your CSS file for styling

const Pending = () => {
  const [pendingAmounts, setPendingAmounts] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [productName, setProductName] = useState("");
  const [pendingAmount, setPendingAmount] = useState("");

  useEffect(() => {
    const database = getDatabase(app);
    const pendingRef = ref(database, "pendingAmounts");

    onValue(pendingRef, (snapshot) => {
      const pendingArray = [];
      snapshot.forEach((childSnapshot) => {
        const pending = childSnapshot.val();
        pendingArray.push({ ...pending, id: childSnapshot.key });
      });
      setPendingAmounts(pendingArray);
    });
  }, []);

  const handleAddPendingAmount = async () => {
    const database = getDatabase(app);
    const pendingRef = ref(database, "pendingAmounts");

    const newPending = {
      customerName,
      phoneNumber,
      productName,
      pendingAmount: parseFloat(pendingAmount),
    };

    try {
      await push(pendingRef, newPending);
      alert("Pending amount added successfully!");

      // Clear form fields
      setCustomerName("");
      setPhoneNumber("");
      setProductName("");
      setPendingAmount("");
    } catch (error) {
      alert("Failed to add pending amount!");
    }
  };

  const handleDeletePendingAmount = async (id) => {
    const database = getDatabase(app);
    const pendingRef = ref(database, `pendingAmounts/${id}`);

    try {
      await remove(pendingRef);
      alert("Pending amount deleted successfully!");

      // Update the list of pending amounts
      setPendingAmounts(pendingAmounts.filter((item) => item.id !== id));
    } catch (error) {
      alert("Failed to delete pending amount!");
    }
  };

  return (
    <div className="pending-section-unique">
      <h2 className="pending-title-unique">Pending Amounts</h2>

      <div className="pending-form-unique">
        <div className="pending-form-group-unique">
          <label className="pending-label-unique">Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="pending-input-unique"
          />
        </div>
        <div className="pending-form-group-unique">
          <label className="pending-label-unique">Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="pending-input-unique"
          />
        </div>
        <div className="pending-form-group-unique">
          <label className="pending-label-unique">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="pending-input-unique"
          />
        </div>
        <div className="pending-form-group-unique">
          <label className="pending-label-unique">Pending Amount</label>
          <input
            type="number"
            value={pendingAmount}
            onChange={(e) => setPendingAmount(e.target.value)}
            className="pending-input-unique"
          />
        </div>
        <button
          onClick={handleAddPendingAmount}
          className="pending-button-unique"
        >
          Add Pending Amount
        </button>
      </div>

      <table className="pending-table-unique">
        <thead className="pending-thead-unique">
          <tr className="pending-thead-tr-unique">
            <th className="pending-th-unique">Customer Name</th>
            <th className="pending-th-unique">Phone Number</th>
            <th className="pending-th-unique">Product Name</th>
            <th className="pending-th-unique">Pending Amount</th>
            <th className="pending-th-unique">Actions</th>
          </tr>
        </thead>
        <tbody className="pending-tbody-unique">
          {pendingAmounts.map((item) => (
            <tr key={item.id} className="pending-tbody-tr-unique">
              <td className="pending-td-unique">{item.customerName}</td>
              <td className="pending-td-unique">{item.phoneNumber}</td>
              <td className="pending-td-unique">{item.productName}</td>
              <td className="pending-td-unique">
                ₨ {item.pendingAmount.toFixed(2)}
              </td>
              <td className="pending-td-unique">
                <button
                  className="pending-delete-button-unique"
                  onClick={() => handleDeletePendingAmount(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Pending;
