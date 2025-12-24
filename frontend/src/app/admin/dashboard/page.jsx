"use client"

import { useState } from "react"

const StatCard = ({ count, title, percentage }) => {
  const progressStyle = {
    background: `conic-gradient(#00aeef ${percentage}%, #edf2f7 ${percentage}%)`,
  }

  return (
    <div className="flex items-center justify-between p-5 bg-white rounded-xl shadow-sm border border-gray-100">
      <div>
        <div className="text-4xl font-bold text-gray-800">{count}</div>
        <div className="text-sm font-medium text-gray-500 mt-1">{title}</div>
      </div>
      <div className="relative w-12 h-12 rounded-full grid place-items-center" style={progressStyle}>
        <div className="absolute w-10 h-10 bg-white rounded-full"></div>
        <span className="relative text-xs font-semibold text-gray-700">{percentage}%</span>
      </div>
    </div>
  )
}

const EmployeeRow = ({ name, role, status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "text-green-600 bg-green-100"
      case "Absent":
        return "text-red-600 bg-red-100"
      case "Leave":
        return "text-yellow-600 bg-yellow-100"
      case "Late":
        return "text-orange-600 bg-orange-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const statusStyle = getStatusColor(status)

  return (
    <div className="grid grid-cols-4 text-sm py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 rounded-lg px-2">
      <div className="text-gray-800 font-medium">{name}</div>
      <div className="text-gray-600">{role}</div>
      <div className="col-span-2 flex items-center space-x-2">
        <span className={`w-2 h-2 rounded-full ${statusStyle.split(" ")[0].replace("text", "bg")}`}></span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle}`}>{status}</span>
      </div>
    </div>
  )
}

const LeadRow = ({ name, company, status, value }) => {
  const getLeadStatusColor = (status) => {
    switch (status) {
      case "Won":
        return "text-green-600 bg-green-100"
      case "In Progress":
        return "text-blue-600 bg-blue-100"
      case "Cold":
        return "text-gray-600 bg-gray-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const statusStyle = getLeadStatusColor(status)

  return (
    <div className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2">
      <div className="flex items-center space-x-3 flex-1">
        <div className="w-8 h-8 rounded-full bg-blue-200" />
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-800">{name}</div>
          <div className="text-xs text-gray-500">{company}</div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <div className="text-xs font-semibold text-gray-700">{value}</div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle}`}>{status}</span>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1)) // January 2024

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const generateCalendarDates = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const dates = []

    for (let i = 0; i < firstDay; i++) {
      dates.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(i)
    }

    return dates
  }

  const calendarDates = generateCalendarDates()
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
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
  ]

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const getCalendarDateClass = (date) => {
    if (!date) return ""

    const today = new Date()
    const isToday =
      date === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()

    const isWeekend =
      new Date(currentDate.getFullYear(), currentDate.getMonth(), date).getDay() === 0 ||
      new Date(currentDate.getFullYear(), currentDate.getMonth(), date).getDay() === 6

    let classes = "text-gray-700 text-sm w-8 h-8 grid place-items-center rounded-full"

    if (isToday) {
      classes += " font-bold text-white bg-[#00aeef] shadow-md"
    } else if (isWeekend) {
      classes += " text-gray-400"
    }

    return classes
  }

  const attendanceStats = [
    { count: 45, title: "Present Today", percentage: 90 },
    { count: 3, title: "Absent", percentage: 6 },
    { count: 1, title: "On Leave", percentage: 2 },
    { count: 1, title: "Late", percentage: 2 },
  ]

  const employees = [
    { name: "John Smith", role: "Senior Developer", status: "Present" },
    { name: "Sarah Johnson", role: "Product Manager", status: "Present" },
    { name: "Mike Chen", role: "Designer", status: "Late" },
    { name: "Emily Davis", role: "QA Engineer", status: "Absent" },
    { name: "Robert Wilson", role: "DevOps Engineer", status: "Leave" },
  ]

  const leads = [
    { name: "Acme Corp", company: "Tech Solutions", status: "Won", value: "$50,000" },
    { name: "Global Industries", company: "Manufacturing", status: "In Progress", value: "$30,000" },
    { name: "StartUp Hub", company: "Consulting", status: "In Progress", value: "$15,000" },
    { name: "Enterprise Ltd", company: "Finance", status: "Cold", value: "$20,000" },
    { name: "Tech Ventures", company: "Software", status: "Won", value: "$75,000" },
  ]

  return (
    <div className="min-h-screen p-6 font-sans">
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 bg-[#00aeef] rounded-3xl shadow-xl text-white flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Hello Admin!</h1>
              <p className="mt-2 text-indigo-100">
                You have <strong>45 employees</strong> present today. Keep track of team performance 📊
              </p>
              <button className="mt-4 px-6 py-2 bg-white text-[#00aeef] rounded-xl font-semibold text-sm hover:bg-indigo-50">
                View Report
              </button>
            </div>
            <div className="hidden sm:block w-32 h-32" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Attendance Overview</h2>
              <button className="text-sm text-[#00aeef] font-medium hover:underline">See all</button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {attendanceStats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Employee Attendance</h2>
              <button className="px-5 py-2 bg-[#00aeef] text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 shadow-md">
                Mark Attendance
              </button>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="grid grid-cols-4 text-xs font-medium text-gray-500 uppercase border-b pb-2 mb-2">
                <div>Employee Name</div>
                <div>Position</div>
                <div className="col-span-2">Status</div>
              </div>
              <div className="space-y-1">
                {employees.map((emp, index) => (
                  <EmployeeRow key={index} {...emp} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl shadow-xl border border-gray-100">
            <div className="flex justify-between items-center mb-4 text-gray-800">
              <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-xl font-bold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {days.map((day) => (
                <div key={day} className="text-xs font-semibold text-gray-400">
                  {day}
                </div>
              ))}
              {calendarDates.map((date, index) => (
                <div key={index} className={getCalendarDateClass(date)}>
                  {date}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Sales Leads</h3>
              <button className="text-sm text-[#00aeef] font-medium hover:underline">See all</button>
            </div>

            <div className="space-y-2">
              {leads.map((lead, index) => (
                <LeadRow key={index} {...lead} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
