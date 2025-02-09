import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, set } from "firebase/database";
import app from "./firebase";
const normalizeInventory = (item) => {
  return {
    brand: item.brand || "Unknown",
    category: item.category || "General",
    code: item.code || "",
    name: item.name || "Unnamed Item",
    purchasePrice: item.purchasePrice || 0,
    qty: item.qty || 0,
    retailPrice: item.retailPrice || 0,
    wholesalePrice: item.wholesalePrice || 0,
  };
};

const FetchInventory = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInventoryData = () => {
    const database = getDatabase(app);
    const inventoryRef = ref(database, "newinventory");

    onValue(inventoryRef, async (snapshot) => {
      const inventoryArray = [];
      snapshot.forEach((childSnapshot) => {
        const item = normalizeInventory(childSnapshot.val());
        inventoryArray.push({ ...item, key: childSnapshot.key });
      });

      // Sort inventory data by code in ascending order
      inventoryArray.sort((a, b) => parseInt(a.code) - parseInt(b.code));

      setInventoryData(inventoryArray);

      // Update all codes to be sequential (0001, 0002, 0003, etc.)
      for (let i = 0; i < inventoryArray.length; i++) {
        inventoryArray[i].code = String(i + 1).padStart(4, "0");
        await set(
          ref(database, `inventory/${inventoryArray[i].key}`),
          inventoryArray[i]
        );
      }

      setLoading(false);
    });
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  return (
    <div className="fetch-inventory-section">
      <h3 className="fetch-inventory-title">Inventory List</h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="inventory-list">
          {inventoryData.map((item) => (
            <li key={item.key}>
              {item.code} - {item.name} - Qty: {item.qty}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FetchInventory;
