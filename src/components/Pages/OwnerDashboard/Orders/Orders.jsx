import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, push, remove } from "firebase/database";
import app from "../../../../firebase";
import "./Orders.css";

const Orders = () => {
  const [vendorOrders, setVendorOrders] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [verbalOrders, setVerbalOrders] = useState([]);
  const [newOrder, setNewOrder] = useState("");

  useEffect(() => {
    const database = getDatabase(app);
    const vendorOrdersRef = ref(database, "vendorOrders");
    const inventoryRef = ref(database, "inventory");
    const verbalOrdersRef = ref(database, "verbalOrders");

    onValue(vendorOrdersRef, (snapshot) => {
      const ordersArray = [];
      snapshot.forEach((childSnapshot) => {
        const order = childSnapshot.val();
        ordersArray.push({ ...order, id: childSnapshot.key });
      });
      setVendorOrders(ordersArray);
    });

    onValue(inventoryRef, (snapshot) => {
      const inventoryArray = [];
      snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        if (item.stock === 0) {
          inventoryArray.push({ ...item, id: childSnapshot.key });
        }
      });
      setInventoryItems(inventoryArray);
    });

    onValue(verbalOrdersRef, (snapshot) => {
      const ordersArray = [];
      snapshot.forEach((childSnapshot) => {
        const order = childSnapshot.val();
        ordersArray.push({ ...order, id: childSnapshot.key });
      });
      setVerbalOrders(ordersArray);
    });
  }, []);

  const handleAddVerbalOrder = async () => {
    const database = getDatabase(app);
    const verbalOrdersRef = ref(database, "verbalOrders");

    const newVerbalOrder = {
      order: newOrder,
      date: new Date().toISOString(),
    };

    try {
      await push(verbalOrdersRef, newVerbalOrder);
      alert("Verbal order added successfully!");
      setNewOrder(""); // Clear form field
    } catch (error) {
      alert("Failed to add verbal order!");
    }
  };

  const handleDeleteVerbalOrder = async (id) => {
    const database = getDatabase(app);
    const verbalOrdersRef = ref(database, `verbalOrders/${id}`);

    try {
      await remove(verbalOrdersRef);
      alert("Verbal order deleted successfully!");
      setVerbalOrders(verbalOrders.filter((item) => item.id !== id));
    } catch (error) {
      alert("Failed to delete verbal order!");
    }
  };

  return (
    <div className="orders-section-unique">
      <h2 className="orders-title-unique">Vendor Orders</h2>
      <table className="orders-table-unique">
        <thead className="orders-thead-unique">
          <tr className="orders-thead-tr-unique">
            <th className="orders-th-unique">Vendor</th>
            <th className="orders-th-unique">Product</th>
            <th className="orders-th-unique">Quantity</th>
            <th className="orders-th-unique">Actions</th>
          </tr>
        </thead>
        <tbody className="orders-tbody-unique">
          {vendorOrders.map((order) => (
            <tr key={order.id} className="orders-tbody-tr-unique">
              <td className="orders-td-unique">{order.vendorName}</td>
              <td className="orders-td-unique">{order.productName}</td>
              <td className="orders-td-unique">{order.quantity}</td>
              <td className="orders-td-unique">
                {/* Add any actions if needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="orders-title-unique">Inventory with Zero Stock</h2>
      <table className="orders-table-unique">
        <thead className="orders-thead-unique">
          <tr className="orders-thead-tr-unique">
            <th className="orders-th-unique">Product</th>
            <th className="orders-th-unique">Stock</th>
          </tr>
        </thead>
        <tbody className="orders-tbody-unique">
          {inventoryItems.map((item) => (
            <tr key={item.id} className="orders-tbody-tr-unique">
              <td className="orders-td-unique">{item.productName}</td>
              <td className="orders-td-unique">{item.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="orders-title-unique">Verbal Orders</h2>
      <div className="orders-form-unique">
        <div className="orders-form-group-unique">
          <label className="orders-label-unique">New Verbal Order</label>
          <input
            type="text"
            value={newOrder}
            onChange={(e) => setNewOrder(e.target.value)}
            className="orders-input-unique"
          />
        </div>
        <button onClick={handleAddVerbalOrder} className="orders-button-unique">
          Add Verbal Order
        </button>
      </div>
      <table className="orders-table-unique">
        <thead className="orders-thead-unique">
          <tr className="orders-thead-tr-unique">
            <th className="orders-th-unique">Order</th>
            <th className="orders-th-unique">Date</th>
            <th className="orders-th-unique">Actions</th>
          </tr>
        </thead>
        <tbody className="orders-tbody-unique">
          {verbalOrders.map((order) => (
            <tr key={order.id} className="orders-tbody-tr-unique">
              <td className="orders-td-unique">{order.order}</td>
              <td className="orders-td-unique">
                {new Date(order.date).toLocaleDateString()}
              </td>
              <td className="orders-td-unique">
                <button
                  className="orders-delete-button-unique"
                  onClick={() => handleDeleteVerbalOrder(order.id)}
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

export default Orders;
