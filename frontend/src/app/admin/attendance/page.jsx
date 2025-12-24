"use client";

import { useState, useEffect } from "react";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  User,
  PlusCircle,
  Filter,
  X,
  Users,
  Briefcase,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import useAdminStore from "@/stores/useAdminStore";

const formatDuration = (hoursDecimal) => {
  if (!hoursDecimal && hoursDecimal !== 0) return "--";

  // Convert decimal hours to total minutes
  const totalMinutes = Math.round(hoursDecimal * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Pad with 0 for nice formatting
  const h = hours.toString().padStart(2, "0");
  const m = minutes.toString().padStart(2, "0");

  return `${h}h ${m}m`;
};

export default function AttendancePage() {
  const [showModal, setShowModal] = useState(false);
  const [filterDate, setFilterDate] = useState("");

  const {
    fetchMonthlyAttendanceSummary,
    fetchAttendanceDetails,
    getAllDepartments,
    getAllEmployeesAssociatedwithDepartment,
  } = useAdminStore();

  const [monthlyAttendance, setMonthlyAttendance] = useState({
    data: [],
    page: 1,
    limit: 10,
    totalPages: 0,
    totalEmployees: 0,
    loading: false,
    month: new Date().toISOString().slice(0, 7), // default current month,
    department: "",
  });

  useEffect(() => {
    const fetchMonthly = async () => {
      setMonthlyAttendance((prev) => ({ ...prev, loading: true }));
      console.log(monthlyAttendance.department);
      try {
        const res = await fetchMonthlyAttendanceSummary({
          month: monthlyAttendance.month,
          page: monthlyAttendance.page,
          limit: monthlyAttendance.limit,
          department: monthlyAttendance.department,
        });

        console.log(res);

        setMonthlyAttendance((prev) => ({
          ...prev,
          data: res.monthlySummary,
          totalPages: res.pagination?.totalPages,
          totalEmployees: res?.pagination?.totalEmployees,
          loading: false,
        }));
      } catch (error) {
        console.error("Error fetching monthly attendance:", error);
      } finally {
        setMonthlyAttendance((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchMonthly();
  }, [
    fetchMonthlyAttendanceSummary,
    monthlyAttendance.month,
    monthlyAttendance.page,
    monthlyAttendance.limit,
    monthlyAttendance.department,
  ]);

  // Handle month input change
  const handleMonthChange = (e) => {
    setMonthlyAttendance((prev) => ({
      ...prev,
      month: e.target.value,
      page: 1, // reset to first page on month change
    }));
  };

  const handleDepartmentChangeInMonthlyReport = (e) => {
    setMonthlyAttendance((prev) => ({
      ...prev,
      department: e.target.value,
      page: 1, // reset to first page on month change
    }));
  };

  const handlePageChangeInMothly = (newPage) => {
    setMonthlyAttendance((prev) => ({ ...prev, page: newPage }));
  };

  //Attendance details functions
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [attendanceDetails, setAttendanceDetails] = useState({
    records: [],
    employeeId: "",
    department: "",
    page: 1,
    limit: 10,
    totalPages: 0,
    totalRecords: 0,
    loading: false,
    selectedDate: "", // YYYY-MM-DD
  });

  useEffect(() => {
    const fetchDetails = async () => {
      setAttendanceDetails((prev) => ({ ...prev, loading: true }));

      try {
        const res = await fetchAttendanceDetails({
          date: attendanceDetails.selectedDate,
          employeeId: attendanceDetails.employeeId,
          department: attendanceDetails.department,
          page: attendanceDetails.page,
          limit: attendanceDetails.limit,
        });
        console.log(res);

        setAttendanceDetails((prev) => ({
          ...prev,
          records: res.attendanceRecords,
          totalRecords: res.pagination.totalRecords,
          totalPages: res.pagination.totalPages,
          loading: false,
        }));
      } catch (error) {
        console.error("Error fetching attendance details:", error);
      } finally {
        setAttendanceDetails((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchDetails();
  }, [
    fetchAttendanceDetails,
    attendanceDetails.selectedDate,
    attendanceDetails.employeeId,
    attendanceDetails.department,
    attendanceDetails.page,
    attendanceDetails.limit,
  ]);

  const handleDateChange = (e) => {
    setAttendanceDetails((prev) => ({
      ...prev,
      selectedDate: e.target.value,
      page: 1, // reset page when date changes
    }));
  };

  const handleEmployeeChange = (e) => {
    setAttendanceDetails((prev) => ({
      ...prev,
      employeeId: e.target.value,
      page: 1, // reset page when employee filter changes
    }));
  };

  const handleDepartmentChangeInDailyReport = (e) => {
    setAttendanceDetails((prev) => ({
      ...prev,
      department: e.target.value,
      employeeId: "",
      page: 1, // reset page when employee filter changes
    }));
    setEmployees([]);
  };

  const handlePageChangeInDetails = (newPage) => {
    setAttendanceDetails((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departments = await getAllDepartments();
        setDepartments(departments);
      } catch (error) {}
    };
    fetchDepartments();
  }, []);

  console.log(departments);

  useEffect(() => {
    console.log(attendanceDetails.department);
    const fetchEmployeesUnderDepartment = async () => {
      try {
        if (attendanceDetails.department) {
          const employees = await getAllEmployeesAssociatedwithDepartment(
            attendanceDetails.department
          );
          setEmployees(employees);
        }
      } catch (error) {}
    };
    fetchEmployeesUnderDepartment();
  }, [attendanceDetails.department]);

  console.log("emploemploemploemploemploemploemplo", employees);

  const [attendance, setAttendance] = useState([
    {
      id: 1,
      name: "Jishnu M",
      role: "Frontend Developer",
      date: "2025-10-24",
      checkIn: "09:10 AM",
      checkOut: "06:00 PM",
      status: "present",
    },
    {
      id: 2,
      name: "Adil",
      role: "UI Designer",
      date: "2025-10-24",
      checkIn: "09:45 AM",
      checkOut: "—",
      status: "ongoing",
    },
    {
      id: 3,
      name: "Althaf",
      role: "Backend Developer",
      date: "2025-10-24",
      checkIn: "—",
      checkOut: "—",
      status: "absent",
    },
  ]);

  // const employees = [
  //   {
  //     id: 1,
  //     name: "Jishnu M",
  //     role: "Frontend Developer",
  //     present: 20,
  //     absent: 2,
  //     leaves: 1,
  //     late: 3,
  //   },
  //   {
  //     id: 2,
  //     name: "Adil",
  //     role: "UI Designer",
  //     present: 18,
  //     absent: 3,
  //     leaves: 2,
  //     late: 5,
  //   },
  //   {
  //     id: 3,
  //     name: "Althaf",
  //     role: "Backend Developer",
  //     present: 19,
  //     absent: 4,
  //     leaves: 0,
  //     late: 2,
  //   },
  // ];

  const [newRecord, setNewRecord] = useState({
    name: "",
    role: "",
    date: "",
    checkIn: "",
    checkOut: "",
    status: "present",
  });

  const handleAddRecord = () => {
    if (!newRecord.name || !newRecord.date || !newRecord.status) {
      alert("Please fill in all required fields");
      return;
    }

    setAttendance([...attendance, { id: Date.now(), ...newRecord }]);
    setNewRecord({
      name: "",
      role: "",
      date: "",
      checkIn: "",
      checkOut: "",
      status: "present",
    });
    setShowModal(false);
  };

  const filteredData = filterDate
    ? attendance.filter((item) => item.date === filterDate)
    : attendance;

  const totalPresent = attendance.filter((a) => a.status === "present").length;
  const totalAbsent = attendance.filter((a) => a.status === "absent").length;
  const totalOngoing = attendance.filter((a) => a.status === "ongoing").length;

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openRecordModel, setOpenRecordModel] = useState(false);

  const handleSelectRecord = (record) => {
    if (!record) return;
    console.log(record);
    setSelectedRecord(record);
    setOpenRecordModel(true);
  };

  return (
    <div className="p-1 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Attendance Overview
          </h1>
          <p className="text-gray-500 text-sm">
            Monitor employee attendance, check-in/out, and summary reports.
          </p>
        </div>
        <Button
          className="bg-[#00aeef] hover:bg-[#0093ca] text-white flex items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <PlusCircle size={18} /> Add Manual Entry
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <SummaryCard
          title="Present Today"
          value={totalPresent}
          icon={<CheckCircle className="text-green-600" size={22} />}
          color="bg-green-50"
        />
        <SummaryCard
          title="Absent"
          value={totalAbsent}
          icon={<XCircle className="text-red-600" size={22} />}
          color="bg-red-50"
        />
        <SummaryCard
          title="Ongoing"
          value={totalOngoing}
          icon={<Clock className="text-yellow-600" size={22} />}
          color="bg-yellow-50"
        />
      </div>

      {/* Employee Summary */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
          <Users className="text-[#00aeef]" size={18} /> Employee Summary
        </h2>
        <input
          type="month"
          value={monthlyAttendance.month}
          onChange={handleMonthChange}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={monthlyAttendance.department}
          onChange={handleDepartmentChangeInMonthlyReport}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Departments</option>
          {departments?.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Employee</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3 text-center">Present</th>
                <th className="px-6 py-3 text-center">Absent</th>
                <th className="px-6 py-3 text-center">Leaves</th>
                <th className="px-6 py-3 text-center">Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {monthlyAttendance?.data?.length > 0 ? (
                monthlyAttendance?.data?.map((emp, idx) => (
                  <tr
                    key={idx}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center gap-2">
                      <User className="text-gray-400" size={18} />
                      {emp.name}
                    </td>
                    <td className="px-6 py-4">{emp.department}</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">
                      {emp.presentDays}
                    </td>
                    <td className="px-6 py-4 text-center text-red-600 font-semibold">
                      {emp.absentDays}
                    </td>
                    <td className="px-6 py-4 text-center text-blue-600 font-semibold">
                      {emp.leaves}
                    </td>
                    <td className="px-6 py-4 text-center text-yellow-600 font-semibold">
                      {formatDuration(emp.totalWorkingHours)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr key={"no-data"}>
                  <td colSpan="6" className="p-4 text-gray-500">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination */}
          {monthlyAttendance.totalPages > 1 && (
            <div className="flex gap-2">
              {Array.from(
                { length: monthlyAttendance.totalPages },
                (_, i) => i + 1
              ).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChangeInMothly(pageNum)}
                  className={`px-3 py-1 rounded ${
                    monthlyAttendance.page === pageNum
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filters + Daily Table */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-3 py-2 shadow-sm">
          <Filter size={16} className="text-gray-500" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="text-sm text-gray-700 outline-none"
          />
          {/* Filters */}
          <input
            type="date"
            value={attendanceDetails.selectedDate}
            onChange={handleDateChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {/* Department Dropdown */}
          <select
            value={attendanceDetails.department}
            onChange={handleDepartmentChangeInDailyReport}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Department</option>
            {departments?.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>

          {/* Employee Dropdown */}
          <select
            value={attendanceDetails.employeeId}
            onChange={handleEmployeeChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Employee</option>
            {employees?.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {filterDate && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterDate("")}
            className="text-gray-600"
          >
            Clear Filter
          </Button>
        )}
      </div>

      {/* Daily Attendance Table */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Employee</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Working Hours</th>
              <th className="px-6 py-3">Check-In</th>
              <th className="px-6 py-3">Check-Out</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceDetails?.records?.length > 0 ? (
              attendanceDetails.records.map((item) => (
                <tr
                  key={item._id}
                  onClick={() => handleSelectRecord(item)}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-2">
                    <User className="text-gray-400" size={18} />
                    {item.employee?.name}
                  </td>
                  <td className="px-6 py-4">{item.employee?.department}</td>
                  <td className="px-6 py-4">{item.date}</td>
                  <td className="p-2">{formatDuration(item.working_hours)}</td>
                  <td className="px-6 py-4">
                    {item.sessions?.[0]?.checkIn
                      ? new Date(item.sessions[0].checkIn).toLocaleTimeString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    {item.sessions?.[0]?.checkOut
                      ? new Date(item.sessions[0].checkOut).toLocaleTimeString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    {item.status === "present" ? (
                      <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                        <CheckCircle size={14} /> Present
                      </Badge>
                    ) : item.status === "absent" ? (
                      <Badge className="bg-red-100 text-red-700 flex items-center gap-1">
                        <XCircle size={14} /> Absent
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-700 flex items-center gap-1">
                        <Clock size={14} /> Ongoing
                      </Badge>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-gray-500">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {attendanceDetails.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: attendanceDetails.totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 border rounded ${
                  attendanceDetails.page === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white"
                }`}
                onClick={() => handlePageChangeInDetails(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {filteredData.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No attendance records found
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={18} />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Add Attendance Entry
            </h2>

            <div className="space-y-3">
              <Input
                placeholder="Employee Name"
                value={newRecord.name}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, name: e.target.value })
                }
              />
              <Input
                placeholder="Role"
                value={newRecord.role}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, role: e.target.value })
                }
              />
              <Input
                type="date"
                value={newRecord.date}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, date: e.target.value })
                }
              />
              <Input
                placeholder="Check-In Time (e.g. 09:00 AM)"
                value={newRecord.checkIn}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, checkIn: e.target.value })
                }
              />
              <Input
                placeholder="Check-Out Time (optional)"
                value={newRecord.checkOut}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, checkOut: e.target.value })
                }
              />
              <select
                value={newRecord.status}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, status: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-[#00aeef]"
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="ongoing">Ongoing</option>
              </select>
              <Button
                className="w-full bg-[#00aeef] hover:bg-[#0093ca] text-white"
                onClick={handleAddRecord}
              >
                Save Record
              </Button>
            </div>
          </div>
        </div>
      )}
      {openRecordModel && (
        <AttendanceRecordModal
          record={selectedRecord}
          onClose={() => {
            setSelectedRecord(null);
            setOpenRecordModel(false);
          }}
        />
      )}
    </div>
  );
}

function SummaryCard({ title, value, icon, color }) {
  return (
    <div
      className={`rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between ${color}`}
    >
      <div>
        <h3 className="text-gray-600 text-sm">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      {icon}
    </div>
  );
}

const AttendanceRecordModal = ({ record, onClose }) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 z-50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-lg"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold mb-4">Attendance Details</h2>

        {/* Employee Info */}
        <div className="mb-4 border-b pb-4">
          <p>
            <strong>Name:</strong> {record.employee?.name}
          </p>
          <p>
            <strong>Email:</strong> {record.employee?.email}
          </p>
          <p>
            <strong>Department:</strong> {record.employee?.department}
          </p>
          <p>
            <strong>Date:</strong> {record.date}
          </p>
          <p>
            <strong>Total Working Hours:</strong>{" "}
            {formatDuration(record.working_hours)}
          </p>
        </div>

        {/* Sessions */}
        <h3 className="text-lg font-medium mb-2">Sessions</h3>

        <div className="max-h-64 overflow-y-auto pr-2">
          {record.sessions?.length > 0 ? (
            record.sessions.map((s, index) => (
              <div
                key={s._id || index}
                className="border rounded-md p-3 mb-3 bg-gray-50"
              >
                <p>
                  <strong>Check In:</strong>{" "}
                  {s.checkIn ? new Date(s.checkIn).toLocaleString() : "-"}
                </p>
                <p>
                  <strong>Check Out:</strong>{" "}
                  {s.checkOut ? new Date(s.checkOut).toLocaleString() : "-"}
                </p>
                <p>
                  <strong>Duration:</strong> {formatDuration(s.duration)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No sessions available.</p>
          )}
        </div>
      </div>
    </div>
  );
};
