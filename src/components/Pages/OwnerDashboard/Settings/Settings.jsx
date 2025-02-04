import React, { useEffect, useState } from "react";
import "./Settings.css";

const Settings = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/items");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setInventory(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div className="alhamd-settings-section">
      <h3 className="alhamd-settings-title">Settings</h3>
      <p className="alhamd-settings-description">
        Here you can adjust your settings.
      </p>
      <h4>Inventory:</h4>
      <ul>
        {inventory.map((item) => (
          <li key={item.id}>
            <p>
              <strong>Code:</strong> {item.code}
            </p>
            <p>
              <strong>Name:</strong> {item.name}
            </p>
            <p>
              <strong>Quantity:</strong> {item.quantity}
            </p>
            <p>
              <strong>Purchase Price:</strong> {item.purchasePrice}
            </p>
            <p>
              <strong>Sale Price:</strong> {item.salePrice}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Settings;
