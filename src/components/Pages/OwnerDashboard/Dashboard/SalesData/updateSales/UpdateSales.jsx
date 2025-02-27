import React, { useState, useEffect, useCallback } from "react";
import { getDatabase, ref, update, get } from "firebase/database";
import app from "../../../../../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UpdateSales.css";

const UpdateSales = () => {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const database = getDatabase(app);
      const salesRef = ref(database, "sales");

      try {
        const snapshot = await get(salesRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setSalesData(Object.entries(data));
        } else {
          toast.error("No sales data found!");
        }
      } catch (error) {
        toast.error("Failed to fetch sales data!");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredSales(
      salesData.filter(
        ([key, value]) =>
          key.includes(searchTerm) ||
          value.phoneNumber.includes(searchTerm) ||
          value.items.some((item) =>
            item.name.toLowerCase().includes(searchTerm)
          )
      )
    );
  }, [searchTerm, salesData]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSelectSale = (sale) => {
    setInvoiceNumber(sale[0]);
    setSelectedSale(sale[1]);
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...selectedSale.items];
    items[index] = { ...items[index], [name]: value };
    setSelectedSale({ ...selectedSale, items });
    recalculateTotals({ ...selectedSale, items });
  };

  const handleSalesDataChange = (e) => {
    const { name, value } = e.target;
    setSelectedSale({ ...selectedSale, [name]: value });
  };

  const handleDeleteItem = (itemIndex) => {
    const updatedItems = selectedSale.items.filter(
      (_, index) => index !== itemIndex
    );
    setSelectedSale({ ...selectedSale, items: updatedItems });
    recalculateTotals({ ...selectedSale, items: updatedItems });
  };

  const handleAddItem = () => {
    const newItems = [
      ...selectedSale.items,
      {
        code: "",
        name: "",
        price: 0,
        quantity: 0,
        total: 0,
        profit: 0,
        loss: 0,
        purchasePrice: 0,
      },
    ];
    setSelectedSale({
      ...selectedSale,
      items: newItems,
    });
    recalculateTotals({ ...selectedSale, items: newItems });
  };

  const recalculateTotals = (sale) => {
    let total = 0;
    let totalProfit = 0;
    let totalLoss = 0;

    sale.items.forEach((item) => {
      const itemTotal = parseFloat(item.price) * parseFloat(item.quantity);
      const itemProfit =
        itemTotal - parseFloat(item.purchasePrice) * parseFloat(item.quantity);
      const itemLoss = itemProfit < 0 ? -itemProfit : 0;

      total += itemTotal;
      totalProfit += itemProfit > 0 ? itemProfit : 0;
      totalLoss += itemLoss;
    });

    setSelectedSale({
      ...sale,
      total,
      totalProfit,
      totalLoss,
    });
  };

  const handleUpdate = useCallback(async () => {
    const database = getDatabase(app);
    const salesRef = ref(database, `sales/${invoiceNumber}`);

    try {
      await update(salesRef, selectedSale);
      toast.success("Sales data updated successfully!");
    } catch (error) {
      toast.error("Failed to update sales data!");
    }
  }, [invoiceNumber, selectedSale]);

  return (
    <div className="unique-update-sales-section">
      <h2>Update Sales</h2>
      <input
        type="text"
        placeholder="Search by Invoice Number, Customer Name or Product Name"
        onChange={handleSearch}
        className="unique-search-input"
      />
      <div className="unique-sales-list">
        {filteredSales.map((sale) => (
          <div
            key={sale[0]}
            onClick={() => handleSelectSale(sale)}
            className="unique-sale-item"
          >
            {sale[0]} - {sale[1].phoneNumber} -{" "}
            {sale[1].items.map((item) => item.name).join(", ")}
          </div>
        ))}
      </div>
      {selectedSale && (
        <>
          <input
            type="text"
            placeholder="Invoice Number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="unique-invoice-input"
          />
          <div className="unique-sales-data-section">
            <label>Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={selectedSale.phoneNumber}
              onChange={handleSalesDataChange}
              className="unique-sales-data-input"
            />
            <label>Total:</label>
            <input
              type="number"
              name="total"
              value={selectedSale.total}
              onChange={handleSalesDataChange}
              className="unique-sales-data-input"
            />
            <label>Total Loss:</label>
            <input
              type="number"
              name="totalLoss"
              value={selectedSale.totalLoss}
              onChange={handleSalesDataChange}
              className="unique-sales-data-input"
            />
            <label>Total Profit:</label>
            <input
              type="number"
              name="totalProfit"
              value={selectedSale.totalProfit}
              onChange={handleSalesDataChange}
              className="unique-sales-data-input"
            />
            <h3>Items:</h3>
            {selectedSale.items.map((item, index) => (
              <div key={index} className="unique-item-section">
                <input
                  type="text"
                  name="code"
                  placeholder="Code"
                  value={item.code}
                  onChange={(e) => handleItemChange(index, e)}
                  className="unique-item-input"
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, e)}
                  className="unique-item-input"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, e)}
                  className="unique-item-input"
                />
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, e)}
                  className="unique-item-input"
                />
                <input
                  type="number"
                  name="total"
                  placeholder="Total"
                  value={item.total}
                  onChange={(e) => handleItemChange(index, e)}
                  className="unique-item-input"
                />
                <input
                  type="number"
                  name="profit"
                  placeholder="Profit"
                  value={item.profit}
                  onChange={(e) => handleItemChange(index, e)}
                  className="unique-item-input"
                />
                <input
                  type="number"
                  name="loss"
                  placeholder="Loss"
                  value={item.loss}
                  onChange={(e) => handleItemChange(index, e)}
                  className="unique-item-input"
                />
                <input
                  type="number"
                  name="purchasePrice"
                  placeholder="Purchase Price"
                  value={item.purchasePrice}
                  onChange={(e) => handleItemChange(index, e)}
                  className="unique-item-input"
                />
                <button
                  onClick={() => handleDeleteItem(index)}
                  className="unique-remove-item-button"
                >
                  Remove Item
                </button>
              </div>
            ))}
            <button onClick={handleAddItem} className="unique-add-item-button">
              Add Item
            </button>
          </div>
          <button onClick={handleUpdate} className="unique-update-button">
            Update Sales
          </button>
        </>
      )}
    </div>
  );
};

export default UpdateSales;
