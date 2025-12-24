"use client";

import React from "react";
import { useEffect, useState } from "react";
import {
  Clock,
  LogIn,
  LogOut,
  Calendar,
  User,
  AlertCircle,
} from "lucide-react";
import useEmployeeStore from "@/stores/useEmployeeStore";
import { UNDERSCORE_NOT_FOUND_ROUTE_ENTRY } from "next/dist/shared/lib/entry-constants";

// utils/time.js

// Format a UTC ISO date string as HH:mm in IST (24-hour). Use locale/timeZone to be safe.
export const formatTimeToIST = (utcDateString, options = {}) => {
  if (!utcDateString) return "--:--";

  // You can control hour12 via options.hour12 (default false)
  const { hour12 = false } = options;

  return new Date(utcDateString).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12,
  });
};

// Example: display "03:15 PM"
export const formatTimeToIST12 = (utcDateString) =>
  formatTimeToIST(utcDateString, { hour12: true });

// Convert duration (hours as decimal) to "01h 04m" style string
// export const formatDuration = (
//   hoursDecimal,
//   { omitZeroHours = false } = {}
// ) => {
//   if (hoursDecimal === null || hoursDecimal === undefined) return "--";

//   const totalMinutes = Math.round(hoursDecimal * 60);
//   const hrs = Math.floor(totalMinutes / 60);
//   const mins = totalMinutes % 60;

//   const hStr = hrs.toString().padStart(2, "0");
//   const mStr = mins.toString().padStart(2, "0");

//   if (omitZeroHours && hrs === 0) return `${mStr}m`;
//   return `${hStr}h ${mStr}m`;
// };

// utils/time.js
export const formatDuration = (hoursDecimal) => {
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

// utils/time.js

export const getDayNameFromDate = (dateString, short = true) => {
  if (!dateString) return "--";

  const date = new Date(dateString);

  return date.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: short ? "short" : "long", // "Mon" or "Monday"
  });
};

