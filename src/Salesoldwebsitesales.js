import React, { useEffect, useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import app from "./firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader"; // Import spinner component

const FetchAndSaveSalesData = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // State to track saving process

  useEffect(() => {
    const fetchSales = async () => {
      console.log("Fetching all sales data");
      try {
        const response = await fetch(`http://localhost:5000/api/sales`);
        console.log("Fetch response status:", response.status);
        if (!response.ok) {
          const responseData = await response.text();
          console.log("Error response data:", responseData);
          throw new Error(`Network response was not ok: ${responseData}`);
        }
        const data = await response.json();
        console.log("Fetched sales data:", data);

        const formattedSales = data.map((sale, index) => {
          const date = sale.date?.$date?.$numberLong
            ? new Date(parseInt(sale.date.$date.$numberLong)).toISOString()
            : sale.date;
          const total = sale.total?.$numberInt ?? sale.total;
          const totalLoss = sale.loss?.$numberInt ?? sale.loss;
          const totalProfit = sale.profit?.$numberInt ?? sale.profit;

          return {
            invoiceNumber: `INV-${(index + 1).toString().padStart(2, "0")}`,
            customerName: sale.customerName || "Customer",
            date: date || "",
            phoneNumber: sale.customerPhone || "N/A",
            total: total !== undefined ? parseInt(total) : 0,
            totalLoss: totalLoss !== undefined ? parseInt(totalLoss) : 0,
            totalProfit: totalProfit !== undefined ? parseInt(totalProfit) : 0,
            items: sale.itemsSold.map((item) => ({
              code: item.code || "",
              name: item.name || "",
              salePrice:
                item.salePrice !== undefined
                  ? parseInt(item.salePrice?.$numberInt ?? item.salePrice)
                  : 0,
              purchasePrice:
                item.purchasePrice !== undefined
                  ? parseInt(
                      item.purchasePrice?.$numberInt ?? item.purchasePrice
                    )
                  : 0,
              quantity:
                item.quantity !== undefined
                  ? parseInt(item.quantity?.$numberInt ?? item.quantity)
                  : 0,
              profit:
                item.profit !== undefined
                  ? parseInt(item.profit?.$numberInt ?? item.profit)
                  : 0,
              loss:
                item.loss !== undefined
                  ? parseInt(item.loss?.$numberInt ?? item.loss)
                  : 0,
            })),
          };
        });

        setSales(formattedSales);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to fetch sales data.");
        setLoading(false);
      }
    };

    fetchSales(); // Fetch all sales data
  }, []);

  const handleSaveSalesToFirebase = async () => {
    console.log("Saving sales data to Firebase...");
    setSaving(true); // Set saving state to true
    const database = getDatabase(app);
    const salesRef = ref(database, "sales");

    try {
      const savePromises = sales.map((sale) => {
        return new Promise((resolve, reject) => {
          push(salesRef, sale, (error) => {
            if (error) {
              console.error("Error saving data:", error);
              toast.error("Failed to save sales data to Firebase.");
              reject(error);
            } else {
              console.log(
                "Sales data saved successfully for invoice:",
                sale.invoiceNumber
              );
              toast.success("Sales data saved successfully to Firebase!");
              resolve();
            }
          });
        });
      });

      await Promise.all(savePromises); // Wait for all save operations to complete
      toast.success("All sales data saved successfully to Firebase!");
    } catch (error) {
      console.error("Error saving data to Firebase:", error);
      toast.error("Failed to save data to Firebase.");
    } finally {
      setSaving(false); // Set saving state to false
    }
  };

  return (
    <div>
      <h3>Fetch and Save All Sales Data</h3>
      {loading ? (
        <p>Loading sales data...</p>
      ) : (
        <div>
          {saving ? (
            <ClipLoader size={50} color={"#123abc"} loading={saving} />
          ) : (
            <button onClick={handleSaveSalesToFirebase}>
              Save Sales to Firebase
            </button>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default FetchAndSaveSalesData;
