import React, { useState } from "react";
import "./Inventory.css";
import AddItem from "./AddItem/AddItem";
import DeleteItem from "./DeleteItem/DeleteItem";
import UpdateItem from "./UpdateItem/UpdateItem";
import ViewInventory from "./ViewInventory/ViewInventory";
import Expenses from "./Expenses/Expenses"; // Import the Expenses component

const Inventory = () => {
  const [activeComponent, setActiveComponent] = useState("view");
  const [selectedItem, setSelectedItem] = useState(null);

  const handleComponentChange = (e) => {
    setActiveComponent(e.target.value);
  };

  const handleViewInventory = () => {
    setActiveComponent("view");
  };

  const handleAddItem = () => {
    setActiveComponent("add");
  };

  const handleDeleteItem = (item) => {
    setSelectedItem(item);
    setActiveComponent("delete");
  };

  const handleUpdateItem = (item) => {
    setSelectedItem(item);
    setActiveComponent("update");
  };

  return (
    <div className="inventory-section">
      <div className="dropdown-options">
        <select onChange={handleComponentChange} defaultValue="view">
          <option value="view">See Inventory</option>
          <option value="add">Add Item</option>
          <option value="update">Update Item</option>
          <option value="delete">Delete Item</option>
          <option value="expenses">Add Expense</option>{" "}
          {/* Add an option for Expenses */}
        </select>
      </div>
      {activeComponent === "view" && (
        <ViewInventory
          onDelete={handleDeleteItem}
          onUpdate={handleUpdateItem}
        />
      )}
      {activeComponent === "add" && <AddItem />}
      {activeComponent === "delete" && <DeleteItem />}
      {activeComponent === "update" && selectedItem && (
        <UpdateItem selectedItem={selectedItem} />
      )}
      {activeComponent === "expenses" && <Expenses />}{" "}
      {/* Render the Expenses component */}
    </div>
  );
};

export default Inventory;
