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
} from "lucide-react";
import useAdminStore from "@/stores/useAdminStore";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Skeleton Loader Component
function SkeletonLoader() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded"></div>
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

export default function LeadsPage() {
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
  console.log(limit);
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
      draft: { bg: "bg-gray-100", text: "text-gray-700" },
      new: { bg: "bg-blue-100", text: "text-blue-700" },
      "in negotiation": { bg: "bg-yellow-100", text: "text-yellow-800" },
      won: { bg: "bg-green-100", text: "text-green-700" },
      loose: { bg: "bg-red-100", text: "text-red-700" },
      canceled: { bg: "bg-gray-100", text: "text-gray-700" },
      assigned: { bg: "bg-purple-100", text: "text-purple-700" },
      "on hold": { bg: "bg-orange-100", text: "text-orange-700" },
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
      <div className="lg:p-1 p-3 space-y-2">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Leads</h1>
            <p className="text-gray-500 text-sm">
              Manage and track all your sales leads
            </p>
          </div>

          <div className="  flex flex-col sm:flex-row gap-3 items-start sm:items-center lg:justify-end justify-between">
            <div className="flex gap-2">
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 bg-[#57a957] hover:bg-green-700 text-white px-4 py-2 rounded-sm font-medium transition"
              >
                <Download size={18} /> Export to Excel
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 bg-[#d03131] hover:bg-red-700 text-white px-4 py-2 rounded-sm font-medium transition"
              >
                <FileText size={18} /> Export to PDF
              </button>

              <button
                className="bg-[#00aeef] hover:bg-[#0093ca] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition"
                onClick={() => setShowAddSidebar(true)}
              >
                <PlusCircle size={18} /> Add Lead
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {allLeadsCount.total}
                </p>
              </div>
              <TrendingUp size={32} className="text-[#00aeef]" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Won</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {allLeadsCount.won}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Lost</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {allLeadsCount.lost}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <TrendingUp size={24} className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">On Hold</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {allLeadsCount.onHold}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Calendar size={24} className="text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar and Filters Combined */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3">
          <Search className="text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by name, company, email, phone..."
            className="flex-1 border-0 focus:outline-none text-sm w-full"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef] flex-1 min-w-[120px]"
          >
            <option value="all">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status} className="">
                {capitalizeWords(status)}
              </option>
            ))}
          </select>

          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="border w-full border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef] flex-1 min-w-[120px]"
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
            className="border w-full border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef] flex-1 min-w-[120px]"
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
            className="border w-full border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef] flex-1 min-w-[130px]"
          />

          <button
            onClick={() => {
              setFilterStatus("all");
              setFilterSource("all");
              setFilterService("all");
              setFilterFollowUpDate("");
            }}
            className="text-sm text-[#00aeef] hover:text-[#0093ca] font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition whitespace-nowrap flex-shrink-0"
          >
            Clear
          </button>
        </div>

        {/* Leads Table */}
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Lead Name</th>
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Country</th>
                <th className="px-6 py-3">Product / Service</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Source</th>
                <th className="px-6 py-3">Follow-up</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads && filteredLeads.length > 0 ? (
                filteredLeads.map((lead, index) => (
                  <tr
                    key={lead._id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {startLeadNumber + index}
                    </td>
                    <td
                      className="px-6 py-4 flex items-center gap-3 cursor-pointer"
                      onClick={() => handleViewClick(lead)}
                    >
                      <div>
                        <p className="font-medium text-gray-900">{lead.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{lead.company}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Mail size={14} /> {lead.email || "-"}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Phone size={14} /> {lead.phone || "-"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {lead.country || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <div className="text-xs">
                        <div>{lead.product || "-"}</div>
                        <div className="text-gray-500">
                          {lead.service || "-"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          getStatusColor(lead.status).bg
                        } ${getStatusColor(lead.status).text}`}
                      >
                        {capitalizeWords(lead.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{lead.source}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {formatDate(lead.followUpDate)}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
                        onClick={() => handleEditClick(lead)}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
                        onClick={() => handleDeleteClick(lead)}
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition"
                        onClick={() => handleViewClick(lead)}
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-gray-500">
                    {loading ? "Loading..." : "No leads found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">
                  Showing {startLeadNumber}-{endLeadNumber} of {total} leads
                </span>
              </div>

              {/* Center: Pagination buttons */}
              <div className="flex justify-center items-center gap-2">
                <button
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    const isCurrentPage = pageNum === page;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg border transition ${
                          isCurrentPage
                            ? "bg-[#00aeef] text-white border-[#00aeef] font-semibold"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>

              {/* Right side: Current page info */}
              <div className="text-sm text-gray-600 text-right">
                <span className="font-medium">
                  Page {page} of {totalPages}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Lead Sidebar */}
      {showAddSidebar && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setShowAddSidebar(false)}
          />
          <div className="lg:h-150 md:h-100 md:w-300 h-130 w-full md:p-5 p-3 m-4 overflow-hidden  justify-center items-center z-30   bg-white shadow-2xl overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Add New Lead
                </h2>
                <button
                  onClick={() => setShowAddSidebar(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lead Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter lead name"
                    className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    value={newLead.name}
                    onChange={(e) =>
                      setNewLead({ ...newLead, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    value={newLead.email}
                    onChange={(e) =>
                      setNewLead({ ...newLead, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="Enter company"
                    className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    value={newLead.company}
                    onChange={(e) =>
                      setNewLead({ ...newLead, company: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone"
                    className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    value={newLead.phone}
                    onChange={(e) =>
                      setNewLead({ ...newLead, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    placeholder="Enter country"
                    className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    value={newLead.country}
                    onChange={(e) =>
                      setNewLead({ ...newLead, country: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product
                  </label>
                  <select
                    value={newLead.product}
                    onChange={(e) =>
                      setNewLead({ ...newLead, product: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product._id} value={product.name}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service
                  </label>
                  <select
                    value={newLead.service}
                    onChange={(e) =>
                      setNewLead({ ...newLead, service: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  >
                    <option value="">Select Service</option>
                    {services.map((service) => (
                      <option key={service._id} value={service.name}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <select
                    value={newLead.source}
                    onChange={(e) =>
                      setNewLead({ ...newLead, source: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  >
                    <option value="">Select Source</option>
                    {sources.map((src) => (
                      <option key={src} value={src}>
                        {src}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newLead.status}
                    onChange={(e) =>
                      setNewLead({ ...newLead, status: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  >
                    <option value="">Select Status</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To
                  </label>
                  <select
                    value={newLead.assignedTo}
                    onChange={(e) =>
                      setNewLead({ ...newLead, assignedTo: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  >
                    <option value="">Select Admin</option>
                    {admins.map((admin) => (
                      <option key={admin._id} value={admin._id}>
                        {admin.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    placeholder="Follow-up Date"
                    className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    value={newLead.followUpDate}
                    onChange={(e) =>
                      setNewLead({ ...newLead, followUpDate: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    placeholder="Enter notes"
                    className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    value={newLead.notes}
                    onChange={(e) =>
                      setNewLead({ ...newLead, notes: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end items-end ">
                <button
                  className=" bg-[#00aeef] md:px-10 px-4 hover:bg-[#0093ca] text-white py-2 rounded-lg font-medium transition mt-6"
                  onClick={handleAddLead}
                  disabled={creating}
                >
                  {creating ? "Saving..." : "Save Lead"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Lead Modal */}
      {showViewModel && selectedLead && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-4xl p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowViewModel(false);
                setSelectedLead(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={24} />
            </button>

            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                {selectedLead.name}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {selectedLead.company}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail size={16} className="text-[#00aeef]" />
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                      Email
                    </p>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {selectedLead.email || "-"}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone size={16} className="text-[#00aeef]" />
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                      Phone
                    </p>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {selectedLead.phone || "-"}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                    Country
                  </p>
                  <p className="text-gray-900 font-medium">
                    {selectedLead.country || "-"}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                    Source
                  </p>
                  <p className="text-gray-900 font-medium">
                    {selectedLead.source || "-"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                    Status
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      getStatusColor(selectedLead.status).bg
                    } ${getStatusColor(selectedLead.status).text}`}
                  >
                    {capitalizeWords(selectedLead.status)}
                  </span>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                    Product
                  </p>
                  <p className="text-gray-900 font-medium">
                    {selectedLead.product || "-"}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                    Service
                  </p>
                  <p className="text-gray-900 font-medium">
                    {selectedLead.service || "-"}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={16} className="text-[#00aeef]" />
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                      Follow-up Date
                    </p>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {formatDate(selectedLead.followUpDate)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                Assigned To
              </p>
              <p className="text-gray-900 font-medium">
                {selectedLead.assignedTo?.email}
              </p>
            </div>

            {selectedLead.notes && (
              <div className="mt-6  rounded-lg p-4 border border-yellow-100">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                  Notes
                </p>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {selectedLead.notes}
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center text-xs text-gray-400">
              <Calendar size={14} className="mr-1" />
              Added: {formatDate(selectedLead.createdAt)}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                className="flex-1 bg-[#00aeef] hover:bg-[#0093ca] text-white py-2 rounded-lg font-medium transition"
                onClick={() => {
                  handleConvertToClient(selectedLead);
                }}
              >
                Convert To Client
              </button>
              <button
                className="flex-1 border border-gray-300 hover:bg-gray-50 py-2 rounded-lg font-medium transition"
                onClick={() => {
                  setShowViewModel(false);
                  setSelectedLead(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lead Sidebar */}
      {showEditSidebar && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setShowEditSidebar(false)}
          />
          <div className="lg:h-150 md:h-100 md:w-300 h-130 w-full md:p-5 p-3 m-4 overflow-hidden  justify-center items-center z-30   bg-white shadow-2xl overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Edit Lead
                </h2>
                <button
                  onClick={() => {
                    setShowEditSidebar(false);
                    setSelectedLead(null);
                  }}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X size={24} />
                </button>
              </div>

              {editLoading ? (
                <SkeletonLoader />
              ) : (
                <div>
                  <div className="grid lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lead Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Lead Name"
                        className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                        value={editLeadData.name}
                        onChange={(e) =>
                          setEditLeadData({
                            ...editLeadData,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        placeholder="Company"
                        className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                        value={editLeadData.company}
                        onChange={(e) =>
                          setEditLeadData({
                            ...editLeadData,
                            company: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="Email"
                        className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                        value={editLeadData.email}
                        onChange={(e) =>
                          setEditLeadData({
                            ...editLeadData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                        value={editLeadData.phone}
                        onChange={(e) =>
                          setEditLeadData({
                            ...editLeadData,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        placeholder="Country"
                        className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                        value={editLeadData.country}
                        onChange={(e) =>
                          setEditLeadData({
                            ...editLeadData,
                            country: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product
                      </label>
                      <select
                        value={editLeadData.product}
                        onChange={(e) =>
                          setEditLeadData({
                            ...editLeadData,
                            product: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service
                      </label>
                      <select
                        value={editLeadData.service}
                        onChange={(e) =>
                          setEditLeadData({
                            ...editLeadData,
                            service: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Source
                      </label>
                      <select
                        value={editLeadData.source}
                        onChange={(e) =>
                          setEditLeadData({
                            ...editLeadData,
                            source: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                      >
                        <option value="">Select Source</option>
                        {sources.map((src) => (
                          <option key={src} value={src}>
                            {src}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={editLeadData.status}
                        onChange={(e) =>
                          setEditLeadData({
                            ...editLeadData,
                            status: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                      >
                        <option value="">Select Status</option>
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assigned To
                      </label>
                      <select
                        value={editLeadData.assignedTo}
                        onChange={(e) =>
                          setEditLeadData({
                            ...editLeadData,
                            assignedTo: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                      >
                        <option value="">Select Admin</option>
                        {admins.map((admin) => (
                          <option key={admin._id} value={admin._id}>
                            {admin.email}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Follow-up Date
                      </label>
                      <input
                        type="date"
                        placeholder="Follow-up Date"
                        className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                        value={editLeadData.followUpDate}
                        onChange={(e) =>
                          setEditLeadData({
                            ...editLeadData,
                            followUpDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        placeholder="Notes"
                        className="w-full border border-gray-300 rounded-sm  p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                        value={editLeadData.notes}
                        onChange={(e) =>
                          setEditLeadData({
                            ...editLeadData,
                            notes: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="flex  gap-2 mt-6">
                      <button
                        className="flex-1 bg-[#00aeef] hover:bg-[#0093ca] text-white py-3 px-7 w-80 rounded-lg font-medium transition disabled:opacity-50"
                        onClick={handleSaveEdit}
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        className="flex-1 border border-gray-300 py-2 px-5 rounded-lg hover:bg-gray-50 transition"
                        onClick={() => {
                          setShowEditSidebar(false);
                          setSelectedLead(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Delete Lead
            </h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <strong>{selectedLead?.name || "this lead"}</strong>? This action
              cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                Delete
              </button>
              <button
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedLead(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
