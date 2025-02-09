import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import app from "../../../../../firebase";
import { getStartDateForPeriod } from "../Sort Data/dateUtils";

const Card = ({ title, type, selectedTimePeriod }) => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);

  const normalizeSale = (sale) => {
    return {
      total:
        sale.total ||
        (sale.quantity || 1) * (sale.price || sale.salePrice || 0),
      totalProfit: sale.totalProfit || sale.profit || 0,
      totalLoss: sale.totalLoss || sale.loss || 0,
      quantity: sale.quantity || 0,
      phoneNumber: sale.phoneNumber || "",
      date: sale.date || new Date().toISOString(),
    };
  };

  const normalizeExpense = (expense) => {
    return {
      amount: expense.amount || 0,
      date: expense.date || new Date().toISOString(),
    };
  };

  const getStartOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  };

  useEffect(() => {
    const filterSalesData = (salesData) => {
      const startDate = getStartDateForPeriod(selectedTimePeriod);
      const now = new Date();
      return salesData.filter((sale) => {
        const saleDate = new Date(sale.date);
        return saleDate >= startDate && saleDate <= now;
      });
    };

    const filterExpensesData = (expensesData) => {
      const startDate = getStartDateForPeriod(selectedTimePeriod);
      const now = new Date();
      return expensesData.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate && expenseDate <= now;
      });
    };

    const filterMonthlyData = (data) => {
      const startOfMonth = getStartOfMonth();
      const now = new Date();
      return data.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startOfMonth && itemDate <= now;
      });
    };

    const database = getDatabase(app);
    const salesRef = ref(database, "sales");
    const expensesRef = ref(database, "expenses");
    const pendingRef = ref(database, "pendingAmounts");

    setLoading(true);

    const fetchData = () => {
      if (
        type === "totalSales" ||
        type === "totalProfit" ||
        type === "totalLoss" ||
        type === "totalAvailable" ||
        type === "totalMonthlyProfit" ||
        type === "totalMonthlyLoss"
      ) {
        onValue(salesRef, (snapshot) => {
          const salesArray = [];
          snapshot.forEach((childSnapshot) => {
            const sale = normalizeSale(childSnapshot.val());
            salesArray.push(sale);
          });

          const filteredSalesData = filterSalesData(salesArray);
          const filteredMonthlySalesData = filterMonthlyData(salesArray);

          let total = 0;
          let totalProfit = 0;
          let totalLoss = 0;
          let monthlyProfit = 0;
          let monthlyLoss = 0;

          filteredSalesData.forEach((sale) => {
            if (type === "totalSales") {
              total += sale.total || 0;
            } else if (type === "totalProfit") {
              totalProfit += sale.totalProfit || 0;
            } else if (type === "totalLoss") {
              totalLoss += sale.totalLoss || 0;
            }
          });

          filteredMonthlySalesData.forEach((sale) => {
            if (type === "totalMonthlyProfit") {
              monthlyProfit += sale.totalProfit || 0;
            } else if (type === "totalMonthlyLoss") {
              monthlyLoss += sale.totalLoss || 0;
            }
          });

          if (type === "totalSales") {
            setValue(total);
          } else if (type === "totalProfit") {
            setValue(totalProfit);
          } else if (type === "totalLoss") {
            setValue(totalLoss);
          } else if (type === "totalMonthlyProfit") {
            setValue(monthlyProfit);
          } else if (type === "totalMonthlyLoss") {
            setValue(monthlyLoss);
          }

          setLoading(false);
        });
      }

      if (type === "totalExpenses") {
        onValue(expensesRef, (snapshot) => {
          const expensesArray = [];
          snapshot.forEach((childSnapshot) => {
            const expense = normalizeExpense(childSnapshot.val());
            expensesArray.push(expense);
          });

          const filteredExpensesData = filterExpensesData(expensesArray);
          let totalExpenses = 0;
          filteredExpensesData.forEach((expense) => {
            totalExpenses += expense.amount;
          });

          setValue(totalExpenses);
          setLoading(false);
        });
      }

      if (type === "totalPendingAmount") {
        onValue(pendingRef, (snapshot) => {
          let pendingAmount = 0;
          snapshot.forEach((childSnapshot) => {
            const pending = childSnapshot.val();
            pendingAmount += pending.pendingAmount;
          });

          setValue(pendingAmount);
          setLoading(false);
        });
      }

      if (type === "totalAvailable") {
        onValue(expensesRef, (expensesSnapshot) => {
          const expensesArray = [];
          expensesSnapshot.forEach((childSnapshot) => {
            const expense = normalizeExpense(childSnapshot.val());
            expensesArray.push(expense);
          });

          const filteredExpensesData = filterMonthlyData(expensesArray);
          let totalExpenses = 0;
          filteredExpensesData.forEach((expense) => {
            totalExpenses += expense.amount;
          });

          onValue(salesRef, (salesSnapshot) => {
            const salesArray = [];
            salesSnapshot.forEach((childSnapshot) => {
              const sale = normalizeSale(childSnapshot.val());
              salesArray.push(sale);
            });

            const filteredSalesData = filterMonthlyData(salesArray);
            let totalSales = 0;
            filteredSalesData.forEach((sale) => {
              totalSales += sale.total || 0;
            });

            const totalAvailable = totalSales - totalExpenses;
            setValue(totalAvailable);
            setLoading(false);
          });
        });
      }
    };

    fetchData();
  }, [selectedTimePeriod, type]);

  return (
    <div className="card">
      <h4>{title}</h4>
      {loading ? <div className="spinner"></div> : <p>₨ {value.toFixed(2)}</p>}
    </div>
  );
};

export default Card;
