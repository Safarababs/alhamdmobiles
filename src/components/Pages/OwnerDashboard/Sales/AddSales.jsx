import React, { useState, useEffect, useCallback } from "react";
import { getDatabase, ref, get, update, set } from "firebase/database";
import app from "../../../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddSales.css";
import Invoice from "../Invoice/Invoice";
import CustomerDetails from "./CustomerDetails/CustomerDetails";
import SearchSection from "./SearchSection/SearchSection";
import SelectedItemSection from "./SelectedItemSection/SelectedItemSection";

const AddSales = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [invoiceTotal, setInvoiceTotal] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState(0);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [highlightedFields, setHighlightedFields] = useState({});

  useEffect(() => {
    fetchInventoryData();
    fetchLastInvoiceNumber();
  }, []);

  const generateInvoiceNumber = useCallback(() => {
    setLoading(true);
    setInvoiceNumber(`INV-${String(lastInvoiceNumber + 1).padStart(2, "0")}`);
    setLoading(false);
  }, [lastInvoiceNumber]);

  useEffect(() => {
    generateInvoiceNumber();
  }, [lastInvoiceNumber, generateInvoiceNumber]);

  const fetchInventoryData = async () => {
    const database = getDatabase(app);
    const inventoryRef = ref(database, "inventory");

    try {
      const snapshot = await get(inventoryRef);
      if (snapshot.exists()) {
        const inventoryArray = [];
        snapshot.forEach((childSnapshot) => {
          const item = childSnapshot.val();
          item.key = childSnapshot.key;
          inventoryArray.push(item);
        });
        setInventoryData(inventoryArray);
        toast.success("Inventory data loaded successfully!");
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      toast.error("Failed to load inventory data!");
    }
  };

  const fetchLastInvoiceNumber = async () => {
    const database = getDatabase(app);
    const invoiceNumberRef = ref(database, "lastInvoiceNumber");

    try {
      const snapshot = await get(invoiceNumberRef);
      if (snapshot.exists()) {
        setLastInvoiceNumber(snapshot.val());
      } else {
        setLastInvoiceNumber(0);
      }
    } catch (error) {
      console.error("Error fetching last invoice number:", error);
      toast.error("Failed to fetch last invoice number!");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectItem = (item) => {
    if (item.qty > 0) {
      setSelectedItem(item);
      setPrice(item.retailPrice);
      setQuantity(1);
    } else {
      toast.error("Stock not available!");
    }
  };

  const handleAddToInvoice = () => {
    const newItem = {
      ...selectedItem,
      quantity,
      price,
    };

    const newInvoiceItems = [...invoiceItems, newItem];
    setInvoiceItems(newInvoiceItems);

    const newTotal = newInvoiceItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
    setInvoiceTotal(newTotal);

    setSelectedItem(null);
    setSearchTerm("");
    setQuantity(1);
    setPrice("");
    toast.success("Item added to invoice!");
  };

  const handlePriceChange = (index, newPrice) => {
    const newInvoiceItems = [...invoiceItems];
    newInvoiceItems[index].price = newPrice;
    setInvoiceItems(newInvoiceItems);

    const newTotal = newInvoiceItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
    setInvoiceTotal(newTotal);
  };

  const handleDeleteItem = (index) => {
    const newInvoiceItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(newInvoiceItems);

    const newTotal = newInvoiceItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
    setInvoiceTotal(newTotal);

    toast.success("Item deleted from invoice!");
  };

  const handleSubmitSale = async () => {
    let newHighlightedFields = {};
    if (!customerName) newHighlightedFields.customerName = true;
    if (!phoneNumber) newHighlightedFields.phoneNumber = true;

    setHighlightedFields(newHighlightedFields);

    if (!customerName || !phoneNumber) {
      toast.error("Customer details are required!");
      return;
    }

    setLoading(true);

    const database = getDatabase(app);
    const updates = {};

    const invoiceItemsWithDetails = invoiceItems.map((item) => {
      const price = parseFloat(item.price);
      const purchasePrice = parseFloat(item.purchasePrice);
      const quantity = parseInt(item.quantity, 10);
      const profit = Math.max((price - purchasePrice) * quantity, 0);
      const loss = Math.max((purchasePrice - price) * quantity, 0);
      const total = quantity * price;

      return {
        code: item.code,
        name: item.name,
        price,
        purchasePrice,
        quantity,
        profit,
        loss,
        total,
      };
    });

    // Update inventory quantities for each item in the invoice
    invoiceItemsWithDetails.forEach((item) => {
      const inventoryItem = inventoryData.find(
        (invItem) => invItem.code === item.code
      );
      if (inventoryItem) {
        const newQty = parseInt(inventoryItem.qty, 10) - item.quantity;
        updates[`/inventory/${inventoryItem.key}/qty`] = newQty;
      }
    });

    const totalProfit = invoiceItemsWithDetails.reduce(
      (total, item) => total + item.profit,
      0
    );
    const totalLoss = invoiceItemsWithDetails.reduce(
      (total, item) => total + item.loss,
      0
    );

    const invoiceData = {
      invoiceNumber,
      customerName,
      phoneNumber,
      items: invoiceItemsWithDetails,
      total: invoiceTotal,
      totalProfit,
      totalLoss,
      date: new Date().toISOString(),
    };

    try {
      await update(ref(database), updates);
      await set(ref(database, `sales/${invoiceNumber}`), invoiceData);
      await set(ref(database, "lastInvoiceNumber"), lastInvoiceNumber + 1);

      toast.success("Sale submitted and inventory updated!");
      setInvoiceItems([]);
      setInvoiceTotal(0);
      setCustomerName("");
      setPhoneNumber("");
      setLastInvoiceNumber((prev) => prev + 1);
    } catch (error) {
      console.error("Error submitting sale:", error);
      toast.error("Failed to submit sale!");
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = searchTerm
    ? inventoryData.filter(
        (item) =>
          (item.name &&
            item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.code &&
            item.code.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  return (
    <div className="add-sales-unique">
      <h2 className="add-sales-title-unique">Add Sales</h2>
      <CustomerDetails
        customerName={customerName}
        setCustomerName={setCustomerName}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        highlightedFields={highlightedFields}
      />
      <SearchSection
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        filteredInventory={filteredInventory}
        handleSelectItem={handleSelectItem}
      />
      {selectedItem && (
        <SelectedItemSection
          selectedItem={selectedItem}
          quantity={quantity}
          setQuantity={setQuantity}
          price={price}
          setPrice={setPrice}
          handleAddToInvoice={handleAddToInvoice}
        />
      )}
      <Invoice
        invoiceItems={invoiceItems}
        invoiceTotal={invoiceTotal}
        customerName={customerName}
        phoneNumber={phoneNumber}
        invoiceNumber={invoiceNumber}
        onPriceChange={handlePriceChange}
        onDeleteItem={handleDeleteItem}
      />
      <button
        className="add-sales-submit-button-unique"
        onClick={handleSubmitSale}
        disabled={loading}
      >
        {loading ? (
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          "Submit Sale"
        )}
      </button>
    </div>
  );
};

export default AddSales;
