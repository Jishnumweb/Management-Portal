"use client";

import { useState, useMemo } from "react";
import { Plus, Eye, Edit2, Trash2, X } from "lucide-react";

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="space-y-3">
    <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
    <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse" />
    <div className="h-4 bg-slate-200 rounded w-2/3 animate-pulse" />
    <div className="h-4 bg-slate-200 rounded w-4/5 animate-pulse" />
  </div>
);

// Main Invoice Page
export default function InvoicePage() {
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      type: "GST",
      clientName: "ABC Corp",
      invoiceNumber: "#10001",
      date: "2025-12-10",
      amount: 50000,
      status: "Paid",
    },
    {
      id: 2,
      type: "Non-GST",
      clientName: "XYZ Ltd",
      invoiceNumber: "#10002",
      date: "2025-12-09",
      amount: 30000,
      status: "Pending",
    },
    {
      id: 3,
      type: "GST",
      clientName: "Tech Solutions",
      invoiceNumber: "#10003",
      date: "2025-12-08",
      amount: 75000,
      status: "Draft",
    },
  ]);

  const [showAddSidebar, setShowAddSidebar] = useState(false);
  const [showViewSidebar, setShowViewSidebar] = useState(false);
  const [showEditSidebar, setShowEditSidebar] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "All" || inv.type === filterType;
      const matchesStatus =
        filterStatus === "All" || inv.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [invoices, searchTerm, filterType, filterStatus]);

  const handleViewInvoice = (invoice) => {
    setLoadingStates((prev) => ({ ...prev, [invoice.id]: true }));
    setTimeout(() => {
      setSelectedInvoice(invoice);
      setLoadingStates((prev) => ({ ...prev, [invoice.id]: false }));
      setShowViewSidebar(true);
    }, 300);
  };

  const handleEditInvoice = (invoice) => {
    setLoadingStates((prev) => ({ ...prev, [invoice.id]: true }));
    setTimeout(() => {
      setSelectedInvoice(invoice);
      setLoadingStates((prev) => ({ ...prev, [invoice.id]: false }));
      setShowEditSidebar(true);
    }, 300);
  };

  const handleDeleteInvoice = (id) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      setInvoices(invoices.filter((inv) => inv.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Invoices</h1>
            <p className="text-slate-600 mt-1">
              Manage your GST and Non-GST invoices
            </p>
          </div>
          <button
            onClick={() => setShowAddSidebar(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Add Invoice
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-slate-200 px-8 py-4">
        <div className="flex items-center gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search by client or invoice number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-64 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
          >
            <option>All Types</option>
            <option>GST</option>
            <option>Non-GST</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
          >
            <option value="All">All Status</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Draft</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setFilterType("All");
              setFilterStatus("All");
            }}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="px-8 py-6">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No invoices found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    Invoice #
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    Client
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    Date
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">
                    Amount
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-slate-900">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {invoice.clientName}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          invoice.type === "GST"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {invoice.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600">{invoice.date}</td>
                    <td className="py-4 px-4 text-right font-medium text-slate-900">
                      ₹{invoice.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          invoice.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : invoice.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewInvoice(invoice)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={18} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleEditInvoice(invoice)}
                          className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} className="text-green-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Invoice Sidebar */}
      {showAddSidebar && (
        <AddInvoiceSidebar
          onClose={() => setShowAddSidebar(false)}
          onAdd={(invoice) => {
            setInvoices([
              ...invoices,
              { ...invoice, id: Math.max(...invoices.map((i) => i.id), 0) + 1 },
            ]);
            setShowAddSidebar(false);
          }}
        />
      )}

      {/* View Invoice Sidebar */}
      {showViewSidebar && selectedInvoice && (
        <ViewInvoiceSidebar
          invoice={selectedInvoice}
          loading={loadingStates[selectedInvoice.id]}
          onClose={() => setShowViewSidebar(false)}
        />
      )}

      {/* Edit Invoice Sidebar */}
      {showEditSidebar && selectedInvoice && (
        <EditInvoiceSidebar
          invoice={selectedInvoice}
          loading={loadingStates[selectedInvoice.id]}
          onClose={() => setShowEditSidebar(false)}
          onUpdate={(updated) => {
            setInvoices(
              invoices.map((inv) => (inv.id === updated.id ? updated : inv))
            );
            setShowEditSidebar(false);
          }}
        />
      )}
    </div>
  );
}

