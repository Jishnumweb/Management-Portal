"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
} from "lucide-react";
import useAdminStore from "@/stores/useAdminStore";

// Calendar Component
function CalendarWidget({
  selectedDates = [],
  onDateClick = null,
  isSelectable = false,
}) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isDateSelected = (day) => {
    if (!day) return false;
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return selectedDates.includes(dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDateClick = (day) => {
    if (onDateClick && isSelectable && day) {
      onDateClick(day);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-500 py-2"
          >
            {day}
          </div>
        ))}

        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => handleDateClick(day)}
            disabled={!day}
            className={`p-2 rounded-lg text-sm font-medium transition ${
              !day
                ? "bg-transparent cursor-default"
                : isDateSelected(day)
                ? "bg-[#00aeef] text-white hover:bg-blue-600 cursor-pointer"
                : isSelectable
                ? "bg-gray-100 text-gray-900 hover:bg-gray-200 cursor-pointer"
                : "bg-gray-50 text-gray-900 hover:bg-gray-100"
            }`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}

// Leave Request Modal
function LeaveRequestModal({ leave, isOpen, onClose, onApprove, onReject }) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectField, setShowRejectField] = useState(false);

  if (!isOpen || !leave) return null;

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(leave._id, rejectReason);
      setRejectReason("");
      setShowRejectField(false);
    } else {
      alert("Please enter a reason for rejection");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700 border border-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "Rejected":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-5 h-5" />;
      case "Pending":
        return <Clock className="w-5 h-5" />;
      case "Rejected":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#00aeef] text-white p-6 flex justify-between items-center border-b ">
          <div>
            <h2 className="text-2xl font-bold">{leave.employeeName}</h2>
            <p className="text-blue-100 text-sm">
              {leave.department} Department
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#00aeef] rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${getStatusColor(
              leave.status
            )}`}
          >
            {getStatusIcon(leave.status)}
            {leave.status}
          </div>

          {/* Leave Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border p-3 rounded-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Leave Type
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {leave.leaveType}
              </p>
            </div>
            <div className="border p-3 rounded-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Duration
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {leave.duration}
              </p>
            </div>
            <div className="border p-3 rounded-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Reason
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {leave.reason}
              </p>
            </div>
            <div className="border p-3 rounded-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Submitted Date
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {leave.submittedDate}
              </p>
            </div>
          </div>

          {/* Comments */}
          {leave.comments && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-[#00aeef] uppercase">
                Employee Comments
              </p>
              <p className="text-gray-700 mt-2">{leave.comments}</p>
            </div>
          )}

          {/* Calendar Section */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Leave Dates Requested
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {console.log(leave.leaveDates)}
              <CalendarWidget
                selectedDates={leave.leaveDates}
                isSelectable={false}
              />
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <p className="font-semibold text-gray-900 mb-3">
                  Dates Selected:
                </p>
                <div className="flex flex-wrap gap-2">
                  {leave.leaveDates.map((date, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-[#00aeef] px-3 py-2 rounded-lg text-sm font-medium"
                    >
                      {date}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 border-t border-gray-200 pt-6">
            {!showRejectField ? (
              <div className="flex gap-3">
                <button
                  onClick={() => onApprove(leave._id)}
                  className="flex-1 bg-green-700 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve Leave
                </button>
                <button
                  onClick={() => setShowRejectField(true)}
                  className="flex-1 bg-red-700 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-5 h-5" />
                  Reject Leave
                </button>
              </div>
            ) : (
              <div className="space-y-3 bg-red-50 border border-red-200 rounded-lg p-4">
                <label className="block">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Reason for Rejection
                  </p>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter reason for rejecting this leave request..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    rows="3"
                  />
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={handleReject}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Confirm Rejection
                  </button>
                  <button
                    onClick={() => {
                      setShowRejectField(false);
                      setRejectReason("");
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function AdminLeaveManagement() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { getAllLeavesForAdmin, getAllDepartments, updateLeaveStatus } =
    useAdminStore();
  const [fetching, setFetching] = useState(false);

  const [leaveStates, setLeaveStates] = useState({
    leaves: [],
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    filterDate: "",
    searchTerm: "",
    filterStatus: "",
    departmentFilter: "",
  });

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        setFetching(true);

        const { leaves, total, currentPage, totalPages } =
          await getAllLeavesForAdmin({
            page: leaveStates.page,
            limit: leaveStates.limit,
            date: leaveStates.filterDate,
            search: leaveStates.searchTerm,
            status: leaveStates.filterStatus,
            department: leaveStates.departmentFilter,
          });

        setLeaveStates((prev) => ({
          ...prev,
          leaves,
          total,
          totalPages,
          page: currentPage,
        }));
      } catch (error) {
        console.error(error);
      } finally {
        setFetching(false);
      }
    };

    fetchLeaves();
  }, [
    leaveStates.departmentFilter,
    leaveStates.page,
    leaveStates.limit,
    leaveStates.searchTerm,
    leaveStates.filterStatus,
    leaveStates.filterDate,
  ]);

  const handleViewLeave = (leave) => {
    setSelectedLeave(leave);
    setShowModal(true);
  };

  const handleApprove = async (leaveId) => {
    try {
      await updateLeaveStatus({ leaveId, status: "Approved" });

      setLeaveStates((prev) => ({
        ...prev,
        leaves: prev.leaves.map((leave) =>
          leave._id === leaveId ? { ...leave, status: "Approved" } : leave
        ),
      }));

      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (leaveId, reason) => {
    try {
      await updateLeaveStatus({
        leaveId,
        status: "Rejected",
        rejectedReason: reason,
      });
      setLeaveStates((prev) => ({
        ...prev,
        leaves: prev.leaves.map((leave) =>
          leave._id === leaveId ? { ...leave, status: "Rejected" } : leave
        ),
      }));

      setShowModal(false);
    } catch (error) {}
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700 border border-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "Rejected":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-4 h-4" />;
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Rejected":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  //fetching department for filter
  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departments = await getAllDepartments();
        setDepartments(departments);
      } catch (error) {}
    };
    fetchDepartments();
  }, []);

  return (
    <div className="min-h-screen p-3">
      <div className=" mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="w-6 h-8 text-[#00aeef]" />
              Leave Management System
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and track employee leave requests
            </p>
          </div>
          {/* <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="bg-[#00aeef] text-white font-semibold py-2 px-3 rounded-lg transition flex items-center gap-2 w-fit"
          >
            <Calendar className="w-5 h-5" />
            {showCalendar ? "Hide Calendar" : "View Calendar"}
          </button> */}
        </div>

        {/* Calendar View */}
        {/* {showCalendar && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Leave Calendar Overview
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <CalendarWidget selectedDates={[]} isSelectable={false} />
              </div>
              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 h-full">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Leave Summary
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        label: "Pending Requests",
                        count: leaveStates?.leaves?.filter(
                          (l) => l.status === "Pending"
                        ).length,
                        color: "yellow",
                      },
                      {
                        label: "Approved Leaves",
                        count: leaveStates?.leaves?.filter(
                          (l) => l.status === "Approved"
                        ).length,
                        color: "green",
                      },
                      {
                        label: "Rejected Leaves",
                        count: leaveStates?.leaves?.filter(
                          (l) => l.status === "Rejected"
                        ).length,
                        color: "red",
                      },
                      {
                        label: "Total Requests",
                        count: leaveStates?.total,
                        color: "blue",
                      },
                    ].map((stat, idx) => (
                      <div
                        key={idx}
                        className={`flex justify-between items-center p-4 bg-${stat.color}-50 border border-${stat.color}-200 rounded-lg`}
                      >
                        <p className={`text-${stat.color}-700 font-semibold`}>
                          {stat.label}
                        </p>
                        <p
                          className={`text-2xl font-bold text-${stat.color}-700`}
                        >
                          {stat.count}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by employee name..."
              value={leaveStates.searchTerm}
              onChange={(e) =>
                setLeaveStates((prev) => ({
                  ...prev,
                  page: 1,
                  searchTerm: e.target.value,
                }))
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent text-gray-900"
            />
            <input
              type="date"
              placeholder="date..."
              value={leaveStates.filterDate}
              onChange={(e) =>
                setLeaveStates((prev) => ({
                  ...prev,
                  page: 1,
                  filterDate: e.target.value,
                }))
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent text-gray-900"
            />
            <select
              value={leaveStates.filterStatus}
              onChange={(e) =>
                setLeaveStates((prev) => ({
                  ...prev,
                  page: 1,
                  filterStatus: e.target.value,
                }))
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent text-gray-900"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select
              value={leaveStates.departmentFilter}
              onChange={(e) =>
                setLeaveStates((prev) => ({
                  ...prev,
                  page: 1,
                  departmentFilter: e.target.value,
                }))
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent text-gray-900"
            >
              <option value="">All Departments</option>
              {departments.map((department) => (
                <option value={department._id} key={department._id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Leave Requests Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              Leave Requests ({leaveStates?.total || 0})
            </h2>
          </div>

          {leaveStates?.leaves?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Employee
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Leave Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Dates
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaveStates?.leaves?.map((leave, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {leave.employee?.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {leave.employee?.department?.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {leave.leaveType}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <div className="flex gap-1 flex-wrap">
                          {leave.leaveDates.slice(0, 1).map((date, i) => (
                            <span
                              key={i}
                              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                            >
                              {date}
                            </span>
                          ))}

                          {leave.leaveDates.length > 1 && (
                            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                              {leave.leaveDates.length - 1} more...
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {leave.duration}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            leave.status
                          )}`}
                        >
                          {getStatusIcon(leave.status)}
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleViewLeave(leave)}
                            className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 transition"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
                No leave requests found
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Leave Request Modal */}
      <LeaveRequestModal
        leave={selectedLeave}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
