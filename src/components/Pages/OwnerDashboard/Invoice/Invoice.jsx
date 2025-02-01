import React from "react";
import "./Invoice.css";

const Invoice = ({
  invoiceItems,
  invoiceTotal,
  customerName,
  phoneNumber,
  invoiceNumber,
  onPriceChange,
  onDeleteItem,
}) => {
  const taxRate = 0.1; // 10% tax rate (adjust as needed)
  const taxAmount = invoiceTotal * taxRate;
  const totalWithTax = invoiceTotal + taxAmount;

  return (
    <div className="invoice-section">
      <h2>Invoice</h2>
      <div className="invoice-header">
        <div className="invoice-details">
          <p>
            <strong>Customer Name:</strong> {customerName}
          </p>
          <p>
            <strong>Phone Number:</strong> {phoneNumber}
          </p>
          <p>
            <strong>Invoice Date:</strong> {new Date().toLocaleDateString()}
          </p>
          <p>
            <strong>Invoice Number:</strong> {invoiceNumber}
          </p>
        </div>
        <div className="company-details">
          <h3>Company Name</h3>
          <p>1234 Street Address</p>
          <p>City, State, Zip Code</p>
          <p>Email: info@company.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
      </div>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Item Code</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Profit</th>
            <th>Loss</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItems.map((item, index) => {
            const itemProfit =
              (item.price - item.purchasePrice) * item.quantity;
            const itemLoss = (item.purchasePrice - item.price) * item.quantity;
            return (
              <tr key={index}>
                <td>{item.code}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      onPriceChange(index, parseFloat(e.target.value))
                    }
                  />
                </td>
                <td>{(item.quantity * item.price).toFixed(2)}</td>
                <td>{itemProfit > 0 ? itemProfit.toFixed(2) : 0}</td>
                <td>{itemLoss > 0 ? itemLoss.toFixed(2) : 0}</td>
                <td>
                  <button onClick={() => onDeleteItem(index)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4">Subtotal</td>
            <td>{invoiceTotal.toFixed(2)}</td>
            <td colSpan="3"></td>
          </tr>
          <tr>
            <td colSpan="4">Tax (10%)</td>
            <td>{taxAmount.toFixed(2)}</td>
            <td colSpan="3"></td>
          </tr>
          <tr>
            <td colSpan="4">
              <strong>Total</strong>
            </td>
            <td>
              <strong>{totalWithTax.toFixed(2)}</strong>
            </td>
            <td colSpan="3"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Invoice;
