"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Download,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import useAdminStore from "@/stores/useAdminStore";

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const CATEGORIES = [
  "Electronics",
  "Furniture",
  "Accessories",
  "Software",
  "Supplies",
  "Other",
];
const UNITS = ["pcs", "box", "kg", "month", "license"];

export default function InventoryPage() {
  const {
    inventories,
    getAllInventories,
    createInventory,
    updateInventory,
    deleteInventory,
  } = useAdminStore();

  const [inventoryStates, setInventoryStates] = useState({
    page: 1,
    limit: 20,
    totalPages: 0,
    totalInventories: 0,
    stats: {
      inStock: 0,
      outOfStock: 0,
      lowStock: 0,
    },
    loading: false,
    searchTerm: "",
    categoryFilter: "",
    statusFilter: "",
    sortBy: "name",
    sortDir: "asc",
  });

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [showStockMovementModal, setShowStockMovementModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [movementType, setMovementType] = useState("IN"); // IN or OUT
  const [movementQty, setMovementQty] = useState("");
  const [movementNotes, setMovementNotes] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    brand: "",
    quantity: "",
    minQty: "",
    purchasePrice: "",
    unit: "pcs",
    location: "",
    supplier: "",
    purchaseDate: "",
    warrantyDate: "",
    notes: "",
  });

  // Calculate status based on quantity
  const getStatus = (quantity, minQty) => {
    if (quantity === 0) return "out of stock";
    if (quantity < minQty) return "low stock";
    return "in stock";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "in stock":
        return "bg-green-100 text-green-800";
      case "low stock":
        return "bg-yellow-100 text-yellow-800";
      case "out of stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const res = await getAllInventories({
          page: inventoryStates.page,
          limit: inventoryStates.limit,
          search: inventoryStates.searchTerm,
          category: inventoryStates.categoryFilter,
          status: inventoryStates.statusFilter,
          sortBy: inventoryStates.sortBy,
          sortDir: inventoryStates.sortDir,
        });

        setInventoryStates((prev) => ({
          ...prev,
          totalPages: res.totalPages,
          totalInventories: res.total,
          stats: {
            inStock: res.stats?.inStock || 0,
            outOfStock: res.stats?.outOfStock || 0,
            lowStock: res.stats?.lowStock || 0,
          },
          loading: false,
        }));
      } catch (error) {
        console.error("Error fetching inventories:", error);
        setInventoryStates((prev) => ({ ...prev, loading: false }));
      }
    };

    // ONLY set loading ONCE
    setInventoryStates((prev) => ({ ...prev, loading: true }));
    fetchInventories();
  }, [
    inventoryStates.page,
    inventoryStates.limit,
    inventoryStates.searchTerm,
    inventoryStates.categoryFilter,
    inventoryStates.statusFilter,
    inventoryStates.sortBy,
    inventoryStates.sortDir,
  ]);

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      category: "",
      brand: "",
      quantity: "",
      minQty: "",
      purchasePrice: "",
      unit: "pcs",
      location: "",
      supplier: "",
      purchaseDate: "",
      warrantyDate: "",
      serialNumber: "",
      notes: "",
    });
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  const handleAddClick = () => {
    setIsEditing(false);
    setEditingId(null);
    resetForm();
    setShowAddModal(true);
  };

  const handleEditClick = (item) => {
    const formatDate = (date) =>
      date ? new Date(date).toISOString().split("T")[0] : "";

    const formattedHistory =
      item.stockHistory?.map((entry) => ({
        ...entry,
        date: formatDate(entry.date),
      })) ?? [];

    setIsEditing(true);
    setEditingId(item._id);

    setFormData({
      name: item.name ?? "",
      sku: item.sku ?? "",
      category: item.category ?? "",
      brand: item.brand ?? "",
      quantity: item.quantity ?? 0,
      minQty: item.minQty ?? 0,
      purchasePrice: item.purchasePrice ?? 0,
      unit: item.unit ?? "pcs",
      location: item.location ?? "",
      supplier: item.supplier ?? "",
      purchaseDate: formatDate(item.purchaseDate),
      warrantyDate: formatDate(item.warrantyDate),
      serialNumber: item.serialNumber ?? "",
      notes: item.notes ?? "",
      status: item.status ?? "in stock",

      // 👇 Add formatted stock history
      stockHistory: formattedHistory,
    });

    setShowAddModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setShowDeleteModel(true);
  };

  const handleSaveItem = async () => {
    if (!formData.name) {
      alert("Please fill in required field name");
      return;
    }

    if (isEditing) {
      // setItems(
      //   items.map((item) =>
      //     item.id === editingId
      //       ? {
      //           ...item,
      //           ...formData,
      //           quantity: Number.parseInt(formData.quantity),
      //           minQty: Number.parseInt(formData.minQty),
      //           purchasePrice: Number.parseFloat(formData.purchasePrice),
      //           sellingPrice: Number.parseFloat(formData.sellingPrice),
      //           tags: formData.tags.split(",").map((t) => t.trim()),
      //           status: getStatus(
      //             Number.parseInt(formData.quantity),
      //             Number.parseInt(formData.minQty)
      //           ),
      //         }
      //       : item
      //   )
      // );
      try {
        setSubmitting(true);

        await updateInventory(editingId, {
          ...formData,
          quantity: Number.parseInt(formData.quantity),
          minQty: Number.parseInt(formData.minQty),
          purchasePrice: Number.parseFloat(formData.purchasePrice),
          status: getStatus(
            Number.parseInt(formData.quantity),
            Number.parseInt(formData.minQty)
          ),
        });

        setShowAddModal(false);
        resetForm();
      } catch (error) {
        console.log(error);
      } finally {
        setSubmitting(false);
      }
    } else {
      // const newItem = {
      //   id: Math.max(...items.map((i) => i.id), 0) + 1,
      //   ...formData,
      //   quantity: Number.parseInt(formData.quantity),
      //   minQty: Number.parseInt(formData.minQty),
      //   purchasePrice: Number.parseFloat(formData.purchasePrice),
      //   sellingPrice: Number.parseFloat(formData.sellingPrice),
      //   tags: formData.tags
      //     .split(",")
      //     .map((t) => t.trim())
      //     .filter((t) => t),
      //   status: getStatus(
      //     Number.parseInt(formData.quantity),
      //     Number.parseInt(formData.minQty)
      //   ),
      //   stockHistory: [
      //     {
      //       id: 1,
      //       type: "IN",
      //       quantity: Number.parseInt(formData.quantity),
      //       date: new Date().toISOString().split("T")[0],
      //       notes: "Initial stock",
      //     },
      //   ],
      // };
      // setItems([...items, newItem]);
      try {
        setSubmitting(true);
        await createInventory({
          ...formData,
          quantity: Number.parseInt(formData.quantity),
          minQty: Number.parseInt(formData.minQty),
          purchasePrice: Number.parseFloat(formData.purchasePrice),
          status: getStatus(
            Number.parseInt(formData.quantity),
            Number.parseInt(formData.minQty)
          ),
          stockHistory: [
            {
              type: "IN",
              quantity: Number.parseInt(formData.quantity),
              date: new Date().toISOString().split("T")[0],
              notes: "Initial stock",
            },
          ],
        });
        setShowAddModal(false);
        resetForm();
      } catch (error) {
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleDeleteItem = async () => {
    if (!deletingId) return;
    setSubmitting(true);
    await deleteInventory(deletingId);
    setSubmitting(false);

    setDeletingId(null);
    setShowDeleteModel(false);
  };

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleStockMovement = async () => {
    if (!movementQty || !selectedItem) {
      alert("Please enter a quantity");
      return;
    }

    const qty = Number.parseInt(movementQty);
    const newQuantity =
      movementType === "IN"
        ? selectedItem.quantity + qty
        : Math.max(0, selectedItem.quantity - qty);

    const updatedItem = {
      ...selectedItem,
      quantity: newQuantity,
      status: getStatus(newQuantity, selectedItem.minQty),
      stockHistory: [
        ...selectedItem.stockHistory,
        {
          type: movementType,
          quantity: qty,
          date: new Date().toISOString().split("T")[0],
          notes: movementNotes,
        },
      ],
    };
    try {
      setSubmitting(true);
      await updateInventory(selectedItem._id, updatedItem);

      setSelectedItem(updatedItem);
      setMovementQty("");
      setMovementNotes("");
      setMovementType("IN");
      setShowStockMovementModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  // const handleExportExcel = () =>
  //   const headers = [
  //     "Item Name",
  //     "SKU",
  //     "Category",
  //     "Quantity",
  //     "Min Qty",
  //     "Status",
  //     "Location",
  //     "Selling Price",
  //   ];
  //   const rows = sortedItems.map((item) => [
  //     item.name,
  //     item.sku,
  //     item.category,
  //     item.quantity,
  //     item.minQty,
  //     item.status,
  //     item.location,
  //     item.sellingPrice,
  //   ]);

  //   let csv = headers.join(",") + "\n";
  //   rows.forEach((row) => {
  //     csv += row.map((cell) => `"${cell}"`).join(",") + "\n";
  //   });

  //   const blob = new Blob([csv], { type: "text/csv" });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = `inventory_${new Date().toISOString().split("T")[0]}.csv`;
  //   a.click();
  // };

  // const handleImportCSV = (e) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = (event) => {
  //     try {
  //       const csv = event.target?.result;
  //       const lines = csv.split("\n").slice(1); // Skip header
  //       const newItems = lines
  //         .filter((line) => line.trim())
  //         .map((line, idx) => {
  //           const cols = line.split(",").map((c) => c.replace(/"/g, ""));
  //           return {
  //             id: Math.max(...items.map((i) => i.id), 0) + idx + 1,
  //             name: cols[0],
  //             sku: cols[1],
  //             category: cols[2],
  //             quantity: Number.parseInt(cols[3]),
  //             minQty: Number.parseInt(cols[4]),
  //             status: cols[5],
  //             location: cols[6],
  //             purchasePrice: 0,
  //             sellingPrice: Number.parseFloat(cols[7]),
  //             unit: "pcs",
  //             brand: "",
  //             supplier: "",
  //             purchaseDate: "",
  //             warrantyDate: "",
  //             serialNumber: "",
  //             tags: [],
  //             notes: "",
  //             stockHistory: [],
  //           };
  //         });
  //       setItems([...items, ...newItems]);
  //       alert(`Successfully imported ${newItems.length} items`);
  //     } catch (error) {
  //       alert("Error importing CSV: " + error.message);
  //     }
  //   };
  //   reader.readAsText(file);
  // };

  const handleFilterChange = (key, value) => {
    setInventoryStates((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // always reset page on filter change
    }));
  };

  const handleSort = (field) => {
    setInventoryStates((prev) => ({
      ...prev,
      sortBy: prev.sortBy === field ? prev.sortBy : field,
      sortDir:
        prev.sortBy === field
          ? prev.sortDir === "asc"
            ? "desc"
            : "asc"
          : "asc",
      page: 1, // optional: reset page when sorting
    }));
  };

  return (
    <div className="min-h-screen 8">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Inventory Management
          </h1>
          <p className="text-gray-600">
            Manage your inventory, track stock levels, and monitor item details
          </p>
        </div>

        {/* Top Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by item name or SKU..."
                value={inventoryStates.searchTerm}
                onChange={(e) => {
                  handleFilterChange("searchTerm", e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddClick}
                className="bg-[#00aeef] text-white px-4 py-2 rounded-lg hover:bg-[#077fab] flex items-center gap-2"
              >
                <Plus size={18} /> Add Item
              </button>
              {/* <button
                onClick={handleExportExcel}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Download size={18} /> Export
              </button>
              <label className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 cursor-pointer">
                <Upload size={18} /> Import
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportCSV}
                  className="hidden"
                />
              </label> */}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Category
              </label>
              <select
                value={inventoryStates.categoryFilter}
                onChange={(e) => {
                  handleFilterChange("categoryFilter", e.target.value);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Status
              </label>
              <select
                value={inventoryStates.statusFilter}
                onChange={(e) => {
                  handleFilterChange("statusFilter", e.target.value);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="in stock">In Stock</option>
                <option value="low stock">Low Stock</option>
                <option value="out of stock">Out of Stock</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Sort By
              </label>
              <select
                value={inventoryStates.sortBy}
                onChange={(e) => {
                  handleFilterChange("sortBy", e.target.value);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="sku">SKU</option>
                <option value="quantity">Quantity</option>
                <option value="category">Category</option>
                <option value="purchasePrice">Price</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-600">
            <p className="text-gray-600 text-sm">Total Items</p>
            <p className="text-2xl font-bold text-gray-900">
              {inventoryStates.totalInventories}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-600">
            <p className="text-gray-600 text-sm">In Stock</p>
            <p className="text-2xl font-bold text-gray-900">
              {inventoryStates.stats.inStock}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-600">
            <p className="text-gray-600 text-sm">Low Stock</p>
            <p className="text-2xl font-bold text-gray-900">
              {inventoryStates.stats.lowStock}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-600">
            <p className="text-gray-600 text-sm">Out of Stock</p>
            <p className="text-2xl font-bold text-gray-900">
              {inventoryStates.stats.outOfStock}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort("name")}
                      className="text-sm font-semibold text-gray-700 flex items-center gap-1"
                    >
                      Item Name{" "}
                      {inventoryStates.sortBy === "name" &&
                        (inventoryStates.sortDir === "asc" ? "↑" : "↓")}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort("sku")}
                      className="text-sm font-semibold text-gray-700 flex items-center gap-1"
                    >
                      SKU{" "}
                      {inventoryStates.sortBy === "sku" &&
                        (inventoryStates.sortDir === "asc" ? "↑" : "↓")}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort("category")}
                      className="text-sm font-semibold text-gray-700"
                    >
                      Category{" "}
                      {inventoryStates.sortBy === "category" &&
                        (inventoryStates.sortDir === "asc" ? "↑" : "↓")}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort("quantity")}
                      className="text-sm font-semibold text-gray-700"
                    >
                      Qty{" "}
                      {inventoryStates.sortBy === "quantity" &&
                        (inventoryStates.sortDir === "asc" ? "↑" : "↓")}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">Min Qty</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Location</th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort("purchasePrice")}
                      className="text-sm font-semibold text-gray-700"
                    >
                      Price{" "}
                      {inventoryStates.sortBy === "purchasePrice" &&
                        (inventoryStates.sortDir === "asc" ? "↑" : "↓")}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventories.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No items found
                    </td>
                  </tr>
                ) : (
                  inventories.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.sku}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        <span
                          className={
                            item.quantity <= 0
                              ? "text-red-600"
                              : item.quantity < item.minQty
                              ? "text-yellow-600"
                              : "text-green-600"
                          }
                        >
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.minQty}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.location}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ₹{item.purchasePrice}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleViewItem(item)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEditClick(item)}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item._id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {inventoryStates.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              {/* Showing X to Y of Z */}
              <div className="text-sm text-gray-600">
                Showing {(inventoryStates.page - 1) * inventoryStates.limit + 1}{" "}
                to{" "}
                {Math.min(
                  inventoryStates.page * inventoryStates.limit,
                  inventoryStates.totalInventories
                )}{" "}
                of {inventoryStates.totalInventories}
              </div>

              {/* Pagination buttons */}
              <div className="flex gap-2">
                {/* Prev */}
                <button
                  onClick={() =>
                    setInventoryStates((prev) => ({
                      ...prev,
                      page: Math.max(1, prev.page - 1),
                    }))
                  }
                  disabled={inventoryStates.page === 1}
                  className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Page Numbers */}
                {[...Array(inventoryStates.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() =>
                      setInventoryStates((prev) => ({
                        ...prev,
                        page: i + 1,
                      }))
                    }
                    className={`px-3 py-1 rounded-lg ${
                      inventoryStates.page === i + 1
                        ? "bg-[#00aeef] text-white"
                        : "border hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                {/* Next */}
                <button
                  onClick={() =>
                    setInventoryStates((prev) => ({
                      ...prev,
                      page: Math.min(prev.totalPages, prev.page + 1),
                    }))
                  }
                  disabled={inventoryStates.page === inventoryStates.totalPages}
                  className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? "Edit Item" : "Add New Item"}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Item Name */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Dell Laptop"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    SKU / Product Code *
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., DL-XPS13-001"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Brand / Model
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Dell, HP"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Quantity in Stock
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                {/* Min Qty */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Minimum Stock Qty
                  </label>
                  <input
                    type="number"
                    value={formData.minQty}
                    onChange={(e) =>
                      setFormData({ ...formData, minQty: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10"
                  />
                </div>

                {/* Purchase Price */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Purchase Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.purchasePrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        purchasePrice: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {UNITS.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Location / Warehouse
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Warehouse A - Shelf 3"
                  />
                </div>

                {/* Supplier */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Supplier / Vendor
                  </label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) =>
                      setFormData({ ...formData, supplier: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Tech Distributor Inc"
                  />
                </div>

                {/* Purchase Date */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) =>
                      setFormData({ ...formData, purchaseDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Warranty Date */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Warranty / Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.warrantyDate}
                    onChange={(e) =>
                      setFormData({ ...formData, warrantyDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Serial Number */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Serial Number / IMEI (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, serialNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes about the item..."
                  rows="3"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                className="px-4 py-2 bg-[#00aeef] text-white rounded-lg hover:bg-[#0689b9]"
              >
                {isEditing ? "Update Item" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Item Modal */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Item Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Item Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Item Name</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedItem.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">SKU</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedItem.sku}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedItem.category}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Brand / Model</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedItem.brand || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Stock Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Quantity in Stock</p>
                      <p
                        className={`text-base font-bold ${
                          selectedItem.quantity === 0
                            ? "text-red-600"
                            : selectedItem.quantity < selectedItem.minQty
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {selectedItem.quantity} {selectedItem.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Minimum Stock Level
                      </p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedItem.minQty}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                          selectedItem.status
                        )}`}
                      >
                        {selectedItem.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedItem.location}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Pricing
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Purchase Price</p>
                      <p className="text-base font-medium text-gray-900">
                        ₹{selectedItem.purchasePrice}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Unit</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedItem.unit}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Supplier & Dates
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Supplier / Vendor</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedItem.supplier || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Purchase Date</p>
                      <p className="text-base font-medium text-gray-900">
                        {formatDate(selectedItem.purchaseDate) || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Warranty / Expiry</p>
                      <p className="text-base font-medium text-gray-900">
                        {formatDate(selectedItem.warrantyDate) || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Serial Number</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedItem.serialNumber || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedItem.notes && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Notes
                  </h3>
                  <p className="text-gray-600">{selectedItem.notes}</p>
                </div>
              )}

              {/* Stock History */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Stock Movement History
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-700 font-medium">
                          Date
                        </th>
                        <th className="px-4 py-2 text-left text-gray-700 font-medium">
                          Type
                        </th>
                        <th className="px-4 py-2 text-left text-gray-700 font-medium">
                          Quantity
                        </th>
                        <th className="px-4 py-2 text-left text-gray-700 font-medium">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedItem.stockHistory.map((entry, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-4 py-2 text-gray-900">
                            {formatDate(entry.date)}
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`font-semibold ${
                                entry.type === "IN"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {entry.type === "IN" ? "+ IN" : "- OUT"}
                            </span>
                          </td>
                          <td className="px-4 py-2 font-medium text-gray-900">
                            {entry.quantity}
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {entry.notes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setShowStockMovementModal(true);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Manage Stock
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditClick(selectedItem);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleDeleteClick(selectedItem._id);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Item Modal */}
      {showDeleteModel && deletingId && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-xl w-full max-h-[50vh] overflow-y-auto p-3">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Delete Item</h2>
              <button
                onClick={() => {
                  setShowDeleteModel(false);
                  setDeletingId(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              {/* Confirmation Text */}
              <p className="text-gray-700 text-center">
                Are you sure you want to delete item ? This action cannot be
                undone.
              </p>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleDeleteItem}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>

                <button
                  onClick={() => {
                    setShowDeleteModel(false);
                    setDeletingId(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock Movement Modal */}
      {showStockMovementModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Stock Movement
              </h2>
              <button
                onClick={() => setShowStockMovementModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Current Stock:{" "}
                  <span className="font-bold text-gray-900">
                    {selectedItem.quantity} {selectedItem.unit}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Item:{" "}
                  <span className="font-bold text-gray-900">
                    {selectedItem.name}
                  </span>
                </p>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Movement Type
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setMovementType("IN")}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                      movementType === "IN"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Stock In
                  </button>
                  <button
                    onClick={() => setMovementType("OUT")}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                      movementType === "OUT"
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Stock Out
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={movementQty}
                  onChange={(e) => setMovementQty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={movementNotes}
                  onChange={(e) => setMovementNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Sale #1001, Damage, Return"
                  rows="3"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowStockMovementModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStockMovement}
                className={`px-4 py-2 text-white rounded-lg ${
                  movementType === "IN"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {movementType === "IN" ? "Add Stock" : "Remove Stock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
