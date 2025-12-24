"use client";

import useAdminStore from "@/stores/useAdminStore";
import { Edit3, Eye, Plus, Save, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function LeaveType() {
  // bankDetails array stores entries using the fields from your mongoose model
  // const [bankDetails, setBankDetails] = useState([
  //   // sample initial row — you can remove or replace with [] to start empty
  //   {
  //     id: Date.now().toString(),
  //     accountHolderName: "Vydurya Enterprises LLP",
  //     accountNumber: "259745749090",
  //     bankName: "Induslnd Bank",
  //     branchName: "Karunagappally",
  //     ifscCode: "INDB0001647",
  //     panNumber: "HWSPM457815",
  //     upiId: "Pos.11380817@indus",
  //     qrCode:
  //       "https://i.pinimg.com/1200x/75/d7/06/75d706845313003903984e0a6c0aa7b2.jpg",
  //   },
  // ]);

  const {
    getAllLeaveTypes,
    createLeaveType,
    updateLeaveType,
    deleteLeaveType,
  } = useAdminStore();

  // UI State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const emptyForm = {
    leave_type: "",
    short_form: "",
    total_leaves: "",
    leaves_per_month: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState([]);

  // Load Bank Details via Zustand
  useEffect(() => {
    const load = async () => {
      setFetching(true);
      const data = await getAllLeaveTypes();
      setLeaveTypes(data || []);
      setFetching(false);
    };
    load();
  }, []);

  // FORM VALIDATION
  const validate = (data) => {
    const errs = {};

    if (!data.leave_type?.trim()) errs.leave_type = "Leave type is required";

    if (!data.short_form?.trim()) errs.short_form = "Short Form is required";

    if (data.total_leaves < 1)
      errs.total_leaves = "Total Leaves must be geater than 0";
    if (data.leaves_per_month < 1)
      errs.leaves_per_month = "Leaves per month must be geater than 0";

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

  // INPUT CHANGE
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id]: value }));
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
        const data = await updateLeaveType(editingId, form);

        setLeaveTypes((prev) =>
          prev.map((item) => (item._id === editingId ? data : item))
        );

        setIsEditOpen(false);
      } else {
        // ADD MODE
        const data = await createLeaveType(form);

        setLeaveTypes((prev) => [...prev, data]);

        setIsAddOpen(false);
      }

      // Reset form & errors
      setForm(emptyForm);
      setErrors({});
    } catch (error) {
      console.error("Error saving leave type:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE ITEM
  const handleDelete = async () => {
    if (!deletingId) return; // safety check
    setSubmitting(true);
    try {
      await deleteLeaveType(deletingId);

      // Update local state
      setLeaveTypes((prev) => prev.filter((b) => b._id !== deletingId));

      // Close modal and reset
      setIsDeleteOpen(false);
      setDeletingId(null);
    } catch (error) {
      console.error("Error deleting leave type:", error);
      // Optionally show a toast or alert
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="lg:p-0 p-3">
      {/* Header */}
      <div className="flex w-full justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-black poppins">
            Leave Type
          </h1>
        </div>
        <div>
          <button
            className="flex items-center rounded-[4px] text-4 font-semibold  bg-[#00aeef] uppercase p-2 text-white cursor-pointer"
            onClick={openAdd}
          >
            <Plus className="h-4 w-4" />
            Add Leave Type
          </button>
        </div>
      </div>
      <div>
        {/* Leads Table */}
        <div className="overflow-x-auto bg-white border border-gray-200 mt-10 rounded-xl shadow-sm">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Leave Type</th>
                <th className="px-6 py-3">Short Form</th>
                <th className="px-6 py-3">Total Leaves</th>
                <th className="px-6 py-3">Leaves Per Month</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveTypes.map((l, idx) => (
                <tr
                  key={l._id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {idx + 1}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3 cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">
                        {l.leave_type}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{l.short_form}</td>
                  <td className="px-6 py-4 text-gray-700">{l.total_leaves}</td>

                  <td className="px-6 py-4 text-gray-700">
                    {l.leaves_per_month}
                  </td>

                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
                      onClick={() => openEdit(l)}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
                      onClick={() => openDelete(l._id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}

              {leaveTypes.length === 0 && (
                <tr className="border-t">
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No leave type details available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* ---------- Add Modal ---------- */}
      {isAddOpen && (
        <div className="fixed flex justify-center items-center inset-0 z-50  lg:p-0 md:p-10">
          <div className="fixed inset-0 bg-black/40 " />
          <div className=" md:h-100 md:w-300 md:p-10 p-3 overflow-hidden  justify-center items-center z-40   bg-[#f9f9f9] shadow-2xl overflow-y-auto ">
            <div className="mb-8 flex justify-between items-center">
              <h1 className="font-bold">Add Leave Type</h1>
              <div>
                <button
                  disabled={submitting}
                  onClick={() => {
                    setIsAddOpen(false);
                    setForm(emptyForm);
                    setErrors({});
                  }}
                  className="cursor-pointer"
                >
                  <X className="text-red-600" />
                </button>
              </div>
            </div>

            {/* Form */}
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveForm(false);
                }}
              >
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-grid-cols-1 gap-3 relative">
                  <div className="relative w-full">
                    <input
                      type="text"
                      id="leave_type"
                      value={form.leave_type}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        errors.leave_type
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                    />

                    <label
                      htmlFor="leave_type"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                      peer-placeholder-shown:top-4 
                      peer-placeholder-shown:text-base
                      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                      peer-[&:not(:placeholder-shown)]:-top-2 
                      peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      Leave Type
                    </label>

                    {errors.leave_type && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.leave_type}
                      </p>
                    )}
                  </div>

                  <div className="relative w-full">
                    <input
                      type="text"
                      id="short_form"
                      value={form.short_form}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        errors.short_form
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                    />

                    <label
                      htmlFor="short_form"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                      peer-placeholder-shown:top-4 
                      peer-placeholder-shown:text-base
                      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                      peer-[&:not(:placeholder-shown)]:-top-2 
                      peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      Short Form
                    </label>

                    {errors.short_form && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.short_form}
                      </p>
                    )}
                  </div>

                  <div className="relative w-full">
                    <input
                      type="number"
                      id="total_leaves"
                      value={form.total_leaves}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        errors.total_leaves
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                    />

                    <label
                      htmlFor="total_leaves"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                      peer-placeholder-shown:top-4 
                      peer-placeholder-shown:text-base
                      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                      peer-[&:not(:placeholder-shown)]:-top-2 
                      peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      Total Leaves
                    </label>

                    {errors.total_leaves && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.total_leaves}
                      </p>
                    )}
                  </div>

                  <div className="relative w-full">
                    <input
                      type="number"
                      id="leaves_per_month"
                      value={form.leaves_per_month}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        errors.leaves_per_month
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                    />

                    <label
                      htmlFor="leaves_per_month"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                      peer-placeholder-shown:top-4 
                      peer-placeholder-shown:text-base
                      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                      peer-[&:not(:placeholder-shown)]:-top-2 
                      peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      Leaves Per Month
                    </label>

                    {errors.leaves_per_month && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.leaves_per_month}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    disabled={submitting}
                    type="button"
                    className="border-[#ff00004e] hover:bg-[red] transition-all border p-2 px-6 text-black rounded-[3px] cursor-pointer"
                    onClick={() => {
                      setIsAddOpen(false);
                      setForm(emptyForm);
                      setErrors({});
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={submitting}
                    type="submit"
                    className="bg-[#00aeef] p-2 px-6 text-white rounded-[3px]  cursor-pointer"
                  >
                    {submitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* ---------- Edit Modal (reuses same form logic/layout) ---------- */}
      {isEditOpen && (
        <div className="fixed flex justify-center items-center inset-0 z-50  lg:p-0 md:p-10">
          <div className="fixed inset-0 bg-black/40 " />
          <div className=" md:h-100 md:w-300 md:p-10 p-3 overflow-hidden  justify-center items-center z-40   bg-[#f9f9f9] shadow-2xl overflow-y-auto ">
            <div className="mb-8 flex justify-between items-center">
              <h1 className="font-bold">Edit Leave Type</h1>
              <div>
                <button
                  disabled={submitting}
                  onClick={() => {
                    setIsEditOpen(false);
                    setForm(emptyForm);
                    setErrors({});
                  }}
                  className="cursor-pointer"
                >
                  <X className="text-red-600" />
                </button>
              </div>
            </div>

            {/* Form */}
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveForm(true);
                }}
              >
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-grid-cols-1 gap-3 relative">
                  {/* Reuse same inputs as Add (values from form) */}
                  <div className="relative w-full">
                    <input
                      type="text"
                      id="leave_type"
                      value={form.leave_type}
                      onChange={handleInputChange}
                      className={`peer p-4 w-full rounded-sm bg-white outline-none ${
                        errors.leave_type
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                      placeholder=" " // IMPORTANT: a single blank space
                    />

                    <label
                      htmlFor="leave_type"
                      className="absolute left-4 top-4 text-black duration-200 
                      peer-placeholder-shown:top-4 
                      peer-placeholder-shown:text-base
                      peer-focus:-top-2 peer-focus:text-xs 
                      peer-focus:text-[#00aeef]
                      peer-[&:not(:placeholder-shown)]:-top-2 
                      peer-[&:not(:placeholder-shown)]:text-xs
                      bg-white px-1"
                    >
                      Leave Type
                    </label>

                    {errors.leave_type && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.leave_type}
                      </p>
                    )}
                  </div>

                  <div className="relative w-full">
                    <input
                      id="short_form"
                      type="text"
                      value={form.short_form}
                      onChange={handleInputChange}
                      placeholder=" " // IMPORTANT
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                        ${
                          errors.short_form
                            ? "border border-red-500"
                            : "border border-[#afa9a959] focus:border-[#00aeef]"
                        }`}
                    />

                    <label
                      htmlFor="short_form"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                        peer-placeholder-shown:top-4 
                        peer-placeholder-shown:text-base
                        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                        peer-[&:not(:placeholder-shown)]:-top-2 
                        peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      Short Form
                    </label>

                    {errors.short_form && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.short_form}
                      </p>
                    )}
                  </div>

                  <div className="relative w-full">
                    <input
                      id="total_leaves"
                      type="number"
                      value={form.total_leaves}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        errors.total_leaves
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                    />

                    <label
                      htmlFor="total_leaves"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                        peer-placeholder-shown:top-4 
                        peer-placeholder-shown:text-base
                        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                        peer-[&:not(:placeholder-shown)]:-top-2 
                        peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      Total Leaves
                    </label>

                    {errors.total_leaves && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.total_leaves}
                      </p>
                    )}
                  </div>

                  <div className="relative w-full">
                    <input
                      id="leaves_per_month"
                      type="number"
                      value={form.leaves_per_month}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        errors.leaves_per_month
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                    />

                    <label
                      htmlFor="leaves_per_month"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                        peer-placeholder-shown:top-4 
                        peer-placeholder-shown:text-base
                        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                        peer-[&:not(:placeholder-shown)]:-top-2 
                        peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      Leaves Per Month
                    </label>

                    {errors.leaves_per_month && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.leaves_per_month}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    disabled={submitting}
                    type="button"
                    className="border-[#ff00004e] hover:bg-[red] transition-all border p-2 px-6 text-black rounded-[3px] cursor-pointer"
                    onClick={() => {
                      setIsEditOpen(false);
                      setForm(emptyForm);
                      setErrors({});
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={submitting}
                    type="submit"
                    className="bg-[#00aeef] p-2 px-6 text-white rounded-[3px]  cursor-pointer"
                  >
                    {submitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-[90%] max-w-sm p-6 rounded-md shadow-xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="font-semibold text-lg">Delete Leave Type</h1>
              <button
                disabled={submitting}
                onClick={() => {
                  setIsDeleteOpen(false);
                  setDeletingId(null);
                }}
                className="cursor-pointer"
              >
                <X className="text-red-600" />
              </button>
            </div>

            {/* Warning Text */}
            <p className="text-gray-700 text-sm leading-relaxed">
              Are you sure you want to delete this leave type?
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
                  setIsDeleteOpen(false);
                  setDeletingId(null);
                }}
              >
                Cancel
              </button>
              <button
                disabled={submitting}
                onClick={handleDelete}
                className="bg-[#00aeef] px-4 py-2 text-white rounded text-sm hover:opacity-90 transition-all"
              >
                {submitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
