import React, { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import app from "../../../../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddEmployee.css";

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
    <div className="add-employee-form">
      <h4>Add Employee</h4>
      <label>
        *Username:
        <input
          type="text"
          name="username"
          value={employeeData.username}
          onChange={handleInputChange}
          className={inputErrors.username ? "error" : ""}
          required
        />
      </label>
      <label>
        *Email:
        <input
          type="email"
          name="email"
          value={employeeData.email}
          onChange={handleInputChange}
          className={inputErrors.email ? "error" : ""}
          required
        />
      </label>
      <label>
        *Password:
        <input
          type="password"
          name="password"
          value={employeeData.password}
          onChange={handleInputChange}
          className={inputErrors.password ? "error" : ""}
          required
        />
      </label>
      <label>
        *CNIC:
        <input
          type="text"
          name="cnic"
          value={employeeData.cnic}
          onChange={handleInputChange}
          className={inputErrors.cnic ? "error" : ""}
          required
        />
      </label>
      <label>
        Bank Account Number(Optional)
        <input
          type="text"
          name="bankAccountNumber"
          value={employeeData.bankAccountNumber}
          onChange={handleInputChange}
        />
      </label>
      <label>
        *Salary:
        <input
          type="number"
          name="salary"
          value={employeeData.salary}
          onChange={handleInputChange}
          className={inputErrors.salary ? "error" : ""}
          required
        />
      </label>
      <label>
        *Phone Number:
        <input
          type="text"
          name="phoneNumber"
          value={employeeData.phoneNumber}
          onChange={handleInputChange}
          className={inputErrors.phoneNumber ? "error" : ""}
          required
        />
      </label>
      <label>
        *Address:
        <input
          type="text"
          name="shopAddress"
          value={employeeData.address}
          onChange={handleInputChange}
          className={inputErrors.address ? "error" : ""}
          required
        />
      </label>
      <button onClick={handleAddEmployee}>Add Employee</button>
    </div>
  );
};

export default AddEmployee;
