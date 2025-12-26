"use client";

import { useEffect, useState } from "react";
import {
  Search,
  PlusCircle,
  Mail,
  Phone,
  X,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  Download,
  FileText,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  Filter,
} from "lucide-react";
import useAdminStore from "@/stores/useAdminStore";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Skeleton Loader Component
function SkeletonLoader() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}

const sources = [
  "LinkedIn",
  "Social Media",
  "Website",
  "Advertising",
  "Friend",
  "Professional Network",
  "Customer Referral",
  "Sales",
  "BNI",
  "Association",
];

const statuses = [
  "Draft",
  "New",
  "In Negotiation",
  "Won",
  "Loose",
  "Canceled",
  "Assigned",
  "On Hold",
];

export default function LeadsContent() {
  const [search, setSearch] = useState("");
  const [showAddSidebar, setShowAddSidebar] = useState(false);
  const [showViewModel, setShowViewModel] = useState(false);
  const [showEditSidebar, setShowEditSidebar] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [filterService, setFilterService] = useState("all");
  const [filterFollowUpDate, setFilterFollowUpDate] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const router = useRouter();

  const {
    leads,
    getAllLeads,
    createLead,
    updateLead,
    deleteLead,
    services,
    getAllServices,
    products,
    getAllProducts,
    admins,
    getAllAdmins,
  } = useAdminStore();

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [allLeadsCount, setAllLeadsCount] = useState({
    total: 0,
    won: 0,
    lost: 0,
    onHold: 0,
  });

  const [selectedLead, setSelectedLead] = useState(null);

  const [newLead, setNewLead] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    product: "",
    service: "",
    source: "Website",
    status: "New",
    assignedTo: undefined,
    notes: "",
    followUpDate: "",
  });

  const [editLeadData, setEditLeadData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    product: "",
    service: "",
    source: "Website",
    status: "New",
    assignedTo: undefined,
    notes: "",
    followUpDate: "",
  });

  const handleConvertToClient = (lead) => {
    router.push(
      `/admin/clients?convert=true&name=${encodeURIComponent(
        lead.name
      )}&email=${encodeURIComponent(
        lead.email
      )}&company_name=${encodeURIComponent(lead.company)}`
    );
  };

  const handleAddLead = async () => {
    if (!newLead.name || !newLead.email) {
      alert("Please fill in required fields (Name & Email).");
      return;
    }
    setCreating(true);
    try {
      await createLead(newLead);
      await getAllLeads({ page, limit, search });
      setNewLead({
        name: "",
        company: "",
        email: "",
        phone: "",
        country: "",
        product: "",
        service: "",
        source: "Website",
        status: "New",
        assignedTo: undefined,
        notes: "",
        followUpDate: "",
      });
      setShowAddSidebar(false);
    } catch (error) {
      console.error("Create lead error:", error);
      alert("Failed to create lead");
    } finally {
      setCreating(false);
    }
  };

  const handleEditClick = (lead) => {
    setSelectedLead(lead);
    setEditLoading(true);
    setTimeout(() => {
      setEditLeadData({
        name: lead.name || "",
        company: lead.company || "",
        email: lead.email || "",
        phone: lead.phone || "",
        country: lead.country || "",
        product: lead.product || "",
        service: lead.service || "",
        source: lead.source || "Website",
        status: lead.status || "New",
        assignedTo: lead.assignedTo && lead.assignedTo._id,
        notes: lead.notes || "",
        followUpDate: lead.followUpDate
          ? new Date(lead.followUpDate).toISOString().slice(0, 10)
          : "",
      });
      setEditLoading(false);
    }, 300);
    setShowEditSidebar(true);
  };

  const handleDeleteClick = (lead) => {
    setSelectedLead(lead);
    setShowDeleteModal(true);
  };

  const handleViewClick = (lead) => {
    setSelectedLead(lead);
    setShowViewModel(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedLead) return;
    try {
      setLoading(true);
      await updateLead(selectedLead._id, editLeadData);
      setShowEditSidebar(false);
      setSelectedLead(null);
      await getAllLeads({ page, limit, search });
    } catch (error) {
      console.error("Update lead error:", error);
      alert("Failed to update lead");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedLead) return;
    try {
      setLoading(true);
      await deleteLead(selectedLead._id);
      setShowDeleteModal(false);
      setSelectedLead(null);
      await getAllLeads({ page, limit, search });
    } catch (error) {
      console.error("Delete lead error:", error);
      alert("Failed to delete lead");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    const { leads: allLeads } = await getAllLeads({
      page: 1,
      limit: 999999,
      forPdf: true,
    });

    if (!allLeads || allLeads.length === 0) {
      alert("No leads to export");
      return;
    }

    const headers = [
      "Lead Name",
      "Company",
      "Email",
      "Phone",
      "Country",
      "Product",
      "Service",
      "Source",
      "Status",
      "Follow-up",
      "Assigned To",
      "Notes",
    ];

    const rows = allLeads.map((lead) => [
      lead.name || "",
      lead.company || "",
      lead.email || "",
      lead.phone || "",
      lead.country || "",
      lead.product || "",
      lead.service || "",
      lead.source || "",
      lead.status || "",
      formatDate(lead.followUpDate),
      lead.assignedTo?.email || "",
      (lead.notes || "").replace(/\n/g, " "),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            const str = String(cell || "");
            return str.includes(",") ? `"${str}"` : str;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `leads_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = async () => {
    const { leads: allLeads } = await getAllLeads({
      page: 1,
      limit: 999999,
      forPdf: true,
    });

    if (!allLeads || allLeads.length === 0) {
      alert("No leads to export");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Leads Report", 14, 15);

    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 23);

    const tableData = allLeads.map((lead) => [
      lead.name || "-",
      lead.email || "-",
      lead.phone || "-",
      lead.company || "-",
      lead.service || "-",
      lead.status || "-",
      formatDate(lead.followUpDate),
    ]);

    autoTable(doc, {
      head: [
        ["Name", "Email", "Phone", "Company", "Service", "Status", "Follow-up"],
      ],
      body: tableData,
      startY: 30,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 174, 239] },
    });

    doc.save(`leads_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const getFilteredLeads = () => {
    return leads.filter((lead) => {
      if (
        filterStatus !== "all" &&
        lead.status?.toLowerCase() !== filterStatus.toLowerCase()
      ) {
        return false;
      }
      if (filterSource !== "all" && lead.source !== filterSource) {
        return false;
      }
      if (filterService !== "all" && lead.service !== filterService) {
        return false;
      }
      if (filterFollowUpDate) {
        const leadFollowUpDate = lead.followUpDate
          ? new Date(lead.followUpDate).toISOString().split("T")[0]
          : "";
        if (leadFollowUpDate !== filterFollowUpDate) {
          return false;
        }
      }
      return true;
    });
  };

  const filteredLeads = getFilteredLeads();

  const getStatistics = () => {
    const stats = {
      won: leads.filter((l) => l.status?.toLowerCase() === "won").length,
      lost: leads.filter((l) => l.status?.toLowerCase() === "loose").length,
      onHold: leads.filter((l) => l.status?.toLowerCase() === "on hold").length,
      total: leads.length,
    };
    return stats;
  };

  const stats = getStatistics();

  const getStatusColor = (status) => {
    const s = (status || "").toLowerCase();
    const statusColors = {
      draft: { bg: "bg-gray-100", text: "text-white", badge: "bg-gray-500" },
      new: { bg: "bg-blue-100", text: "text-blue-700", badge: "bg-blue-500" },
      "in negotiation": {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        badge: "bg-yellow-500",
      },
      won: {
        bg: "bg-green-100",
        text: "text-green-700",
        badge: "bg-green-500",
      },
      loose: { bg: "bg-red-100", text: "text-red-700", badge: "bg-red-500" },
      canceled: {
        bg: "bg-gray-100",
        text: "text-white",
        badge: "bg-gray-500",
      },
      assigned: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        badge: "bg-purple-500",
      },
      "on hold": {
        bg: "bg-orange-100",
        text: "text-orange-700",
        badge: "bg-orange-500",
      },
    };
    return statusColors[s] || statusColors["new"];
  };

  const capitalizeWords = (str) =>
    String(str || "")
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
      .join(" ");

  useEffect(() => {
    const loadFullCounts = async () => {
      const data = await getAllLeads({ page: 1, limit: 999999, forPdf: true });
      const list = data.leads;

      setAllLeadsCount({
        total: list.length,
        won: list.filter((l) => l.status?.toLowerCase() === "won").length,
        lost: list.filter((l) => l.status?.toLowerCase() === "loose").length,
        onHold: list.filter((l) => l.status?.toLowerCase() === "on hold")
          .length,
      });
    };

    loadFullCounts();
  }, []);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const { leads, total, currentPage, totalPages } = await getAllLeads({
          page,
          limit,
          search,
          filterStatus,
          filterSource,
          filterService,
          filterFollowUpDate,
        });
        setPage(currentPage);
        setTotal(total);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [
    page,
    limit,
    search,
    filterStatus,
    filterSource,
    filterService,
    filterFollowUpDate,
  ]);

  useEffect(() => {
    getAllServices();
    getAllProducts();
    getAllAdmins();
  }, []);

  const formatDate = (d) => {
    if (!d) return "-";
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString();
    } catch {
      return d;
    }
  };

  const truncate = (text, n = 40) =>
    text && text.length > n ? text.slice(0, n) + "..." : text || "-";

  const startLeadNumber = (page - 1) * limit + 1;
  const endLeadNumber = Math.min(page * limit, total);

  return (
    <>
      <div className="min-h-screen ">
        <div className="max-w-7xl mx-auto lg:p-0 p-3">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#2F81F7]">
                  Leads
                </h1>
                <p className="text-[#ffffffb9] ">
                  Manage and track all your sales leads
                </p>
              </div>

              <button
                onClick={() => setShowAddSidebar(true)}
                className="flex items-center justify-center gap-2 bg-[#238636] hover:shadow-lg text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <PlusCircle size={18} />
                Add Lead
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Leads"
                value={allLeadsCount.total}
                icon={TrendingUp}
                color="from-blue-500 to-blue-600"
              />
              <StatCard
                title="Won"
                value={allLeadsCount.won}
                icon={TrendingUp}
                color="from-green-500 to-green-600"
              />
              <StatCard
                title="Lost"
                value={allLeadsCount.lost}
                icon={TrendingUp}
                color="from-red-500 to-red-600"
              />
              <StatCard
                title="On Hold"
                value={allLeadsCount.onHold}
                icon={Calendar}
                color="from-orange-500 to-orange-600"
              />
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="-background rounded-xl shadow-sm border border-[#ffffff3b] lg:p-1 p-2 mb-6">
            <div className="flex items-center gap-2 sm:mb-0 justify-center">
              <Search className="text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, company, email..."
                className="flex-1 bg-transparent border-0 placeholder:text-[#ffffff75] focus:outline-none text-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background cursor-pointer text-gray-600 transition"
              >
                <Filter size={18} />
                <span className="hidden sm:inline text-sm font-medium">
                  Filters
                </span>
              </button>
            </div>

            {/* Advanced Filters */}
            {filterOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-[#ffffff3b]">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border text-white bg-background border-[#ffffff3b] rounded-lg px-3 py-2 text-sm focus:outline-none  focus:ring-[#83898b]"
                >
                  <option value="all">All Status</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {capitalizeWords(status)}
                    </option>
                  ))}
                </select>

                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  className="border text-white bg-background border-[#ffffff3b] rounded-lg px-3 py-2 text-sm focus:outline-none  focus:ring-[#83898b]"
                >
                  <option value="all">All Sources</option>
                  {sources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>

                <select
                  value={filterService}
                  onChange={(e) => setFilterService(e.target.value)}
                  className="border text-white bg-background border-[#ffffff3b] rounded-lg px-3 py-2 text-sm focus:outline-none  focus:ring-[#83898b]"
                >
                  <option value="all">All Services</option>
                  {services.map((service) => (
                    <option key={service._id} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={filterFollowUpDate}
                  onChange={(e) => setFilterFollowUpDate(e.target.value)}
                  className="border text-white bg-background border-[#ffffff3b] rounded-lg px-3 py-2 text-sm focus:outline-none  focus:ring-[#83898b]"
                />

                <button
                  onClick={() => {
                    setFilterStatus("all");
                    setFilterSource("all");
                    setFilterService("all");
                    setFilterFollowUpDate("");
                  }}
                  className="col-span-1 sm:col-span-2 lg:col-span-4 text-sm text-[#ffffffc4] hover:text-[#d9d9d9] font-medium px-3 py-2 rounded-lg hover:bg-background transition"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 border-2 border-[#ffffff3b] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-background transition"
            >
              <Download size={16} className="text-[#238636]" />
              <span className="hidden sm:inline text-[#238636]">
                Export Excel
              </span>
              <span className="sm:hidden">Excel</span>
            </button>

            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 border-2 border-[#ffffff3b] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-background transition"
            >
              <FileText size={16} />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>

          {/* Leads Table */}
          {loading ? (
            <SkeletonLoader />
          ) : (
            <div className="bg-[#0D1117] rounded-xl shadow-sm border border-[#ffffff61] overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#161B22] border-b border-[#ffffff4a]">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold texwhite]">
                        #
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-[white]">
                        Lead Name
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-[white]">
                        Company
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-[white]">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-[white]">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-[white]">
                        Service
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-[white]">
                        Follow-up
                      </th>
                      <th className="px-6 py-4 text-center font-semibold text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ffffff51]">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td
                          colSpan="8"
                          className="px-6 py-12 text-center text-white"
                        >
                          No leads found
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead, idx) => (
                        <tr
                          key={lead._id}
                          className="hover:bg-background transition-colors"
                        >
                          <td className="px-6 py-4 text-[white]">
                            {startLeadNumber + idx}
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-white">
                              {lead.name}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-white">
                            {truncate(lead.company, 20)}
                          </td>
                          <td className="px-6 py-4">
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-[#00aeef] hover:underline flex items-center gap-1"
                            >
                              <Mail size={14} />
                              {truncate(lead.email, 18)}
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`${
                                getStatusColor(lead.status).badge
                              } text-white px-3 py-1 rounded-full text-xs font-semibold`}
                            >
                              {capitalizeWords(lead.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-white">
                            {truncate(lead.service, 15)}
                          </td>
                          <td className="px-6 py-4 text-white text-sm">
                            {formatDate(lead.followUpDate)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleViewClick(lead)}
                                className="p-2 hover:bg-blue-50 rounded-lg text-white hover:text-[#00aeef] transition"
                                title="View"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleEditClick(lead)}
                                className="p-2 hover:bg-yellow-50 rounded-lg text-white hover:text-yellow-600 transition"
                                title="Edit"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(lead)}
                                className="p-2 hover:bg-red-50 rounded-lg text-white hover:text-red-600 transition"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y-10 divide-background">
                {filteredLeads.length === 0 ? (
                  <div className="px-4 py-12 text-center text-gray-500">
                    No leads found
                  </div>
                ) : (
                  filteredLeads.map((lead, idx) => (
                    <div
                      key={lead._id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white">
                            {lead.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {lead.company}
                          </p>
                        </div>
                        <span
                          className={`${
                            getStatusColor(lead.status).badge
                          } text-white px-2 py-1 rounded-full text-xs font-semibold`}
                        >
                          {capitalizeWords(lead.status)}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4 text-sm">
                        <p className="flex items-center gap-2 text-gray-600">
                          <Mail size={14} className="text-gray-400" />
                          {truncate(lead.email, 25)}
                        </p>
                        {lead.phone && (
                          <p className="flex items-center gap-2 text-gray-600">
                            <Phone size={14} className="text-gray-400" />
                            {lead.phone}
                          </p>
                        )}
                        {lead.service && (
                          <p className="text-gray-600">
                            <span className="font-medium">Service:</span>{" "}
                            {lead.service}
                          </p>
                        )}
                        {lead.followUpDate && (
                          <p className="flex items-center gap-2 text-gray-600">
                            <Calendar size={14} className="text-gray-400" />
                            {formatDate(lead.followUpDate)}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewClick(lead)}
                          className="flex-1 px-3 py-2 text-xs font-medium bg-background text-[#00aeef] rounded-lg hover:bg-blue-100 transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditClick(lead)}
                          className="flex-1 px-3 py-2 text-xs font-medium bg-background text-yellow-600 rounded-lg hover:bg-yellow-100 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(lead)}
                          className="flex-1 px-3 py-2 text-xs font-medium bg-background text-red-600 rounded-lg hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-3">
                  <p className="text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-semibold">{startLeadNumber}</span> to{" "}
                    <span className="font-semibold">{endLeadNumber}</span> of{" "}
                    <span className="font-semibold">{total}</span> leads
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                    >
                      <ArrowLeft size={16} />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (p) => (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                              page === p
                                ? "bg-[#00aeef] text-white"
                                : "border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number.parseInt(e.target.value));
                      setPage(1);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  >
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Sidebar */}
      {(showAddSidebar || showEditSidebar) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 bg-opacity-50"
            onClick={() => {
              setShowAddSidebar(false);
              setShowEditSidebar(false);
            }}
          />

          <div className="relative min-h-screen flex items-end sm:items-center justify-center p-4">
            <div className="relative bg-background rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-[#2F81F7]">
                  {showAddSidebar ? "Add New Lead" : "Edit Lead"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddSidebar(false);
                    setShowEditSidebar(false);
                  }}
                  className="p-2 hover:bg-background text-[red] rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={showAddSidebar ? newLead.name : editLeadData.name}
                    onChange={(e) => {
                      if (showAddSidebar) {
                        setNewLead({ ...newLead, name: e.target.value });
                      } else {
                        setEditLeadData({
                          ...editLeadData,
                          name: e.target.value,
                        });
                      }
                    }}
                    className="w-full border border-gray-300 text-white placeholder:text-[#ffffff64] rounded-lg px-4 py-2 "
                    placeholder="Lead name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={showAddSidebar ? newLead.email : editLeadData.email}
                    onChange={(e) => {
                      if (showAddSidebar) {
                        setNewLead({ ...newLead, email: e.target.value });
                      } else {
                        setEditLeadData({
                          ...editLeadData,
                          email: e.target.value,
                        });
                      }
                    }}
                    className="w-full border border-gray-300 text-white placeholder:text-[#ffffff64] rounded-lg px-4 py-2 "
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={
                      showAddSidebar ? newLead.company : editLeadData.company
                    }
                    onChange={(e) => {
                      if (showAddSidebar) {
                        setNewLead({ ...newLead, company: e.target.value });
                      } else {
                        setEditLeadData({
                          ...editLeadData,
                          company: e.target.value,
                        });
                      }
                    }}
                    className="w-full border border-gray-300 text-white placeholder:text-[#ffffff64] rounded-lg px-4 py-2 "
                    placeholder="Company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={showAddSidebar ? newLead.phone : editLeadData.phone}
                    onChange={(e) => {
                      if (showAddSidebar) {
                        setNewLead({ ...newLead, phone: e.target.value });
                      } else {
                        setEditLeadData({
                          ...editLeadData,
                          phone: e.target.value,
                        });
                      }
                    }}
                    className="w-full border border-gray-300 text-white placeholder:text-[#ffffff64] rounded-lg px-4 py-2 "
                    placeholder="Phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={
                      showAddSidebar ? newLead.country : editLeadData.country
                    }
                    onChange={(e) => {
                      if (showAddSidebar) {
                        setNewLead({ ...newLead, country: e.target.value });
                      } else {
                        setEditLeadData({
                          ...editLeadData,
                          country: e.target.value,
                        });
                      }
                    }}
                    className="w-full border border-gray-300 text-white placeholder:text-[#ffffff64] rounded-lg px-4 py-2 "
                    placeholder="Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Service
                  </label>
                  <select
                    value={
                      showAddSidebar ? newLead.service : editLeadData.service
                    }
                    onChange={(e) => {
                      if (showAddSidebar) {
                        setNewLead({ ...newLead, service: e.target.value });
                      } else {
                        setEditLeadData({
                          ...editLeadData,
                          service: e.target.value,
                        });
                      }
                    }}
                    className="w-full border bg-background border-gray-300 text-white placeholder:text-[#ffffff64] rounded-lg px-4 py-2 "
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service._id} value={service.name}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Product
                  </label>
                  <select
                    value={
                      showAddSidebar ? newLead.product : editLeadData.product
                    }
                    onChange={(e) => {
                      if (showAddSidebar) {
                        setNewLead({ ...newLead, product: e.target.value });
                      } else {
                        setEditLeadData({
                          ...editLeadData,
                          product: e.target.value,
                        });
                      }
                    }}
                    className="w-full border bg-background border-gray-300 text-white placeholder:text-[#ffffff64] rounded-lg px-4 py-2 "
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product._id} value={product.name}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Status
                  </label>
                  <select
                    value={
                      showAddSidebar ? newLead.status : editLeadData.status
                    }
                    onChange={(e) => {
                      if (showAddSidebar) {
                        setNewLead({ ...newLead, status: e.target.value });
                      } else {
                        setEditLeadData({
                          ...editLeadData,
                          status: e.target.value,
                        });
                      }
                    }}
                    className="w-full border bg-background border-gray-300 text-white placeholder:text-[#ffffff64] rounded-lg px-4 py-2 "
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {capitalizeWords(status)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Source
                  </label>
                  <select
                    value={
                      showAddSidebar ? newLead.source : editLeadData.source
                    }
                    onChange={(e) => {
                      if (showAddSidebar) {
                        setNewLead({ ...newLead, source: e.target.value });
                      } else {
                        setEditLeadData({
                          ...editLeadData,
                          source: e.target.value,
                        });
                      }
                    }}
                    className="w-full border bg-background border-gray-300 text-white placeholder:text-[#ffffff64] rounded-lg px-4 py-2 "
                  >
                    {sources.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Assigned To
                  </label>
                  <select
                    value={
                      showAddSidebar
                        ? newLead.assignedTo || ""
                        : editLeadData.assignedTo || ""
                    }
                    onChange={(e) => {
                      if (showAddSidebar) {
                        setNewLead({
                          ...newLead,
                          assignedTo: e.target.value || undefined,
                        });
                      } else {
                        setEditLeadData({
                          ...editLeadData,
                          assignedTo: e.target.value || undefined,
                        });
                      }
                    }}
                    className="w-full bg-background border border-gray-300 text-white placeholder:text-[#ffffff64] rounded-lg px-4 py-2 "
                  >
                    <option value="">Unassigned</option>
                    {admins.map((admin) => (
                      <option key={admin._id} value={admin._id}>
                        {admin.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={
                      showAddSidebar
                        ? newLead.followUpDate
                        : editLeadData.followUpDate
                    }
                    onChange={(e) => {
                      if (showAddSidebar) {
                        setNewLead({
                          ...newLead,
                          followUpDate: e.target.value,
                        });
                      } else {
                        setEditLeadData({
                          ...editLeadData,
                          followUpDate: e.target.value,
                        });
                      }
                    }}
                    className="w-full bg-background border border-gray-300 text-white placeholder:text-[#ffffff64] rounded-lg px-4 py-2 "
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Notes
                  </label>
                  <textarea
                    value={showAddSidebar ? newLead.notes : editLeadData.notes}
                    onChange={(e) => {
                      if (showAddSidebar) {
                        setNewLead({ ...newLead, notes: e.target.value });
                      } else {
                        setEditLeadData({
                          ...editLeadData,
                          notes: e.target.value,
                        });
                      }
                    }}
                    className="w-full border border-gray-300 text-white placeholder:text-[#ffffff64] rounded-lg px-4 py-2 "
                    placeholder="Add notes..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t border-gray-200 bg-background">
                <button
                  onClick={() => {
                    setShowAddSidebar(false);
                    setShowEditSidebar(false);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 placeholder:text-white rounded-lg text-white font-medium hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={showAddSidebar ? handleAddLead : handleSaveEdit}
                  disabled={creating || editLoading || loading}
                  className="flex-1 px-4 py-2 bg-[#238636] text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50"
                >
                  {creating || editLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModel && selectedLead && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 bg-opacity-50"
            onClick={() => setShowViewModel(false)}
          />

          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-background rounded-2xl w-full max-w-2xl shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-white">Lead Details</h2>
                <button
                  onClick={() => setShowViewModel(false)}
                  className="p-2 hover:bg-background text-[red] rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DetailItem label="Name" value={selectedLead.name} />
                  <DetailItem label="Email" value={selectedLead.email} />
                  <DetailItem label="Company" value={selectedLead.company} />
                  <DetailItem label="Phone" value={selectedLead.phone} />
                  <DetailItem label="Country" value={selectedLead.country} />
                  <DetailItem label="Service" value={selectedLead.service} />
                  <DetailItem label="Product" value={selectedLead.product} />
                  <DetailItem label="Source" value={selectedLead.source} />
                  <DetailItem
                    label="Status"
                    value={
                      <span
                        className={`${
                          getStatusColor(selectedLead.status).badge
                        } text-white px-3 py-1 rounded-full text-sm font-semibold`}
                      >
                        {capitalizeWords(selectedLead.status)}
                      </span>
                    }
                  />
                  <DetailItem
                    label="Follow-up Date"
                    value={formatDate(selectedLead.followUpDate)}
                  />
                  <DetailItem
                    label="Assigned To"
                    value={selectedLead.assignedTo?.email || "-"}
                  />
                  <DetailItem
                    label="Created At"
                    value={formatDate(selectedLead.createdAt)}
                  />
                </div>

                {selectedLead.notes && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                    <p className="text-white text-sm whitespace-pre-wrap">
                      {selectedLead.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 p-6 border-t border-gray-200 bg-background">
                <button
                  onClick={() => setShowViewModel(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-white font-medium hover:bg-gray-100 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleConvertToClient(selectedLead);
                    setShowViewModel(false);
                  }}
                  className="flex-1 px-4 py-2 bg-[#238636] text-white rounded-lg font-medium hover:shadow-lg transition"
                >
                  Convert to Client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedLead && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 bg-opacity-50"
            onClick={() => setShowDeleteModal(false)}
          />

          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-background rounded-2xl w-full max-w-sm shadow-2xl">
              <div className="p-6 text-center">
                <div className="mx-auto w-12 h-12  rounded-full flex items-center justify-center mb-4">
                  <Trash2 size={24} className="text-red-600" />
                </div>

                <h2 className="text-xl font-bold text-[#bb0707] mb-2">
                  Delete Lead?
                </h2>
                <p className="text-[#ffffff51] mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{selectedLead.name}</span>?
                  This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-white font-medium hover:bg-[#0000006f] transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-background border  text-[red] rounded-lg font-medium hover:bg-red-700 hover:text-white transition disabled:opacity-50"
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Helper Components
function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-background border border-[#ffffff2d] rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[white] text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-[white] mt-2">{value}</p>
        </div>
        {/* <div className={`bg-gradient-to-br ${color} p-3 rounded-xl text-white`}>
          <Icon size={24} />
        </div> */}
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-[#ffffff63] font-medium">{label}</p>
      <p className="text-white font-semibold mt-1">{value || "-"}</p>
    </div>
  );
}
