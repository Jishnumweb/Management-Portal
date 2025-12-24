"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Edit3,
  Eye,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Circle,
  TrendingUp,
  X,
} from "lucide-react";
import useEmployeeStore from "@/stores/useEmployeeStore";
import useAdminStore from "@/stores/useAdminStore";

export default function EmployeeTasksPage() {
  const { myTasks, getMyTask, updateMyTask, acceptMyTask, rejectMyTask } =
    useEmployeeStore();
  const { taskStatuses, getAllTaskStatus } = useAdminStore();
  const [taskData, setTaskData] = useState({});

  const [showEditSidebar, setShowEditSidebar] = useState(false);
  const [showViewModel, setShowViewModel] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [editId, setEditId] = useState(null);

  const [taskStates, setTaskStates] = useState({
    data: [],
    page: 1,
    limit: 10,
    totalPages: 0,
    totalTasks: 0,
    loading: false,
    serachFilter: "",
    priorityFilter: "",
    statusFilter: "",
    dueDateFilter: "",
  });

  const [editTaskData, setEditTaskData] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setTaskStates((prev) => ({ ...prev, loading: true }));
      try {
        const res = await getMyTask({
          page: taskStates.page,
          limit: taskStates.limit,
          search: taskStates.serachFilter,
          priority: taskStates.priorityFilter,
          status: taskStates.statusFilter,
          dueDate: taskStates.dueDateFilter,
        });

        setTaskStates((prev) => ({
          ...prev,
          data: res.tasks,
          totalPages: res.totalPages,
          totalTasks: res.total,
          loading: false,
        }));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setTaskStates((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchTasks();
  }, [
    taskStates.page,
    taskStates.limit,
    taskStates.serachFilter,
    taskStates.priorityFilter,
    taskStates.statusFilter,
    taskStates.dueDateFilter,
  ]);

  useEffect(() => {
    getAllTaskStatus();
  }, []);

  // const getStatistics = () => {
  //   return {
  //     total: tasks.length,
  //     accepted: tasks.filter((t) => t.accepted).length, // count accepted tasks
  //     inProgress: tasks.filter((t) => t.status === "In Progress" && t.accepted)
  //       .length,
  //     completed: tasks.filter((t) => t.status === "Completed").length,
  //     pending: tasks.filter((t) => t.status === "Not Started" && t.accepted)
  //       .length,
  //     overdue: tasks.filter(
  //       (t) =>
  //         new Date(t.dueDate) < new Date() &&
  //         t.status !== "Completed" &&
  //         t.accepted
  //     ).length,
  //   };
  // };

  const getStatusColor = (status) => {
    const colors = {
      "Not Started": { bg: "bg-gray-100", text: "text-gray-700" },
      "In Progress": { bg: "bg-blue-100", text: "text-blue-700" },
      Completed: { bg: "bg-green-100", text: "text-green-700" },
      "On Hold": { bg: "bg-orange-100", text: "text-orange-700" },
    };
    return colors[status] || colors["Not Started"];
  };

  const getPriorityColor = (priority) => {
    const colors = {
      Low: { bg: "bg-gray-100", text: "text-gray-700" },
      Medium: { bg: "bg-yellow-100", text: "text-yellow-800" },
      High: { bg: "bg-red-100", text: "text-red-700" },
      Urgent: { bg: "bg-purple-100", text: "text-purple-700" },
    };
    return colors[priority] || colors["Medium"];
  };

  const handleEditClick = (task) => {
    if (!task.accepted === "Accepted") {
      alert("Please accept this task first before updating it.");
      return;
    }
    setEditTaskData({
      title: task.title || "",
      priority: task.priority?.priority || "",
      status: task.status?._id || "",
      assignedTo: task.assignedTo || [],
      clientName: task.clientName?.name || "",
      description: task.description || "",
      dueDate: task.dueDate || "",
      accepted: task.accepted || "Pending",
      percentageComplete: task.percentageComplete || 0,
      timeSpent: task.timeSpent || 0,
    });
    setEditId(task._id);
    setShowEditSidebar(true);
  };

  const handleUpdateTask = async () => {
    setEditLoading(true);
    try {
      await updateMyTask(editId, editTaskData);
      setShowEditSidebar(false);
      setEditTaskData({});
      setEditId(null);
    } finally {
      setEditLoading(false);
    }
  };

  const handleViewClick = (task) => {
    setSelectedTask(task);
    setShowViewModel(true);
  };

  const handleStatusUpdate = (status) => {
    const updated = { ...editTaskData, status };
    // if (status === "Completed" && editTaskData.percentageComplete !== 100) {
    //   updated.percentageComplete = 100;
    // }
    setEditTaskData(updated);
  };

  const handleProgressUpdate = (percentage) => {
    setEditTaskData({
      ...editTaskData,
      percentageComplete: Math.min(100, Math.max(0, percentage)),
      // status:
      //   percentage === 100 && editTaskData.status !== "Completed"
      //     ? "Completed"
      //     : editTaskData.status,
    });
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isDeadlineSoon = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const daysUntil = Math.floor((due - today) / (1000 * 60 * 60 * 24));
    return daysUntil <= 3 && daysUntil >= 0;
  };

  const isOverdue = (dueDate, status) => {
    return status !== "Completed" && new Date(dueDate) < new Date();
  };

  const handleAcceptTask = async (task) => {
    await acceptMyTask(task._id);
  };

  const handleRejectTask = async (task) => {
    await rejectMyTask(task._id);
  };

  // const stats = getStatistics();

  const handleFilterChange = (key, value) => {
    setTaskStates((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // always reset page on filter change
    }));
  };

  return (
    <>
      <div className="p-1 space-y-2">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">My Tasks</h1>
            <p className="text-gray-500 text-sm">
              View and update your assigned tasks
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {taskStates.totalTasks}
                </p>
              </div>
              <TrendingUp size={32} className="text-[#00aeef]" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Accepted</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {taskStates.accepted}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <CheckCircle size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {taskStates.inProgress}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Circle size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {taskStates.completed}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Overdue</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {taskStates.overdue}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertCircle size={24} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3">
          <Search className="text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by task title or description..."
            className="flex-1 border-0 focus:outline-none text-sm w-full"
            value={taskStates.serachFilter}
            onChange={(e) => handleFilterChange("serachFilter", e.target.value)}
          />
          <input
            type="date"
            name="dueDateFilter"
            value={taskStates.dueDateFilter}
            onChange={(e) =>
              handleFilterChange("dueDateFilter", e.target.value)
            }
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            value={taskStates.statusFilter}
            onChange={(e) => handleFilterChange("statusFilter", e.target.value)}
            className="border border-gray-300 w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef] flex-1 min-w-[120px]"
          >
            <option value="">All Status</option>
            {taskStatuses.map((status) => (
              <option key={status._id} value={status._id}>
                {status.taskStatus}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setTaskStates((prev) => ({
                ...prev,
                serachFilter: "",
                statusFilter: "",
                priorityFilter: "",
                dueDateFilter: "",
                page: 1,
              }));
            }}
            className="text-sm text-[#00aeef] hover:text-[#0093ca] font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition whitespace-nowrap flex-shrink-0"
          >
            Clear
          </button>
        </div>

        {/* Tasks Table */}
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Task Title</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3">Due Date</th>
                <th className="px-6 py-3">Time Spent</th>
                <th className="px-6 py-3">Completion</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myTasks && myTasks.length > 0 ? (
                myTasks.map((task, index) => (
                  <tr
                    key={task._id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {index}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{task.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          task.accepted === "Accepted"
                            ? `${getStatusColor(task.status).bg} ${
                                getStatusColor(task.status).text
                              }`
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {task.accepted === "Accepted"
                          ? task.status?.taskStatus
                          : "Pending Acceptance"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          getPriorityColor(task.priority).bg
                        } ${getPriorityColor(task.priority).text}`}
                      >
                        {task.priority?.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {formatDate(task.dueDate)}
                        {isOverdue(task.dueDate, task.status) &&
                          task.accepted === "Accepted" && (
                            <AlertCircle
                              size={16}
                              className="text-red-600"
                              title="Overdue"
                            />
                          )}
                        {isDeadlineSoon(task.dueDate) &&
                          !isOverdue(task.dueDate, task.status) &&
                          task.accepted === "Accepted" && (
                            <Clock
                              size={16}
                              className="text-orange-600"
                              title="Deadline Soon"
                            />
                          )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="text-[#00aeef]" />{" "}
                        {task.timeSpent}h / {task.estimatedTime}h
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#00aeef] h-2 rounded-full"
                            style={{ width: `${task.percentageComplete || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">
                          {task.percentageComplete || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      {task.accepted === "Pending" && (
                        <>
                          <button
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition font-medium"
                            onClick={() => handleAcceptTask(task)}
                          >
                            Accept
                          </button>
                          <button
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition font-medium"
                            onClick={() => handleRejectTask(task)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {task.accepted === "Accepted" && (
                        <>
                          <button
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
                            onClick={() => handleEditClick(task)}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition"
                            onClick={() => handleViewClick(task)}
                          >
                            <Eye size={14} />
                          </button>
                        </>
                      )}
                      {task.accepted === "Rejected" && (
                        <>
                          <p className="p-3 rounded-md bg-red-400">Rejected</p>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-500">
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {/* {totalPages > 1 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(Math.max(1, page - 1))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  Previous
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  Next
                </button>
              </div>

              <div className="text-sm text-gray-600 text-right">
                <span className="font-medium">
                  Page {page} of {totalPages}
                </span>
              </div>
            </div>
          </div>
        )} */}
      </div>
      {/* Update Task Sidebar - Employee can only edit Status and Percentage */}
      {showEditSidebar && editId && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setShowEditSidebar(false)}
          />
          <div className="lg:h-150 md:h-100 md:w-300 h-130 w-full md:p-5 p-3 m-4 overflow-hidden justify-center items-center z-30 bg-white shadow-2xl overflow-y-auto rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Update Task Status
                </h2>
                <button
                  onClick={() => {
                    setShowEditSidebar(false);
                    setEditTaskData({});
                  }}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X size={24} />
                </button>
              </div>

              {editLoading ? (
                <p>Loading...</p>
              ) : (
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Task Title
                    </label>
                    <input
                      type="text"
                      disabled
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                      value={editTaskData.title || ""}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <input
                      type="text"
                      disabled
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                      value={editTaskData.priority || ""}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="text"
                      disabled
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                      value={formatDate(editTaskData.dueDate) || ""}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Hours
                    </label>
                    <input
                      type="text"
                      disabled
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                      value={editTaskData.estimatedTime || ""}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={editTaskData.status || ""}
                      onChange={(e) => handleStatusUpdate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                    >
                      {taskStatuses.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.taskStatus}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Spent (hours)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                      value={editTaskData.timeSpent || 0}
                      onChange={(e) =>
                        setEditTaskData({
                          ...editTaskData,
                          timeSpent: Number.parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Completion Percentage:{" "}
                      <span className="text-[#00aeef] font-bold">
                        {editTaskData.percentageComplete || 0}%
                      </span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      className="w-full cursor-pointer"
                      value={editTaskData.percentageComplete || 0}
                      onChange={(e) =>
                        handleProgressUpdate(Number.parseInt(e.target.value))
                      }
                    />
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-[#00aeef] h-3 rounded-full transition-all"
                        style={{
                          width: `${editTaskData.percentageComplete || 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      disabled
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                      value={editTaskData.description || ""}
                    />
                  </div>

                  {editTaskData.notes && (
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        disabled
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-yellow-50 text-gray-600 cursor-not-allowed"
                        value={editTaskData.notes || ""}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                  onClick={() => {
                    setShowEditSidebar(false);
                    setEditTaskData({});
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#00aeef] hover:bg-[#0093ca] text-white px-6 py-2 rounded-lg font-medium transition"
                  onClick={handleUpdateTask}
                  disabled={editLoading}
                >
                  {editLoading ? "Saving..." : "Update Status"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {console.log(selectedTask)}
      {/* View Task Modal */}
      {showViewModel && selectedTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowViewModel(false);
                setSelectedTask(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={24} />
            </button>

            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {selectedTask.title}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {selectedTask.description}
                  </p>
                </div>

                {/* FIXED STATUS BADGE */}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedTask.accepted === "Accepted"
                      ? `${getStatusColor(selectedTask.status?._id).bg} ${
                          getStatusColor(selectedTask.status?._id).text
                        }`
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {selectedTask.accepted === "Accepted"
                    ? selectedTask.status?.taskStatus // ✔ FIXED
                    : "Pending Acceptance"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                    Priority
                  </p>
                  <p className="text-gray-900 font-medium">
                    <span
                      className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                        getPriorityColor(selectedTask.priority._id).bg
                      } ${getPriorityColor(selectedTask.priority._id).text}`}
                    >
                      {selectedTask.priority?.priority}
                    </span>
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={16} className="text-[#00aeef]" />
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                      Due Date
                    </p>
                  </div>

                  <p className="text-gray-900 font-medium">
                    {formatDate(selectedTask.dueDate)}
                  </p>

                  {isOverdue(selectedTask.dueDate, selectedTask.status?._id) &&
                    selectedTask.accepted === "Accepted" && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle size={14} /> Overdue
                      </p>
                    )}

                  {isDeadlineSoon(selectedTask.dueDate) &&
                    !isOverdue(
                      selectedTask.dueDate,
                      selectedTask.status?._id
                    ) &&
                    selectedTask.accepted === "Accepted" && (
                      <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                        <Clock size={14} /> Deadline Soon
                      </p>
                    )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={16} className="text-[#00aeef]" />
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                      Time Tracking
                    </p>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {selectedTask.timeSpent}h spent /{" "}
                    {selectedTask.estimatedTime}h estimated
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                    Completion Progress
                  </p>
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-[#00aeef] h-3 rounded-full"
                        style={{ width: `${selectedTask.percentageComplete || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-lg font-bold text-[#00aeef]">
                      {selectedTask.percentageComplete || 0}% Complete
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                    Current Status
                  </p>

                  {/* FIXED CURRENT STATUS */}
                  <p className="text-gray-900 font-medium">
                    {selectedTask.status?.taskStatus} {/* ✔ FIXED */}
                  </p>
                </div>
              </div>
            </div>

            {selectedTask.notes && (
              <div className="mt-6 bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                  Notes
                </p>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {selectedTask.description}
                </p>
              </div>
            )}

            <div className="mt-8 flex gap-3">
              <button
                className="flex-1 bg-[#00aeef] hover:bg-[#0093ca] text-white py-2 rounded-lg font-medium transition"
                onClick={() => {
                  handleEditClick(selectedTask);
                  setShowViewModel(false);
                }}
              >
                Update Status & Progress
              </button>
              <button
                className="flex-1 border border-gray-300 hover:bg-gray-50 py-2 rounded-lg font-medium transition"
                onClick={() => {
                  setShowViewModel(false);
                  setSelectedTask(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
