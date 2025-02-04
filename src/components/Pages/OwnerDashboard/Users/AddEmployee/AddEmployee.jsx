import React, { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import app from "../../../../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddEmployee.css"; // Import the CSS file

const AddEmployee = ({ onSave }) => {
  const [employeeData, setEmployeeData] = useState({
    username: "",
    email: "",
    password: "",
    role: "Employee",
    cnic: "",
    bankAccountNumber: "",
    salary: "",
    phoneNumber: "",
    shopAddress: "",
  });
  const [inputErrors, setInputErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({ ...prevData, [name]: value }));
    setInputErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
  };

  const handleAddEmployee = async () => {
    const database = getDatabase(app);
    const usersRef = ref(database, "users");

    const errors = {};
    Object.keys(employeeData).forEach((key) => {
      if (key !== "bankAccountNumber" && !employeeData[key]) {
        errors[key] = true;
      }
    });

    if (Object.keys(errors).length > 0) {
      setInputErrors(errors);
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      await push(usersRef, employeeData);
      toast.success("Employee added successfully!");
      setEmployeeData({
        username: "",
        email: "",
        password: "",
        role: "Employee",
        cnic: "",
        bankAccountNumber: "",
        salary: "",
        phoneNumber: "",
        address: "",
      }); // Reset form data
      setInputErrors({});
      onSave();
    } catch (error) {
      toast.error("Failed to add employee!");
    }
  };

  return (
    <div className="alhamd-add-employee-form">
      <h4 className="alhamd-form-title">Add Employee</h4>
      <label className="alhamd-form-label">
        *Username:
        <input
          type="text"
          name="username"
          value={employeeData.username}
          onChange={handleInputChange}
          className={inputErrors.username ? "alhamd-input-error" : ""}
          required
        />
      </label>
      <label className="alhamd-form-label">
        *Email:
        <input
          type="email"
          name="email"
          value={employeeData.email}
          onChange={handleInputChange}
          className={inputErrors.email ? "alhamd-input-error" : ""}
          required
        />
      </label>
      <label className="alhamd-form-label">
        *Password:
        <input
          type="password"
          name="password"
          value={employeeData.password}
          onChange={handleInputChange}
          className={inputErrors.password ? "alhamd-input-error" : ""}
          required
        />
      </label>
      <label className="alhamd-form-label">
        *CNIC:
        <input
          type="text"
          name="cnic"
          value={employeeData.cnic}
          onChange={handleInputChange}
          className={inputErrors.cnic ? "alhamd-input-error" : ""}
          required
        />
      </label>
      <label className="alhamd-form-label">
        Bank Account Number (Optional)
        <input
          type="text"
          name="bankAccountNumber"
          value={employeeData.bankAccountNumber}
          onChange={handleInputChange}
        />
      </label>
      <label className="alhamd-form-label">
        *Salary:
        <input
          type="number"
          name="salary"
          value={employeeData.salary}
          onChange={handleInputChange}
          className={inputErrors.salary ? "alhamd-input-error" : ""}
          required
        />
      </label>
      <label className="alhamd-form-label">
        *Phone Number:
        <input
          type="text"
          name="phoneNumber"
          value={employeeData.phoneNumber}
          onChange={handleInputChange}
          className={inputErrors.phoneNumber ? "alhamd-input-error" : ""}
          required
        />
      </label>
      <label className="alhamd-form-label">
        *Address:
        <input
          type="text"
          name="shopAddress"
          value={employeeData.shopAddress}
          onChange={handleInputChange}
          className={inputErrors.shopAddress ? "alhamd-input-error" : ""}
          required
        />
      </label>
      <button onClick={handleAddEmployee} className="alhamd-add-button">
        Add Employee
      </button>
    </div>
  );
};

export default AddEmployee;
