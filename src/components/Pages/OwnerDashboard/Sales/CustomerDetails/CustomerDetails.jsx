import React from "react";
import "./CustomerDetails.css";

const CustomerDetails = React.memo(
  ({ customerName, setCustomerName, phoneNumber, setPhoneNumber }) => {
    return (
      <div className="customer-details-unique">
        <input
          className="customer-input-unique"
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          className="customer-input-unique"
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
    );
  }
);

export default CustomerDetails;
