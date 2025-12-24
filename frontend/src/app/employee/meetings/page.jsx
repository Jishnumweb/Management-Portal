"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  X,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  Check,
  XCircle,
} from "lucide-react";
import useEmployeeStore from "@/stores/useEmployeeStore";

const EmployeeMeetingsPage = () => {
  const { myMeetings, getMyMeetings } = useEmployeeStore();

  const [showViewModel, setShowViewModel] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const [meetingStates, setMeetingStates] = useState({
    data: [],
    page: 1,
    limit: 10,
    totalPages: 0,
    totalMeetings: 0,
    loading: false,
    serachFilter: "",
    statusFilter: "",
    dateFilter: "",
  });

  useEffect(() => {
    const fetchMeetings = async () => {
      setMeetingStates((prev) => ({ ...prev, loading: true }));
      try {
        const res = await getMyMeetings({
          page: meetingStates.page,
          limit: meetingStates.limit,
          search: meetingStates.serachFilter,
          status: meetingStates.statusFilter,
          date: meetingStates.dateFilter,
        });

        setMeetingStates((prev) => ({
          ...prev,
          data: res.meetings,
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
    meetingStates.serachFilter,
    meetingStates.statusFilter,
    meetingStates.dateFilter,
  ]);

  const handleViewClick = (meeting) => {
    setSelectedMeeting(meeting);
    setShowViewModel(true);
  };

  const handleFilterChange = (key, value) => {
    setMeetingStates((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // reset page on filter change
    }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isDeadlineSoon = (date) => {
    const meetingDate = new Date(date);
    const today = new Date();
    const daysUntil = Math.floor((meetingDate - today) / (1000 * 60 * 60 * 24));
    return daysUntil <= 1 && daysUntil >= 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-600 mt-2">
            View and accept scheduled meetings
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                  Total Meetings
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {meetingStates.totalMeetings}
                </p>
              </div>
              <Calendar size={40} className="text-[#00aeef] opacity-20" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by task title or description..."
              className="flex-1 border-0 focus:outline-none text-sm w-full"
              value={meetingStates.serachFilter}
              onChange={(e) =>
                handleFilterChange("serachFilter", e.target.value)
              }
            />
            <input
              type="date"
              name="dateFilter"
              value={meetingStates.dateFilter}
              onChange={(e) => handleFilterChange("dateFilter", e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              value={meetingStates.statusFilter}
              onChange={(e) =>
                handleFilterChange("statusFilter", e.target.value)
              }
              className="border border-gray-300 w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef] flex-1 min-w-[120px]"
            >
              <option value="">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Meetings Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Meeting Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Scheduled Date & Time
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {myMeetings.map((meeting) => (
                <tr
                  key={meeting._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{meeting.title}</p>
                    <p className="text-sm text-gray-500">
                      {meeting.scheduledBy?.name}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                      {meeting.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#00aeef]" />
                      <span className="text-gray-900">
                        {formatDate(meeting.date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={16} className="text-[#00aeef]" />
                      <span className="text-gray-900">{meeting.time}</span>
                    </div>
                    {isDeadlineSoon(meeting.date) && (
                      <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                        <Clock size={14} /> Meeting Soon
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                      {meeting.location}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                      {meeting.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-[#00aeef] text-white rounded-md hover:bg-[#0095cc] transition"
                      onClick={() => handleViewClick(meeting)}
                    >
                      <Eye size={14} />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {myMeetings.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              <p>No meetings found</p>
            </div>
          )}
        </div>

        {/* View Meeting Modal */}
        {showViewModel && selectedMeeting && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
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
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {selectedMeeting.title}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {selectedMeeting.notes}
                    </p>
                  </div>
                  {/* <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      selectedMeeting.accepted
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {selectedMeeting.accepted
                      ? "Accepted"
                      : "Pending Acceptance"}
                  </span> */}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                      Scheduled By
                    </p>
                    <p className="text-gray-900 font-medium">
                      {selectedMeeting.organizer}
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                      Meeting Type
                    </p>
                    <p className="text-gray-900 font-medium">
                      <span className="inline-block px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-700">
                        {selectedMeeting.type}
                      </span>
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                      Scheduled Date
                    </p>
                    <p className="text-gray-900 font-medium">
                      {formatDate(selectedMeeting.date)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                      Meeting Time
                    </p>
                    <p className="text-gray-900 font-medium">
                      {selectedMeeting.time}
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                      Duration
                    </p>
                    <p className="text-gray-900 font-medium">
                      {selectedMeeting.duration}
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                      Location
                    </p>
                    <p className="text-gray-900 font-medium">
                      {selectedMeeting.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 border rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">
                  Participants
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedMeeting.attendees}
                </div>
              </div>
              {selectedMeeting.meetingLink && (
                <div className="mt-6 border rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">
                    Meeting Link
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMeeting.meetingLink}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeMeetingsPage;
