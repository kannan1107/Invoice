import React, { useState, useRef } from "react";


const Invoice = () => {
  const [invoiceDetails, setInvoiceDetails] = useState({
    name: "",
    address: "",
    date: new Date().toISOString().substring(0, 10),
    invoiceNo: `INV-${Math.floor(Math.random() * 10000)}`,
  });

  const [items, setItems] = useState([
    { id: 1, description: "", quantity: 1, price: 0 },
  ]);

  const [taxPercent, setTaxPercent] = useState(5);
  const [discountPercent, setDiscountPercent] = useState(0);

  const printRef = useRef();

  // Handle input change for invoice details
  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setInvoiceDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handle item change
  const handleItemChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: field === "description" ? value : Number(value) } : item
      )
    );
  };

  // Add new item
  const addItem = () => {
    setItems((prev) => [...prev, { id: Date.now(), description: "", quantity: 1, price: 0 }]);
  };

  // Remove item
  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculate totals
  const subTotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const taxAmount = (subTotal * taxPercent) / 100;
  const discountAmount = (subTotal * discountPercent) / 100;
  const total = subTotal + taxAmount - discountAmount;

  // Print invoice
  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();  // Reload to restore event handlers
  };

  return (
    <div className="container mx-auto p-20 overflow-x-auto relative shadow-lg bg-gray-150">	
      <h1 className="text-2xl font-bold mb-4 text-center">Billing Details</h1>

      {/* Invoice Details */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold min-w-full table-layout-fix">Name</label>
          <input
            type="text"
            name="name"
            value={invoiceDetails.name}
            onChange={handleInvoiceChange}
            className="border p-2 rounded w-full"
            placeholder="Customer Name"
          />
        </div>
        <div>
          <label className="block font-semibold">Invoice No</label>
          <input
            type="text"
            name="invoiceNo"
            value={invoiceDetails.invoiceNo}
            onChange={handleInvoiceChange}
            className="border p-2 rounded w-full"
            placeholder="Invoice Number"
          />
        </div>
        <div>
          <label className="block font-semibold">Address</label>
          <textarea
            name="address"
            value={invoiceDetails.address}
            onChange={handleInvoiceChange}
            className="border p-2 rounded w-full"
            placeholder="Customer Address"
          />
        </div>
        <div>
          <label className="block font-semibold">Date</label>
          <input
            type="date"
            name="date"
            value={invoiceDetails.date}
            onChange={handleInvoiceChange}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 	">
          <thead>
            <tr className="bg-gray-100 max-2xl ">
              <th className="border px-4 py-2 text-left">Description</th>
              <th className="border px-4 py-2 text-right">Quantity</th>
              <th className="border px-4 py-2 text-right">Price</th>
              <th className="border px-4 py-2 text-right">Amount</th>
              <th className="border px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ id, description, quantity, price }) => (
              <tr key={id}>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => handleItemChange(id, "description", e.target.value)}
                    className="w-full p-1 border rounded"
                    placeholder="Item Description"
                  />
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => handleItemChange(id, "quantity", e.target.value)}
                    className="w-full p-1 border rounded text-right"
                  />
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => handleItemChange(id, "price", e.target.value)}
                    className="w-full p-1 border rounded text-right"
                  />
                </td>
                <td className="border px-4 py-2 text-right">{(quantity * price).toFixed(2)}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => removeItem(id)}
                    className="text-red-600 hover:text-red-800 font-bold text-green-600 hover:text-green-800 font-bold text-lg"
                    disabled={items.length === 1}
                    title="Remove Item"
                  >
                    🗑

                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={addItem}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Item
      </button>

      {/* Tax and Discount */}
      <div className="mt-6 max-w-md">
        <div className="flex justify-between mb-2">
          <label className="font-semibold">Tax %</label>
          <input
            type="number"
            min="0"
            value={taxPercent}
            onChange={(e) => setTaxPercent(Number(e.target.value))}
            className="border p-1 rounded w-20 text-right"
          />
        </div>
        <div className="flex justify-between mb-2">
          <label className="font-semibold">Discount %</label>
          <input
            type="number"
            min="0"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(Number(e.target.value))}
            className="border p-1 rounded w-20 text-right"
          />
        </div>
      </div>

      {/* Totals */}
      <div className="mt-6 max-w-md">
        <div className="flex justify-between border-t border-gray-300 pt-2 mb-1">
          <span>Subtotal:</span>
          <span>${subTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Tax ({taxPercent}%):</span>
          <span>${taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Discount ({discountPercent}%):</span>
          <span>-${discountAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Print Invoice
      </button>

      {/* Hidden Printable Section */}
      <div ref={printRef} className="hidden">
        <div className="p-4" style={{ width: "210mm", minHeight: "297mm" }}>
                      <div className=" grid grid-cols-3 ">

                        <p><strong>Date:</strong> {invoiceDetails.date}</p>

          <h2 className="text-3xl font-bold mb-4 text-blue-400"><center>Invoice</center></h2>
                    <p><strong>Invoice No:</strong> {invoiceDetails.invoiceNo}</p>

                      </div>

          <div className=" grid grid-cols-2 ">
<p><strong>Name:</strong> {invoiceDetails.name}</p>
          <p><strong>Address:</strong> {invoiceDetails.address}</p>
          

          </div>

          <table className="min-w-full mt-4 border border-black">
            <thead>
              <tr>
                <th className="border border-black px-4 py-2 text-left">Description</th>
                <th className="border border-black px-4 py-2 text-right">Quantity</th>
                <th className="border border-black px-4 py-2 text-right">Price</th>
                <th className="border border-black px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ id, description, quantity, price }) => (
                <tr key={id}>
                  <td className="border border-black px-4 py-2">{description}</td>
                  <td className="border border-black px-4 py-2 text-right">{quantity}</td>
                  <td className="border border-black px-4 py-2 text-right">${price.toFixed(2)}</td>
                  <td className="border border-black px-4 py-2 text-right">${(quantity * price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 max-w-md float-end">
            <div className="flex justify-between border-t border-black pt-2 mb-1">
              <span>Subtotal:</span>
              <span>${subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Tax ({taxPercent}%):</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Discount ({discountPercent}%):</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-black pt-2">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          
         
          </div>
             <div className="mt-6 text-center flex text-2xl text-green-600">
            <h1>Thank you for your business!</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;