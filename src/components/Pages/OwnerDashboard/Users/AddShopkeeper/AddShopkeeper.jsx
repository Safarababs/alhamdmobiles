import React, { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import app from "../../../../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddShopkeeper.css"; // Import the CSS file

const AddShopkeeper = ({ onSave }) => {
  const [shopkeeperData, setShopkeeperData] = useState({
    username: "",
    email: "",
    password: "",
    shopName: "",
    shopAddress: "",
    phoneNumber: "",
    role: "Shopkeeper",
  });
  const [inputErrors, setInputErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShopkeeperData((prevData) => ({ ...prevData, [name]: value }));
    setInputErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
  };

  const handleAddShopkeeper = async () => {
    const database = getDatabase(app);
    const usersRef = ref(database, "users");

    const errors = {};
    Object.keys(shopkeeperData).forEach((key) => {
      if (!shopkeeperData[key]) {
        errors[key] = true;
      }
    });

    if (Object.keys(errors).length > 0) {
      setInputErrors(errors);
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      await push(usersRef, shopkeeperData);
      toast.success("Shopkeeper added successfully!");
      setShopkeeperData({
        username: "",
        email: "",
        password: "",
        shopName: "",
        shopAddress: "",
        phoneNumber: "",
        role: "Shopkeeper",
      }); // Reset form data
      setInputErrors({});
      onSave();
    } catch (error) {
      toast.error("Failed to add shopkeeper!");
    }
  };

  return (
    <div className="alhamd-add-shopkeeper-form">
      <h4 className="alhamd-form-title">Add Shopkeeper</h4>
      <label className="alhamd-form-label">
        Username:
        <input
          type="text"
          name="username"
          value={shopkeeperData.username}
          onChange={handleInputChange}
          className={inputErrors.username ? "alhamd-input-error" : ""}
          required
        />
      </label>
      <label className="alhamd-form-label">
        Email:
        <input
          type="email"
          name="email"
          value={shopkeeperData.email}
          onChange={handleInputChange}
          className={inputErrors.email ? "alhamd-input-error" : ""}
          required
        />
      </label>
      <label className="alhamd-form-label">
        Password:
        <input
          type="password"
          name="password"
          value={shopkeeperData.password}
          onChange={handleInputChange}
          className={inputErrors.password ? "alhamd-input-error" : ""}
          required
        />
      </label>
      <label className="alhamd-form-label">
        Shop Name:
        <input
          type="text"
          name="shopName"
          value={shopkeeperData.shopName}
          onChange={handleInputChange}
          className={inputErrors.shopName ? "alhamd-input-error" : ""}
          required
        />
      </label>
      <label className="alhamd-form-label">
        Shop Address:
        <input
          type="text"
          name="shopAddress"
          value={shopkeeperData.shopAddress}
          onChange={handleInputChange}
          className={inputErrors.shopAddress ? "alhamd-input-error" : ""}
          required
        />
      </label>
      <label className="alhamd-form-label">
        Phone Number:
        <input
          type="text"
          name="phoneNumber"
          value={shopkeeperData.phoneNumber}
          onChange={handleInputChange}
          className={inputErrors.phoneNumber ? "alhamd-input-error" : ""}
          required
        />
      </label>
      <button onClick={handleAddShopkeeper} className="alhamd-add-button">
        Add Shopkeeper
      </button>
    </div>
  );
};

export default AddShopkeeper;
