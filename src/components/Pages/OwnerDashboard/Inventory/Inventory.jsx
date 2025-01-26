import React, { useState } from "react";
import "./Inventory.css";
import AddItem from "./AddItem/AddItem";
import DeleteItem from "./DeleteItem/DeleteItem";
import UpdateItem from "./UpdateItem/UpdateItem";
import ViewInventory from "./ViewInventory/ViewInventory";

const Inventory = () => {
  const [activeComponent, setActiveComponent] = useState("view");
  const [selectedItem, setSelectedItem] = useState(null);

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
      <h3>Inventory</h3>

      <div className="inventory-cards">
        <div className="card" onClick={handleViewInventory}>
          <h4>See Inventory</h4>
          <button>See Inventory</button>
        </div>
        <div className="card" onClick={handleAddItem}>
          <h4>Add Item</h4>
          <button>Add Item</button>
        </div>
        <div className="card" onClick={() => handleUpdateItem(null)}>
          <h4>Update Item</h4>
          <button>Update Item</button>
        </div>
        <div className="card" onClick={() => handleDeleteItem(null)}>
          <h4>Delete Item</h4>
          <button>Delete Item</button>
        </div>
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
    </div>
  );
};

export default Inventory;
