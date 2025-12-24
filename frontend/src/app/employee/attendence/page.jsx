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
import useEmployeeStore from "@/stores/useEmployeeStore";

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

  const { getMonthlyAttendance } = useEmployeeStore();

  const [attendanceDetails, setAttendanceDetails] = useState({
    records: [],
    page: 1,
    limit: 31,
    totalPages: 0,
    totalRecords: 0,
    loading: false,
    absent: 0,
    ongoing: 0,
    present: 0,
    totalDays: 0,
    selectedMonth: new Date().toISOString().slice(0, 7),
  });
  console.log(attendanceDetails.selectedMonth);

  useEffect(() => {
    const fetchDetails = async () => {
      setAttendanceDetails((prev) => ({ ...prev, loading: true }));

      try {
        const res = await getMonthlyAttendance({
          month: attendanceDetails.selectedMonth,
          page: attendanceDetails.page,
          limit: attendanceDetails.limit,
        });
        console.log(res);

        setAttendanceDetails((prev) => ({
          ...prev,
          records: res.attendanceRecords,
          totalRecords: res?.pagination?.totalRecords,
          totalPages: res?.pagination?.totalPages,
          absent: res.stats?.absent,
          ongoing: res.stats?.ongoing,
          present: res.stats?.present,
          totalDays: res.stats?.totalDays,
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
    getMonthlyAttendance,
    attendanceDetails.selectedMonth,
    attendanceDetails.page,
    attendanceDetails.limit,
  ]);

  const handleMonthChange = (e) => {
    setAttendanceDetails((prev) => ({
      ...prev,
      selectedMonth: e.target.value,
      page: 1, // reset page when employee filter changes
    }));
  };

  const handlePageChangeInDetails = (newPage) => {
    setAttendanceDetails((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

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
    <div className="p-6 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Attendance Overview
          </h1>
          <p className="text-gray-500 text-sm">
            Monitor your attendance, check-in/out, and summary reports.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <SummaryCard
          title="Present Today"
          value={attendanceDetails.present}
          icon={<CheckCircle className="text-green-600" size={22} />}
          color="bg-green-50"
        />
        <SummaryCard
          title="Absent"
          value={attendanceDetails.absent}
          icon={<XCircle className="text-red-600" size={22} />}
          color="bg-red-50"
        />
        <SummaryCard
          title="Ongoing"
          value={attendanceDetails.ongoing}
          icon={<Clock className="text-yellow-600" size={22} />}
          color="bg-yellow-50"
        />
        <SummaryCard
          title="Totla Days"
          value={attendanceDetails.totalDays}
          icon={<Clock className="text-blue-600" size={22} />}
          color="bg-blue-50"
        />
      </div>

      {/* Filters + Daily Table */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-3 py-2 shadow-sm">
          <input
            type="month"
            value={attendanceDetails.selectedMonth}
            onChange={handleMonthChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* {filterDate && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterDate("")}
            className="text-gray-600"
          >
            Clear Filter
          </Button>
        )} */}
      </div>

      {/* Daily Attendance Table */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
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
      </div>

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
