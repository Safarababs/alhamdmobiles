import React, { useEffect, useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import app from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader"; // Import spinner component

const FetchAndSaveData = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // State to track saving process

  useEffect(() => {
    const fetchInventory = async () => {
      console.log("Fetching all inventory data");
      try {
        const response = await fetch(`http://localhost:5000/api/items`);
        console.log("Fetch response status:", response.status);
        if (!response.ok) {
          const responseData = await response.text();
          console.log("Error response data:", responseData);
          throw new Error(`Network response was not ok: ${responseData}`);
        }
        const data = await response.json();
        console.log("Fetched inventory data:", data);

        const formattedInventory = data.map((item) => {
          const purchasePrice =
            item.purchasePrice !== undefined
              ? parseInt(item.purchasePrice?.$numberInt ?? item.purchasePrice)
              : 0;
          const salePrice =
            item.salePrice !== undefined
              ? parseInt(item.salePrice?.$numberInt ?? item.salePrice)
              : 0;
          const wholesalePrice =
            purchasePrice + (salePrice - purchasePrice) / 2;

          return {
            name: item.name || "",
            code: item.code || "",
            purchasePrice: purchasePrice,
            wholesalePrice: wholesalePrice,
            retailPrice: salePrice,
            qty:
              item.quantity !== undefined
                ? parseInt(item.quantity?.$numberInt ?? item.quantity)
                : 0,
            brand: "Default",
            category: "General",
          };
        });

        setInventory(formattedInventory);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to fetch inventory data.");
        setLoading(false);
      }
    };

    fetchInventory(); // Fetch all inventory data
  }, []);

  const handleSaveDataToFirebase = async () => {
    console.log("Saving data to Firebase...");
    setSaving(true); // Set saving state to true
    const database = getDatabase(app);
    const inventoryRef = ref(database, "inventory");

    try {
      const savePromises = inventory.map((item) => {
        return new Promise((resolve, reject) => {
          push(inventoryRef, item, (error) => {
            if (error) {
              console.error("Error saving inventory data:", error);
              toast.error("Failed to save inventory data to Firebase.");
              reject(error);
            } else {
              console.log(
                "Inventory data saved successfully for item:",
                item.code
              );
              toast.success("Inventory data saved successfully to Firebase!");
              resolve();
            }
          });
        });
      });

      await Promise.all(savePromises); // Wait for all save operations to complete
      toast.success("All inventory data saved successfully to Firebase!");
    } catch (error) {
      console.error("Error saving data to Firebase:", error);
      toast.error("Failed to save data to Firebase.");
    } finally {
      setSaving(false); // Set saving state to false
    }
  };

  return (
    <div>
      <h3>Fetch and Save Inventory Data</h3>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div>
          {saving ? (
            <ClipLoader size={50} color={"#123abc"} loading={saving} />
          ) : (
            <button onClick={handleSaveDataToFirebase}>
              Save Inventory to Firebase
            </button>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default FetchAndSaveData;
