"use client";

import React, { useState, useEffect } from "react";
import useAdminStore from "@/stores/useAdminStore";
import { X, Eye, Edit3, Trash2 } from "lucide-react";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
};

const TaskManagementDashboard = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [addModel, setAddModel] = useState(false);
  const [editModel, setEditModel] = useState(false);
  const [deleteModel, setDeleteModel] = useState(false);

  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({});

  // const [tasks, setTasks] = useState([
  //   {
  //     id: 1,
  //     name: "Design new landing page",
  //     assigned: "Sarah Chen",
  //     priority: "High",
  //     status: "In Progress",
  //     deadline: "2024-01-25",
  //     progress: 65,
  //   },
  //   {
  //     id: 2,
  //     name: "API integration",
  //     assigned: "Mike Johnson",
  //     priority: "High",
  //     status: "In Progress",
  //     deadline: "2024-01-22",
  //     progress: 80,
  //   },
  //   {
  //     id: 3,
  //     name: "User testing phase 1",
  //     assigned: "Emma Davis",
  //     priority: "Medium",
  //     status: "Pending",
  //     deadline: "2024-02-01",
  //     progress: 20,
  //   },
  //   {
  //     id: 4,
  //     name: "Database optimization",
  //     assigned: "John Smith",
  //     priority: "Medium",
  //     status: "Completed",
  //     deadline: "2024-01-18",
  //     progress: 100,
  //   },
  //   {
  //     id: 5,
  //     name: "Documentation update",
  //     assigned: "Lisa Wong",
  //     priority: "Low",
  //     status: "Pending",
  //     deadline: "2024-02-05",
  //     progress: 40,
  //   },
  //   {
  //     id: 6,
  //     name: "Bug fixes - Critical",
  //     assigned: "Alex Kumar",
  //     priority: "High",
  //     status: "In Progress",
  //     deadline: "2024-01-20",
  //     progress: 90,
  //   },
  //   {
  //     id: 7,
  //     name: "Team meeting preparation",
  //     assigned: "Sarah Chen",
  //     priority: "Low",
  //     status: "Pending",
  //     deadline: "2024-01-19",
  //     progress: 10,
  //   },
  //   {
  //     id: 8,
  //     name: "Marketing campaign launch",
  //     assigned: "Mike Johnson",
  //     priority: "High",
  //     status: "In Progress",
  //     deadline: "2024-01-24",
  //     progress: 75,
  //   },
  // ]);

  const {
    tasks,
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
    getAllPriorities,
    priorities,
    getAllTaskStatus,
    taskStatuses,
    getAllEmployees,
    employees,
    getAllClients,
    clients,
  } = useAdminStore();

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
    employeeFilter: "",
    clientFilter: "",
    dueDateFilter: "",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      setTaskStates((prev) => ({ ...prev, loading: true }));
      try {
        const res = await getAllTasks({
          page: taskStates.page,
          limit: taskStates.limit,
          search: taskStates.serachFilter,
          priority: taskStates.priorityFilter,
          status: taskStates.statusFilter,
          employee: taskStates.employeeFilter,
          client: taskStates.clientFilter,
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
    taskStates.employeeFilter,
    taskStates.clientFilter,
    taskStates.dueDateFilter,
  ]);
  const initialForm = {
    title: "",
    priority: "",
    status: "",
    assignedTo: [],
    clientName: "",
    description: "",
    dueDate: "",
  };
  const [formData, setFormData] = useState(initialForm);

  const handleFilterChange = (key, value) => {
    setTaskStates((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // always reset page on filter change
    }));
  };
  console.log(formData.assignedTo);

  // OPEN MODALS
  const openAdd = () => {
    setFormData(initialForm);
    setErrors({});
    setEditId(null);
    setAddModel(true);
  };

  const openEdit = (item) => {
    setFormData({
      title: item.title || "",
      priority: item.priority?._id || "",
      status: item.status?._id || "",
      assignedTo: item.assignedTo || [],
      clientName: item.clientName?._id || "",
      description: item.description || "",
      dueDate: formatDateForInput(item.dueDate),
    });
    setErrors({});
    setEditId(item._id);
    setEditModel(true);
  };

  console.log(formData);

  const openDelete = (id) => {
    setDeleteId(id);
    setDeleteModel(true);
  };

  const activities = [
    {
      id: 1,
      type: "completed",
      text: "Alex Kumar completed Database optimization",
      time: "2 hours ago",
      icon: "✓",
    },
    {
      id: 2,
      type: "assigned",
      text: "Sarah Chen was assigned to Design new landing page",
      time: "5 hours ago",
      icon: "📌",
    },
    {
      id: 3,
      type: "overdue",
      text: "Team meeting preparation is now overdue",
      time: "1 day ago",
      icon: "⚠️",
    },
    {
      id: 4,
      type: "completed",
      text: "John Smith completed API integration review",
      time: "2 days ago",
      icon: "✓",
    },
    {
      id: 5,
      type: "assigned",
      text: "Emma Davis was assigned to User testing phase 1",
      time: "3 days ago",
      icon: "📌",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-orange-600";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const handleInputChange = (e) => {
    const { id, options, multiple, value } = e.target;

    const newValue = multiple
      ? Array.from(options)
          .filter((opt) => opt.selected)
          .map((opt) => opt.value)
      : value;

    setFormData((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };

  // FORM VALIDATION
  const validate = (data) => {
    const errs = {};

    if (!data.title?.trim()) errs.title = "Title is required";

    if (!data.priority?.trim()) errs.short_form = "Priority is required";
    if (!data.status?.trim()) errs.status = "Status is required";
    if (!data.priority?.trim()) errs.priority = "Status is required";
    if (!Array.isArray(data.assignedTo) || data.assignedTo.length === 0) {
      errs.assignedTo = "AssignedTo is required";
    }
    if (!data.dueDate?.trim()) errs.dueDate = "Duedate is required";

    return errs;
  };

  // SAVE FORM (ADD / EDIT via Zustand) with multipart/form-data
  const saveForm = async () => {
    const validation = validate(formData);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);

    try {
      if (editId) {
        // EDIT MODE
        const data = await updateTask(editId, formData);
        console.log(formData);
        // setLeaveTypes((prev) =>
        //   prev.map((item) => (item._id === editingId ? data : item))
        // );

        setEditModel(false);
        setEditId(null);
      } else {
        // ADD MODE
        const data = await createTask(formData);

        // setLeaveTypes((prev) => [...prev, data]);

        setAddModel(false);
      }

      // Reset form & errors
      setFormData(initialForm);
      setErrors({});
    } catch (error) {
      console.error("Error saving Task:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return; // safety check
    setSubmitting(true);
    try {
      await deleteTask(deleteId);

      // Update local state
      // set((prev) => prev.filter((b) => b._id !== deletingId));

      // Close modal and reset
      setDeleteModel(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      // Optionally show a toast or alert
    } finally {
      setSubmitting(false);
    }
  };

  const [mapDatas, setMapDatas] = useState({
    priorities: [],
    status: [],
    employees: [],
    client: [],
  });

  useEffect(() => {
    getAllPriorities();
    getAllTaskStatus();
    getAllEmployees();
    getAllClients();
  }, []);

  // 2️⃣ When Zustand store updates, sync to mapDatas
  useEffect(() => {
    setMapDatas({
      priorities,
      status: taskStatuses,
      employees,
      clients,
    });
  }, [priorities, taskStatuses, employees, clients]);
  console.log(tasks);
  return (
    <div style={{ backgroundColor: "", minHeight: "100vh" }} className="p-3">
      <div style={{ padding: "1px" }} className="mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2
              className="text-3xl font-bold mb-2"
              style={{ color: "#1a1a1a" }}
            >
              Task Management Dashboard
            </h2>
            <p style={{ color: "#666" }} className="text-sm">
              Welcome back! Here's your task overview for today.
            </p>
          </div>
          <button
            onClick={openAdd}
            style={{
              backgroundColor: "#00AEEF",
              color: "white",
            }}
            className="px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            + New Task
          </button>
        </div>

        {/* Tasks Table */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            border: "1px solid #e5e7eb",
            marginBottom: "32px",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 style={{ color: "#1a1a1a" }} className="font-bold text-lg">
              Active Tasks
            </h3>
            {/* <div className="flex gap-2">
              {["all", "high", "medium", "low"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  style={{
                    backgroundColor:
                      activeFilter === filter ? "#00aeef" : "#f3f4f6",
                    color: activeFilter === filter ? "white" : "#666",
                  }}
                  className="px-4 py-2 rounded-8 text-xs font-medium transition-all capitalize"
                >
                  {filter}
                </button>
              ))}
            </div> */}

            {/* Filters + Daily Table */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-3 py-2 shadow-sm">
                {/* <Filter size={16} className="text-gray-500" /> */}
                {/* Filters */}
                <input
                  type="text"
                  name="serachFilter"
                  value={taskStates.serachFilter}
                  onChange={(e) =>
                    handleFilterChange("serachFilter", e.target.value)
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                {/* Department Dropdown */}
                <select
                  name="statusFilter"
                  value={taskStates.statusFilter}
                  onChange={(e) =>
                    handleFilterChange("statusFilter", e.target.value)
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Status</option>
                  {taskStatuses?.map((status) => (
                    <option key={status._id} value={status._id}>
                      {status.taskStatus}
                    </option>
                  ))}
                </select>
                <select
                  name="priorityFilter"
                  value={taskStates.priorityFilter}
                  onChange={(e) =>
                    handleFilterChange("priorityFilter", e.target.value)
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Priority</option>
                  {priorities?.map((priority) => (
                    <option key={priority._id} value={priority._id}>
                      {priority.priority}
                    </option>
                  ))}
                </select>
                <select
                  name="employeeFilter"
                  value={taskStates.employeeFilter}
                  onChange={(e) =>
                    handleFilterChange("employeeFilter", e.target.value)
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Employee</option>
                  {employees?.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
                <select
                  name="clientFilter"
                  value={taskStates.clientFilter}
                  onChange={(e) =>
                    handleFilterChange("clientFilter", e.target.value)
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Client</option>
                  {clients?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
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
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <th
                    style={{
                      color: "#666",
                      textAlign: "left",
                      padding: "12px 0",
                    }}
                    className="font-semibold"
                  >
                    Task Name
                  </th>
                  <th
                    style={{
                      color: "#666",
                      textAlign: "left",
                      padding: "12px 0",
                    }}
                    className="font-semibold"
                  >
                    Assigned To
                  </th>
                  <th
                    style={{
                      color: "#666",
                      textAlign: "left",
                      padding: "12px 0",
                    }}
                    className="font-semibold"
                  >
                    Priority
                  </th>
                  <th
                    style={{
                      color: "#666",
                      textAlign: "left",
                      padding: "12px 0",
                    }}
                    className="font-semibold"
                  >
                    Status
                  </th>
                  <th
                    style={{
                      color: "#666",
                      textAlign: "left",
                      padding: "12px 0",
                    }}
                    className="font-semibold"
                  >
                    Deadline
                  </th>
                  <th
                    style={{
                      color: "#666",
                      textAlign: "left",
                      padding: "12px 0",
                    }}
                    className="font-semibold"
                  >
                    Progress
                  </th>
                  <th
                    style={{
                      color: "#666",
                      textAlign: "left",
                      padding: "12px 0",
                    }}
                    className="font-semibold"
                  >
                    Employee verify
                  </th>
                  <th
                    style={{
                      color: "#666",
                      textAlign: "left",
                      padding: "12px 0",
                    }}
                    className="font-semibold"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tasks?.map((task, idx) => (
                  <tr
                    key={idx}
                    style={{ borderBottom: "1px solid #e5e7eb" }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td
                      style={{ color: "#1a1a1a", padding: "16px 0" }}
                      className="font-medium"
                    >
                      {task.title}
                    </td>
                    <td style={{ color: "#666", padding: "16px 0" }}>
                      {task?.assignedTo?.[0]?.name}
                    </td>
                    <td
                      style={{ color: "#1a1a1a", padding: "16px 0" }}
                      className={`font-semibold ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority?.priority}
                    </td>
                    <td style={{ padding: "16px 0" }}>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status?.taskStatus}
                      </span>
                    </td>
                    <td style={{ color: "#666", padding: "16px 0" }}>
                      {formatDate(task.dueDate)}
                    </td>
                    <td style={{ padding: "16px 0" }}>
                      <div
                        style={{
                          backgroundColor: "#e5e7eb",
                          borderRadius: "4px",
                          height: "6px",
                          width: "80px",
                        }}
                        className="overflow-hidden"
                      >
                        <div
                          style={{
                            backgroundColor:
                              task.progress === 100 ? "#0D676D" : "#00AEEF",
                            height: "100%",
                            width: `${task.percentageComplete || 0}%`,
                            transition: "width 0.3s ease",
                          }}
                        ></div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 0" }}>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border`}
                      >
                        {task.accepted}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-start gap-2">
                      <button
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
                        onClick={() => null}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
                        onClick={() => openEdit(task)}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
                        onClick={() => openDelete(task._id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
              gridColumn: "span 2",
            }}
          >
            <h3 style={{ color: "#1a1a1a" }} className="font-bold text-lg mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {activities.map((activity, idx) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        backgroundColor:
                          activity.type === "completed"
                            ? "#d1fae5"
                            : activity.type === "overdue"
                            ? "#fee2e2"
                            : "#e0f2fe",
                        borderRadius: "50%",
                      }}
                      className="flex items-center justify-center text-sm"
                    >
                      {activity.icon}
                    </div>
                    {idx !== activities.length - 1 && (
                      <div
                        style={{
                          width: "2px",
                          height: "32px",
                          backgroundColor: "#e5e7eb",
                          margin: "8px 0",
                        }}
                      ></div>
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <p
                      style={{ color: "#1a1a1a" }}
                      className="text-sm font-medium"
                    >
                      {activity.text}
                    </p>
                    <p style={{ color: "#999" }} className="text-xs mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3 style={{ color: "#1a1a1a" }} className="font-bold text-lg mb-6">
              Quick Stats
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p style={{ color: "#666" }} className="text-sm">
                    Completion Rate
                  </p>
                  <span
                    style={{ color: "#0D676D" }}
                    className="text-lg font-bold"
                  >
                    78%
                  </span>
                </div>
                <div
                  style={{
                    backgroundColor: "#e5e7eb",
                    borderRadius: "4px",
                    height: "6px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#0D676D",
                      height: "100%",
                      width: "78%",
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p style={{ color: "#666" }} className="text-sm">
                    On-Time Rate
                  </p>
                  <span
                    style={{ color: "#00AEEF" }}
                    className="text-lg font-bold"
                  >
                    94%
                  </span>
                </div>
                <div
                  style={{
                    backgroundColor: "#e5e7eb",
                    borderRadius: "4px",
                    height: "6px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#00AEEF",
                      height: "100%",
                      width: "94%",
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p style={{ color: "#666" }} className="text-sm">
                    Team Utilization
                  </p>
                  <span
                    style={{ color: "#ea580c" }}
                    className="text-lg font-bold"
                  >
                    87%
                  </span>
                </div>
                <div
                  style={{
                    backgroundColor: "#e5e7eb",
                    borderRadius: "4px",
                    height: "6px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#ea580c",
                      height: "100%",
                      width: "87%",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Add Modal ---------- */}
      {addModel && (
        <div className="fixed flex justify-center items-center inset-0 z-50  lg:p-0 md:p-10">
          <div className="fixed inset-0 bg-black/40 " />
          <div className=" md:h-100 md:w-300 md:p-10 p-3 overflow-hidden  justify-center items-center z-40   bg-[#f9f9f9] shadow-2xl overflow-y-auto ">
            <div className="mb-8 flex justify-between items-center">
              <h1 className="font-bold">Add Task</h1>
              <div>
                <button
                  disabled={submitting}
                  onClick={() => {
                    setAddModel(false);
                    setFormData(initialForm);
                    setErrors({});
                  }}
                  className="cursor-pointer"
                >
                  <X className="text-red-600" />
                </button>
              </div>
            </div>

            {/* Form */}
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveForm(false);
                }}
              >
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-grid-cols-1 gap-3 relative">
                  <div className="relative w-full">
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        errors.title
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                    />

                    <label
                      htmlFor="title"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                      peer-placeholder-shown:top-4 
                      peer-placeholder-shown:text-base
                      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                      peer-[&:not(:placeholder-shown)]:-top-2 
                      peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      Title
                    </label>

                    {errors.title && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <SelectInput
                    label="Priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    error={errors.priority}
                  >
                    <option value=""></option>
                    {priorities.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.priority}
                      </option>
                    ))}
                  </SelectInput>

                  <SelectInput
                    label="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    error={errors.status}
                  >
                    <option value=""></option>
                    {taskStatuses.map((status) => (
                      <option key={status._id} value={status._id}>
                        {status.taskStatus}
                      </option>
                    ))}
                  </SelectInput>

                  <MultiSelect
                    label="Assign To"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    options={employees}
                    error={errors.assignedTo}
                  />

                  <SelectInput
                    label="clientName"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    error={errors.clientName}
                  >
                    <option value=""></option>
                    {clients.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </SelectInput>
                  <div className="relative w-full">
                    <input
                      type="date"
                      id="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        errors.dueDate
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                    />

                    <label
                      htmlFor="dueDate"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                      peer-placeholder-shown:top-4 
                      peer-placeholder-shown:text-base
                      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                      peer-[&:not(:placeholder-shown)]:-top-2 
                      peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      Due Date
                    </label>
                    {errors.dueDate && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.dueDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    disabled={submitting}
                    type="button"
                    className="border-[#ff00004e] hover:bg-[red] transition-all border p-2 px-6 text-black rounded-[3px] cursor-pointer"
                    onClick={() => {
                      setAddModel(false);
                      setFormData(initialForm);
                      setErrors({});
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={submitting}
                    type="submit"
                    className="bg-[#00aeef] p-2 px-6 text-white rounded-[3px]  cursor-pointer"
                  >
                    {submitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* ---------- Edit Modal ---------- */}
      {editModel && (
        <div className="fixed flex justify-center items-center inset-0 z-50  lg:p-0 md:p-10">
          <div className="fixed inset-0 bg-black/40 " />
          <div className=" md:h-100 md:w-300 md:p-10 p-3 overflow-hidden  justify-center items-center z-40   bg-[#f9f9f9] shadow-2xl overflow-y-auto ">
            <div className="mb-8 flex justify-between items-center">
              <h1 className="font-bold">Edit Task</h1>
              <div>
                <button
                  disabled={submitting}
                  onClick={() => {
                    setEditModel(false);
                    setFormData(initialForm);
                    setEditId(null);
                    setErrors({});
                  }}
                  className="cursor-pointer"
                >
                  <X className="text-red-600" />
                </button>
              </div>
            </div>

            {/* Form */}
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveForm(false);
                }}
              >
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-grid-cols-1 gap-3 relative">
                  <div className="relative w-full">
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        errors.title
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                    />

                    <label
                      htmlFor="title"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                      peer-placeholder-shown:top-4 
                      peer-placeholder-shown:text-base
                      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                      peer-[&:not(:placeholder-shown)]:-top-2 
                      peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      Title
                    </label>

                    {errors.title && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>
                  <SelectInput
                    label="Priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    error={errors.priority}
                  >
                    <option value=""></option>
                    {priorities.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.priority}
                      </option>
                    ))}
                  </SelectInput>
                  <SelectInput
                    label="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    error={errors.status}
                  >
                    <option value=""></option>
                    {taskStatuses.map((status) => (
                      <option key={status._id} value={status._id}>
                        {status.taskStatus}
                      </option>
                    ))}
                  </SelectInput>

                  <MultiSelect
                    label="Assign To"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    options={employees}
                    error={errors.assignedTo}
                  />
                  <SelectInput
                    label="clientName"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    error={errors.clientName}
                  >
                    <option value=""></option>
                    {clients.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </SelectInput>
                  <div className="relative w-full">
                    <input
                      type="date"
                      id="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={`peer p-4 w-full rounded-sm bg-white outline-none 
                      ${
                        errors.dueDate
                          ? "border border-red-500"
                          : "border border-[#afa9a959] focus:border-[#00aeef]"
                      }`}
                    />

                    <label
                      htmlFor="dueDate"
                      className="absolute left-4 top-4 text-black transition-all duration-200 bg-white px-1
                      peer-placeholder-shown:top-4 
                      peer-placeholder-shown:text-base
                      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
                      peer-[&:not(:placeholder-shown)]:-top-2 
                      peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      Due Date
                    </label>
                    {errors.dueDate && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.dueDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    disabled={submitting}
                    type="button"
                    className="border-[#ff00004e] hover:bg-[red] transition-all border p-2 px-6 text-black rounded-[3px] cursor-pointer"
                    onClick={() => {
                      setEditModel(false);
                      setFormData(initialForm);
                      setErrors({});
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={submitting}
                    type="submit"
                    className="bg-[#00aeef] p-2 px-6 text-white rounded-[3px]  cursor-pointer"
                  >
                    {submitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {deleteModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-[90%] max-w-sm p-6 rounded-md shadow-xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="font-semibold text-lg">Delete Task</h1>
              <button
                disabled={submitting}
                onClick={() => {
                  setDeleteModel(false);
                  setDeleteId(null);
                }}
                className="cursor-pointer"
              >
                <X className="text-red-600" />
              </button>
            </div>

            {/* Warning Text */}
            <p className="text-gray-700 text-sm leading-relaxed">
              Are you sure you want to delete this task?
              <br />
              <span className="font-medium text-red-600">
                This action cannot be undone.
              </span>
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                disabled={submitting}
                type="button"
                className="border border-red-400 hover:bg-red-500 hover:text-white transition-all px-4 py-2 rounded text-sm"
                onClick={() => {
                  setDeleteModel(false);
                  setDeleteId(null);
                }}
              >
                Cancel
              </button>
              <button
                disabled={submitting}
                onClick={handleDelete}
                className="bg-[#00aeef] px-4 py-2 text-white rounded text-sm hover:opacity-90 transition-all"
              >
                {submitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SelectInput = ({
  label,
  name,
  value,
  onChange,
  error,
  children,
  multiple = false,
}) => {
  console.log(value);
  const hasValue =
    (Array.isArray(value) && value.length > 0) ||
    (value !== "" && value !== undefined && value !== null);

  return (
    <div className="relative w-full mb-5">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        multiple={multiple} // ← added
        className={`peer p-4 w-full rounded-sm bg-white outline-none 
          ${
            error
              ? "border border-red-500"
              : "border border-[#afa9a959] focus:border-[#00aeef]"
          }
        `}
      >
        {children}
      </select>

      <label
        htmlFor={name}
        className={`absolute left-4 text-black bg-white px-1 transition-all duration-200
          ${hasValue ? "-top-2 text-xs" : "top-4 text-base"}
          peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#00aeef]
        `}
      >
        {label}
      </label>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

const MultiSelect = ({
  label,
  name,
  value = [], // ← now supports objects
  options = [],
  onChange,
  error,
}) => {
  const [open, setOpen] = useState(false);

  // Extract only IDs from value array (if objects)
  const selectedIds = value.map((v) => (typeof v === "string" ? v : v._id));

  const toggleSelect = (id) => {
    let newSelected;

    if (selectedIds.includes(id)) {
      newSelected = selectedIds.filter((v) => v !== id);
    } else {
      newSelected = [...selectedIds, id];
    }

    // Emit only IDs
    onChange({
      target: {
        id: name,
        value: newSelected,
      },
    });
  };

  const hasValue = selectedIds.length > 0;

  return (
    <div className="relative w-full mb-5">
      {/* Floating Label */}
      <label
        htmlFor={name}
        className={`absolute left-4 bg-white px-1 text-black transition-all duration-200 z-10
          ${hasValue ? "-top-2 text-xs" : "top-4 text-base"}
          ${open ? "text-[#00aeef]" : ""}
        `}
      >
        {label}
      </label>

      {/* Display box */}
      <div
        className={`peer p-4 w-full rounded-sm bg-white outline-none cursor-pointer
          ${
            error
              ? "border border-red-500"
              : "border border-[#afa9a959] focus:border-[#00aeef]"
          }
        `}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="flex flex-wrap gap-1">
          {selectedIds.length === 0 ? (
            <span className="text-gray-400 text-sm">Select...</span>
          ) : (
            selectedIds.map((id) => {
              const item = options.find((o) => o._id === id);
              return (
                <span
                  key={id}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {item?.name}
                </span>
              );
            })
          )}
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white shadow-md border rounded-sm max-h-40 overflow-y-auto">
          {options.map((e) => (
            <div
              key={e._id}
              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => toggleSelect(e._id)}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(e._id)}
                readOnly
                className="mr-2"
              />
              <span>{e.name}</span>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default TaskManagementDashboard;
