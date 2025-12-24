"use client";

import { useState } from "react";
import {
  X,
  AlertCircle,
  FileText,
  MessageSquare,
  Users,
  ChevronUp,
  ChevronDown,
  Settings,
} from "lucide-react";

const NotificationBadge = ({ count }) => {
  if (count === 0) return null;
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full ml-1">
      {count > 9 ? "9+" : count}
    </span>
  );
};

const UserAvatar = ({ name, color = "bg-blue-500" }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`${color} w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}
    >
      {initials}
    </div>
  );
};

const DepartmentBadge = ({
  name,
  color = "bg-blue-100",
  textColor = "text-blue-700",
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color} ${textColor}`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          textColor === "text-blue-700"
            ? "bg-blue-700"
            : textColor === "text-purple-700"
            ? "bg-purple-700"
            : "bg-orange-700"
        }`}
      />
      {name}
    </span>
  );
};

const NotificationItem = ({ notification, onApprove, onDeny }) => {
  const {
    id,
    type,
    name,
    action,
    time,
    department,
    departmentColor,
    avatarColor,
    content,
  } = notification;

  const getIcon = () => {
    switch (type) {
      case "join":
        return <Users className="w-4 h-4 text-gray-400" />;
      case "invite":
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
      case "upload":
        return <FileText className="w-4 h-4 text-gray-400" />;
      case "comment":
        return <MessageSquare className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
      <div className="flex gap-4">
        <UserAvatar name={name} color={avatarColor} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold text-gray-900">{name}</span>
                <span className="text-gray-600"> {action}</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">{time}</span>
                <DepartmentBadge name={department} color={departmentColor} />
              </div>
            </div>
            {getIcon()}
          </div>

          {content && (
            <div className="mt-3">
              {content.type === "file" && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded border border-gray-200 w-fit">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700 font-medium">
                    {content.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({content.size})
                  </span>
                </div>
              )}
              {content.type === "text" && (
                <p className="mt-2 px-3 py-2 bg-gray-50 rounded border-l-2 border-gray-300 text-sm text-gray-700">
                  {content.text}
                </p>
              )}
            </div>
          )}

          {type === "invite" && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onDeny(id)}
                className="px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Deny
              </button>
              <button
                onClick={() => onApprove(id)}
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                Approve
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Notifications({ onClose }) {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "join",
      name: "Wei Chen",
      action: "joined to Final Presentation",
      time: "8 min ago",
      department: "Horizon Shift",
      departmentColor: "bg-orange-100",
      avatarColor: "bg-orange-500",
    },
    {
      id: 2,
      type: "invite",
      name: "Sophia Williams",
      action: "invites you synergy.fig file with you",
      time: "2 hours ago",
      department: "Synergy HR",
      departmentColor: "bg-purple-100",
      avatarColor: "bg-purple-500",
    },
    {
      id: 3,
      type: "upload",
      name: "Arthur Taylor",
      action: "uploaded an arthur.csv file",
      time: "3 hours ago",
      department: "Apex Financial",
      departmentColor: "bg-orange-100",
      avatarColor: "bg-pink-500",
      content: {
        type: "file",
        name: "arthur.csv",
        size: "4mb",
      },
    },
    {
      id: 4,
      type: "comment",
      name: "Laura Perez",
      action: "commented on your post",
      time: "2 days ago",
      department: "Solaris",
      departmentColor: "bg-orange-100",
      avatarColor: "bg-pink-500",
      content: {
        type: "text",
        text: "Fantastic! Let's dive right in 🚀",
      },
    },
  ]);

  const unreadCount = notifications.length;

  const handleApprove = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleDeny = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleMarkAsRead = () => {
    // Implementation for marking all as read
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "inbox") return true;
    return false;
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs and Controls */}
        <div className="border-b border-gray-200 px-6 pt-4 pb-0 flex items-center justify-between">
          <div className="flex gap-6">
            {["all", "inbox", "following", "archived"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "border-blue-600 text-[#00aeef]"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === "inbox" && <NotificationBadge count={unreadCount} />}
              </button>
            ))}
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-2 text-right">
          <button
            onClick={handleMarkAsRead}
            className="text-sm font-medium text-[#00aeef] hover:text-blue-700"
          >
            Mark all as read
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No notifications</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onApprove={handleApprove}
                onDeny={handleDeny}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Use</span>
              <ChevronUp className="w-4 h-4" />
              <ChevronDown className="w-4 h-4" />
              <span>to navigate</span>
            </div>
            <button className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Manage Notification
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
