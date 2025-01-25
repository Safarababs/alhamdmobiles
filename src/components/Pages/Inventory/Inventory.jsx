import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../../firebase";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import "./Inventory.css";

const Inventory = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lowStock, setLowStock] = useState([]);
  const [outOfStock, setOutOfStock] = useState([]);

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    const database = getDatabase(app);
    const inventoryRef = ref(database, "inventory");

    try {
      const snapshot = await get(inventoryRef);
      if (snapshot.exists()) {
        const inventoryItems = Object.values(snapshot.val());
        setInventoryData(inventoryItems);

        // Filter low stock and out of stock
        const lowStockItems = inventoryItems.filter((item) => item.stock <= 5);
        const outOfStockItems = inventoryItems.filter(
          (item) => item.stock === 0
        );
        setLowStock(lowStockItems);
        setOutOfStock(outOfStockItems);
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pie chart data
  const pieChartData = {
    labels: ["Low Stock", "In Stock", "Out of Stock"],
    datasets: [
      {
        data: [
          lowStock.length,
          inventoryData.length - lowStock.length - outOfStock.length,
          outOfStock.length,
        ],
        backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56"],
        hoverBackgroundColor: ["#ff6384", "#36a2eb", "#ffcd56"],
      },
    ],
  };

  return (
    <div className="inventory">
      <h2>Inventory Overview</h2>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="inventory-summary">
            <div>
              <h4>Total Products</h4>
              <p>{inventoryData.length}</p>
            </div>
            <div>
              <h4>Low Stock</h4>
              <p>{lowStock.length}</p>
            </div>
            <div>
              <h4>Out of Stock</h4>
              <p>{outOfStock.length}</p>
            </div>
          </div>

          <div className="pie-chart">
            <h3>Inventory Distribution</h3>
            <Pie data={pieChartData} options={{ responsive: true }} />
          </div>

          <div className="product-list">
            <h3>Product List</h3>
            <ul>
              {inventoryData.map((product) => (
                <li key={product.id}>
                  <div>{product.name}</div>
                  <div>{product.stock} in stock</div>
                  <button onClick={() => editProduct(product)}>Edit</button>
                  <button onClick={() => deleteProduct(product.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

// Edit product function
const editProduct = (product) => {
  console.log("Edit product:", product);
  // Here you can implement edit functionality like opening a modal with product details
};

// Delete product function
const deleteProduct = (productId) => {
  console.log("Delete product:", productId);
  // Here you can implement delete functionality to remove product from Firebase
};

export default Inventory;
