"use client";

import { Edit3, Eye, Plus, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import useAdminStore from "@/stores/useAdminStore";

export default function LeadReferencePage() {
  const {
    leadReference,
    getAllLeadReference,
    createLeadReference,
    updateLeadReference,
    deleteLeadReference,
  } = useAdminStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const emptyForm = {
    leadReference: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setFetching(true);
      await getAllLeadReference();
      setFetching(false);
    };
    load();
  }, []);

  const validate = (data) => {
    const errs = {};

    if (!data.leadReference?.trim())
      errs.leadReference = "lead reference is required";
    return errs;
  };

  // OPEN MODALS
  const openAdd = () => {
    setForm(emptyForm);
    setErrors({});
    setEditingId(null);
    setIsAddOpen(true);
  };

  const openEdit = (item) => {
    setForm(item);
    setErrors({});

    setEditingId(item._id);
    setIsEditOpen(true);
  };

  const openDelete = (id) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  // SAVE FORM (ADD / EDIT via Zustand) with multipart/form-data
  const saveForm = async () => {
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);

    try {
      if (editingId) {
        // EDIT MODE
        await updateLeadReference(editingId, form);

        setIsEditOpen(false);
      } else {
        // ADD MODE
        await createLeadReference(form);

        setIsAddOpen(false);
      }

      // Reset form & errors
      setForm(emptyForm);
      setErrors({});
    } catch (error) {
      console.error("Error saving lead reference:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE ITEM
  const handleDelete = async () => {
    if (!deletingId) return; // safety check
    setSubmitting(true);
    try {
      await deleteLeadReference(deletingId);

      // Close modal and reset
      setIsDeleteOpen(false);
      setDeletingId(null);
    } catch (error) {
      console.error("Error deleting lead reference:", error);
      // Optionally show a toast or alert
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full p-2">
      {/* HEADER */}
      <div className="flex w-full justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-black poppins">
          Lead Reference Management
        </h1>

        <button
          className="p-3 rounded-[4px] text-sm bg-[#00aeef] text-white flex gap-2 items-center hover:bg-[#039bd0]"
          onClick={openAdd}
        >
          <Plus size={20} /> Add Lead Reference
        </button>
      </div>

      {/* ---------- CATEGORY TABLE ---------- */}

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Lead Reference</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          {leadReference.map((ref, idx) => (
            <tbody key={idx}>
              <tr className="border-t hover:bg-gray-50 text-center">
                <td className="px-6 py-4 font-medium">{idx + 1}</td>
                <td className="px-6 py-4 cursor-pointer">
                  {ref.leadReference}
                </td>
                <td className="px-6 py-4 flex justify-center gap-2">
                  <button
                    onClick={() => openEdit(ref)}
                    className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => openDelete(ref._id)}
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

      {/* CATEGORY MODAL */}
      {isAddOpen && (
        <Modal
          title="Add Lead Reference"
          onClose={() => {
            setIsAddOpen(false);
            setForm(emptyForm);
            setErrors({});
          }}
        >
          <Input
            onChange={(e) => setForm({ leadReference: e.target.value })}
            error={errors.leadReference}
            value={form.leadReference}
            type="text"
            label="leadReference"
            name="leadReference"
            placeholder=""
          />
          <Buttons
            onCancel={() => {
              setIsAddOpen(false);
              setForm(emptyForm);
              setErrors({});
            }}
            onSubmit={saveForm}
            submitting={submitting}
          />
        </Modal>
      )}

      {isEditOpen && (
        <Modal
          title="Edit Lead Reference"
          onClose={() => {
            setIsEditOpen(false);
            setEditingId(null);
            setForm(emptyForm);
            setErrors({});
          }}
        >
          <Input
            onChange={(e) => setForm({ leadReference: e.target.value })}
            error={errors.leadReference}
            value={form.leadReference}
            type="text"
            label="leadReference"
            name="leadReference"
            placeholder=""
          />
          <Buttons
            onCancel={() => {
              setIsEditOpen(false);
              setEditingId(null);
              setForm(emptyForm);
              setErrors({});
            }}
            onSubmit={saveForm}
            submitting={submitting}
          />
        </Modal>
      )}

      {isDeleteOpen && (
        <Modal
          title="Delete Lead Reference"
          onClose={() => {
            setIsDeleteOpen(false);
            setDeletingId(null);
          }}
        >
          <p className="text-gray-700 text-sm leading-relaxed">
            Are you sure you want to delete this Lead reference?
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
            onSubmit={handleDelete}
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
  placeholder = "",
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
