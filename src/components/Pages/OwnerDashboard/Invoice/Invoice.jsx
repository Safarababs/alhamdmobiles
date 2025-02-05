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
  const taxRate = 0; // 10% tax rate (adjust as needed)
  const taxAmount = invoiceTotal * taxRate;
  const totalWithTax = invoiceTotal + taxAmount;

  return (
    <div className="invoice-section-unique">
      <h2 className="invoice-title-unique">Abdullah Mobiles Bhera</h2>

      <div className="invoice-header-unique">
        <div className="invoice-details-unique">
          <p className="invoice-details-paragraph-unique">
            <strong>Customer Name:</strong> {customerName}
          </p>
          <hr></hr>
          <p className="invoice-details-paragraph-unique">
            <strong>Phone Number:</strong> {phoneNumber}
          </p>
          <hr></hr>
          <p className="invoice-details-paragraph-unique">
            <strong>Invoice Date:</strong> {new Date().toLocaleDateString()}
          </p>
          <hr></hr>
          <p className="invoice-details-paragraph-unique">
            <strong>Invoice Number:</strong> {invoiceNumber}
          </p>
          <hr></hr>
        </div>
        <div className="company-details-unique">
          <p className="company-address-unique">Main Bazar Bhera</p>
          <hr></hr>
          <p className="company-city-unique">
            City, Bhera, Sargodha, Pk, 40540
          </p>
          <hr></hr>
          <p className="company-email-unique">
            Email: safarabbas_2010@hotmail.com
          </p>
          <hr></hr>
          <p className="company-phone-unique">Phone: +92 (304) 6348069</p>
          <hr></hr>
        </div>
      </div>
      <table className="invoice-table-unique">
        <thead className="invoice-thead-unique">
          <tr className="invoice-thead-tr-unique">
            <th className="invoice-th-unique">Item Code</th>
            <th className="invoice-th-unique">Item Name</th>
            <th className="invoice-th-unique">Quantity</th>
            <th className="invoice-th-unique">Price</th>
            <th className="invoice-th-unique">Total</th>
            <th className="invoice-th-unique">Profit</th>
            <th className="invoice-th-unique">Loss</th>
            <th className="invoice-th-unique">Actions</th>
          </tr>
        </thead>
        <tbody className="invoice-tbody-unique">
          {invoiceItems.map((item, index) => {
            const itemProfit =
              (item.price - item.purchasePrice) * item.quantity;
            const itemLoss = (item.purchasePrice - item.price) * item.quantity;
            return (
              <tr key={index} className="invoice-tbody-tr-unique">
                <td className="invoice-td-unique">{item.code}</td>
                <td className="invoice-td-unique">{item.name}</td>
                <td className="invoice-td-unique">{item.quantity}</td>
                <td className="invoice-td-unique">
                  <input
                    className="invoice-input-unique"
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      onPriceChange(index, parseFloat(e.target.value))
                    }
                  />
                </td>
                <td className="invoice-td-unique">
                  {(item.quantity * item.price).toFixed(2)}
                </td>
                <td className="invoice-td-unique">
                  {itemProfit > 0 ? itemProfit.toFixed(2) : 0}
                </td>
                <td className="invoice-td-unique">
                  {itemLoss > 0 ? itemLoss.toFixed(2) : 0}
                </td>
                <td className="invoice-td-unique">
                  <button
                    className="invoice-button-unique"
                    onClick={() => onDeleteItem(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="invoice-tfoot-unique">
          <tr className="invoice-tfoot-tr-unique">
            <td className="invoice-td-unique" colSpan="4">
              Subtotal
            </td>
            <td className="invoice-td-unique">{invoiceTotal.toFixed(2)}</td>
            <td className="invoice-td-unique" colSpan="3"></td>
          </tr>
          <tr className="invoice-tfoot-tr-unique">
            <td className="invoice-td-unique" colSpan="4">
              Tax (10%)
            </td>
            <td className="invoice-td-unique">{taxAmount.toFixed(2)}</td>
            <td className="invoice-td-unique" colSpan="3"></td>
          </tr>
          <tr className="invoice-tfoot-tr-unique">
            <td className="invoice-td-unique" colSpan="4">
              <strong>Total</strong>
            </td>
            <td className="invoice-td-unique">
              <strong>{totalWithTax.toFixed(2)}</strong>
            </td>
            <td className="invoice-td-unique" colSpan="3"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Invoice;