// Add Invoice Sidebar
function AddInvoiceSidebar({ onClose, onAdd }) {
  const [invoiceType, setInvoiceType] = useState("GST");
  const [formData, setFormData] = useState({
    clientName: "",
    invoiceNumber: "",
    date: new Date().toISOString().split("T")[0],
    emailId: "",
    address: "",
    pincode: "",
    state: "",
    city: "",
    country: "",
    product: "",
    description: "",
    qty: "",
    rate: "",
    subtotal: "",
    discountType: "Percentage",
    discount: "",
    total: "",
    gstType: "IGST",
    gstPercentage: "",
    igstAmount: "",
    roundOff: "",
    bankName: "",
    bankAccountNumber: "",
    nameOnAccount: "",
    branchName: "",
    ifscCode: "",
    panCard: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.clientName || !formData.invoiceNumber) {
      alert("Please fill in required fields");
      return;
    }
    onAdd({
      type: invoiceType,
      clientName: formData.clientName,
      invoiceNumber: formData.invoiceNumber,
      date: formData.date,
      amount: Number.parseInt(formData.total) || 0,
      status: "Draft",
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Add Invoice</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Invoice Type Toggle */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Invoice Type
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setInvoiceType("GST")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  invoiceType === "GST"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                GST Invoice
              </button>
              <button
                onClick={() => setInvoiceType("Non-GST")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  invoiceType === "Non-GST"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Non-GST Invoice
              </button>
            </div>
          </div>

          {/* Client Details */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Client Details
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="clientName"
                placeholder="Client Name *"
                value={formData.clientName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="invoiceNumber"
                  placeholder="Invoice Number *"
                  value={formData.invoiceNumber}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="email"
                name="emailId"
                placeholder="Email ID"
                value={formData.emailId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Product Details
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="product"
                placeholder="Product *"
                value={formData.product}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  name="qty"
                  placeholder="Qty"
                  value={formData.qty}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="rate"
                  placeholder="Rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="subtotal"
                  placeholder="Subtotal"
                  value={formData.subtotal}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                >
                  <option>Percentage</option>
                  <option>Fixed</option>
                </select>
                <input
                  type="number"
                  name="discount"
                  placeholder="Discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="total"
                  placeholder="Total"
                  value={formData.total}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* GST Details (only for GST invoices) */}
          {invoiceType === "GST" && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                GST Details
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gstType"
                      value="IGST"
                      checked={formData.gstType === "IGST"}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-slate-700">IGST</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gstType"
                      value="SGST/CGST"
                      checked={formData.gstType === "SGST/CGST"}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-slate-700">SGST/CGST</span>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="gstPercentage"
                    placeholder="GST %"
                    value={formData.gstPercentage}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    name="igstAmount"
                    placeholder="IGST Amount"
                    value={formData.igstAmount}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="roundOff"
                    placeholder="Round Off"
                    value={formData.roundOff}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bank Details */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Bank Details
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="bankName"
                placeholder="Bank Name"
                value={formData.bankName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="nameOnAccount"
                  placeholder="Name on Account"
                  value={formData.nameOnAccount}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="bankAccountNumber"
                  placeholder="Account Number"
                  value={formData.bankAccountNumber}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="branchName"
                  placeholder="Branch Name"
                  value={formData.branchName}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="ifscCode"
                  placeholder="IFSC Code"
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="text"
                name="panCard"
                placeholder="PAN Card Number"
                value={formData.panCard}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 sticky bottom-0 bg-white pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Save Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// View Invoice Sidebar
function ViewInvoiceSidebar({ invoice, loading, onClose }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Invoice Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <SkeletonLoader />
          ) : (
            <div className="space-y-6">
              {/* Invoice Header */}
              <div className="bg-gradient-to-r from-blue-50 to-slate-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-600 text-sm">Invoice Number</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {invoice.invoiceNumber}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      invoice.type === "GST"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {invoice.type}
                  </span>
                </div>
              </div>

              {/* Client Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Client Information
                </h3>
                <div className="space-y-2 text-slate-600">
                  <p>
                    <span className="font-medium text-slate-900">Name:</span>{" "}
                    {invoice.clientName}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Date:</span>{" "}
                    {invoice.date}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Amount:</span>{" "}
                    ₹{invoice.amount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Status
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    invoice.status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : invoice.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {invoice.status}
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Edit Invoice Sidebar
function EditInvoiceSidebar({ invoice, loading, onClose, onUpdate }) {
  const [formData, setFormData] = useState(invoice);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onUpdate(formData);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-50 to-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Edit Invoice</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <SkeletonLoader />
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                name="clientName"
                placeholder="Client Name"
                value={formData.clientName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                name="invoiceNumber"
                placeholder="Invoice Number"
                value={formData.invoiceNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white cursor-pointer"
              >
                <option>Paid</option>
                <option>Pending</option>
                <option>Draft</option>
              </select>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                >
                  Update Invoice
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
