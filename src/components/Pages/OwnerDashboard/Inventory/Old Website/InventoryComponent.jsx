import React, { useEffect } from "react";

const InventoryComponent = () => {
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch("https://ssmobile.netlify.app/inventory");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div>
      <h1>Inventory</h1>
      <p>Check the console for fetched data.</p>
    </div>
  );
};

export default InventoryComponent;
