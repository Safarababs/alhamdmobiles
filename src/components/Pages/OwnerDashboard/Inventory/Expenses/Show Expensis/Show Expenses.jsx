import React, { useEffect, useState, useCallback } from "react";
import { getDatabase, ref, get } from "firebase/database";
import app from "../../../../../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ShowExpenses.css";
import { getStartDateForPeriod } from "../../../Dashboard/Sort Data/dateUtils";

const ShowExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("daily");
  const [endDate] = useState(new Date());
  const [totalAmount, setTotalAmount] = useState(0); // State for total amount

  const fetchExpenseData = useCallback(async () => {
    const database = getDatabase(app);
    const expensesRef = ref(database, "expenses");

    const adjustedStartDate = getStartDateForPeriod(selectedPeriod);

    try {
      const snapshot = await get(expensesRef);
      if (snapshot.exists()) {
        const expensesArray = [];
        let total = 0; // Variable to calculate total amount

        snapshot.forEach((childSnapshot) => {
          const expense = childSnapshot.val();
          const expenseDate = expense.date ? new Date(expense.date) : null;
          if (
            expenseDate &&
            expenseDate >= adjustedStartDate &&
            expenseDate <= endDate
          ) {
            expense.key = childSnapshot.key; // Store the Firebase key
            expensesArray.push(expense);
            total += expense.amount || 0; // Add to total amount
          }
        });

        setExpenses(expensesArray);
        setTotalAmount(total); // Update total amount
        toast.success("Expenses data loaded successfully!");
      }
    } catch (error) {
      console.error("Error fetching expenses data:", error);
      toast.error("Failed to load expenses data!");
    }
  }, [selectedPeriod, endDate]);

  useEffect(() => {
    fetchExpenseData();
  }, [fetchExpenseData]);

  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
  };

  return (
    <div className="unique-view-expenses-section">
      <h2>Here is your expense details 💸</h2>
      <div className="unique-dashboard-time-period">
        <select
          value={selectedPeriod}
          onChange={handlePeriodChange}
          className="unique-dashboard-time-period-select"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="all-time">All Time</option>
        </select>
      </div>
      <div className="unique-total-amount">
        <h3>Total Amount: {totalAmount.toFixed(2)}</h3>
      </div>
      <div className="unique-view-expenses-table">
        <table className="unique-view-expenses-table-element">
          <thead className="unique-view-expenses-table-head">
            <tr>
              <th className="unique-view-expenses-table-th">Date</th>
              <th className="unique-view-expenses-table-th">Name</th>
              <th className="unique-view-expenses-table-th">Amount</th>
            </tr>
          </thead>
          <tbody className="unique-view-expenses-table-body">
            {expenses.map((expense) => (
              <tr className="unique-view-expenses-table-row" key={expense.key}>
                <td className="unique-view-expenses-table-td">
                  {expense.date}
                </td>
                <td className="unique-view-expenses-table-td">
                  {expense.name}
                </td>
                <td className="unique-view-expenses-table-td">
                  {expense.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowExpenses;
