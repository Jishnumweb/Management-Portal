"use client";

import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Download,
  Search,
  Upload,
  AlertCircle,
  X,
} from "lucide-react";
import useAdminStore from "@/stores/useAdminStore";

const EXPENSE_CATEGORIES = [
  "Travel",
  "Food",
  "Office",
  "Salary",
  "Rent",
  "Hosting",
  "Fuel",
  "Utilities",
  "Equipment",
  "Marketing",
  "Other",
];

const PAYMENT_METHODS = ["Cash", "UPI", "Bank", "Card", "Cheque"];

const CATEGORY_COLORS = {
  Travel: "bg-blue-100 text-blue-700",
  Food: "bg-orange-100 text-orange-700",
  Office: "bg-purple-100 text-purple-700",
  Salary: "bg-green-100 text-green-700",
  Rent: "bg-red-100 text-red-700",
  Hosting: "bg-indigo-100 text-indigo-700",
  Fuel: "bg-amber-100 text-amber-700",
  Utilities: "bg-teal-100 text-teal-700",
  Equipment: "bg-cyan-100 text-cyan-700",
  Marketing: "bg-pink-100 text-pink-700",
  Other: "bg-gray-100 text-gray-700",
};

export default function ExpensesModule() {
  // const [expenses, setExpenses] = useState([
  //   {
  //     id: 1,
  //     date: "2025-11-20",
  //     entryDate: "2025-11-20",
  //     category: "Fuel",
  //     amount: 1500,
  //     gstPercent: 5,
  //     gstAmount: 75,
  //     total: 1575,
  //     paymentMethod: "Card",
  //     referenceId: "TXN-20251120-001",
  //     vendor: "Shell Petrol Station",
  //     receipt: null,
  //     notes: "Monthly fuel expenses",
  //   },
  //   {
  //     id: 2,
  //     date: "2025-11-18",
  //     entryDate: "2025-11-18",
  //     category: "Office",
  //     amount: 5000,
  //     gstPercent: 18,
  //     gstAmount: 900,
  //     total: 5900,
  //     paymentMethod: "Bank",
  //     referenceId: "TXN-20251118-002",
  //     vendor: "Office Supplies Co.",
  //     receipt: null,
  //     notes: "Stationery and office materials",
  //   },
  // ]);

  const [showForm, setShowForm] = useState(false);
  const [deleteModel, setDeleteModel] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const {
    expenses,
    getAllExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpenseStats,
  } = useAdminStore();

  const [expenseStates, setExpenseStates] = useState({
    data: [],
    page: 1,
    limit: 10,
    totalPages: 0,
    totalExpense: 0,
    loading: false,
    search: "",
    category: "",
    paymentMethod: "",
    referenceId: "",
    month: "",
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      setExpenseStates((prev) => ({ ...prev, loading: true }));
      try {
        const res = await getAllExpenses({
          page: expenseStates.page,
          limit: expenseStates.limit,
          search: expenseStates.search,
          category: expenseStates.category,
          paymentMethod: expenseStates.paymentMethod,
          referenceId: expenseStates.referenceId,
          month: expenseStates.month,
        });

        setExpenseStates((prev) => ({
          ...prev,
          totalPages: res.totalPages,
          totalExpense: res.total,
          loading: false,
        }));
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setExpenseStates((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchExpenses();
  }, [
    expenseStates.page,
    expenseStates.limit,
    expenseStates.search,
    expenseStates.category,
    expenseStates.paymentMethod,
    expenseStates.referenceId,
    expenseStates.month,
  ]);

  const [expenseStatsStates, setExpenseStatsStates] = useState({
    totalExpenses: 0,
    totalGST: 0,
    grandTotal: 0,
    totalEntries: 0,
  });
  const [monthlyFilterForStats, setMonthlyFilterForStats] = useState("");

  useEffect(() => {
    const fetchExpenseStats = async () => {
      try {
        const res = await getExpenseStats({
          month: monthlyFilterForStats,
        });

        setExpenseStatsStates({
          totalExpenses: res.totalExpenses,
          totalGST: res.totalGST,
          grandTotal: res.grandTotal,
          totalEntries: res.totalEntries,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchExpenseStats();
  }, [monthlyFilterForStats]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    entryDate: new Date().toISOString().split("T")[0],
    category: "Office",
    amount: "",
    gstPercent: 18,
    gstAmount: 0,
    total: 0,
    paymentMethod: "UPI",
    referenceId: "",
    vendor: "",
    receipt: null,
    notes: "",
  });

  const fileInputRef = useRef();

  // Calculate GST Amount
  const handleAmountChange = (value) => {
    const amount = Number.parseFloat(value) || 0;
    const gstAmount = (amount * formData.gstPercent) / 100;
    const total = amount + gstAmount;

    setFormData({
      ...formData,
      amount,
      gstAmount: Number.parseFloat(gstAmount.toFixed(2)),
      total: Number.parseFloat(total.toFixed(2)),
    });
  };

  // Handle GST Percent Change
  const handleGstPercentChange = (value) => {
    const gstPercent = Number.parseFloat(value) || 0;
    const gstAmount = (formData.amount * gstPercent) / 100;
    const total = formData.amount + gstAmount;

    setFormData({
      ...formData,
      gstPercent,
      gstAmount: Number.parseFloat(gstAmount.toFixed(2)),
      total: Number.parseFloat(total.toFixed(2)),
    });
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // ---- CREATE FORMDATA ----
    const fd = new FormData();
    fd.append("date", formData.date);
    fd.append("entryDate", formData.entryDate);
    fd.append("category", formData.category);
    fd.append("amount", formData.amount);
    fd.append("gstPercent", formData.gstPercent);
    fd.append("gstAmount", formData.gstAmount);
    fd.append("total", formData.total);
    fd.append("paymentMethod", formData.paymentMethod);
    fd.append("referenceId", formData.referenceId);
    fd.append("vendor", formData.vendor);
    fd.append("notes", formData.notes);

    // ---- HANDLE FILE ONLY IF SELECTED ----
    if (formData.receipt instanceof File) {
      fd.append("receipt", formData.receipt);
    }
    try {
      // ---- UPDATE OR CREATE ----
      if (editingId) {
        await updateExpense(editingId, fd); // (PUT)
      } else {
        await createExpense(fd); // (POST)
      }

      setSubmitting(false);
      setEditingId(null);

      // ---- RESET FORM ----
      setFormData({
        date: new Date().toISOString().split("T")[0],
        entryDate: new Date().toISOString().split("T")[0],
        category: "Office",
        amount: "",
        gstPercent: 18,
        gstAmount: 0,
        total: 0,
        paymentMethod: "UPI",
        referenceId: "",
        vendor: "",
        receipt: null,
        notes: "",
      });

      setShowForm(false);
    } catch (error) {}
  };

  // Edit Expense
  const handleEdit = (expense) => {
    setFormData({
      ...expense,
      date: expense.date ? expense.date.split("T")[0] : "",
      entryDate: expense.entryDate ? expense.entryDate.split("T")[0] : "",
      receipt: null, // keep file null for edit (UI safe)
    });

    setEditingId(expense._id);
    setShowForm(true);
  };

  // Delete Expense
  const handleDelete = (id) => {
    setDeleteModel(true);
    setDeleteId(id);
  };

  const handleDeleteSubmit = async () => {
    if (!deleteId) return; // safety check
    setSubmitting(true);
    try {
      await deleteExpense(deleteId);

      setDeleteModel(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting Expense:", error);
      // Optionally show a toast or alert
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Receipt Upload
  const handleReceiptUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        receipt: file, // directly store the file
      });
    }
  };

  // Cancel Edit
  const handleCancel = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      entryDate: new Date().toISOString().split("T")[0],
      category: "Office",
      amount: "",
      gstPercent: 18,
      gstAmount: 0,
      total: 0,
      paymentMethod: "UPI",
      referenceId: "",
      vendor: "",
      receipt: null,
      notes: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Download PDF Report
  const downloadPDF = async () => {
    const { expenses } = await getAllExpenses({
      page: 1,
      limit: 99999,
      month: monthlyFilterForStats,
      forPdf: true,
    });

    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalGst = expenses.reduce((sum, exp) => sum + exp.gstAmount, 0);
    const totalWithGst = expenses.reduce((sum, exp) => sum + exp.total, 0);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 5px 0; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background-color: #f0f0f0; padding: 10px; text-align: left; font-weight: bold; border: 1px solid #ddd; }
          td { padding: 10px; border: 1px solid #ddd; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .summary { margin-top: 20px; font-size: 14px; }
          .summary-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd; }
          .summary-row.total { font-weight: bold; font-size: 16px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Expense Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <table>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Vendor</th>
            <th>Amount</th>
            <th>GST %</th>
            <th>GST</th>
            <th>Total</th>
            <th>Payment Method</th>
            <th>Reference ID</th>
          </tr>
          ${expenses
            .map(
              (exp) => `
            <tr>
              <td>${new Date(exp.date).toLocaleDateString()}</td>
              <td>${exp.category}</td>
              <td>${exp.vendor}</td>
              <td>₹${exp.amount.toFixed(2)}</td>
              <td>${exp.gstPercent}%</td>
              <td>₹${exp.gstAmount.toFixed(2)}</td>
              <td>₹${exp.total.toFixed(2)}</td>
              <td>${exp.paymentMethod}</td>
              <td>${exp.referenceId}</td>
            </tr>
          `
            )
            .join("")}
        </table>

        <div class="summary">
          <div class="summary-row">
            <span>Total Amount:</span>
            <span>₹${totalAmount.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Total GST:</span>
            <span>₹${totalGst.toFixed(2)}</span>
          </div>
          <div class="summary-row total">
            <span>Grand Total:</span>
            <span>₹${totalWithGst.toFixed(2)}</span>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "", "width=900,height=600");
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleFilterChange = (key, value) => {
    setExpenseStates((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // always reset page on filter change
    }));
  };

  return (
    <div className="min-h-screen ">
      <div className="">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">
              Expenses
            </h1>
            <p className="text-slate-600">
              Manage and track all business expenses
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-[#00aeef] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              New Expense
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <Download size={20} />
              Download PDF
            </button>
          </div>
        </div>
        <input
          type="month"
          name="monthlyFilterForStats"
          value={monthlyFilterForStats}
          onChange={(e) => setMonthlyFilterForStats(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <p className="text-slate-600 text-sm font-medium mb-1">
              Total Expenses
            </p>
            <p className="text-xl font-semibold text-slate-900">
              ₹{expenseStatsStates.totalExpenses?.toFixed(2) || 0.0}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <p className="text-slate-600 text-sm font-medium mb-1">Total GST</p>
            <p className="text-xl font-semibold text-blue-600">
              ₹{expenseStatsStates.totalGST?.toFixed(2) || 0.0}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <p className="text-slate-600 text-sm font-medium mb-1">
              Grand Total
            </p>
            <p className="text-xl font-semibold text-slate-900">
              ₹{expenseStatsStates.grandTotal?.toFixed(2) || 0.0}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <p className="text-slate-600 text-sm font-medium mb-1">
              Total Entries
            </p>
            <p className="text-xl font-semibold text-slate-900">
              {expenseStatsStates.totalEntries || 0}
            </p>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex justify-center items-center">
            <div className="fixed inset-0 bg-black/40" />
            <div className="lg:h-150 md:h-100 md:w-300 h-130 w-full md:p-10 p-3 m-4 overflow-hidden  justify-center items-center z-30   bg-white shadow-2xl overflow-y-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {editingId ? "Edit Expense" : "Add New Expense"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      Expense Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      Entry Date *
                    </label>
                    <input
                      type="date"
                      value={formData.entryDate}
                      onChange={(e) =>
                        setFormData({ ...formData, entryDate: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Category and Payment Method */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      Payment Method *
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {PAYMENT_METHODS.map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Vendor and Reference ID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      Vendor / Payee Name *
                    </label>
                    <input
                      type="text"
                      value={formData.vendor}
                      onChange={(e) =>
                        setFormData({ ...formData, vendor: e.target.value })
                      }
                      placeholder="Enter vendor name"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      Reference / Transaction ID
                    </label>
                    <input
                      type="text"
                      value={formData.referenceId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          referenceId: e.target.value,
                        })
                      }
                      placeholder="TXN-XXXXX"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Amount and GST */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      Expense Amount *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      GST % *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.gstPercent}
                      onChange={(e) => handleGstPercentChange(e.target.value)}
                      placeholder="18"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      GST Amount
                    </label>
                    <input
                      type="text"
                      value={formData.gstAmount.toFixed(2)}
                      disabled
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      Total
                    </label>
                    <input
                      type="text"
                      value={formData.total.toFixed(2)}
                      disabled
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-700 font-bold"
                    />
                  </div>
                </div>

                {/* Receipt Upload */}
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    Bill / Receipt Upload
                  </label>
                  <div
                    className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                    <p className="text-slate-600">
                      {formData.receipt
                        ? `File: ${formData.receipt.name}`
                        : "Click to upload PDF or image"}
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleReceiptUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    Notes / Description
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Add any notes or description"
                    rows="3"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleCancel}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={submitting}
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    {submitting
                      ? "Saving..."
                      : editingId
                      ? "Update Expense"
                      : "Add Expense"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deleteModel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white w-[90%] max-w-sm p-6 rounded-md shadow-xl">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h1 className="font-semibold text-lg">Delete Expense</h1>
                <button
                  disabled={submitting}
                  onClick={() => {
                    setDeleteModel(false);
                    setDeleteId(null);
                  }}
                  className="cursor-pointer"
                >
                  <X className="text-red-600" />
                </button>
              </div>

              {/* Warning Text */}
              <p className="text-gray-700 text-sm leading-relaxed">
                Are you sure you want to delete this expense?
                <br />
                <span className="font-medium text-red-600">
                  This action cannot be undone.
                </span>
              </p>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  disabled={submitting}
                  type="button"
                  className="border border-red-400 hover:bg-red-500 hover:text-white transition-all px-4 py-2 rounded text-sm"
                  onClick={() => {
                    setDeleteModel(false);
                    setDeleteId(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  disabled={submitting}
                  onClick={handleDeleteSubmit}
                  className="bg-[#00aeef] px-4 py-2 text-white rounded text-sm hover:opacity-90 transition-all"
                >
                  {submitting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search
              size={20}
              className="absolute left-3 top-3 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by vendor name or reference Id..."
              value={expenseStates.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={expenseStates.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={expenseStates.paymentMethod}
            onChange={(e) =>
              handleFilterChange("paymentMethod", e.target.value)
            }
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Payment Method</option>
            {PAYMENT_METHODS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <input
            type="month"
            name="month"
            value={expenseStates.month}
            onChange={(e) => handleFilterChange("month", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    GST
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {expenses.length > 0 ? (
                  expenses.map((expense) => (
                    <tr
                      key={expense._id}
                      className="border-b border-slate-200 hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-slate-900">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            CATEGORY_COLORS[expense.category] ||
                            CATEGORY_COLORS.Other
                          }`}
                        >
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">
                        {expense.vendor}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                        ₹{expense.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        ₹{expense.gstAmount.toFixed(2)} ({expense.gstPercent}%)
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-bold">
                        ₹{expense.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {expense.paymentMethod}
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Edit"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle size={24} />
                        <p>No expenses found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
