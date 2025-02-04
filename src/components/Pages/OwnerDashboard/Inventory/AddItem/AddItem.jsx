// import React, { useState } from "react";
// import { getDatabase, ref, push } from "firebase/database";
// import app from "../../../../../firebase";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./AddItem.css";

// const AddItem = () => {
//   const [theme, setTheme] = useState("light");
//   const [itemName, setItemName] = useState("");
//   const [itemCode, setItemCode] = useState("");
//   const [purchasePrice, setPurchasePrice] = useState("");
//   const [wholesalePrice, setWholesalePrice] = useState("");
//   const [retailPrice, setRetailPrice] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [brand, setBrand] = useState("");
//   const [category, setCategory] = useState("");

//   const handleAddItem = async () => {
//     const database = getDatabase(app);
//     const inventoryRef = ref(database, "inventory");

//     const newItem = {
//       name: itemName,
//       code: itemCode,
//       purchasePrice: purchasePrice,
//       wholesalePrice: wholesalePrice,
//       retailPrice: retailPrice,
//       qty: quantity,
//       brand: brand,
//       category: category,
//     };

//     try {
//       await push(inventoryRef, newItem);
//       toast.success("Item added successfully!");
//       setItemName("");
//       setItemCode("");
//       setPurchasePrice("");
//       setWholesalePrice("");
//       setRetailPrice("");
//       setQuantity("");
//       setBrand("");
//       setCategory("");
//     } catch (error) {
//       toast.error("Failed to add item!");
//     }
//   };

//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
//   };

//   return (
//     <div className={`add-item-section ${theme}`} data-theme={theme}>
//       <h3 className="add-item-title">Add Item</h3>
//       <div className="add-item-form-group">
//         <label className="add-item-label">Item Name</label>
//         <input
//           className="add-item-input"
//           type="text"
//           value={itemName}
//           onChange={(e) => setItemName(e.target.value)}
//         />
//       </div>
//       <div className="add-item-form-group">
//         <label className="add-item-label">Item Code</label>
//         <input
//           className="add-item-input"
//           type="text"
//           value={itemCode}
//           onChange={(e) => setItemCode(e.target.value)}
//         />
//       </div>
//       <div className="add-item-form-group">
//         <label className="add-item-label">Purchase Price</label>
//         <input
//           className="add-item-input"
//           type="number"
//           value={purchasePrice}
//           onChange={(e) => setPurchasePrice(e.target.value)}
//         />
//       </div>
//       <div className="add-item-form-group">
//         <label className="add-item-label">Wholesale Price</label>
//         <input
//           className="add-item-input"
//           type="number"
//           value={wholesalePrice}
//           onChange={(e) => setWholesalePrice(e.target.value)}
//         />
//       </div>
//       <div className="add-item-form-group">
//         <label className="add-item-label">Retail Price</label>
//         <input
//           className="add-item-input"
//           type="number"
//           value={retailPrice}
//           onChange={(e) => setRetailPrice(e.target.value)}
//         />
//       </div>
//       <div className="add-item-form-group">
//         <label className="add-item-label">Quantity</label>
//         <input
//           className="add-item-input"
//           type="number"
//           value={quantity}
//           onChange={(e) => setQuantity(e.target.value)}
//         />
//       </div>
//       <div className="add-item-form-group">
//         <label className="add-item-label">Brand</label>
//         <select
//           className="add-item-select"
//           value={brand}
//           onChange={(e) => setBrand(e.target.value)}
//         >
//           <option value="">Select Brand</option>
//           <option value="Ronin">Ronin</option>
//           <option value="Faster">Faster</option>
//           <option value="Amb">Amb</option>
//           {/* Add other brands here */}
//         </select>
//       </div>
//       <div className="add-item-form-group">
//         <label className="add-item-label">Category</label>
//         <select
//           className="add-item-select"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//         >
//           <option value="">Select Category</option>
//           <option value="Smart Watches">Smart Watches</option>
//           <option value="Wireless Chargers">Wireless Chargers</option>
//           <option value="Bluetooths">Bluetooths</option>
//           {/* Add other categories here */}
//         </select>
//       </div>
//       <button className="add-item-button" onClick={handleAddItem}>
//         Add Item
//       </button>
//     </div>
//   );
// };

// export default AddItem;

import React, { useEffect, useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import app from "../../../../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddItem = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/items");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setInventory(data);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to fetch inventory data.");
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleAddToFirebase = async () => {
    const database = getDatabase(app);
    const inventoryRef = ref(database, "inventory");

    try {
      inventory.forEach((item) => {
        const formattedItem = {
          code: item.code,
          name: item.name,
          qty: item.quantity,
          purchasePrice: item.purchasePrice,
          retailPrice: item.salePrice,
          wholesalePrice: item.wholesalePrice || null,
          brand: item.brand || "Unknown",
          category: item.category || "Uncategorized",
          newKey1: "New Value 1", // Add new key-value pairs
          newKey2: "New Value 2",
        };

        push(inventoryRef, formattedItem, (error) => {
          if (error) {
            console.error("Error saving data:", error);
            toast.error("Failed to save data to Firebase.");
          } else {
            console.log("Data saved successfully!");
            toast.success("Data saved successfully to Firebase!");
          }
        });
      });
    } catch (error) {
      console.error("Error saving data to Firebase:", error);
      toast.error("Failed to save data to Firebase.");
    }
  };

  return (
    <div className="add-item-section">
      <h3 className="add-item-title">Add Item</h3>
      {loading ? (
        <p>Loading inventory data...</p>
      ) : (
        <button onClick={handleAddToFirebase}>
          Save Inventory to Firebase
        </button>
      )}
      <ToastContainer />
    </div>
  );
};

export default AddItem;
