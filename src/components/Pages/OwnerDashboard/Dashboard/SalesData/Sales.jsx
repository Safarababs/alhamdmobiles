import React, { useState } from "react";
import UpdateSales from "./updateSales/UpdateSales";
import DeleteSales from "./deleteSales/DeleteSales";
import ViewSales from "./viewSalesData/viewSales";

const Sales = () => {
  const [activeComponent, setActiveComponent] = useState("view");

  const handleComponentChange = (e) => {
    setActiveComponent(e.target.value);
  };

  const handleDeleteItem = () => {
    setActiveComponent("delete");
  };

  const handleUpdateItem = () => {
    setActiveComponent("update");
  };

  return (
    <div className="inventory-section">
      <div className="dropdown-options">
        <select onChange={handleComponentChange} defaultValue="view">
          <option value="view">Sales</option>
          <option value="update">Update Sale</option>
          <option value="delete">Delete Sale</option>
        </select>
      </div>
      {activeComponent === "view" && (
        <ViewSales onDelete={handleDeleteItem} onUpdate={handleUpdateItem} />
      )}
      {activeComponent === "delete" && <DeleteSales />}
      {activeComponent === "update" && <UpdateSales />}
    </div>
  );
};

export default Sales;
