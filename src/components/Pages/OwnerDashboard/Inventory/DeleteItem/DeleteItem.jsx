import React, { useState } from "react";
import { getDatabase, ref, get, remove } from "firebase/database";
import app from "../../../../../firebase";
import { ToastContainer, toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import "react-toastify/dist/ReactToastify.css";
import "./DeleteItem.css";

const DeleteItem = () => {
  const [itemCode, setItemCode] = useState("");

  const handleDeleteItem = async () => {
    const confirmDelete = async () => {
      const database = getDatabase(app);
      const inventoryRef = ref(database, "inventory");

      try {
        // Find the item with the given code
        const snapshot = await get(inventoryRef);
        if (snapshot.exists()) {
          const items = snapshot.val();
          let itemKey = null;
          for (const key in items) {
            if (items[key].code === itemCode) {
              itemKey = key;
              break;
            }
          }

          if (itemKey) {
            const itemRef = ref(database, `inventory/${itemKey}`);
            await remove(itemRef);
            toast.success("Item deleted successfully!");
            setItemCode(""); // Clear the input field
          } else {
            toast.error("Item not found!");
          }
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error("Failed to delete item!");
      }
    };

    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this item?",
      buttons: [
        {
          label: "Yes",
          onClick: () => confirmDelete(),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <div className="delete-item-section">
      <h3>Delete Item</h3>
      <div className="form-group">
        <label>Item Code</label>
        <input
          type="text"
          value={itemCode}
          onChange={(e) => setItemCode(e.target.value)}
          placeholder="Enter item code"
        />
      </div>
      <button onClick={handleDeleteItem}>Delete Item</button>
      <ToastContainer />
    </div>
  );
};

export default DeleteItem;
