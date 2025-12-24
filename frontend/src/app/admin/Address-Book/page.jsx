"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  Upload,
  Eye,
  Edit2,
  Trash2,
  MessageCircle,
  Mail,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useAdminStore from "@/stores/useAdminStore";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
export default function ContactsModule() {
  const {
    contacts,
    getAllContacts,
    createContact,
    updateContact,
    deleteContact,
  } = useAdminStore();

  const [contactStates, setContactStates] = useState({
    page: 1,
    limit: 20,
    totalPages: 0,
    totalContacts: 0,
    loading: false,
    searchTerm: "",
    statusFilter: "",
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    position: "",
    phone: "",
    email: "",
    status: "Active",
  });
  const fileInputRef = useRef(null);

  const statuses = ["Active", "Inactive", "Pending"];

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await getAllContacts({
          page: contactStates.page,
          limit: contactStates.limit,
          search: contactStates.searchTerm,
          status: contactStates.statusFilter,
        });

        setContactStates((prev) => ({
          ...prev,
          totalPages: res.totalPages,
          totalContacts: res.total,
          loading: false,
        }));
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setContactStates((prev) => ({ ...prev, loading: false }));
      }
    };

    // ONLY set loading ONCE
    setContactStates((prev) => ({ ...prev, loading: true }));
    fetchContacts();
  }, [
    contactStates.page,
    contactStates.limit,
    contactStates.searchTerm,
    contactStates.statusFilter,
  ]);

  // Add new contact
  const handleAddContact = async () => {
    if (!formData.name || !formData.phone) {
      alert("Please fill in required fields");
      return;
    }
    try {
      setSubmitting(true);
      await createContact(formData);

      setShowAddModal(false);
      setFormData({
        name: "",
        company: "",
        position: "",
        phone: "",
        email: "",
        status: "Active",
      });
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  // Edit contact
  const handleEditContact = async () => {
    if (!formData.name || !formData.phone) {
      alert("Please fill in required fields");
      return;
    }
    try {
      setSubmitting(true);
      await updateContact(selectedContact._id, formData);

      setShowEditModal(false);
      setFormData({
        name: "",
        company: "",
        position: "",
        phone: "",
        email: "",
        status: "Active",
      });
      setSelectedContact(null);
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  const [deletedContact, setDeletedContact] = useState(null);
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  // Delete contact
  const handleDeleteContact = async () => {
    if (!deletedContact) return;
    setSubmitting(true);
    await deleteContact(deletedContact);
    setSubmitting(false);

    setDeletedContact(null);
    setShowDeleteModel(false);
  };

  // View contact
  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowViewModal(true);
  };

  const handleOpenDeleteModel = (id) => {
    setDeletedContact(id);
    setShowDeleteModel(true);
  };

  // Open edit modal
  const handleOpenEditModal = (contact) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name,
      company: contact.company,
      position: contact.position,
      phone: contact.phone,
      email: contact.email,
      status: contact.status,
    });
    setShowEditModal(true);
  };

  // Handle CSV import
  // const handleImportCSV = (e) => {
  //   // const file = e.target.files?.[0];
  //   // if (!file) return;
  //   // const reader = new FileReader();
  //   // reader.onload = (event) => {
  //   //   try {
  //   //     const csv = event.target?.result;
  //   //     const lines = csv.split("\n");
  //   //     const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  //   //     const newContacts = [];
  //   //     for (let i = 1; i < lines.length; i++) {
  //   //       if (lines[i].trim() === "") continue;
  //   //       const values = lines[i].split(",").map((v) => v.trim());
  //   //       const contact = {
  //   //         id:
  //   //           Math.max(...contacts.map((c) => c.id), 0) +
  //   //           newContacts.length +
  //   //           1,
  //   //         name: values[headers.indexOf("name")] || "",
  //   //         company: values[headers.indexOf("company")] || "",
  //   //         phone: values[headers.indexOf("phone")] || "",
  //   //         email: values[headers.indexOf("email")] || "",
  //   //         status: values[headers.indexOf("status")] || "Active",
  //   //         profile:
  //   //           values[headers.indexOf("name")]?.charAt(0).toUpperCase() || "👤",
  //   //       };
  //   //       if (contact.name && contact.email) newContacts.push(contact);
  //   //     }
  //   //     setContacts([...contacts, ...newContacts]);
  //   //     alert(`Successfully imported ${newContacts.length} contacts`);
  //   //   } catch (error) {
  //   //     alert("Error importing CSV. Please check the format.");
  //   //   }
  //   // };
  //   // reader.readAsText(file);
  // };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleFilterChange = (key, value) => {
    setContactStates((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // always reset page on filter change
    }));
  };

  return (
    <div className="min-h-screen ">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contacts</h1>
          <p className="text-gray-600">
            Manage your business contacts asnd customer relationships
          </p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
              <input
                type="search" // Changed from 'text' to 'search' (better for browsers)
                name="q" // Changed from 'contact search' to 'q' or 'search'
                id="search" // Added a unique ID
                autoComplete="off" // This is the most important part
                placeholder="Search by name, email, or phone or company..."
                value={contactStates.searchTerm}
                onChange={(e) => {
                  handleFilterChange("searchTerm", e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter
                size={20}
                className="absolute left-3 top-3 text-gray-400"
              />
              <select
                value={contactStates.statusFilter}
                onChange={(e) => {
                  handleFilterChange("statusFilter", e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Company Filter
            <div className="relative">
              <select
                value={contactStates.companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {companies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div> */}

            {/* Add Contact Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 bg-[#00aeef] text-white py-2 rounded-lg hover:bg-[#00afefdb] transition"
            >
              <Plus size={20} /> Add Contact
            </button>
          </div>

          {/* Import CSV Button */}
          {/* <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded-lg transition"
            >
              <Upload size={20} /> Import CSV
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
          </div> */}
        </div>

        {/* Contacts Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <tr
                      key={contact._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {contact.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {contact.company}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {contact.position}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {contact.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {contact.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            contact.status
                          )}`}
                        >
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewContact(contact)}
                            className="p-2 text-gray-500 hover:text-blue-600 transition"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(contact)}
                            className="p-2 text-gray-500 hover:text-blue-600 transition"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModel(contact._id)}
                            className="p-2 text-gray-500 hover:text-red-600 transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No contacts found. Try adjusting your filters or add a new
                      contact.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {contactStates.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            {/* Showing X to Y of Z */}
            <div className="text-sm text-gray-600">
              Showing {(contactStates.page - 1) * contactStates.limit + 1} to{" "}
              {Math.min(
                contactStates.page * contactStates.limit,
                contactStates.totalContacts
              )}{" "}
              of {contactStates.totalContacts}
            </div>

            {/* Pagination buttons */}
            <div className="flex gap-2">
              {/* Prev */}
              <button
                onClick={() =>
                  setContactStates((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1),
                  }))
                }
                disabled={contactStates.page === 1}
                className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Page Numbers */}
              {[...Array(contactStates.totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() =>
                    setContactStates((prev) => ({
                      ...prev,
                      page: i + 1,
                    }))
                  }
                  className={`px-3 py-1 rounded-lg ${
                    contactStates.page === i + 1
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
                  setContactStates((prev) => ({
                    ...prev,
                    page: Math.min(prev.totalPages, prev.page + 1),
                  }))
                }
                disabled={contactStates.page === contactStates.totalPages}
                className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Add Contact Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setFormData({
              name: "",
              company: "",
              position: "",
              phone: "",
              email: "",
              status: "Active",
            });
          }}
          title="Add New Contact"
        >
          <div className="space-y-4 ">
            <div className="grid lg:grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Company name"
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      position: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Position"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91"
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({
                    name: "",
                    company: "",
                    phone: "",
                    email: "",
                    status: "Active",
                  });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                className="flex-1 px-4 py-2 bg-[#00aeef] text-white rounded-lg hover:bg-[#058cbe] transition"
              >
                Add Contact
              </button>
            </div>
          </div>
        </Modal>

        {/* Edit Contact Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setFormData({
              name: "",
              company: "",
              phone: "",
              email: "",
              status: "Active",
            });
            setSelectedContact(null);
          }}
          title="Edit Contact"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, company: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Position
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, position: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Position"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1-555-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setFormData({
                    name: "",
                    company: "",
                    phone: "",
                    email: "",
                    status: "Active",
                  });
                  setSelectedContact(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditContact}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>

        {/* View Contact Modal */}
        <Modal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedContact(null);
          }}
          title="Contact Details"
        >
          {selectedContact && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full text-3xl font-semibold">
                  {selectedContact.name.slice(0, 1)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedContact.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedContact.company}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedContact.position}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Email
                </p>
                <p className="text-sm text-gray-900">{selectedContact.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Phone
                </p>
                <p className="text-sm text-gray-900">{selectedContact.phone}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Status
                </p>
                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    selectedContact.status
                  )}`}
                >
                  {selectedContact.status}
                </span>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleOpenEditModal(selectedContact);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Edit Contact
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedContact(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Contact Modal */}
        <Modal
          isOpen={showDeleteModel}
          onClose={() => {
            setShowDeleteModel(false);
            setDeletedContact(null);
          }}
          title="Delete Contact"
        >
          {deletedContact && (
            <div className="space-y-4">
              {/* Confirmation Text */}
              <p className="text-gray-700 text-center">
                Are you sure you want to delete
                <span className="font-semibold"> {deletedContact.name} </span>?
                This action cannot be undone.
              </p>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleDeleteContact}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>

                <button
                  onClick={() => {
                    setShowDeleteModel(false);
                    setDeletedContact(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
