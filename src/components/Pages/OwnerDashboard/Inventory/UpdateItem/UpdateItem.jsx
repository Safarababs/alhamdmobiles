import React, { useState, useEffect } from "react";
import { getDatabase, ref, update } from "firebase/database";
import app from "../../../../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  brandOptions,
  categoryOptions,
} from "../../Common Options/commonOptions"; // Import common options
import "./UpdateItem.css";

const UpdateItem = ({ selectedItem }) => {
  const [itemName, setItemName] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");

  useEffect(() => {
    if (selectedItem) {
      setItemName(selectedItem.name);
      setItemCode(selectedItem.code);
      setPurchasePrice(selectedItem.purchasePrice);
      setWholesalePrice(selectedItem.wholesalePrice);
      setRetailPrice(selectedItem.retailPrice);
      setQuantity(selectedItem.qty);
      setCategory(selectedItem.category);
      setBrand(selectedItem.brand);
    }
  }, [selectedItem]);

  const handleUpdateItem = async () => {
    const database = getDatabase(app);
    const itemRef = ref(database, `inventory/${selectedItem.key}`); // Use selectedItem.key to reference the correct item

    const updatedItem = {
      name: itemName,
      code: itemCode,
      purchasePrice: purchasePrice,
      wholesalePrice: wholesalePrice,
      retailPrice: retailPrice,
      qty: quantity,
      category: category,
      brand: brand,
    };

    try {
      await update(itemRef, updatedItem);
      toast.success("Item updated successfully!");
    } catch (error) {
      toast.error("Failed to update item!");
    }
  };

  return (
    <div className="update-item-section-unique">
      <h3 className="update-item-title-unique">Update Item</h3>
      <div className="update-item-form-group-unique">
        <label className="update-item-label-unique">Item Name</label>
        <input
          className="update-item-input-unique"
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
      </div>
      <div className="update-item-form-group-unique">
        <label className="update-item-label-unique">Item Code</label>
        <input
          className="update-item-input-unique"
          type="text"
          value={itemCode}
          onChange={(e) => setItemCode(e.target.value)}
        />
      </div>
      <div className="update-item-form-group-unique">
        <label className="update-item-label-unique">Purchase Price</label>
        <input
          className="update-item-input-unique"
          type="number"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
        />
      </div>
      <div className="update-item-form-group-unique">
        <label className="update-item-label-unique">Wholesale Price</label>
        <input
          className="update-item-input-unique"
          type="number"
          value={wholesalePrice}
          onChange={(e) => setWholesalePrice(e.target.value)}
        />
      </div>
      <div className="update-item-form-group-unique">
        <label className="update-item-label-unique">Retail Price</label>
        <input
          className="update-item-input-unique"
          type="number"
          value={retailPrice}
          onChange={(e) => setRetailPrice(e.target.value)}
        />
      </div>
      <div className="update-item-form-group-unique">
        <label className="update-item-label-unique">Quantity</label>
        <input
          className="update-item-input-unique"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      <div className="update-item-form-group-unique">
        <label className="update-item-label-unique">Category</label>
        <select
          className="update-item-select-unique"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="update-item-form-group-unique">
        <label className="update-item-label-unique">Brand</label>
        <select
          className="update-item-select-unique"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          <option value="">Select Brand</option>
          {brandOptions.map((br) => (
            <option key={br} value={br}>
              {br}
            </option>
          ))}
        </select>
      </div>
      <button className="update-item-button-unique" onClick={handleUpdateItem}>
        Update Item
      </button>
      <ToastContainer />
    </div>
  );
};

export default UpdateItem;
