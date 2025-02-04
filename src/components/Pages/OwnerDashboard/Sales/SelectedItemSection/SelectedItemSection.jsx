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
    <div className="selected-item-section-unique">
      <h3 className="selected-item-title-unique">
        Selected Item: {selectedItem.name}
      </h3>
      <p className="selected-item-stock-unique">Stock: {selectedItem.qty}</p>
      <input
        className="selected-item-input-unique"
        type="number"
        value={quantity}
        min="1"
        max={selectedItem.qty}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      />
      <input
        className="selected-item-input-unique"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button
        className="selected-item-button-unique"
        onClick={handleAddToInvoice}
      >
        Add to Invoice
      </button>
    </div>
  );
};

export default SelectedItemSection;
