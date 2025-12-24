"use client";

import { useState, useEffect } from "react";
import {
  PlusCircle,
  X,
  Search,
  Download,
  FileText,
  TrendingUp,
  Calendar,
  Clock,
  Users,
  MapPin,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useAdminStore from "@/stores/useAdminStore";

const MeetingPage = () => {
  const {
    meetings,
    getAllMeetings,
    createMeeting,
    updateMeeting,
    deleteMeeting,
  } = useAdminStore();

  const [meetingStates, setMeetingStates] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalMeetings: 0,
    loading: false,
    searchTerm: "",
    filterStatus: "",
    filterType: "",
    filterDate: "",
  });

  // const [meetings, setMeetings] = useState([
  //   {
  //     _id: "1",
  //     title: "Product Demo - TechCorp",
  //     attendees: ["John Doe", "Sarah Smith"],
  //     date: "2025-01-15",
  //     time: "10:00 AM",
  //     duration: "30 min",
  //     location: "Conference Room A",
  //     status: "scheduled",
  //     type: "client-meeting",
  //     notes: "Demonstrate new features to client",
  //     organizer: "john@company.com",
  //     createdAt: new Date("2025-01-10"),
  //   },
  //   {
  //     _id: "2",
  //     title: "Team Standup",
  //     attendees: ["Team Lead", "Developers"],
  //     date: "2025-01-14",
  //     time: "09:00 AM",
  //     duration: "15 min",
  //     location: "Virtual - Zoom",
  //     status: "scheduled",
  //     type: "internal",
  //     notes: "Daily standup meeting",
  //     organizer: "lead@company.com",
  //     createdAt: new Date("2025-01-10"),
  //   },
  //   {
  //     _id: "3",
  //     title: "Budget Review Meeting",
  //     attendees: ["Finance Team", "Managers"],
  //     date: "2025-01-16",
  //     time: "02:00 PM",
  //     duration: "60 min",
  //     location: "Board Room",
  //     status: "completed",
  //     type: "internal",
  //     notes: "Q1 budget allocation review",
  //     organizer: "finance@company.com",
  //     createdAt: new Date("2025-01-08"),
  //   },
  //   {
  //     _id: "4",
  //     title: "Client Negotiation",
  //     attendees: ["Sales Team", "Client Representatives"],
  //     date: "2025-01-17",
  //     time: "03:30 PM",
  //     duration: "45 min",
  //     location: "Client Office",
  //     status: "pending",
  //     type: "client-meeting",
  //     notes: "Contract discussion and negotiations",
  //     organizer: "sales@company.com",
  //     createdAt: new Date("2025-01-09"),
  //   },
  // ]);

  const [showAddSidebar, setShowAddSidebar] = useState(false);
  const [showEditSidebar, setShowEditSidebar] = useState(false);
  const [showViewModel, setShowViewModel] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchMeetings = async () => {
      setMeetingStates((prev) => ({ ...prev, loading: true }));
      try {
        const res = await getAllMeetings({
          page: meetingStates.page,
          limit: meetingStates.limit,
          search: meetingStates.searchTerm,
          status: meetingStates.filterStatus,
          type: meetingStates.filterType,
          date: meetingStates.filterDate,
        });

        setMeetingStates((prev) => ({
          ...prev,
          totalPages: res.totalPages,
          totalMeetings: res.total,
          loading: false,
        }));
      } catch (error) {
        console.error("Error fetching meetings:", error);
      } finally {
        setMeetingStates((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchMeetings();
  }, [
    meetingStates.page,
    meetingStates.limit,
    meetingStates.searchTerm,
    meetingStates.filterStatus,
    meetingStates.filterDate,
    meetingStates.filterType,
  ]);

  const [newMeeting, setNewMeeting] = useState({
    title: "",
    attendees: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    status: "Scheduled",
    type: "Internal",
    notes: "",
    organizer: "",
    meetingLink: "",
  });

  const getStatistics = () => {
    return {
      total: meetings.length,
      scheduled: meetings.filter((m) => m.status === "Scheduled").length,
      completed: meetings.filter((m) => m.status === "Completed").length,
      pending: meetings.filter((m) => m.status === "Pending").length,
    };
  };

  const getStatusColor = (status) => {
    const statusColors = {
      Scheduled: { bg: "bg-blue-100", text: "text-blue-700" },
      Completed: { bg: "bg-green-100", text: "text-green-700" },
      Pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
      Cancelled: { bg: "bg-red-100", text: "text-red-700" },
      scheduled: { bg: "bg-blue-100", text: "text-blue-700" },
      completed: { bg: "bg-green-100", text: "text-green-700" },
      pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
      cancelled: { bg: "bg-red-100", text: "text-red-700" },
    };
    return statusColors[status] || statusColors.scheduled;
  };

  const getTypeColor = (type) => {
    const typeColors = {
      "Client Meeting": { bg: "bg-purple-100", text: "text-purple-700" },
      Internal: { bg: "bg-gray-100", text: "text-gray-700" },
      "Team Meeting": { bg: "bg-indigo-100", text: "text-indigo-700" },
    };
    return typeColors[type] || typeColors.Internal;
  };

  const formatDate = (date) => {
    if (!date) return "-";
    if (typeof date === "string") return date;
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // const exportToExcel = () => {
  //   const allMeetings = filteredMeetings.map((m) => ({
  //     Title: m.title,
  //     Date: formatDate(m.date),
  //     Time: m.time,
  //     Duration: m.duration,
  //     Location: m.location,
  //     Status: capitalizeWords(m.status),
  //     Type: capitalizeWords(m.type),
  //     Attendees: m.attendees.join(", "),
  //     Organizer: m.organizer,
  //     Notes: m.notes,
  //   }));

  //   const headers = Object.keys(allMeetings[0] || {});
  //   const csv = [
  //     headers.join(","),
  //     ...allMeetings.map((m) =>
  //       headers
  //         .map((h) => {
  //           const value = m[h];
  //           return typeof value === "string" && value.includes(",")
  //             ? `"${value}"`
  //             : value;
  //         })
  //         .join(",")
  //     ),
  //   ].join("\n");

  //   const blob = new Blob([csv], { type: "text/csv" });
  //   const url = window.URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = `meetings-${new Date().toISOString().split("T")[0]}.csv`;
  //   link.click();
  // };

  // const exportToPDF = () => {
  //   const allMeetings = filteredMeetings;
  //   const html = `
  //     <!DOCTYPE html>
  //     <html>
  //       <head>
  //         <title>Meetings Report</title>
  //         <style>
  //           body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
  //           h1 { color: #00aeef; border-bottom: 2px solid #00aeef; padding-bottom: 10px; }
  //           .header-info { font-size: 12px; color: #666; margin-bottom: 20px; }
  //           table { width: 100%; border-collapse: collapse; margin-top: 10px; }
  //           th { background-color: #00aeef; color: white; padding: 10px; text-align: left; font-size: 12px; }
  //           td { padding: 8px; border-bottom: 1px solid #ddd; font-size: 11px; }
  //           tr:nth-child(even) { background-color: #f9f9f9; }
  //           .status { padding: 4px 8px; border-radius: 4px; font-weight: bold; display: inline-block; font-size: 10px; }
  //           .status-scheduled { background-color: #dbeafe; color: #1e40af; }
  //           .status-completed { background-color: #dcfce7; color: #166534; }
  //           .status-pending { background-color: #fef3c7; color: #92400e; }
  //           .footer { margin-top: 30px; font-size: 11px; color: #999; text-align: center; }
  //         </style>
  //       </head>
  //       <body>
  //         <h1>Meetings Report</h1>
  //         <div class="header-info">
  //           <p>Generated on: ${new Date().toLocaleString()}</p>
  //           <p>Total Meetings: ${allMeetings.length}</p>
  //         </div>
  //         <table>
  //           <thead>
  //             <tr>
  //               <th>Title</th>
  //               <th>Date</th>
  //               <th>Time</th>
  //               <th>Location</th>
  //               <th>Status</th>
  //               <th>Type</th>
  //               <th>Organizer</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             ${allMeetings
  //               .map(
  //                 (m) => `
  //               <tr>
  //                 <td>${m.title}</td>
  //                 <td>${formatDate(m.date)}</td>
  //                 <td>${m.time}</td>
  //                 <td>${m.location}</td>
  //                 <td><span class="status status-${m.status}">${capitalizeWords(
  //                   m.status
  //                 )}</span></td>
  //                 <td>${capitalizeWords(m.type)}</td>
  //                 <td>${m.organizer}</td>
  //               </tr>
  //             `
  //               )
  //               .join("")}
  //           </tbody>
  //         </table>
  //         <div class="footer">
  //           <p>This is an automated report. For more details, please access the system directly.</p>
  //         </div>
  //       </body>
  //     </html>
  //   `;

  //   const printWindow = window.open("", "", "width=900,height=600");
  //   printWindow.document.write(html);
  //   printWindow.document.close();
  //   setTimeout(() => printWindow.print(), 250);
  // };

  const handleAddMeeting = async () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time) {
      alert("Please fill in required fields");
      return;
    }

    try {
      setSubmitting(true);

      // Convert attendees from comma-separated string → array
      const formattedMeeting = {
        ...newMeeting,
        attendees: newMeeting.attendees
          ? newMeeting.attendees
              .split(",")
              .map((a) => a.trim())
              .filter((a) => a !== "")
          : [],
      };

      await createMeeting(formattedMeeting);

      // Reset form
      setNewMeeting({
        title: "",
        attendees: "",
        date: "",
        time: "",
        duration: "",
        location: "",
        status: "Scheduled",
        type: "Internal",
        notes: "",
        organizer: "",
      });

      setShowAddSidebar(false);
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditMeeting = async () => {
    if (
      !selectedMeeting.title ||
      !selectedMeeting.date ||
      !selectedMeeting.time
    ) {
      alert("Please fill in required fields");
      return;
    }
    try {
      setEditLoading(true);
      await updateMeeting(selectedMeeting._id, selectedMeeting);
      setShowEditSidebar(false);
      setSelectedMeeting(null);
    } catch (error) {
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteMeeting = async (id) => {
    if (confirm("Are you sure you want to delete this meeting?")) {
      setSubmitting(true);
      await deleteMeeting(id);
      setSubmitting(false);
      setShowViewModel(false);
      setSelectedMeeting(null);
    }
  };

  const handleFilterChange = (key, value) => {
    setMeetingStates((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // always reset page on filter change
    }));
  };

  const stats = getStatistics();

  return (
    <div className="min-h-screen p-2">
      <div className="p-1 space-y-2">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Meetings</h1>
            <p className="text-gray-500 text-sm">
              Manage and track all your meetings
            </p>
          </div>
          <button
            className="bg-[#00aeef] hover:bg-[#0093ca] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition"
            onClick={() => setShowAddSidebar(true)}
          >
            <PlusCircle size={18} /> Add Meeting
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Meetings
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {meetingStates.totalMeetings}
                </p>
              </div>
              <TrendingUp size={32} className="text-[#00aeef]" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {stats.scheduled}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {stats.completed}
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
                <p className="text-gray-500 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {stats.pending}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          {/* <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={exportToPDF}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 font-medium transition text-sm"
            >
              <FileText size={16} /> Download PDF
            </button>
            <button
              onClick={exportToExcel}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 font-medium transition text-sm"
            >
              <Download size={16} /> Export Excel
            </button>
          </div> */}

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search
                size={16}
                className="absolute left-3 top-2.5 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search meetings..."
                className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef] w-full"
                value={meetingStates.searchTerm}
                onChange={(e) => {
                  handleFilterChange("searchTerm", e.target.value);
                }}
              />
            </div>

            <select
              value={meetingStates.filterStatus}
              onChange={(e) => {
                handleFilterChange("filterStatus", e.target.value);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
            >
              <option value="">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>

            <select
              value={meetingStates.filterType}
              onChange={(e) => {
                handleFilterChange("filterType", e.target.value);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
            >
              <option value="">All Types</option>
              <option value="Client Meeting">Client Meeting</option>
              <option value="Internal">Internal</option>
              <option value="Team Meeting">Team Meeting</option>
            </select>
            <input
              type="date"
              value={meetingStates.filterDate}
              onChange={(e) => {
                handleFilterChange("filterDate", e.target.value);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Date & Time
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Location
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {meetings.map((meeting) => (
                  <tr
                    key={meeting._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {meeting.title}
                    </td>
                    <td className="p-4 text-gray-600">
                      {formatDate(meeting.date)} at {meeting.time}
                    </td>
                    <td className="p-4 text-gray-600">{meeting.location}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          getStatusColor(meeting.status).bg
                        } ${getStatusColor(meeting.status).text}`}
                      >
                        {capitalizeWords(meeting.status)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          getTypeColor(meeting.type).bg
                        } ${getTypeColor(meeting.type).text}`}
                      >
                        {capitalizeWords(meeting.type)}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedMeeting(meeting);
                          setShowViewModel(true);
                        }}
                        className="text-[#00aeef] hover:text-[#0093ca] font-medium text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMeeting(meeting);
                          setShowEditSidebar(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {meetingStates.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              {/* Showing X to Y of Z */}
              <div className="text-sm text-gray-600">
                Showing {(meetingStates.page - 1) * meetingStates.limit + 1} to{" "}
                {Math.min(
                  meetingStates.page * meetingStates.limit,
                  meetingStates.totalMeetings
                )}{" "}
                of {meetingStates.totalMeetings}
              </div>

              {/* Pagination buttons */}
              <div className="flex gap-2">
                {/* Prev */}
                <button
                  onClick={() =>
                    setMeetingStates((prev) => ({
                      ...prev,
                      page: Math.max(1, prev.page - 1),
                    }))
                  }
                  disabled={meetingStates.page === 1}
                  className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Page Numbers */}
                {[...Array(meetingStates.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() =>
                      setMeetingStates((prev) => ({
                        ...prev,
                        page: i + 1,
                      }))
                    }
                    className={`px-3 py-1 rounded-lg ${
                      meetingStates.page === i + 1
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
                    setMeetingStates((prev) => ({
                      ...prev,
                      page: Math.min(prev.totalPages, prev.page + 1),
                    }))
                  }
                  disabled={meetingStates.page === meetingStates.totalPages}
                  className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {meetings.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No meetings found
            </div>
          )}
        </div>
      </div>

      {showAddSidebar && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setShowAddSidebar(false)}
          />
          <div className="lg:h-150 md:h-100 md:w-300 h-130 w-full md:p-5 p-3 m-4 overflow-hidden justify-center items-center z-30 bg-white shadow-2xl overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Add New Meeting
                </h2>
                <button
                  onClick={() => setShowAddSidebar(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter meeting title"
                    className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    value={newMeeting.title}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    value={newMeeting.date}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, date: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    value={newMeeting.time}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, time: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 30 min"
                    className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    value={newMeeting.duration}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, duration: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    value={newMeeting.location}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, location: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organizer Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter organizer email"
                    className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    value={newMeeting.organizer}
                    onChange={(e) =>
                      setNewMeeting({
                        ...newMeeting,
                        organizer: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newMeeting.status}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, status: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Type
                  </label>
                  <select
                    value={newMeeting.type}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, type: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  >
                    <option value="Internal">Internal</option>
                    <option value="Client Meeting">Client Meeting</option>
                    <option value="Team Meeting">Team Meeting</option>
                  </select>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attendees (comma-separated)
                  </label>
                  <textarea
                    placeholder="Enter attendee names separated by commas"
                    className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    rows="3"
                    value={newMeeting.attendees}
                    onChange={(e) =>
                      setNewMeeting({
                        ...newMeeting,
                        attendees: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    placeholder="Add any notes or agenda items"
                    className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    rows="4"
                    value={newMeeting.notes}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, notes: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  disabled={submitting}
                  onClick={handleAddMeeting}
                  className="bg-[#00aeef] hover:bg-[#0093ca] text-white px-6 py-2 rounded-lg font-medium transition flex-1"
                >
                  {submitting ? "Saving..." : "Add Meeting"}
                </button>
                <button
                  disabled={submitting}
                  onClick={() => setShowAddSidebar(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditSidebar && selectedMeeting && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setShowEditSidebar(false)}
          />
          <div className="lg:h-150 md:h-100 md:w-300 h-130 w-full md:p-5 p-3 m-4 overflow-hidden justify-center items-center z-30 bg-white shadow-2xl overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Edit Meeting
                </h2>
                <button
                  onClick={() => {
                    setShowEditSidebar(false);
                    setSelectedMeeting(null);
                  }}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    value={selectedMeeting.title}
                    onChange={(e) =>
                      setSelectedMeeting({
                        ...selectedMeeting,
                        title: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    value={selectedMeeting.date}
                    onChange={(e) =>
                      setSelectedMeeting({
                        ...selectedMeeting,
                        date: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    value={selectedMeeting.time}
                    onChange={(e) =>
                      setSelectedMeeting({
                        ...selectedMeeting,
                        time: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    value={selectedMeeting.duration}
                    onChange={(e) =>
                      setSelectedMeeting({
                        ...selectedMeeting,
                        duration: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    value={selectedMeeting.location}
                    onChange={(e) =>
                      setSelectedMeeting({
                        ...selectedMeeting,
                        location: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organizer Email
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    value={selectedMeeting.organizer}
                    onChange={(e) =>
                      setSelectedMeeting({
                        ...selectedMeeting,
                        organizer: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={selectedMeeting.status}
                    onChange={(e) =>
                      setSelectedMeeting({
                        ...selectedMeeting,
                        status: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Type
                  </label>
                  <select
                    value={selectedMeeting.type}
                    onChange={(e) =>
                      setSelectedMeeting({
                        ...selectedMeeting,
                        type: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                  >
                    <option value="Internal">Internal</option>
                    <option value="Client Meeting">Client Meeting</option>
                    <option value="Team Meeting">Team Meeting</option>
                  </select>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attendees (comma-separated)
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    rows="3"
                    value={selectedMeeting.attendees.join(", ")}
                    onChange={(e) =>
                      setSelectedMeeting({
                        ...selectedMeeting,
                        attendees: e.target.value
                          .split(",")
                          .map((a) => a.trim()),
                      })
                    }
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-sm p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    rows="4"
                    value={selectedMeeting.notes}
                    onChange={(e) =>
                      setSelectedMeeting({
                        ...selectedMeeting,
                        notes: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleEditMeeting}
                  disabled={editLoading}
                  className="bg-[#00aeef] hover:bg-[#0093ca] text-white px-6 py-2 rounded-lg font-medium transition flex-1 disabled:opacity-50"
                >
                  {editLoading ? "Saving..." : "Save Meeting"}
                </button>
                <button
                  onClick={() => {
                    setShowEditSidebar(false);
                    setSelectedMeeting(null);
                  }}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showViewModel && selectedMeeting && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-4xl p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowViewModel(false);
                setSelectedMeeting(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={24} />
            </button>

            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                {selectedMeeting.title}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {formatDate(selectedMeeting.date)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={16} className="text-[#00aeef]" />
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                      Date & Time
                    </p>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {formatDate(selectedMeeting.date)} at {selectedMeeting.time}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={16} className="text-[#00aeef]" />
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                      Duration
                    </p>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {selectedMeeting.duration || "-"}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={16} className="text-[#00aeef]" />
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                      Location
                    </p>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {selectedMeeting.location}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                    Status
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      getStatusColor(selectedMeeting.status).bg
                    } ${getStatusColor(selectedMeeting.status).text}`}
                  >
                    {capitalizeWords(selectedMeeting.status)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                    Meeting Type
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      getTypeColor(selectedMeeting.type).bg
                    } ${getTypeColor(selectedMeeting.type).text}`}
                  >
                    {capitalizeWords(selectedMeeting.type)}
                  </span>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail size={16} className="text-[#00aeef]" />
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                      Organizer
                    </p>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {selectedMeeting.organizer}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users size={16} className="text-[#00aeef]" />
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                      Attendees
                    </p>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {selectedMeeting.attendees.join(", ")}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                    Created
                  </p>
                  <p className="text-gray-900 font-medium">
                    {formatDate(selectedMeeting.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {selectedMeeting.notes && (
              <div className="mt-6 border rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                  Notes
                </p>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {selectedMeeting.notes}
                </p>
              </div>
            )}

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  setSelectedMeeting(selectedMeeting);
                  setShowViewModel(false);
                  setShowEditSidebar(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition flex-1"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteMeeting(selectedMeeting._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition flex-1"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowViewModel(false);
                  setSelectedMeeting(null);
                }}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition flex-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingPage;