export default function EmployeeDashboard() {
  const {
    profile,
    getProfile,
    weeklySummary,
    checkIn,
    checkOut,
    fetchTodayAttendance,
    fetchWeeklySummary,
  } = useEmployeeStore();

  const [attendance, setAttendance] = useState(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [lastSession, setLastSession] = useState(null);
  const [attendanceData, setAttendanceData] = useState({
    checkedIn: false,
    checkInTime: null,

    checkOutTime: null,
    totalHours: "0h 0m",
  });

  const [todayLogs, setTodayLogs] = useState([
    { time: "09:00 AM", type: "check-in", status: "on-time" },
    { time: "05:30 PM", type: "check-out", status: "completed" },
  ]);

  const [weeklyData, setWeeklyData] = useState([
    { day: "Mon", hours: 8.5, status: "completed" },
    { day: "Tue", hours: 8.2, status: "completed" },
    { day: "Wed", hours: 8.0, status: "completed" },
    { day: "Thu", hours: 8.3, status: "completed" },
    { day: "Fri", hours: 8.0, status: "completed" },
    { day: "Sat", hours: 0, status: "off" },
    { day: "Sun", hours: 0, status: "off" },
  ]);

  const [loading, setLoading] = useState(false);

  // Format time
  // const formatTime = (date) => {
  //   return date?.toLocaleTimeString("en-US", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: true,
  //   });
  // };

  // Check-in handler
  const handleCheckIn = async () => {
    try {
      setLoading(true);

      const data = await checkIn();

      if (data?.success && data?.attendance) {
        const { attendance } = data;
        setAttendance(attendance);

        const sessions = attendance.sessions || [];
        console.log("Session", sessions);
        if (sessions.length > 0) {
          const last = sessions[sessions.length - 1];
          setLastSession(last);
          console.log("lastSe", lastSession);
          // Checked in if last session has no checkout
          setCheckedIn(!last.checkOut);
        } else {
          setLastSession(null);
          setCheckedIn(false);
        }
      } else {
        setAttendance(null);
        setLastSession(null);
        setCheckedIn(false);
      }
    } catch (error) {
      console.error("Error during check-in:", error);
      setAttendance(null);
      setLastSession(null);
      setCheckedIn(false);
    } finally {
      setLoading(false);
    }
  };

  // Check-out handler
  const handleCheckOut = async () => {
    try {
      setLoading(true);

      const data = await checkOut();

      if (data?.success && data?.attendance) {
        const { attendance } = data;
        setAttendance(attendance);

        const sessions = attendance.sessions || [];

        if (sessions.length > 0) {
          const last = sessions[sessions.length - 1];
          setLastSession(last);
          // If last session has no checkout → still checked in
          setCheckedIn(!last.checkOut);
        } else {
          setLastSession(null);
          setCheckedIn(false);
        }
      } else {
        // In case response doesn’t contain attendance
        setAttendance(null);
        setLastSession(null);
        setCheckedIn(false);
      }
    } catch (error) {
      console.error("Error during check-out:", error);
      setAttendance(null);
      setLastSession(null);
      setCheckedIn(false);
    } finally {
      setLoading(false);
      await fetchWeeklySummary();
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // Fetch today's attendance (make sure this returns JSON)
        const data = await fetchTodayAttendance();
        console.log(data);

        if (data?.success && data?.attendance) {
          const { attendance } = data;
          setAttendance(attendance);

          const sessions = attendance.sessions || [];

          if (sessions.length > 0) {
            const last = sessions[sessions.length - 1];
            setLastSession(last);
            // Checked in if last session has no checkout
            setCheckedIn(!last.checkOut);
          } else {
            setLastSession(null);
            setCheckedIn(false);
          }
        } else {
          setAttendance(null);
          setLastSession(null);
          setCheckedIn(false);
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
        setCheckedIn(false);
        setLastSession(null);
      }
    };

    fetchAttendance();
  }, []);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        await fetchWeeklySummary();
      } catch (error) {
      } finally {
      }
    };

    fetchWeeklyData();
  }, []);

  console.log(attendance, lastSession, checkedIn);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white">
        <div className=" mx-auto px-4 ">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {profile.name}
              </h1>
              <p className="text-gray-500 mt-1">
                {profile.position?.name} • {profile.department?.name}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 font-semibold text-lg">
                {profile.name?.slice(0, 1)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" mx-auto px-4 py-8">
        {/* Check-in/Check-out Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-[#00aeef]" />
            <h2 className="text-xl font-semibold text-gray-900">
              Time Tracking
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Check-in Time */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Check-in Time
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {lastSession?.checkIn
                  ? formatTimeToIST12(lastSession.checkIn)
                  : "--:--"}
              </p>
            </div>

            {/* Check-out Time */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Check-out Time
              </p>
              <p className="text-2xl font-bold text-gray-600">
                {lastSession?.checkOut
                  ? formatTimeToIST12(lastSession.checkOut)
                  : "--:--"}
              </p>
            </div>

            {/* Total Hours */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Hours Worked
              </p>
              <p className="text-2xl font-bold text-green-600">
                {attendance?.working_hours
                  ? formatDuration(attendance.working_hours)
                  : "00h:00m"}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCheckIn}
              disabled={checkedIn || loading}
              className="flex-1 flex items-center justify-center gap-2 bg-[#00aeef] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {loading && checkedIn === false ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              {checkedIn ? "Checked In" : "Check In"}
            </button>

            <button
              onClick={handleCheckOut}
              disabled={!checkedIn || loading}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {loading && checkedIn === true ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <LogOut className="w-5 h-5" />
              )}
              Check Out
            </button>
          </div>
        </div>

        {/* Today's Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Today's Activity
              </h3>
            </div>

            <div className="space-y-4">
              {attendance?.sessions?.map((log, idx) => (
                <React.Fragment key={idx}>
                  {/* ✅ Check-In Row */}
                  {log.checkIn && (
                    <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50">
                        <LogIn className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 capitalize">
                          Checked In
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatTimeToIST12(log.checkIn)}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        On Time
                      </span>
                    </div>
                  )}

                  {/* ✅ Check-Out Row */}
                  {log.checkOut && (
                    <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50">
                        <LogOut className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 capitalize">
                          Checked Out
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatTimeToIST12(log.checkOut)}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Completed
                      </span>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Weekly Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Weekly Summary
              </h3>
            </div>

            <div className="space-y-3">
              {weeklySummary.map((day, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  {console.log(day)}
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-700 w-10">
                      {getDayNameFromDate(day?.date_ist)}
                    </span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[80px]">
                      <div
                        className={`h-full rounded-full ${
                          day.status === "off" ? "bg-gray-300" : "bg-blue-600"
                        }`}
                        style={{ width: `${(day.hoursWorked / 8.5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 text-right">
                    {formatDuration(day?.hoursWorked)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Total This Week
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    {formatDuration(
                      weeklySummary.reduce(
                        (acc, day) => acc + (day.hoursWorked || 0),
                        0
                      )
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
