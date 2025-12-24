"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, User, LogOut, Settings, LogIn, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Message from "./admin/Message";
import useAuthStore from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import useEmployeeStore from "@/stores/useEmployeeStore";

const formatTimeToIST = (utcDateString, options = {}) => {
  if (!utcDateString) return "--:--";
  const { hour12 = false } = options;
  return new Date(utcDateString).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12,
  });
};

const formatTimeToIST12 = (utcDateString) =>
  formatTimeToIST(utcDateString, { hour12: true });

const formatDuration = (hoursDecimal) => {
  if (!hoursDecimal && hoursDecimal !== 0) return "--";
  const totalMinutes = Math.round(hoursDecimal * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const h = hours.toString().padStart(2, "0");
  const m = minutes.toString().padStart(2, "0");
  return `${h}h ${m}m`;
};

export function EmployeeNavbar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [attendanceModal, setAttendanceModal] = useState(false); // Modal state for check-in/out
  const [loading, setLoading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [lastSession, setLastSession] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const router = useRouter();
  const { logout } = useAuthStore();
  const { checkIn, checkOut, fetchTodayAttendance } = useEmployeeStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const data = await fetchTodayAttendance();
        if (data?.success && data?.attendance) {
          const { attendance } = data;
          setAttendance(attendance);
          const sessions = attendance.sessions || [];
          if (sessions.length > 0) {
            const last = sessions[sessions.length - 1];
            setLastSession(last);
            setCheckedIn(!last.checkOut);
          } else {
            setLastSession(null);
            setCheckedIn(false);
          }
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };
    fetchAttendance();
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      const data = await checkIn();
      if (data?.success && data?.attendance) {
        const { attendance } = data;
        setAttendance(attendance);
        const sessions = attendance.sessions || [];
        if (sessions.length > 0) {
          const last = sessions[sessions.length - 1];
          setLastSession(last);
          setCheckedIn(!last.checkOut);
        }
      }
    } catch (error) {
      console.error("Error during check-in:", error);
    } finally {
      setLoading(false);
    }
  };

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
          setCheckedIn(!last.checkOut);
        }
      }
    } catch (error) {
      console.error("Error during check-out:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch {}
  };

  const handleClick = () => setMessageOpen(!messageOpen);
  const onClose = () => setMessageOpen(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#f5f5f5] border-b border-gray-200 px-4 md:px-16 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section - Time & Date */}
          <div className="hidden md:flex flex-col items-center py-2 rounded-lg">
            <div className="text-lg font-semibold text-[#00aeef]">
              {mounted ? formatTime(currentTime) : "--:--:--"}
            </div>
            <div className="text-xs text-gray-600">
              {mounted ? formatDate(currentTime) : ""}
            </div>
          </div>

          <SidebarTrigger className="md:hidden" />

          {/* Center Section - Check-in/Check-out Status & Quick Actions */}
          <div className="flex-1 flex items-center justify-center gap-3 md:gap-4">
            {/* Status Badge */}
            <div
              className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-sm bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setAttendanceModal(true)}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  checkedIn ? "bg-green-500 animate-pulse" : "bg-gray-300"
                }`}
              />
              <span className="text-xs md:text-sm font-medium text-gray-700">
                {checkedIn ? "Checked In" : "Checked Out"}
              </span>
              <Clock className="w-4 h-4 text-gray-500 ml-1" />
            </div>

            {/* Quick Stats */}
            <div className="hidden lg:flex items-center gap-3 px-3 py-2 rounded-sm bg-white border border-gray-200 text-xs md:text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500">
                  In:{" "}
                  {lastSession?.checkIn
                    ? formatTimeToIST12(lastSession.checkIn)
                    : "--:--"}
                </span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div className="flex flex-col">
                <span className="text-gray-500">
                  Hours: {formatDuration(attendance?.working_hours || 0)}
                </span>
              </div>
            </div>

            {/* Quick Check-in/Out Button */}
            <button
              onClick={() => (checkedIn ? handleCheckOut() : handleCheckIn())}
              disabled={loading}
              className={`hidden md:flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                checkedIn
                  ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                  : "bg-[#00aeef]/10 text-[#00aeef] hover:bg-[#00aeef]/20 border border-[#00aeef]/20"
              } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : checkedIn ? (
                <LogOut className="w-4 h-4" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span className="text-xs md:text-sm">
                {checkedIn ? "Check Out" : "Check In"}
              </span>
            </button>
          </div>

          {/* Right Section - Notifications & User Menu */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gray-100"
              onClick={handleClick}
            >
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 focus:outline-none">
                  <Avatar className="h-8 w-8 border border-gray-200">
                    <AvatarImage src="/avatar.png" alt="user avatar" />
                    <AvatarFallback>
                      <div className="">
                        <img
                          src="https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Transparent.png"
                          alt=""
                          className="h-14 w-full object-contain "
                        />
                      </div>
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {attendanceModal && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
          onClick={() => setAttendanceModal(false)}
        >
          <div
            className="w-full md:w-96 bg-white rounded-2xl md:rounded-xl shadow-2xl p-6 md:p-8 animate-in slide-in-from-bottom md:zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#00aeef]/10 rounded-lg">
                <Clock className="w-5 h-5 text-[#00aeef]" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Time Tracking
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {mounted ? formatDate(currentTime) : ""}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {/* Check-in Time */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                <p className="text-xs font-medium text-gray-600 mb-2">
                  Check-in
                </p>
                <p className="text-lg md:text-xl font-bold text-blue-600">
                  {lastSession?.checkIn
                    ? formatTimeToIST12(lastSession.checkIn)
                    : "--:--"}
                </p>
              </div>

              {/* Hours Worked */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
                <p className="text-xs font-medium text-gray-600 mb-2">Hours</p>
                <p className="text-lg md:text-xl font-bold text-green-600">
                  {formatDuration(attendance?.working_hours || 0)}
                </p>
              </div>

              {/* Check-out Time */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 text-center">
                <p className="text-xs font-medium text-gray-600 mb-2">
                  Check-out
                </p>
                <p className="text-lg md:text-xl font-bold text-gray-600">
                  {lastSession?.checkOut
                    ? formatTimeToIST12(lastSession.checkOut)
                    : "--:--"}
                </p>
              </div>
            </div>

            {/* Status Info */}
            <div
              className={`p-4 rounded-lg mb-6 ${
                checkedIn
                  ? "bg-green-50 border border-green-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    checkedIn ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <span
                  className={`font-medium ${
                    checkedIn ? "text-green-700" : "text-gray-600"
                  }`}
                >
                  {checkedIn
                    ? "You're currently checked in"
                    : "You're checked out"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCheckIn}
                disabled={checkedIn || loading}
                className="flex-1 flex items-center justify-center gap-2 bg-[#00aeef] hover:bg-[#0099d9] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-sm transition-colors duration-200"
              >
                {loading && !checkedIn ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-5 h-5" />
                )}
                Check In
              </button>

              <button
                onClick={handleCheckOut}
                disabled={!checkedIn || loading}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-sm transition-colors duration-200"
              >
                {loading && checkedIn ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogOut className="w-5 h-5" />
                )}
                Check Out
              </button>
            </div>

            {/* Close hint */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Click outside to close
            </p>
          </div>
        </div>
      )}

      {messageOpen && <Message onClose={onClose} />}
    </>
  );
}
