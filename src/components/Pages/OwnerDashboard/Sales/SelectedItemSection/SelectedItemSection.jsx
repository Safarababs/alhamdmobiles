import React from "react";
import "./SelectedItemSection.css";

const SelectedItemSection = ({
  selectedItem,
  quantity,
  setQuantity,
  price,
  setPrice,
  handleAddToInvoice,
}) => {
  return (
    <div className="selected-item-section">
      <h3>Selected Item: {selectedItem.name}</h3>
      <p>Stock: {selectedItem.qty}</p>
      <input
        type="number"
        value={quantity}
        min="1"
        max={selectedItem.qty}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={handleAddToInvoice}>Add to Invoice</button>
    </div>
  );
};

export default SelectedItemSection;
