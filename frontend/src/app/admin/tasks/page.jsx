"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TaskManagementDashboard = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  // KPI Data
  const kpiCards = [
    {
      label: "Total Tasks",
      value: "248",
      icon: "📋",
      trend: "+12%",
      color: "teal",
    },
    {
      label: "In Progress",
      value: "45",
      icon: "⚡",
      trend: "+8%",
      color: "blue",
    },
    {
      label: "Completed",
      value: "156",
      icon: "✓",
      trend: "+24%",
      color: "teal",
    },
    { label: "Overdue", value: "12", icon: "⚠️", trend: "-5%", color: "red" },
    {
      label: "Team Members",
      value: "24",
      icon: "👥",
      trend: "+2",
      color: "blue",
    },
    {
      label: "Active Projects",
      value: "8",
      icon: "📊",
      trend: "+1",
      color: "teal",
    },
  ];

  // Chart Data
  const taskCompletionData = [
    { week: "Week 1", completed: 45, pending: 12, overdue: 3 },
    { week: "Week 2", completed: 52, pending: 10, overdue: 2 },
    { week: "Week 3", completed: 48, pending: 14, overdue: 4 },
    { week: "Week 4", completed: 61, pending: 8, overdue: 1 },
    { week: "Week 5", completed: 58, pending: 11, overdue: 3 },
  ];

  const priorityData = [
    { name: "High", value: 45, color: "#dc2626" },
    { name: "Medium", value: 89, color: "#ea580c" },
    { name: "Low", value: 114, color: "#16a34a" },
  ];

  const attendanceData = [
    { day: "Mon", present: 22, absent: 2 },
    { day: "Tue", present: 21, absent: 3 },
    { day: "Wed", present: 23, absent: 1 },
    { day: "Thu", present: 22, absent: 2 },
    { day: "Fri", present: 20, absent: 4 },
  ];

  // Task Table Data
  const tasks = [
    {
      id: 1,
      name: "Design new landing page",
      assigned: "Sarah Chen",
      priority: "High",
      status: "In Progress",
      deadline: "2024-01-25",
      progress: 65,
    },
    {
      id: 2,
      name: "API integration",
      assigned: "Mike Johnson",
      priority: "High",
      status: "In Progress",
      deadline: "2024-01-22",
      progress: 80,
    },
    {
      id: 3,
      name: "User testing phase 1",
      assigned: "Emma Davis",
      priority: "Medium",
      status: "Pending",
      deadline: "2024-02-01",
      progress: 20,
    },
    {
      id: 4,
      name: "Database optimization",
      assigned: "John Smith",
      priority: "Medium",
      status: "Completed",
      deadline: "2024-01-18",
      progress: 100,
    },
    {
      id: 5,
      name: "Documentation update",
      assigned: "Lisa Wong",
      priority: "Low",
      status: "Pending",
      deadline: "2024-02-05",
      progress: 40,
    },
    {
      id: 6,
      name: "Bug fixes - Critical",
      assigned: "Alex Kumar",
      priority: "High",
      status: "In Progress",
      deadline: "2024-01-20",
      progress: 90,
    },
    {
      id: 7,
      name: "Team meeting preparation",
      assigned: "Sarah Chen",
      priority: "Low",
      status: "Pending",
      deadline: "2024-01-19",
      progress: 10,
    },
    {
      id: 8,
      name: "Marketing campaign launch",
      assigned: "Mike Johnson",
      priority: "High",
      status: "In Progress",
      deadline: "2024-01-24",
      progress: 75,
    },
  ];

  // Activity Feed
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

  return (
    <div style={{ backgroundColor: "", minHeight: "100vh" }}>
      {/* Top Navigation */}

      {/* Main Content */}
      <div style={{ padding: "1px" }} className=" mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ color: "#1a1a1a" }}>
            Task Management Dashboard
          </h2>
          <p style={{ color: "#666" }} className="text-sm">
            Welcome back! Here's your task overview for today.
          </p>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {kpiCards.map((card, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                border: "1px solid #e5e7eb",
              }}
              className="hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-2xl">{card.icon}</div>
                <span
                  style={{
                    color:
                      card.color === "teal"
                        ? "#0D676D"
                        : card.color === "blue"
                        ? "#00AEEF"
                        : "#dc2626",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  {card.trend}
                </span>
              </div>
              <p style={{ color: "#666" }} className="text-xs mb-2">
                {card.label}
              </p>
              <p style={{ color: "#1a1a1a" }} className="text-2xl font-bold">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Bar Chart */}
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
            <h3 style={{ color: "#1a1a1a" }} className="font-bold text-lg mb-4">
              Weekly Task Completion
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskCompletionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="completed" fill="#0D676D" radius={[6, 6, 0, 0]} />
                <Bar dataKey="pending" fill="#00AEEF" radius={[6, 6, 0, 0]} />
                <Bar dataKey="overdue" fill="#dc2626" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3 style={{ color: "#1a1a1a" }} className="font-bold text-lg mb-4">
              Task Priority
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {priorityData.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor: item.color,
                        borderRadius: "2px",
                      }}
                    ></div>
                    <span style={{ color: "#666" }}>{item.name}</span>
                  </div>
                  <span style={{ color: "#1a1a1a" }} className="font-semibold">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance & Line Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Attendance Chart */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3 style={{ color: "#1a1a1a" }} className="font-bold text-lg mb-4">
              Daily Attendance
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="present" fill="#0D676D" radius={[6, 6, 0, 0]} />
                <Bar dataKey="absent" fill="#fca5a5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3 style={{ color: "#1a1a1a" }} className="font-bold text-lg mb-4">
              Task Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={taskCompletionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#0D676D"
                  strokeWidth={2}
                  dot={{ fill: "#0D676D", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="#00AEEF"
                  strokeWidth={2}
                  dot={{ fill: "#00AEEF", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManagementDashboard;
