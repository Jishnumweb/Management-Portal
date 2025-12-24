"use client";

import { Edit3, Eye, Plus, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import useAdminStore from "@/stores/useAdminStore";

export default function ProductPage() {
  const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllServices,
    createService,
    updateService,
    deleteService,
    products,
    services,
  } = useAdminStore();
  const [activeTab, setActiveTab] = useState("product"); // category | subcategory
  // const [productModel, setProductModel] = useState(false);
  // const [subProductModel, setSubProductModel] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const emptyFormForProduct = {
    name: "",
  };

  const emptyFormForService = {
    name: "",
    product: "",
  };

  const [productForm, setProductForm] = useState(emptyFormForProduct);
  const [serviceForm, setServiceForm] = useState(emptyFormForService);
  const [productErrors, setProductErrors] = useState({});
  const [serviceErrors, setServiceErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setFetching(true);
      await getAllProducts();

      await getAllServices();
      setFetching(false);
    };
    load();
  }, []);

  const validateProduct = (data) => {
    const errs = {};

    if (!data.name?.trim()) errs.name = "Prouct name is required";
    return errs;
  };

  const validateService = (data) => {
    const errs = {};

    if (!data.name?.trim()) errs.name = "Service name is required";
    if (!data.product?.trim()) errs.name = "Product name is required";
    return errs;
  };

  // OPEN MODALS
  const openAdd = () => {
    if (activeTab === "product") {
      setProductForm(emptyFormForProduct);
      setProductErrors({});
    }
    if (activeTab === "service") {
      setServiceForm(emptyFormForService);
      setServiceErrors({});
    }

    setEditingId(null);
    setIsAddOpen(true);
  };

  const openEdit = (item) => {
    if (activeTab === "product") {
      setProductForm(item);
      setProductErrors({});
    }
    if (activeTab === "service") {
      setServiceForm({
        name: item.name,
        product: item.product?._id,
      });
      setServiceErrors({});
    }

    setEditingId(item._id);
    setIsEditOpen(true);
  };

  const openDelete = (id) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  // INPUT CHANGE
  const handleInputChangeForProduct = (e) => {
    const { id, value } = e.target;
    setProductForm((f) => ({ ...f, [id]: value }));
  };

  const handleInputChangeForService = (e) => {
    const { id, value } = e.target;
    setServiceForm((f) => ({ ...f, [id]: value }));
  };

  // SAVE FORM (ADD / EDIT via Zustand) with multipart/form-data
  const saveFormForProduct = async () => {
    const validation = validateProduct(productForm);
    setProductErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);

    try {
      if (editingId) {
        // EDIT MODE
        await updateProduct(editingId, productForm);

        setIsEditOpen(false);
      } else {
        // ADD MODE
        await createProduct(productForm);

        setIsAddOpen(false);
      }

      // Reset form & errors
      setProductForm(emptyFormForProduct);
      setProductErrors({});
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const saveFormForService = async () => {
    const validation = validateProduct(serviceForm);
    setServiceErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);

    try {
      if (editingId) {
        // EDIT MODE
        await updateService(editingId, serviceForm);

        setIsEditOpen(false);
      } else {
        // ADD MODE
        await createService(serviceForm);

        setIsAddOpen(false);
      }

      // Reset form & errors
      setServiceForm(emptyFormForService);
      setServiceErrors({});
    } catch (error) {
      console.error("Error saving Service:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE ITEM
  const handleDeleteForProduct = async () => {
    if (!deletingId) return; // safety check
    setSubmitting(true);
    try {
      await deleteProduct(deletingId);

      // Close modal and reset
      setIsDeleteOpen(false);
      setDeletingId(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      // Optionally show a toast or alert
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE ITEM
  const handleDeleteForService = async () => {
    if (!deletingId) return; // safety check
    setSubmitting(true);
    try {
      console.log(deletingId);
      await deleteService(deletingId);

      // Close modal and reset
      setIsDeleteOpen(false);
      setDeletingId(null);
    } catch (error) {
      console.error("Error deleting service:", error);
      // Optionally show a toast or alert
    } finally {
      setSubmitting(false);
    }
  };
  console.log(services);

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex w-full justify-between items-center mb-6 p-3">
        <h1 className="text-2xl font-semibold text-black poppins">
          Product Management
        </h1>

        {activeTab === "product" ? (
          <button
            className="p-3 rounded-[4px] text-sm bg-[#00aeef] text-white flex gap-2 items-center hover:bg-[#039bd0]"
            onClick={openAdd}
          >
            <Plus size={20} /> Add Product Category
          </button>
        ) : (
          <button
            className="p-3 rounded-[4px] text-sm bg-[#00aeef] text-white flex gap-2 items-center hover:bg-[#039bd0]"
            onClick={openAdd}
          >
            <Plus size={20} /> Add Sub Product Category
          </button>
        )}
      </div>

      {/* ---------- TABS ---------- */}
      <div className="flex gap-6 border-b mb-6 m-2">
        <button
          className={`pb-3 text-sm font-medium ${
            activeTab === "product"
              ? "border-b-2 border-[#00aeef] text-[#00aeef]"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("product")}
        >
          Product Category
        </button>

        <button
          className={`pb-3 text-sm font-medium ${
            activeTab === "service"
              ? "border-b-2 border-[#00aeef] text-[#00aeef]"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("service")}
        >
          Sub Product Category
        </button>
      </div>

      {/* ---------- CATEGORY TABLE ---------- */}
      {activeTab === "product" && (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm m-2">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Product Name</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            {products.map((p, idx) => (
              <tbody key={idx}>
                <tr className="border-t hover:bg-gray-50 text-center">
                  <td className="px-6 py-4 font-medium">{idx + 1}</td>
                  <td className="px-6 py-4 cursor-pointer">{p.name}</td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => openDelete(p._id)}
                      className="p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      )}

      {/* ---------- SUB CATEGORY TABLE ---------- */}
      {activeTab === "service" && (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm m-2">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Sub Product Category</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            {services.map((s, idx) => (
              <tbody>
                <tr className="border-t hover:bg-gray-50 text-center">
                  <td className="px-6 py-4 font-medium">{idx + 1}</td>
                  <td className="px-6 py-4 cursor-pointer">{s.name}</td>
                  <td className="px-6 py-4">{s.product?.name}</td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button
                      onClick={() => openEdit(s)}
                      className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => openDelete(s._id)}
                      className="p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {isAddOpen && activeTab === "product" && (
        <Modal
          title="Add Product Category"
          onClose={() => {
            setIsAddOpen(false);
            setProductForm(emptyFormForProduct);
            setProductErrors({});
          }}
        >
          <Input
            onChange={handleInputChangeForProduct}
            error={productErrors.name}
            value={productForm.name}
            type="text"
            label="Product Name"
            name="name"
            placeholder="Enter product"
          />
          <Buttons
            onCancel={() => {
              setIsAddOpen(false);
              setProductForm(emptyFormForProduct);
              setProductErrors({});
            }}
            onSubmit={saveFormForProduct}
            submitting={submitting}
          />
        </Modal>
      )}

      {isEditOpen && activeTab === "product" && (
        <Modal
          title="Edit Product Category"
          onClose={() => {
            setIsEditOpen(false);
            setEditingId(null);
            setProductForm(emptyFormForProduct);
            setProductErrors({});
          }}
        >
          <Input
            onChange={handleInputChangeForProduct}
            error={productErrors.name}
            value={productForm.name}
            type="text"
            label="Product Name"
            name="name"
            placeholder="Enter product"
          />
          <Buttons
            onCancel={() => {
              setIsEditOpen(false);
              setEditingId(null);
              setProductForm(emptyFormForProduct);
              setProductErrors({});
            }}
            onSubmit={saveFormForProduct}
            submitting={submitting}
          />
        </Modal>
      )}

      {isDeleteOpen && activeTab === "product" && (
        <Modal
          title="Delete Product Category"
          onClose={() => {
            setIsDeleteOpen(false);
            setDeletingId(null);
          }}
        >
          <p className="text-gray-700 text-sm leading-relaxed">
            Are you sure you want to delete this Product category?
            <br />
            <span className="font-medium text-red-600">
              This action cannot be undone.
            </span>
          </p>
          <Buttons
            onCancel={() => {
              setIsDeleteOpen(false);
              setDeletingId(null);
            }}
            onSubmit={handleDeleteForProduct}
            submitting={submitting}
            buttonContent="Delete"
          />
        </Modal>
      )}

      {/* SUB CATEGORY MODAL */}
      {isAddOpen && activeTab === "service" && (
        <Modal
          title="Add Sub Product Category"
          onClose={() => {
            setIsAddOpen(false);
            setServiceForm(emptyFormForService);
            setServiceErrors({});
          }}
        >
          <Input
            onChange={handleInputChangeForService}
            error={serviceErrors.name}
            value={serviceForm.name}
            type="text"
            label="Sub Product Name"
            name="name"
            placeholder="Enter name"
          />
          <div>
            <select
              value={serviceForm.product}
              name="product"
              id="product"
              onChange={handleInputChangeForService}
              className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <Buttons
            onCancel={() => {
              setIsAddOpen(false);
              setProductForm(emptyFormForProduct);
              setProductErrors({});
            }}
            onSubmit={saveFormForService}
          />
        </Modal>
      )}

      {isEditOpen && activeTab === "service" && (
        <Modal
          title="Edit Sub Product Category"
          onClose={() => {
            setIsEditOpen(false);
            setEditingId(null);
            setServiceForm(emptyFormForService);
            setServiceErrors({});
          }}
        >
          <Input
            onChange={handleInputChangeForService}
            error={serviceErrors.name}
            value={serviceForm.name}
            type="text"
            label="Sub Product Name"
            name="name"
            placeholder="Enter name"
          />
          <div>
            <select
              value={serviceForm.product}
              name="product"
              id="product"
              onChange={handleInputChangeForService}
              className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <Buttons
            onCancel={() => {
              setIsEditOpen(false);
              setEditingId(null);
              setProductForm(emptyFormForProduct);
              setProductErrors({});
            }}
            onSubmit={saveFormForService}
            submitting={submitting}
          />
        </Modal>
      )}

      {isDeleteOpen && activeTab === "service" && (
        <Modal
          title="Delete Sub Product Category"
          onClose={() => {
            setIsDeleteOpen(false);
            setDeletingId(null);
          }}
        >
          <p className="text-gray-700 text-sm leading-relaxed">
            Are you sure you want to delete this Sub product category?
            <br />
            <span className="font-medium text-red-600">
              This action cannot be undone.
            </span>
          </p>
          <Buttons
            onCancel={() => {
              setIsDeleteOpen(false);
              setDeletingId(null);
            }}
            onSubmit={handleDeleteForService}
            submitting={submitting}
            buttonContent="Delete"
          />
        </Modal>
      )}
    </div>
  );
}

/* ---------------- REUSABLE COMPONENTS ---------------- */

function Modal({ title, children, onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose}></div>

      <div className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2">
        <div className="bg-white rounded-md shadow-xl p-6 animate-[zoomIn_0.3s_ease]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <X size={22} />
            </button>
          </div>

          {children}
        </div>
      </div>
    </>
  );
}

function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder = " ",
  error,
}) {
  return (
    <div className="relative w-full mb-5">
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder} // important: must be " "
        className={`peer p-4 w-full rounded-sm bg-white outline-none 
          ${
            error
              ? "border border-red-500"
              : "border border-[#afa9a959] focus:border-[#00aeef]"
          }
        `}
      />

      <label
        htmlFor={name}
        className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
          peer-placeholder-shown:top-4 
          peer-placeholder-shown:text-base
          peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
          peer-[&:not(:placeholder-shown)]:-top-2 
          peer-[&:not(:placeholder-shown)]:text-xs"
      >
        {label}
      </label>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function Buttons({ onCancel, onSubmit, submitting, buttonContent = "Save" }) {
  return (
    <div className="flex justify-end gap-3 mt-4">
      <button
        disabled={submitting}
        className="px-4 py-2 border text-gray-600 hover:bg-gray-100"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        disabled={submitting}
        onClick={onSubmit}
        className="px-4 py-2 bg-[#00aeef] text-white hover:bg-[#029cd3]"
      >
        {submitting
          ? buttonContent === "Save"
            ? "Saving..."
            : "Deleting..."
          : buttonContent}
      </button>
    </div>
  );
}
