"use client";

import useAdminStore from "@/stores/useAdminStore";
import { Edit3, Eye, Plus, Save, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Bank() {
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
    getAllBankDetails,
    createBankDetails,
    updateBankDetails,
    deleteBankDetails,
  } = useAdminStore();

  // UI State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const emptyForm = {
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    branchName: "",
    ifscCode: "",
    panNumber: "",
    upiId: "",
    qrCode: "",
    qrCodeFile: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [viewItem, setViewItem] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bankDetails, setBankDetails] = useState([]);

  // Load Bank Details via Zustand
  useEffect(() => {
    const load = async () => {
      try {
        setFetching(true);
        const data = await getAllBankDetails();
        setBankDetails(data || []);
      } catch (error) {
      } finally {
        setFetching(false);
      }
    };
    load();
  }, []);

  // FORM VALIDATION
  const validate = (data) => {
    const errs = {};

    if (!data.accountHolderName?.trim())
      errs.accountHolderName = "Account holder name is required";

    if (!data.accountNumber?.trim()) {
      errs.accountNumber = "Account number is required";
    } else if (!/^\d{6,20}$/.test(data.accountNumber.trim())) {
      errs.accountNumber =
        "Account number should be digits only (6-20 characters)";
    }

    if (!data.bankName?.trim()) errs.bankName = "Bank name is required";
    if (!data.branchName?.trim()) errs.branchName = "Branch name is required";

    if (!data.ifscCode?.trim()) {
      errs.ifscCode = "IFSC code is required";
    } else if (
      !/^[A-Z]{4}0[0-9A-Z]{6}$/.test(data.ifscCode.trim().toUpperCase())
    ) {
      errs.ifscCode = "Invalid IFSC format (e.g. ABCD0XXXXXX)";
    }

    if (!data.panNumber?.trim()) errs.panNumber = "PAN is required";

    if (!data.upiId?.trim()) {
      errs.upiId = "UPI ID is required";
    } else if (!/\S+@\S+/.test(data.upiId.trim())) {
      errs.upiId = "Invalid UPI ID (must contain @)";
    }

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
  console.log(form);

  const openView = (item) => {
    setViewItem(item);
    setIsViewOpen(true);
  };

  // INPUT CHANGE
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id]: value }));
  };

  // FILE UPLOAD → ONLY UI PREVIEW
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file); // for UI preview
      setForm((f) => ({
        ...f,
        qrCodeFile: file, // store the File object for backend
        qrCode: url, // store the URL for UI preview
      }));
    }
  };

  // Uppercase conversion
  const normalizeUpperOnBlur = (field) => {
    setForm((f) => ({ ...f, [field]: (f[field] || "").toUpperCase() }));
  };

  // SAVE FORM (ADD / EDIT via Zustand) with multipart/form-data
  const saveForm = async () => {
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("accountHolderName", form.accountHolderName);
      formData.append("accountNumber", form.accountNumber);
      formData.append("bankName", form.bankName);
      formData.append("branchName", form.branchName);
      formData.append("ifscCode", form.ifscCode);
      formData.append("panNumber", form.panNumber);
      formData.append("upiId", form.upiId);

      if (form.qrCodeFile) {
        formData.append("qrCode", form.qrCodeFile);
      }

      if (editingId) {
        // ------- EDIT MODE -------
        const updatedData = await updateBankDetails(editingId, formData);

        // Update only the edited item in state
        setBankDetails((prev) =>
          prev.map((item) => (item._id === editingId ? updatedData : item))
        );

        setIsEditOpen(false);
      } else {
        // ------- ADD MODE -------
        const newData = await createBankDetails(formData);

        // Add new item to state
        setBankDetails((prev) => [...prev, newData]);

        setIsAddOpen(false);
      }

      // Reset state
      setForm(emptyForm);
      setErrors({});
    } catch (error) {
      console.error("Error saving bank details:", error);
    } finally {
      setSubmitting(false);
    }
  };

  console.log(bankDetails);

  // DELETE ITEM
  const handleDelete = async () => {
    if (!deletingId) return; // safety check
    setSubmitting(true);
    try {
      await deleteBankDetails(deletingId);

      // Update local state
      setBankDetails((prev) => prev.filter((b) => b._id !== deletingId));

      // Close modal and reset
      setIsDeleteOpen(false);
      setDeletingId(null);
    } catch (error) {
      console.error("Error deleting bank details:", error);
      // Optionally show a toast or alert
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="lg:p-0 p-4">
      {/* Header */}
      <div className="flex w-full justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-black poppins">
            Bank Details
          </h1>
        </div>
        <div>
          <button
            className="flex items-center rounded-[4px] text-4 font-semibold  bg-[#00aeef] uppercase p-2 text-white cursor-pointer"
            onClick={openAdd}
          >
            <Plus className="h-4 w-4" />
            Add Bank
          </button>
        </div>
      </div>
      <div>
        {/* Leads Table */}
        <div className="overflow-x-auto bg-white border border-gray-200 mt-10 rounded-xl shadow-xl">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Account Name</th>
                <th className="px-6 py-3">Account Number</th>
                <th className="px-6 py-3">Bank</th>
                <th className="px-6 py-3">Branch</th>
                <th className="px-6 py-3">IFSC</th>
                <th className="px-6 py-3"> UPI</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bankDetails.map((b, idx) => (
                <tr
                  key={b._id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {idx + 1}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3 cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">
                        {b.accountHolderName}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{b.accountNumber}</td>
                  <td className="px-6 py-4 text-gray-700">{b.bankName}</td>

                  <td className="px-6 py-4 text-gray-700">{b.branchName}</td>
                  <td className="px-6 py-4 text-gray-700">{b.ifscCode}</td>
                  <td className="px-6 py-4 text-gray-700">{b.upiId}</td>

                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
                      onClick={() => openEdit(b)}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
                      onClick={() => openDelete(b._id)}
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      className="flex items-center gap-1 cursor-pointer px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition"
                      onClick={() => openView(b)}
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}

              {bankDetails.length === 0 && (
                <tr className="border-t">
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No bank details available.
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
          <div className=" md:h-100 md:w-300 md:p-10 p-3 overflow-hidden  justify-center items-center z-40   bg-white shadow-2xl overflow-y-auto ">
            <div className="mb-8 flex justify-between items-center">
              <h1 className="font-bold">Add Bank Detail</h1>
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
                  {/* accountHolderName */}
                  {/* accountHolderName */}
                  <div className="relative w-full">
                    <input
                      type="text"
                      id="accountHolderName"
                      value={form.accountHolderName}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        errors.accountHolderName
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                    />

                    <label
                      htmlFor="accountHolderName"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                      peer-placeholder-shown:top-4 
                      peer-placeholder-shown:text-base
                      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                      peer-[&:not(:placeholder-shown)]:-top-2 
                      peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      Account Holder Name
                    </label>

                    {errors.accountHolderName && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.accountHolderName}
                      </p>
                    )}
                  </div>

                  {/* accountNumber */}
                  <div className="relative w-full">
                    <input
                      id="accountNumber"
                      type="text"
                      value={form.accountNumber}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        errors.accountNumber
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                    />

                    <label
                      htmlFor="accountNumber"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                      peer-placeholder-shown:top-4 
                      peer-placeholder-shown:text-base
                      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                      peer-[&:not(:placeholder-shown)]:-top-2 
                      peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      Account Number
                    </label>

                    {errors.accountNumber && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.accountNumber}
                      </p>
                    )}
                  </div>

                  {/* bankName */}
                  <div className="relative w-full">
                    <input
                      id="bankName"
                      type="text"
                      value={form.bankName}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        errors.bankName
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                    />

                    <label
                      htmlFor="bankName"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                      peer-placeholder-shown:top-4 
                      peer-placeholder-shown:text-base
                      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                      peer-[&:not(:placeholder-shown)]:-top-2 
                      peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      Bank Name
                    </label>

                    {errors.bankName && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.bankName}
                      </p>
                    )}
                  </div>

                  {/* branchName */}
                  <div className="relative w-full">
                    <input
                      id="branchName"
                      type="text"
                      value={form.branchName}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        errors.branchName
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                    />

                    <label
                      htmlFor="branchName"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                      peer-placeholder-shown:top-4 
                      peer-placeholder-shown:text-base
                      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                      peer-[&:not(:placeholder-shown)]:-top-2 
                      peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      Branch Name
                    </label>

                    {errors.branchName && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.branchName}
                      </p>
                    )}
                  </div>

                  {/* ifscCode */}
                  <div className="relative w-full">
                    <input
                      id="ifscCode"
                      type="text"
                      value={form.ifscCode}
                      onChange={handleInputChange}
                      onBlur={() => normalizeUpperOnBlur("ifscCode")}
                      placeholder=" "
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        errors.ifscCode
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                    />

                    <label
                      htmlFor="ifscCode"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                      peer-placeholder-shown:top-4 
                      peer-placeholder-shown:text-base
                      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                      peer-[&:not(:placeholder-shown)]:-top-2 
                      peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      IFSC Code
                    </label>

                    {errors.ifscCode && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.ifscCode}
                      </p>
                    )}
                  </div>

                  {/* panNumber */}
                  <div className="relative w-full">
                    <input
                      id="panNumber"
                      type="text"
                      value={form.panNumber}
                      onChange={handleInputChange}
                      onBlur={() => normalizeUpperOnBlur("panNumber")}
                      placeholder=" "
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        errors.panNumber
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                    />

                    <label
                      htmlFor="panNumber"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                      peer-placeholder-shown:top-4 
                      peer-placeholder-shown:text-base
                      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                      peer-[&:not(:placeholder-shown)]:-top-2 
                      peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      PAN Number
                    </label>

                    {errors.panNumber && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.panNumber}
                      </p>
                    )}
                  </div>

                  {/* upiId */}
                  <div className="relative w-full">
                    <input
                      id="upiId"
                      type="text"
                      value={form.upiId}
                      onChange={handleInputChange}
                      placeholder=" " // IMPORTANT for floating label
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        errors.upiId
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                    />

                    <label
                      htmlFor="upiId"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                      peer-placeholder-shown:top-4 
                      peer-placeholder-shown:text-base
                      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                      peer-[&:not(:placeholder-shown)]:-top-2 
                      peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      UPI ID
                    </label>

                    {errors.upiId && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.upiId}
                      </p>
                    )}
                  </div>

                  {/* QR Code file */}
                  <div className="relative w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="peer p-4 w-full rounded-sm bg-white border border-[#afa9a959] outline-none focus:border-[#00aeef] placeholder-transparent"
                      placeholder="QR Code"
                    />
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
          <div className=" md:h-100 md:w-300 md:p-10 p-3 overflow-hidden  justify-center items-center z-40   bg-white shadow-2xl overflow-y-auto ">
            <div className="mb-8 flex justify-between items-center">
              <h1 className="font-bold">Edit Bank Detail</h1>
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
                      id="accountHolderName"
                      value={form.accountHolderName}
                      onChange={handleInputChange}
                      className={`peer p-4 w-full rounded-sm bg-white outline-none ${
                        errors.accountHolderName
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                      placeholder=" " // IMPORTANT: a single blank space
                    />

                    <label
                      htmlFor="accountHolderName"
                      className="absolute left-4 top-4 text-black duration-200 
                      peer-placeholder-shown:top-4 
                      peer-placeholder-shown:text-base
                      peer-focus:-top-2 peer-focus:text-xs 
                      peer-focus:text-[#00aeef]
                      peer-[&:not(:placeholder-shown)]:-top-2 
                      peer-[&:not(:placeholder-shown)]:text-xs
                      bg-white px-1"
                    >
                      Account Holder Name
                    </label>

                    {errors.accountHolderName && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.accountHolderName}
                      </p>
                    )}
                  </div>

                  <div className="relative w-full">
                    <input
                      id="accountNumber"
                      type="text"
                      value={form.accountNumber}
                      onChange={handleInputChange}
                      placeholder=" " // IMPORTANT
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                        ${
                          errors.accountNumber
                            ? "border border-red-500"
                            : "border border-[#afa9a959] focus:border-[#00aeef]"
                        }`}
                    />

                    <label
                      htmlFor="accountNumber"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                        peer-placeholder-shown:top-4 
                        peer-placeholder-shown:text-base
                        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                        peer-[&:not(:placeholder-shown)]:-top-2 
                        peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      Account Number
                    </label>

                    {errors.accountNumber && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.accountNumber}
                      </p>
                    )}
                  </div>

                  <div className="relative w-full">
                    <input
                      id="bankName"
                      type="text"
                      value={form.bankName}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        errors.bankName
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                    />

                    <label
                      htmlFor="bankName"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                        peer-placeholder-shown:top-4 
                        peer-placeholder-shown:text-base
                        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                        peer-[&:not(:placeholder-shown)]:-top-2 
                        peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      Bank Name
                    </label>

                    {errors.bankName && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.bankName}
                      </p>
                    )}
                  </div>

                  <div className="relative w-full">
                    <input
                      id="branchName"
                      type="text"
                      value={form.branchName}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        errors.branchName
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                    />

                    <label
                      htmlFor="branchName"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                        peer-placeholder-shown:top-4 
                        peer-placeholder-shown:text-base
                        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                        peer-[&:not(:placeholder-shown)]:-top-2 
                        peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      Branch Name
                    </label>

                    {errors.branchName && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.branchName}
                      </p>
                    )}
                  </div>

                  <div className="relative w-full">
                    <input
                      id="ifscCode"
                      type="text"
                      value={form.ifscCode}
                      onChange={handleInputChange}
                      onBlur={() => normalizeUpperOnBlur("ifscCode")}
                      placeholder=" "
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        errors.ifscCode
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                    />

                    <label
                      htmlFor="ifscCode"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                        peer-placeholder-shown:top-4 
                        peer-placeholder-shown:text-base
                        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                        peer-[&:not(:placeholder-shown)]:-top-2 
                        peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      IFSC Code
                    </label>

                    {errors.ifscCode && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.ifscCode}
                      </p>
                    )}
                  </div>

                  <div className="relative w-full">
                    <input
                      id="panNumber"
                      type="text"
                      value={form.panNumber}
                      onChange={handleInputChange}
                      onBlur={() => normalizeUpperOnBlur("panNumber")}
                      placeholder=" "
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        errors.panNumber
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                    />

                    <label
                      htmlFor="panNumber"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                        peer-placeholder-shown:top-4 
                        peer-placeholder-shown:text-base
                        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                        peer-[&:not(:placeholder-shown)]:-top-2 
                        peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      PAN Number
                    </label>

                    {errors.panNumber && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.panNumber}
                      </p>
                    )}
                  </div>

                  <div className="relative w-full">
                    <input
                      id="upiId"
                      type="text"
                      value={form.upiId}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={`peer p-4 w-full rounded-sm bg-white outline-none ${
                        errors.upiId
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                    />

                    <label
                      htmlFor="upiId"
                      className="absolute left-4 top-4 bg-white px-1 text-black transition-all duration-200
                        peer-placeholder-shown:top-4 
                        peer-placeholder-shown:text-base
                        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                        peer-[&:not(:placeholder-shown)]:-top-2
                        peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      UPI ID
                    </label>

                    {errors.upiId && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.upiId}
                      </p>
                    )}
                  </div>

                  <div className="relative w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="peer p-4 w-full rounded-sm bg-white border border-[#afa9a959] outline-none focus:border-[#00aeef] placeholder-transparent"
                      placeholder="QR Code"
                    />
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

      {/* ---------- View Modal ---------- */}
      {isViewOpen && viewItem && (
        <div className="fixed flex justify-center items-center inset-0 z-50 p-5  lg:p-0 md:p-10">
          <div className="fixed inset-0 bg-black/40 " />
          <div className=" md:h-150 md:w-200 h-130 w-140 md:p-10 p-3 overflow-hidden  justify-center items-center z-40   bg-white shadow-2xl overflow-y-auto ">
            <div className="mb-8 flex justify-between items-center">
              <h1 className="font-bold"> Bank Details</h1>
              <div>
                <button
                  onClick={() => {
                    setIsViewOpen(false);
                    setViewItem(null);
                  }}
                  className="cursor-pointer"
                >
                  <X className="text-red-600" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                  <div className="p-6 border rounded-md bg-white text-gray-700 flex justify-evenly">
                    Account holder name :{" "}
                    <span className="text-black font-semibold">
                      {" "}
                      {viewItem.accountHolderName}
                    </span>
                  </div>
                  <div className="p-6 border rounded-md bg-white text-gray-700 flex justify-evenly">
                    Account number :{" "}
                    <span className="text-black font-semibold">
                      {" "}
                      {viewItem.accountNumber}
                    </span>
                  </div>
                  <div className="p-6 border rounded-md bg-white text-gray-700 flex justify-evenly">
                    IFSC Code :{" "}
                    <span className="text-black font-semibold">
                      {" "}
                      {viewItem.ifscCode}
                    </span>
                  </div>
                </div>
                {console.log(viewItem.qrCode)}
                <div className="flex justify-center items-start">
                  <img
                    src={viewItem.qrCode || null}
                    crossOrigin="anonymous"
                    className="w-52 h-52 object-contain border rounded-md"
                    alt="QR"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 border rounded-md bg-white flex justify-evenly">
                  Branch :{" "}
                  <span className="text-black font-semibold">
                    {" "}
                    {viewItem.branchName}
                  </span>
                </div>
                <div className="p-6 border rounded-md bg-white flex justify-evenly">
                  UPI ID :{" "}
                  <span className="text-black font-semibold">
                    {" "}
                    {viewItem.upiId}
                  </span>
                </div>
                <div className="p-6 border rounded-md bg-white flex justify-evenly">
                  PAN :{" "}
                  <span className="text-black font-semibold">
                    {" "}
                    {viewItem.panNumber}
                  </span>
                </div>
                <div className="p-6 border rounded-md bg-white flex justify-evenly">
                  Bank :{" "}
                  <span className="text-black font-semibold">
                    {" "}
                    {viewItem.bankName}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="border-[#ff00004e] hover:bg-[red] transition-all border p-2 px-6 text-black rounded-[3px] cursor-pointer"
                onClick={() => {
                  setIsViewOpen(false);
                  setViewItem(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-[90%] max-w-sm p-6 rounded-md shadow-xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="font-semibold text-lg">Delete Bank Detail</h1>
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
              Are you sure you want to delete this bank detail?
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
