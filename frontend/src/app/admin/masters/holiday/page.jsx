"use client";

import { Edit3, Eye, Plus, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import useAdminStore from "@/stores/useAdminStore";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB"); // 19/11/2025
};

export default function ProductPage() {
  const {
    getAllHolidays,
    createHoliday,
    updateHoliday,
    deleteHoliday,
    getAllHolidayTypes,
    createHolidayType,
    updateHolidayType,
    deleteHolidayType,
    holidays,
    holidayTypes,
  } = useAdminStore();
  const [activeTab, setActiveTab] = useState("holiday"); // category | subcategory
  // const [productModel, setProductModel] = useState(false);
  // const [subProductModel, setSubProductModel] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const emptyFormForHoliday = {
    holidayName: "",
    date: "",
    holidayType: "",
  };

  const emptyFormForHolidayType = {
    holidayType: "",
    color: "",
  };

  const [holidayForm, setHolidayForm] = useState(emptyFormForHoliday);
  const [holidayTypeForm, setHolidayTypeForm] = useState(
    emptyFormForHolidayType
  );
  const [holidayError, setHolidayError] = useState({});
  const [holidayTypeError, setHolidayTypeError] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setFetching(true);
      await getAllHolidayTypes();

      await getAllHolidays();
      setFetching(false);
    };
    load();
  }, []);

  const validateHoliday = (data) => {
    const errs = {};

    if (!data.holidayName?.trim())
      errs.holidayName = "Holiday name is required";
    if (!data.date?.trim()) errs.date = "Date is required";
    if (!data.holidayType?.trim()) errs.holidayType = "holidayType is required";
    return errs;
  };

  const validateHolidayType = (data) => {
    const errs = {};

    if (!data.holidayType?.trim())
      errs.holidayType = "Holiday type is required";
    // if (!data.color?.trim()) errs.color = "Color is required";

    return errs;
  };

  // OPEN MODALS
  const openAdd = () => {
    if (activeTab === "holiday") {
      setHolidayForm(emptyFormForHoliday);
      setHolidayError({});
    }
    if (activeTab === "holidaytype") {
      setHolidayTypeForm(emptyFormForHolidayType);
      setHolidayTypeError({});
    }

    setEditingId(null);
    setIsAddOpen(true);
  };

  const openEdit = (item) => {
    if (activeTab === "holiday") {
      setHolidayForm({
        holidayName: item.holidayName,
        date: item.date,
        holidayType: item.holidayType?._id,
      });
      setHolidayError({});
    }
    if (activeTab === "holidaytype") {
      setHolidayTypeForm({
        holidayType: item.holidayType,
        color: item.color,
      });
      setHolidayTypeError({});
    }

    setEditingId(item._id);
    setIsEditOpen(true);
  };

  const openDelete = (id) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  // INPUT CHANGE
  const handleInputChangeForHoliday = (e) => {
    const { id, value } = e.target;
    setHolidayForm((f) => ({ ...f, [id]: value }));
  };

  const handleInputChangeForHolidayType = (e) => {
    const { id, value } = e.target;
    setHolidayTypeForm((f) => ({ ...f, [id]: value }));
  };

  // SAVE FORM (ADD / EDIT via Zustand)
  const saveFormForHoliday = async () => {
    const validation = validateHoliday(holidayForm);
    setHolidayError(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    console.log("Hello from creates");

    try {
      if (editingId) {
        // EDIT MODE
        await updateHoliday(editingId, holidayForm);

        setIsEditOpen(false);
      } else {
        // ADD MODE
        await createHoliday(holidayForm);

        setIsAddOpen(false);
      }

      // Reset form & errors
      setHolidayForm(emptyFormForHoliday);
      setHolidayError({});
    } catch (error) {
      console.error("Error saving Holiday:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const saveFormForHolidayType = async () => {
    const validation = validateHolidayType(holidayTypeForm);
    setHolidayTypeError(validation);
    if (Object.keys(validation).length > 0) return;

    console.log("Hello from type");

    setSubmitting(true);

    try {
      if (editingId) {
        // EDIT MODE
        await updateHolidayType(editingId, holidayTypeForm);

        setIsEditOpen(false);
      } else {
        // ADD MODE
        await createHolidayType(holidayTypeForm);

        setIsAddOpen(false);
      }

      // Reset form & errors
      setHolidayTypeForm(emptyFormForHolidayType);
      setHolidayTypeError({});
    } catch (error) {
      console.error("Error saving holiday type:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE ITEM
  const handleDeleteForHoliday = async () => {
    if (!deletingId) return; // safety check
    setSubmitting(true);
    try {
      await deleteHoliday(deletingId);

      // Close modal and reset
      setIsDeleteOpen(false);
      setDeletingId(null);
    } catch (error) {
      console.error("Error deleting holiday:", error);
      // Optionally show a toast or alert
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE ITEM
  const handleDeleteForHolidayType = async () => {
    if (!deletingId) return; // safety check
    setSubmitting(true);
    try {
      console.log(deletingId);
      await deleteHolidayType(deletingId);

      // Close modal and reset
      setIsDeleteOpen(false);
      setDeletingId(null);
    } catch (error) {
      console.error("Error deleting holiday type:", error);
      // Optionally show a toast or alert
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full p-3">
      {/* HEADER */}
      <div className="flex w-full justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-black poppins">Holiday</h1>

        {activeTab === "holiday" ? (
          <button
            className="p-3 rounded-[4px] text-sm bg-[#00aeef] text-white flex gap-2 items-center hover:bg-[#039bd0]"
            onClick={openAdd}
          >
            <Plus size={20} /> Add Holiday
          </button>
        ) : (
          <button
            className="p-3 rounded-[4px] text-sm bg-[#00aeef] text-white flex gap-2 items-center hover:bg-[#039bd0]"
            onClick={openAdd}
          >
            <Plus size={20} /> Add Holiday Type
          </button>
        )}
      </div>

      {/* ---------- TABS ---------- */}
      <div className="flex gap-6 border-b mb-6">
        <button
          className={`pb-3 text-sm font-medium ${
            activeTab === "holiday"
              ? "border-b-2 border-[#00aeef] text-[#00aeef]"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("holiday")}
        >
          Holiday
        </button>

        <button
          className={`pb-3 text-sm font-medium ${
            activeTab === "holidaytype"
              ? "border-b-2 border-[#00aeef] text-[#00aeef]"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("holidaytype")}
        >
          Holiday Type
        </button>
      </div>

      {/* ---------- HOLIDAY TABLE ---------- */}
      {activeTab === "holiday" && (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Holiday</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Holiday Type</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            {holidays?.map((h, idx) => (
              <tbody key={idx}>
                <tr className="border-t hover:bg-gray-50 text-center">
                  <td className="px-6 py-4 font-medium">{idx + 1}</td>
                  <td className="px-6 py-4 cursor-pointer">{h.holidayName}</td>
                  <td className="px-6 py-4 cursor-pointer">
                    {formatDate(h.date)}
                  </td>
                  <td className="px-6 py-4 cursor-pointer">
                    {h.holidayType?.holidayType}
                  </td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button
                      onClick={() => openEdit(h)}
                      className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => openDelete(h._id)}
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

      {/* ---------- HOLIDAY TYPE TABLE ---------- */}
      {activeTab === "holidaytype" && (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Holiday Type</th>
                <th className="px-6 py-3">Color</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            {holidayTypes?.map((h, idx) => (
              <tbody key={idx}>
                <tr className="border-t hover:bg-gray-50 text-center">
                  <td className="px-6 py-4 font-medium">{idx + 1}</td>
                  <td className="px-6 py-4 cursor-pointer">{h.holidayType}</td>
                  <td className="px-6 py-4">{h.color}</td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button
                      onClick={() => openEdit(h)}
                      className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => openDelete(h._id)}
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
      {isAddOpen && activeTab === "holiday" && (
        <Modal
          title="Add Holiday"
          onClose={() => {
            setIsAddOpen(false);
            setHolidayForm(emptyFormForHoliday);
            setHolidayError({});
          }}
        >
          <Input
            onChange={handleInputChangeForHoliday}
            error={holidayError.holidayName}
            value={holidayForm.holidayName}
            type="text"
            label="Holiday Name"
            name="holidayName"
            placeholder="Enter Holiday Name"
          />
          <div className="relative w-full">
            <input
              type="date"
              id="date"
              value={holidayForm.date}
              onChange={handleInputChangeForHoliday}
              placeholder=""
              className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        holidayError.date
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
            />

            <label
              htmlFor="dueDate"
              className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                      peer-placeholder-shown:top-4 
                      peer-placeholder-shown:text-base
                      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                      peer-[&:not(:placeholder-shown)]:-top-2 
                      peer-[&:not(:placeholder-shown)]:text-xs"
            >
              Date
            </label>
            {holidayError.date && (
              <p className="text-sm text-red-600 mt-1">{holidayError.date}</p>
            )}
          </div>
          <SelectInput
            label="Holiday Type"
            name="holidayType"
            value={holidayForm.holidayType}
            onChange={handleInputChangeForHoliday}
            error={holidayError.holidayType}
          >
            <option value=""></option>
            {holidayTypes.map((h) => (
              <option key={h._id} value={h._id}>
                {h.holidayType}
              </option>
            ))}
          </SelectInput>
          <Buttons
            onCancel={() => {
              setIsAddOpen(false);
              setHolidayForm(emptyFormForHoliday);
              setHolidayError({});
            }}
            onSubmit={saveFormForHoliday}
            submitting={submitting}
          />
        </Modal>
      )}

      {isEditOpen && activeTab === "holiday" && (
        <Modal
          title="Edit Holiday"
          onClose={() => {
            setIsEditOpen(false);
            setEditingId(null);
            setHolidayForm(emptyFormForHoliday);
            setHolidayError({});
          }}
        >
          <Input
            onChange={handleInputChangeForHoliday}
            error={holidayError.holidayName}
            value={holidayForm.holidayName}
            type="text"
            label="Holiday Name"
            name="name"
            placeholder="Enter Holiday"
          />
          <div className="relative w-full">
            <input
              type="date"
              id="date"
              value={holidayForm.date}
              onChange={handleInputChangeForHoliday}
              placeholder=""
              className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        holidayError.date
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
            />

            <label
              htmlFor="dueDate"
              className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                      peer-placeholder-shown:top-4 
                      peer-placeholder-shown:text-base
                      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                      peer-[&:not(:placeholder-shown)]:-top-2 
                      peer-[&:not(:placeholder-shown)]:text-xs"
            >
              Date
            </label>
            {holidayError.date && (
              <p className="text-sm text-red-600 mt-1">{holidayError.date}</p>
            )}
          </div>
          <SelectInput
            label="Holiday Type"
            name="holidayType"
            value={holidayForm.holidayType}
            onChange={handleInputChangeForHoliday}
            error={holidayError.holidayType}
          >
            <option value=""></option>
            {holidayTypes.map((h) => (
              <option key={h._id} value={h._id}>
                {h.holidayType}
              </option>
            ))}
          </SelectInput>
          <Buttons
            onCancel={() => {
              setIsEditOpen(false);
              setEditingId(null);
              setHolidayForm(emptyFormForHoliday);
              setHolidayError({});
            }}
            onSubmit={saveFormForHoliday}
            submitting={submitting}
          />
        </Modal>
      )}

      {isDeleteOpen && activeTab === "holiday" && (
        <Modal
          title="Delete Holiday"
          onClose={() => {
            setIsDeleteOpen(false);
            setDeletingId(null);
          }}
        >
          <p className="text-gray-700 text-sm leading-relaxed">
            Are you sure you want to delete this Holiday?
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
            onSubmit={handleDeleteForHoliday}
            submitting={submitting}
            buttonContent="Delete"
          />
        </Modal>
      )}

      {/* HOLIDAY TYPE MODAL */}
      {isAddOpen && activeTab === "holidaytype" && (
        <Modal
          title="Add Holiday Type"
          onClose={() => {
            setIsAddOpen(false);
            setHolidayTypeForm(emptyFormForHolidayType);
            setHolidayTypeError({});
          }}
        >
          <Input
            onChange={handleInputChangeForHolidayType}
            error={holidayTypeError.holidayType}
            value={holidayTypeForm.holidayType}
            type="text"
            label="Holiday Type"
            name="holidayType"
            placeholder=""
          />
          {/* <div>
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
          </div> */}
          <Buttons
            onCancel={() => {
              setIsAddOpen(false);
              setHolidayTypeForm(emptyFormForHolidayType);
              setHolidayTypeError({});
            }}
            onSubmit={saveFormForHolidayType}
          />
        </Modal>
      )}

      {isEditOpen && activeTab === "holidaytype" && (
        <Modal
          title="Edit Holiday Type"
          onClose={() => {
            setIsEditOpen(false);
            setEditingId(null);
            setHolidayTypeForm(emptyFormForHolidayType);
            setHolidayTypeError({});
          }}
        >
          <Input
            onChange={handleInputChangeForHolidayType}
            error={holidayTypeError.holidayType}
            value={holidayTypeForm.holidayType}
            type="text"
            label="Holiday Type"
            name="holidayType"
            placeholder=""
          />
          {/* <div>
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
          </div> */}
          <Buttons
            onCancel={() => {
              setIsEditOpen(false);
              setEditingId(null);
              setHolidayTypeForm(emptyFormForHolidayType);
              setHolidayTypeError({});
            }}
            onSubmit={saveFormForHolidayType}
            submitting={submitting}
          />
        </Modal>
      )}

      {isDeleteOpen && activeTab === "holidaytype" && (
        <Modal
          title="Delete Joliday Type"
          onClose={() => {
            setIsDeleteOpen(false);
            setDeletingId(null);
          }}
        >
          <p className="text-gray-700 text-sm leading-relaxed">
            Are you sure you want to delete this Holiday type?
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
            onSubmit={handleDeleteForHolidayType}
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

const SelectInput = ({ label, name, value, onChange, error, children }) => {
  const hasValue = value !== "" && value !== undefined && value !== null;

  return (
    <div className="relative w-full mb-5">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`peer p-4 w-full rounded-sm bg-white outline-none 
          ${
            error
              ? "border border-red-500"
              : "border border-[#afa9a959] focus:border-[#00aeef]"
          }
        `}
      >
        {children}
      </select>

      <label
        htmlFor={name}
        className={`absolute left-4 text-black bg-white px-1 transition-all duration-200
          ${hasValue ? "-top-2 text-xs" : "top-4 text-base"}
          peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
        `}
      >
        {label}
      </label>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};
