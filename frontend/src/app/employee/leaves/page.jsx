"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Trash2,
  Eye,
  CheckCircle,
  Clock3,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import useEmployeeStore from "@/stores/useEmployeeStore";

export default function LeaveManagementSystem() {
  const {
    myLeaves,
    applyLeave,
    getMyLeaves,
    deleteSingleLeaveDate,
    getAllLeaveTypes,
  } = useEmployeeStore();
  const [fetching, setFetching] = useState(false);

  const [leaveStates, setLeaveStates] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    searchTerm: "",
    filterStatus: "",
  });

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        setFetching(true);

        const { leaves, total, currentPage, totalPages } = await getMyLeaves({
          page: leaveStates.page,
          limit: leaveStates.limit,
          search: leaveStates.searchTerm,
          status: leaveStates.filterStatus,
        });
        console.log(myLeaves);

        setLeaveStates((prev) => ({
          ...prev,
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
    leaveStates.page,
    leaveStates.limit,
    leaveStates.searchTerm,
    leaveStates.filterStatus,
  ]);

  // const [leaveRequests, setLeaveRequests] = useState([
  //   {
  //     id: 1,
  //     date: "2025-10-22",
  //     type: "Sick",
  //     duration: "Full Day",
  //     reason: "Medical appointment",
  //     status: "Approved",
  //     submittedDate: "2025-10-20",
  //   },
  //   {
  //     id: 2,
  //     date: "2025-10-23",
  //     type: "Casual",
  //     duration: "Half Day",
  //     reason: "Personal work",
  //     status: "Pending",
  //     submittedDate: "2025-10-23",
  //   },
  //   {
  //     id: 3,
  //     date: "2025-11-05",
  //     type: "Casual",
  //     duration: "Full Day",
  //     reason: "Family event",
  //     status: "Pending",
  //     submittedDate: "2025-10-23",
  //   },
  //   {
  //     id: 4,
  //     date: "2025-11-05",
  //     type: "Casual",
  //     duration: "Full Day",
  //     reason: "Family event",
  //     status: "Rejected",
  //     submittedDate: "2025-10-20",
  //   },
  // ]);

  const [showModal, setShowModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarView, setCalendarView] = useState("normal");
  const [selectedDates, setSelectedDates] = useState([]);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: "",
    duration: "",
    reason: "",
    leaveDates: [],
    rangeStart: null,
    rangeEnd: null,
  });
  const [leaveError, setLeaveError] = useState("");
  const [leaveApplying, setLeaveApplying] = useState(false);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  const isDateInMyLeaves = (dateStr) => {
    return myLeaves?.some((leave) => leave.leaveDates?.includes(dateStr));
  };

  const getMyLeavesForDate = (dateStr) => {
    return (
      myLeaves?.filter((leave) => leave.leaveDates.includes(dateStr)) || []
    );
  };

  const toggleDateSelection = (day) => {
    const dateStr = formatDate(
      leaveForm.rangeStart?.getFullYear() || currentMonth.getFullYear(),
      leaveForm.rangeStart?.getMonth() || currentMonth.getMonth(),
      day
    );
    console.log(selectedDates);

    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter((d) => d !== dateStr));
    } else {
      setSelectedDates([...selectedDates, dateStr]);
    }
  };

  const validateForm = () => {
    if (!leaveForm.leaveType) return "Select leave type";
    if (!leaveForm.duration) return "Select leave duration";
    if (selectedDates.length === 0) return "Select at least one leave date";
    if (!leaveForm.reason || leaveForm.reason.length < 3)
      return "Reason must be at least 3 characters";
    return null;
  };

  const handleSubmitLeave = async () => {
    setLeaveError("");

    const errorMsg = validateForm();
    if (errorMsg) {
      setLeaveError(errorMsg);
      return;
    }
    const payload = {
      leaveType: leaveForm.leaveType,
      leaveDates: selectedDates,
      duration: leaveForm.duration,
      reason: leaveForm.reason,
    };

    try {
      setLeaveApplying(true);
      await applyLeave(payload);

      setLeaveForm({
        leaveType: "",
        duration: "",
        reason: "",
        leaveDates: [],
        rangeStart: null,
        rangeEnd: null,
      });
      setSelectedDates([]);
      setShowModal(false);
    } catch (err) {
      setLeaveError(err.message || "Failed to apply leave");
    } finally {
      setLeaveApplying(false);
    }
  };

  const handleDeleteRequest = async (id, date) => {
    try {
      await deleteSingleLeaveDate(id, date);
    } catch (error) {}
  };

  // const filteredRequests = myLeaves.filter((req) => {
  //   const matchesStatus = filterStatus === "All" || req.status === filterStatus;
  //   const matchesSearch =
  //     req.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     req.type.toLowerCase().includes(searchTerm.toLowerCase());
  //   return matchesStatus && matchesSearch;
  // });

  const calendarDays = [];
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const modalCalendarDays = [];
  const modalDaysInMonth = getDaysInMonth(currentMonth);
  const modalFirstDay = getFirstDayOfMonth(currentMonth);

  for (let i = 0; i < modalFirstDay; i++) {
    modalCalendarDays.push(null);
  }

  for (let day = 1; day <= modalDaysInMonth; day++) {
    modalCalendarDays.push(day);
  }
  console.log(myLeaves);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getCalendarDateBgColor = (dateStr) => {
    const leaves = getMyLeavesForDate(dateStr);
    if (leaves.length === 0)
      return "bg-gray-50 text-gray-900 hover:bg-gray-100";
    if (leaves.some((l) => l.status === "Approved")) {
      return "bg-[#00bf63] text-white shadow-md hover:shadow-lg";
    }
    if (leaves.some((l) => l.status === "Pending")) {
      return "bg-yellow-200 text-black border shadow-md hover:shadow-lg";
    }
    if (leaves.some((l) => l.status === "Rejected")) {
      return "bg-red-500 text-white shadow-md hover:shadow-lg";
    }
    return "bg-gray-50 text-gray-900 hover:bg-gray-100";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-4 h-4" />;
      case "Pending":
        return <Clock3 className="w-4 h-4" />;
      case "Rejected":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
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

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [leaveTypes, setLeaveTypes] = useState([]);
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const { leaveTypes: types } = await getAllLeaveTypes();
        setLeaveTypes(types);
      } catch (error) {}
    };

    fetchLeaveTypes();
  }, []);
  console.log(leaveTypes);

  return (
    <div className="lg:px-0 px-3 mt-3 lg:mt-0">
      <div className="">
        {/* Header */}
        <div className="">
          <div className=" flex justify-between mb-10">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#00aeef]" />
                Leave Management
              </h1>
              <p className="text-gray-600">
                Track and manage your leave requests
              </p>
            </div>

            <div className=" ">
              <button
                onClick={() => setShowModal(true)}
                className="w-full flex justify-center items-center text-sm  bg-[#00aeef] text-white font-semibold p-1 lg:p-3 rounded-lg transition transform hover:scale-105 active:scale-95"
              >
                <Plus />
                Apply Leave
              </button>
            </div>
          </div>
        </div>

        <div
          className={`${
            calendarView === "minimize"
              ? "grid grid-cols-1"
              : "grid grid-cols-1 lg:grid-cols-3"
          } gap-6 mb-8`}
        >
          {/* Calendar Section - conditionally hidden when minimized */}
          {calendarView !== "minimize" && (
            <div className="lg:col-span-1 ">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {monthNames[currentMonth.getMonth()]}{" "}
                    {currentMonth.getFullYear()}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() - 1
                          )
                        )
                      }
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() + 1
                          )
                        )
                      }
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="text-center font-semibold text-sm text-gray-600 py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => {
                    const dateStr = day
                      ? formatDate(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth(),
                          day
                        )
                      : null;
                    const hasLeave = day ? isDateInMyLeaves(dateStr) : false;
                    const leaveData = day ? getMyLeavesForDate(dateStr) : [];

                    return (
                      <div key={index} className="aspect-square">
                        {day ? (
                          <div
                            className={`w-full h-full flex items-center justify-center rounded-lg font-medium text-sm cursor-pointer transition group relative ${getCalendarDateBgColor(
                              dateStr
                            )}`}
                          >
                            <div>{day}</div>
                            {hasLeave && (
                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-1 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                                {leaveData.length} leave(s) -{" "}
                                {leaveData[0].status}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-full" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500"></div>
                    <span className="text-sm text-gray-600">
                      Leave Approved
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-yellow-400"></div>
                    <span className="text-sm text-gray-600">Leave Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-500"></div>
                    <span className="text-sm text-gray-600">
                      Leave Rejected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-50 border border-gray-300"></div>
                    <span className="text-sm text-gray-600">No Leave</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            className={`${
              calendarView === "minimize" ? "lg:col-span-1" : "lg:col-span-2"
            } h-full`}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  All Requests
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCalendarView("full")}
                    className={`p-2 rounded-lg transition ${
                      calendarView === "full"
                        ? "bg-[#00aeef] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    title="Full view"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCalendarView("normal")}
                    className={`p-2 rounded-lg transition ${
                      calendarView === "normal"
                        ? "bg-[#00aeef] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    title="Normal view"
                  >
                    <Calendar className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCalendarView("minimize")}
                    className={`p-2 rounded-lg transition ${
                      calendarView === "minimize"
                        ? "bg-[#00aeef] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    title="Minimize calendar"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search by type or reason..."
                  value={leaveStates.searchTerm}
                  onChange={(e) =>
                    setLeaveStates((prev) => ({
                      ...prev,
                      page: 1,
                      searchTerm: e.target.value,
                    }))
                  }
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
                  className="px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Requests Grid */}
              {myLeaves?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-300 bg-gray-50">
                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">
                          Leave Type
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">
                          Date
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">
                          Duration
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">
                          Reason
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">
                          Submitted
                        </th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {myLeaves.flatMap((req) =>
                        req.leaveDates.map((date, idx) => (
                          <tr
                            key={`${req._id}-${idx}`}
                            className={`border-b border-gray-200 hover:bg-gray-50 transition`}
                          >
                            <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                              {req.leaveType}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-900">
                              {date}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-900">
                              {req.duration}
                            </td>

                            <td
                              className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate"
                              title={req.reason}
                            >
                              {req.reason}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-900">
                              {req.createdAt?.slice(0, 10)}
                            </td>

                            <td className="px-4 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1 ${getStatusColor(
                                  req.status
                                )}`}
                              >
                                {getStatusIcon(req.status)}
                                {req.status}
                              </span>
                            </td>

                            <td className="px-4 py-4 text-center">
                              <div className="flex gap-2 justify-center">
                                <button className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 transition">
                                  <Eye className="w-4 h-4" />
                                </button>

                                {req.status === "Pending" && (
                                  <button
                                    onClick={() =>
                                      handleDeleteRequest(req._id, date)
                                    }
                                    className="p-2 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 transition"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="col-span-full text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No leave requests found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Apply for Leave
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setLeaveError("");
                  setSelectedDates([]);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Calendar Picker */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {monthNames[currentMonth.getMonth()]}{" "}
                  {currentMonth.getFullYear()}
                </h3>

                <div className="grid grid-cols-7 gap-2 mb-4">
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="text-center font-semibold text-xs text-gray-600 py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {modalCalendarDays.map((day, index) => {
                    const dateStr = day
                      ? formatDate(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth(),
                          day
                        )
                      : null;
                    const isSelected = day
                      ? selectedDates.includes(dateStr)
                      : false;

                    return (
                      <div key={index}>
                        {day ? (
                          <button
                            disabled={isDateInMyLeaves(dateStr)} // Disable if leave exists
                            onClick={() => toggleDateSelection(day)}
                            className={`w-full aspect-square flex items-center justify-center rounded-lg font-medium text-sm transition
                            ${
                              isDateInMyLeaves(dateStr)
                                ? `${getCalendarDateBgColor(dateStr)} border` // show leave color
                                : isSelected
                                ? "bg-blue-500 text-white shadow-md"
                                : "bg-white border border-gray-300 text-gray-900 hover:border-blue-400"
                            }`}
                          >
                            {day}
                          </button>
                        ) : (
                          <div />
                        )}
                      </div>
                    );
                  })}
                </div>

                {selectedDates.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">
                      Selected dates: {selectedDates.length}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedDates.map((date) => (
                        <span
                          key={date}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {date}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Leave Type *
                  </label>
                  <select
                    value={leaveForm.leaveType}
                    onChange={(e) =>
                      setLeaveForm({ ...leaveForm, leaveType: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="">Select leave type</option>
                    {leaveTypes?.map((type) => (
                      <option key={type._id} value={type._id}>
                        {type.leave_type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Duration *
                  </label>
                  <select
                    value={leaveForm.duration}
                    onChange={(e) =>
                      setLeaveForm({
                        ...leaveForm,
                        duration: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="">Select duration</option>
                    <option value="Full Day">Full Day</option>
                    <option value="Half Day">Half Day</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Reason *
                  </label>
                  <textarea
                    value={leaveForm.reason}
                    onChange={(e) =>
                      setLeaveForm({
                        ...leaveForm,
                        reason: e.target.value,
                      })
                    }
                    placeholder="Explain the reason for your leave request"
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  />
                </div>
              </div>

              {leaveError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {leaveError}
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmitLeave}
                disabled={leaveApplying}
                className="w-full bg-[#00aeef] hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {leaveApplying ? "Submitting..." : "Submit Leave Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
