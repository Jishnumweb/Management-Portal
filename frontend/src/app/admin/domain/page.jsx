"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  X,
  Download,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useAdminStore from "@/stores/useAdminStore";

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-4xl",
    xl: "max-w-4xl",
  };
  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div
        className={`bg-white rounded-lg shadow-lg ${sizeClasses[size]} w-full my-8`}
      >
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto lg:max-h-136 max-h-96">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function DomainTrackingModule() {
  const { domains, getAllDomains, createDomain, updateDomain, deleteDomain } =
    useAdminStore();

  const [domainStates, setDomainStates] = useState({
    page: 1,
    limit: 20,
    totalPages: 0,
    totalDomains: 0,
    loading: false,
    searchTerm: "",
    statusFilter: "",
    providerFilter: "",
    sortBy: "expiryDate",
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  // const [reminderAlerts, setReminderAlerts] = useState({});

  const [formData, setFormData] = useState({
    domainName: "",
    ownerName: "",
    company: "",
    registrationDate: "",
    expiryDate: "",
    provider: "GoDaddy",
    credentials: "",
    renewalCost: "",
    dnsProvider: "",
    status: "Active",
    tags: [],
    notes: "",
    alternateDomains: [],
  });

  const [newTag, setNewTag] = useState("");
  const [newAltDomain, setNewAltDomain] = useState("");

  // Get unique providers for filters
  const providers = ["GoDaddy", "Namecheap", "Hostinger", "Bluehost", "Other"];
  const statuses = ["Active", "Expiring Soon", "Expired"];

  // Calculate domain status and reminders
  const calculateStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return "Expired";
    if (daysUntilExpiry <= 30) return "Expiring Soon";
    return "Active";
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

  const checkReminders = (expiryDate) => {
    const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
    return [1, 7, 15, 30].includes(daysUntilExpiry);
  };

  // Add new domain
  const handleAddDomain = async () => {
    if (!formData.domainName && !formData.expiryDate && !formData.ownerName) {
      alert("Please fill in required fields");
      return;
    }

    try {
      setSubmitting(true);
      await createDomain(formData);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await getAllDomains({
          page: domainStates.page,
          limit: domainStates.limit,
          search: domainStates.searchTerm,
          status: domainStates.statusFilter,
          provider: domainStates.providerFilter,
          sortBy: domainStates.sortBy,
        });

        setDomainStates((prev) => ({
          ...prev,
          totalPages: res.totalPages,
          totalDomains: res.total,
          loading: false,
        }));
      } catch (error) {
        console.error("Error fetching domains:", error);
        setDomainStates((prev) => ({ ...prev, loading: false }));
      }
    };

    // ONLY set loading ONCE
    setDomainStates((prev) => ({ ...prev, loading: true }));
    fetchDomains();
  }, [
    domainStates.page,
    domainStates.limit,
    domainStates.searchTerm,
    domainStates.statusFilter,
    domainStates.providerFilter,
    domainStates.sortBy,
  ]);

  const [submitting, setSubmitting] = useState(false);
  // Edit domain
  const handleEditDomain = async () => {
    if (!formData.domainName && !formData.expiryDate && !formData.ownerName) {
      alert("Please fill in required fields");
      return;
    }
    try {
      setSubmitting(true);

      await updateDomain(selectedDomain._id, formData);

      setShowEditModal(false);
      resetForm();
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const [deletedDomain, setDeletedDomain] = useState(null);
  // Delete domain
  const handleDeleteDomain = async () => {
    if (!deletedDomain) return;
    setSubmitting(true);
    await deleteDomain(deletedDomain);
    setSubmitting(false);

    setDeletedDomain(null);
    setShowDeleteModel(false);
  };

  // View domain
  const handleViewDomain = (domain) => {
    setSelectedDomain(domain);
    setShowViewModal(true);
  };

  const handleOpenDeleteModel = (id) => {
    setDeletedDomain(id);
    setShowDeleteModel(true);
  };

  // Open edit modal
  const handleOpenEditModal = (domain) => {
    setSelectedDomain(domain);
    setFormData({
      domainName: domain.domainName,
      ownerName: domain.ownerName,
      company: domain.company,
      registrationDate: formatDate(domain.registrationDate),
      expiryDate: formatDate(domain.expiryDate),
      provider: domain.provider,
      credentials: domain.credentials,
      renewalCost: domain.renewalCost,
      dnsProvider: domain.dnsProvider,
      status: domain.status,
      tags: domain.tags,
      notes: domain.notes,
      alternateDomains: domain.alternateDomains,
    });
    setShowEditModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      domainName: "",
      ownerName: "",
      company: "",
      registrationDate: "",
      expiryDate: "",
      provider: "GoDaddy",
      credentials: "",
      renewalCost: "",
      dnsProvider: "",
      status: "Active",
      tags: [],
      notes: "",
      alternateDomains: [],
    });
    setNewTag("");
    setNewAltDomain("");
  };

  // Add tag
  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag("");
    }
  };

  // Remove tag
  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  // Add alternate domain
  const handleAddAltDomain = () => {
    if (newAltDomain && !formData.alternateDomains.includes(newAltDomain)) {
      setFormData({
        ...formData,
        alternateDomains: [...formData.alternateDomains, newAltDomain],
      });
      setNewAltDomain("");
    }
  };

  // Remove alternate domain
  const handleRemoveAltDomain = (domain) => {
    setFormData({
      ...formData,
      alternateDomains: formData.alternateDomains.filter((d) => d !== domain),
    });
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "Domain Name",
      "Owner Name",
      "Company",
      "Registration Date",
      "Expiry Date",
      "Provider",
      "Renewal Cost",
      "DNS Provider",
      "Status",
      "Tags",
    ];
    const rows = sortedDomains.map((d) => [
      d.domainName,
      d.ownerName,
      d.company,
      d.registrationDate,
      d.expiryDate,
      d.provider,
      d.renewalCost,
      d.dnsProvider,
      d.status,
      d.tags.join(";"),
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach((row) => {
      csv += row.map((cell) => `"${cell}"`).join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "domains-export.csv";
    a.click();
  };

  // Export to PDF
  const handleExportPDF = () => {
    let pdfContent =
      "DOMAIN TRACKING REPORT\n" +
      "Generated: " +
      new Date().toLocaleDateString() +
      "\n\n";

    sortedDomains.forEach((d) => {
      pdfContent +=
        `Domain: ${d.domainName}\n` +
        `Owner: ${d.ownerName}\n` +
        `Company: ${d.company}\n` +
        `Expiry: ${d.expiryDate}\n` +
        `Status: ${d.status}\n` +
        `Provider: ${d.provider}\n` +
        `Renewal Cost: $${d.renewalCost}\n` +
        "---\n\n";
    });

    const blob = new Blob([pdfContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "domains-export.pdf";
    a.click();
  };

  // Download PDF for single domain
  const handleDownloadDomainPDF = (domain) => {
    const pdfContent =
      `DOMAIN DETAILS - ${domain.domainName}\n\n` +
      `Owner: ${domain.ownerName}\n` +
      `Company: ${domain.company}\n` +
      `Registration Date: ${domain.registrationDate}\n` +
      `Expiry Date: ${domain.expiryDate}\n` +
      `Provider: ${domain.provider}\n` +
      `DNS Provider: ${domain.dnsProvider}\n` +
      `Renewal Cost: $${domain.renewalCost}\n` +
      `Status: ${domain.status}\n` +
      `Tags: ${domain.tags.join(", ")}\n` +
      `Alternate Domains: ${domain.alternateDomains.join(", ")}\n` +
      `Notes: ${domain.notes}\n`;

    const blob = new Blob([pdfContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${domain.domainName}-details.pdf`;
    a.click();
  };

  // Get status badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-300";
      case "Expiring Soon":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Expired":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Get row colors based on status
  const getRowColor = (status) => {
    switch (status) {
      case "Active":
        return "";
      case "Expiring Soon":
        return "bg-yellow-50";
      case "Expired":
        return "bg-red-50";
      default:
        return "";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <CheckCircle size={18} className="text-green-600" />;
      case "Expiring Soon":
        return <AlertCircle size={18} className="text-yellow-600" />;
      case "Expired":
        return <X size={18} className="text-red-600" />;
      default:
        return <Clock size={18} className="text-gray-600" />;
    }
  };

  const handleFilterChange = (key, value) => {
    setDomainStates((prev) => ({
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Domain Tracking
          </h1>
          <p className="text-gray-600">
            Manage and track all your domain registrations and renewals
          </p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search domains, owner, company..."
                value={domainStates.searchTerm}
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
                value={domainStates.statusFilter}
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

            {/* Provider Filter */}
            <div className="relative">
              <select
                value={domainStates.providerFilter}
                onChange={(e) => {
                  handleFilterChange("providerFilter", e.target.value);
                }}
                className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                {providers.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={domainStates.sortBy}
                onChange={(e) => {
                  handleFilterChange("sortBy", e.target.value);
                }}
                className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="expiryDate">Sort by Expiry</option>
                <option value="domainName">Sort by Name</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="flex items-center justify-center gap-2 bg-[#00aeef] text-white px-4 py-2 rounded-lg hover:bg-[#00afefca] transition"
            >
              <Plus size={20} /> Add Domain
            </button>
            {/* <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded-lg transition"
            >
              <Download size={20} /> Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded-lg transition"
            >
              <FileText size={20} /> Export PDF
            </button> */}
          </div>
        </div>

        {/* Domains Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Domain
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Expiry Date
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
                {domains.length > 0 ? (
                  domains.map((domain) => (
                    <tr
                      key={domain._id}
                      className={`hover:bg-gray-50 transition ${getRowColor(
                        domain.status
                      )}`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {domain.domainName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {domain.ownerName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {domain.company}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {domain.provider}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(domain.expiryDate)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(domain.status)}
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              domain.status
                            )}`}
                          >
                            {domain.status}
                            {/* {domain.status === "Expiring Soon" &&
                              `$
                            {getDaysUntilExpiry(formatDate(domain.expiryDate))} d`} */}

                            {`\n${getDaysUntilExpiry(
                              formatDate(domain.expiryDate)
                            )} d`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDomain(domain)}
                            className="p-2 text-gray-500 hover:text-blue-600 transition"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(domain)}
                            className="p-2 text-gray-500 hover:text-blue-600 transition"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModel(domain._id)}
                            className="p-2 text-gray-500 hover:text-red-600 transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDownloadDomainPDF(domain)}
                            className="p-2 text-gray-500 hover:text-green-600 transition"
                            title="Download PDF"
                          >
                            <Download size={18} />
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
                      No domains found. Try adjusting your filters or add a new
                      domain.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {domainStates.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            {/* Showing X to Y of Z */}
            <div className="text-sm text-gray-600">
              Showing {(domainStates.page - 1) * domainStates.limit + 1} to{" "}
              {Math.min(
                domainStates.page * domainStates.limit,
                domainStates.totalDomains
              )}{" "}
              of {domainStates.totalDomains}
            </div>

            {/* Pagination buttons */}
            <div className="flex gap-2">
              {/* Prev */}
              <button
                onClick={() =>
                  setDomainStates((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1),
                  }))
                }
                disabled={domainStates.page === 1}
                className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Page Numbers */}
              {[...Array(domainStates.totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() =>
                    setDomainStates((prev) => ({
                      ...prev,
                      page: i + 1,
                    }))
                  }
                  className={`px-3 py-1 rounded-lg ${
                    domainStates.page === i + 1
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
                  setDomainStates((prev) => ({
                    ...prev,
                    page: Math.min(prev.totalPages, prev.page + 1),
                  }))
                }
                disabled={domainStates.page === domainStates.totalPages}
                className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Results counter */}
        <div className="mt-4 text-sm text-gray-600">
          Total: {domainStates.totalDomains} domains
        </div>

        {/* Add Domain Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Domain"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Domain Name *
                </label>
                <input
                  type="text"
                  value={formData.domainName}
                  onChange={(e) =>
                    setFormData({ ...formData, domainName: e.target.value })
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Owner Name *
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerName: e.target.value })
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Owner name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Provider
                </label>
                <select
                  value={formData.provider}
                  onChange={(e) =>
                    setFormData({ ...formData, provider: e.target.value })
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="GoDaddy">GoDaddy</option>
                  <option value="Namecheap">Namecheap</option>
                  <option value="Hostinger">Hostinger</option>
                  <option value="Bluehost">Bluehost</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Registration Date
                </label>
                <input
                  type="date"
                  value={formData.registrationDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registrationDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Renewal Cost
                </label>
                <input
                  type="number"
                  value={formData.renewalCost}
                  onChange={(e) =>
                    setFormData({ ...formData, renewalCost: e.target.value })
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  DNS Provider
                </label>
                <input
                  type="text"
                  value={formData.dnsProvider}
                  onChange={(e) =>
                    setFormData({ ...formData, dnsProvider: e.target.value })
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Cloudflare, Route 53, etc."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Credentials
              </label>
              <textarea
                value={formData.credentials}
                onChange={(e) =>
                  setFormData({ ...formData, credentials: e.target.value })
                }
                className="w-full px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Username, password, access details..."
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Alternate Domains
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newAltDomain}
                  onChange={(e) => setNewAltDomain(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="example.co"
                />
                <button
                  onClick={handleAddAltDomain}
                  className="px-3 py-2 bg-[#00aeef] text-white rounded-lg hover:bg-[#00afefc7]"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.alternateDomains.map((domain) => (
                  <span
                    key={domain}
                    className="px-3 py-1 bg-blue-100 text-[#00aeef] rounded-full text-sm flex items-center gap-2"
                  >
                    {domain}
                    <button
                      onClick={() => handleRemoveAltDomain(domain)}
                      className="hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a tag"
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-[#00aeef] text-white rounded-lg hover:bg-[#00afefcc]"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-green-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes..."
                rows="2"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDomain}
                className="flex-1 px-4 py-2 bg-[#00aeef] text-white rounded-lg hover:bg-[#00afefd0] transition"
              >
                Add Domain
              </button>
            </div>
          </div>
        </Modal>

        {/* View Domain Modal */}
        <Modal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          title="Domain Details"
          size="lg"
        >
          {selectedDomain && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedDomain.domainName}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Owner Name</p>
                    <p className="font-medium text-gray-900">
                      {selectedDomain.ownerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-medium text-gray-900">
                      {selectedDomain.company}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Provider</p>
                    <p className="font-medium text-gray-900">
                      {selectedDomain.provider}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">DNS Provider</p>
                    <p className="font-medium text-gray-900">
                      {selectedDomain.dnsProvider}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Registration Date</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(selectedDomain.registrationDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expiry Date</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(selectedDomain.expiryDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Renewal Cost</p>
                    <p className="font-medium text-gray-900">
                      ${selectedDomain.renewalCost}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        selectedDomain.status
                      )}`}
                    >
                      {selectedDomain.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Credentials
                </h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedDomain.credentials}
                </p>
              </div>

              {selectedDomain.alternateDomains.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Alternate Domains
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDomain.alternateDomains.map((d) => (
                      <span
                        key={d}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedDomain.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDomain.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedDomain.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                  <p className="text-sm text-gray-600">
                    {selectedDomain.notes}
                  </p>
                </div>
              )}

              {selectedDomain.renewalHistory.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Renewal History
                  </h4>
                  <div className="space-y-2">
                    {selectedDomain.renewalHistory.map((renewal, idx) => (
                      <p key={idx} className="text-sm text-gray-600">
                        {renewal.date} - ${renewal.cost}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => handleDownloadDomainPDF(selectedDomain)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <Download size={18} /> Download PDF
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Edit Domain Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Domain"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Domain Name *
                </label>
                <input
                  type="text"
                  value={formData.domainName}
                  onChange={(e) =>
                    setFormData({ ...formData, domainName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Owner Name *
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Owner name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Provider
                </label>
                <select
                  value={formData.provider}
                  onChange={(e) =>
                    setFormData({ ...formData, provider: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="GoDaddy">GoDaddy</option>
                  <option value="Namecheap">Namecheap</option>
                  <option value="Hostinger">Hostinger</option>
                  <option value="Bluehost">Bluehost</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Registration Date
                </label>
                <input
                  type="date"
                  value={formData.registrationDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registrationDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Renewal Cost
                </label>
                <input
                  type="number"
                  value={formData.renewalCost}
                  onChange={(e) =>
                    setFormData({ ...formData, renewalCost: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  DNS Provider
                </label>
                <input
                  type="text"
                  value={formData.dnsProvider}
                  onChange={(e) =>
                    setFormData({ ...formData, dnsProvider: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Cloudflare, Route 53, etc."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Credentials
              </label>
              <textarea
                value={formData.credentials}
                onChange={(e) =>
                  setFormData({ ...formData, credentials: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Username, password, access details..."
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Alternate Domains
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newAltDomain}
                  onChange={(e) => setNewAltDomain(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="example.co"
                />
                <button
                  onClick={handleAddAltDomain}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.alternateDomains.map((domain) => (
                  <span
                    key={domain}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                  >
                    {domain}
                    <button
                      onClick={() => handleRemoveAltDomain(domain)}
                      className="hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a tag"
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-green-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes..."
                rows="2"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditDomain}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Update Domain
              </button>
            </div>
          </div>
        </Modal>

        {/* Delete Domain Modal */}
        <Modal
          isOpen={showDeleteModel}
          onClose={() => {
            setShowDeleteModel(false);
            setDeletedDomain(null);
          }}
          title="Delete Domain"
        >
          {deletedDomain && (
            <div className="space-y-4">
              {/* Confirmation Text */}
              <p className="text-gray-700 text-center">
                Are you sure you want to delete
                <span className="font-semibold">
                  {" "}
                  {deleteDomain.domainName}{" "}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleDeleteDomain}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>

                <button
                  onClick={() => {
                    setShowDeleteModel(false);
                    setDeletedDomain(null);
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
