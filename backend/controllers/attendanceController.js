// attendance.controller.js
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import mongoose from "mongoose";

// Helpers -------------------------------------------------------------------
// Use Intl to compute IST date parts reliably regardless of server TZ
const getISTDateYMD = (date = new Date()) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date); // returns "YYYY-MM-DD"

// Return the UTC Date value that corresponds to IST midnight for the given date.
// Example: for IST 2025-11-13 00:00, this returns the UTC instant representing that moment.
const getISTMidnight = (date = new Date()) => {
  const ymd = getISTDateYMD(date); // "YYYY-MM-DD"
  // build a time string at IST midnight and parse it — the `+05:30` offset ensures correct instant
  return new Date(`${ymd}T00:00:00.000+05:30`);
};

// Return current UTC Date (store UTC timestamps)
const getNowUTC = () => new Date();

// Convert stored attendance.date (UTC instant representing IST midnight) to YYYY-MM-DD (IST)
const toISTDateString = (date) => {
  if (!date) return null;
  return getISTDateYMD(new Date(date));
};

// Format a UTC timestamp to IST display time (e.g. "03:15 PM")
const toISTTimeString = (utcDate) => {
  if (!utcDate) return null;
  return new Date(utcDate).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Map sessions to include IST display times and keep raw UTC fields
const mapSessionsWithIST = (sessions = []) =>
  sessions.map((s) => ({
    _id: s._id,
    checkIn: s.checkIn ?? null, // raw UTC
    checkOut: s.checkOut ?? null, // raw UTC
    duration: s.duration ?? 0,
    checkIn_ist: s.checkIn ? toISTTimeString(s.checkIn) : null,
    checkOut_ist: s.checkOut ? toISTTimeString(s.checkOut) : null,
  }));

// -------------------- CONTROLLERS --------------------

// CHECK-IN
export const checkIn = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const today = getISTMidnight();

    let attendance = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });

    if (!attendance) {
      attendance = new Attendance({
        employee: employeeId,
        date: today, // stored as UTC instant that equals IST midnight
        sessions: [{ checkIn: getNowUTC() }],
      });
    } else {
      const lastSession = attendance.sessions[attendance.sessions.length - 1];
      if (lastSession && !lastSession.checkOut) {
        return res
          .status(400)
          .json({ success: false, message: "You are already checked in!" });
      }
      attendance.sessions.push({ checkIn: getNowUTC() });
    }

    await attendance.save();

    const obj = attendance.toObject();
    return res.status(200).json({
      success: true,
      message: "Check-in successful",
      attendance: {
        ...obj,
        date_utc: obj.date,
        date_ist: toISTDateString(obj.date),
        sessions: mapSessionsWithIST(obj.sessions),
      },
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return res.status(500).json({
      success: false,
      message: "Error during check-in",
      error: error.message,
    });
  }
};

// CHECK-OUT
export const checkOut = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const today = getISTMidnight();

    const attendance = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "No check-in record found for today",
      });
    }

    const lastSession = attendance.sessions[attendance.sessions.length - 1];
    if (!lastSession || lastSession.checkOut) {
      return res
        .status(400)
        .json({ success: false, message: "You are not currently checked in" });
    }

    lastSession.checkOut = getNowUTC();

    await attendance.save();

    const obj = attendance.toObject();
    return res.status(200).json({
      success: true,
      message: "Check-out successful",
      attendance: {
        ...obj,
        date_utc: obj.date,
        date_ist: toISTDateString(obj.date),
        sessions: mapSessionsWithIST(obj.sessions),
      },
    });
  } catch (error) {
    console.error("Check-out error:", error);
    return res.status(500).json({
      success: false,
      message: "Error during check-out",
      error: error.message,
    });
  }
};

// GET ALL ATTENDANCE (for employee)
export const getMyAttendance = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const records = await Attendance.find({ employee: employeeId })
      .sort({ date: -1 })
      .lean();

    const formatted = records.map((r) => ({
      ...r,
      date_utc: r.date,
      date_ist: toISTDateString(r.date),
      sessions: mapSessionsWithIST(r.sessions || []),
    }));

    return res.status(200).json({ success: true, attendance: formatted });
  } catch (error) {
    console.error("Get all attendance error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching attendance records",
      error: error.message,
    });
  }
};

// WEEKLY SUMMARY (last 7 days, returns date in IST YYYY-MM-DD)
export const getWeeklySummary = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const today = getISTMidnight(); // IST-aligned midnight stored in DB
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);

    const records = await Attendance.find({
      employee: employeeId,
      date: { $gte: sevenDaysAgo, $lt: tomorrow },
    })
      .sort({ date: 1 })
      .lean();

    const summary = records.map((r) => ({
      date_utc: r.date,
      date_ist: toISTDateString(r.date),
      hoursWorked: r.working_hours || 0,
    }));

    return res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error("Weekly summary error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching weekly summary",
      error: error.message,
    });
  }
};

// TODAY’S ATTENDANCE DETAILS
export const getTodayAttendance = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const today = getISTMidnight();

    const attendance = await Attendance.findOne({
      employee: employeeId,
      date: today,
    }).lean();

    if (!attendance) {
      return res.status(200).json({
        success: true,
        message: "No attendance record found for today",
        attendance: null,
      });
    }

    return res.status(200).json({
      success: true,
      attendance: {
        ...attendance,
        date_utc: attendance.date,
        date_ist: toISTDateString(attendance.date),
        sessions: mapSessionsWithIST(attendance.sessions || []),
      },
    });
  } catch (error) {
    console.error("Get today attendance error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching today's attendance",
      error: error.message,
    });
  }
};

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

// Convert JS Date → UTC representation for IST midnight
// const getISTMidnightForAttendanceReport = (date = new Date()) => {
//   const ist = new Date(date.getTime() + IST_OFFSET_MS);
//   ist.setHours(0, 0, 0, 0);
//   return new Date(ist.getTime() - IST_OFFSET_MS);
// };

// Convert UTC → YYYY-MM-DD (IST)
const toISTDateStringForAttendanceReport = (date) => {
  if (!date) return null;
  const d = new Date(new Date(date).getTime() + IST_OFFSET_MS);
  return d.toISOString().split("T")[0];
};

//
// ────────────────────────────────────────────────
//  1️⃣ MONTHLY SUMMARY CONTROLLER (with month/year filter)
// ────────────────────────────────────────────────
//
export const getMonthlyAttendanceSummaryForAdmin = async (req, res) => {
  try {
    // Accept month as YYYY-MM (e.g., "2025-11") and department ID
    const { page = 1, limit = 10, month, department } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));

    // parse month param (YYYY-MM) or fallback to current
    let queryYear;
    let queryMonth;
    if (month) {
      const parts = String(month).split("-");
      if (parts.length === 2) {
        queryYear = parseInt(parts[0], 10);
        queryMonth = parseInt(parts[1], 10);
        if (
          Number.isNaN(queryYear) ||
          Number.isNaN(queryMonth) ||
          queryMonth < 1 ||
          queryMonth > 12
        ) {
          const now = new Date();
          queryYear = now.getFullYear();
          queryMonth = now.getMonth() + 1;
        }
      } else {
        const now = new Date();
        queryYear = now.getFullYear();
        queryMonth = now.getMonth() + 1;
      }
    } else {
      const now = new Date();
      queryYear = now.getFullYear();
      queryMonth = now.getMonth() + 1;
    }

    // compute month start and next month start in IST
    const monthStartUTC = new Date(
      `${queryYear}-${String(queryMonth).padStart(
        2,
        "0"
      )}-01T00:00:00.000+05:30`
    );
    const nextMonthUTC =
      queryMonth === 12
        ? new Date(`${queryYear + 1}-01-01T00:00:00.000+05:30`)
        : new Date(
            `${queryYear}-${String(queryMonth + 1).padStart(
              2,
              "0"
            )}-01T00:00:00.000+05:30`
          );

    // Step 1: Get attendance summary (aggregate) for chosen month
    const monthlyRecords = await Attendance.aggregate([
      {
        $match: { date: { $gte: monthStartUTC, $lt: nextMonthUTC } },
      },
      {
        $group: {
          _id: "$employee",
          presentDays: { $sum: 1 },
          totalWorkingHours: { $sum: "$working_hours" },
        },
      },
    ]);

    // Step 2: Build employee query
    let employeeQuery = {};
    if (department && mongoose.Types.ObjectId.isValid(department)) {
      employeeQuery.department = new mongoose.Types.ObjectId(department);
    }

    // Step 3: Fetch employees with optional filter + pagination
    const skip = (pageNum - 1) * limitNum;
    const totalEmployees = await Employee.countDocuments(employeeQuery);

    const employees = await Employee.find(
      employeeQuery,
      "name email position department"
    )
      .populate("position", "name")
      .populate("department", "name")
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Step 4: compute present/absent/workingHours
    const now = new Date();
    const daysInMonth = new Date(queryYear, queryMonth, 0).getDate(); // last day number

    let daysCountForAbsent;
    if (queryYear === now.getFullYear() && queryMonth === now.getMonth() + 1) {
      daysCountForAbsent = Math.min(now.getDate(), daysInMonth);
    } else {
      daysCountForAbsent = daysInMonth;
    }

    const monthlySummary = employees.map((emp) => {
      const record = monthlyRecords.find(
        (r) => r._id && r._id.toString() === emp._id.toString()
      );
      const presentDays = record ? record.presentDays : 0;
      const totalWorkingHours = record ? record.totalWorkingHours : 0;
      const absentDays = Math.max(0, daysCountForAbsent - presentDays);

      return {
        employeeId: emp._id,
        name: emp.name,
        email: emp.email,
        department: emp.department?.name || "-",
        position: emp.position?.name || "-",
        presentDays,
        absentDays,
        totalWorkingHours: parseFloat((totalWorkingHours || 0).toFixed(2)),
      };
    });

    return res.status(200).json({
      success: true,
      message: "Monthly attendance summary fetched successfully",
      month: `${String(queryYear)}-${String(queryMonth).padStart(2, "0")}`, // return YYYY-MM
      monthName: new Date(queryYear, queryMonth - 1).toLocaleString("en-IN", {
        month: "long",
      }),
      year: queryYear,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalEmployees,
        totalPages: Math.ceil(totalEmployees / limitNum),
      },
      monthlySummary,
    });
  } catch (error) {
    console.error("Error fetching monthly summary:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching monthly attendance summary",
      error: error.message,
    });
  }
};

//
// ────────────────────────────────────────────────
//  2️⃣ ATTENDANCE DETAILS CONTROLLER (date filter + pagination)
//
//

const getISTMidnightFromDateString = (dateStr) => {
  // dateStr from frontend: "YYYY-MM-DD"
  return new Date(`${dateStr}T00:00:00.000+05:30`);
};

// helper assumed to exist in file:
// const getISTMidnightFromDateString = (dateStr) => new Date(`${dateStr}T00:00:00.000+05:30`);
// const toISTDateStringForAttendanceReport = (date) => { ... }

export const getAttendanceDetailsForAdmin = async (req, res) => {
  try {
    const { date, page = 1, limit = 10, department, employeeId } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    // 1) date filter (IST day)
    if (date) {
      const istMidnight = getISTMidnightFromDateString(date);
      if (isNaN(istMidnight.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format. Expect YYYY-MM-DD.",
        });
      }
      const nextDay = new Date(istMidnight.getTime() + 24 * 60 * 60 * 1000);
      query.date = { $gte: istMidnight, $lt: nextDay };
    }

    // 2) employeeId filter (most specific)
    if (employeeId) {
      if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid employeeId." });
      }
      query.employee = new mongoose.Types.ObjectId(employeeId);
    } else if (department) {
      // 3) department filter → find employees in department and filter by their ids
      if (!mongoose.Types.ObjectId.isValid(department)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid department id." });
      }

      // fetch employee ids for the department
      const empDocs = await Employee.find(
        { department: new mongoose.Types.ObjectId(department) },
        "_id"
      ).lean();

      if (!empDocs || empDocs.length === 0) {
        // no employees in this department → return empty result with pagination metadata
        return res.status(200).json({
          success: true,
          message: "No employees found for the requested department",
          filterDate: date || null,
          pagination: {
            page: pageNum,
            limit: limitNum,
            totalRecords: 0,
            totalPages: 0,
          },
          attendanceRecords: [],
        });
      }

      query.employee = { $in: empDocs.map((e) => e._id) };
    }

    // count total
    const totalRecords = await Attendance.countDocuments(query);

    // fetch records with nested population (employee -> department)
    const attendanceRecords = await Attendance.find(query)
      .populate({
        path: "employee",
        select: "name email department",
        populate: {
          path: "department",
          select: "name",
        },
      })
      .sort({ date: -1, _id: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const formattedRecords = attendanceRecords.map((rec) => ({
      _id: rec._id,
      employee: {
        _id: rec.employee?._id || null,
        name: rec.employee?.name || null,
        email: rec.employee?.email || null,
        department: rec.employee?.department?.name || null,
      },
      date: toISTDateStringForAttendanceReport(rec.date),
      working_hours: rec.working_hours || 0,
      sessions: (rec.sessions || []).map((s) => ({
        checkIn: s.checkIn,
        checkOut: s.checkOut,
        duration: s.duration,
      })),
    }));
    console.log(formattedRecords);
    return res.status(200).json({
      success: true,
      message: "Attendance records fetched successfully",
      filterDate: date || null,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limitNum),
      },
      attendanceRecords: formattedRecords,
    });
  } catch (error) {
    console.error("Error fetching attendance details:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching attendance details",
      error: error.message,
    });
  }
};

export const getMyMonthlyAttendance = async (req, res) => {
  try {
    const { month, page = 1, limit = 10 } = req.query;

    // Validate month format YYYY-MM
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({
        success: false,
        message: "Invalid month format. Use YYYY-MM",
      });
    }

    const [year, monthInput] = month.split("-").map(Number); // monthInput = 1–12 from frontend
    const monthIndex = monthInput - 1; // JS Date uses 0–11

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // Build month start/end as YYYY-MM-DD
    const monthStartStr = `${year}-${String(monthInput).padStart(2, "0")}-01`;
    const monthEndStr = `${year}-${String(monthInput).padStart(
      2,
      "0"
    )}-${String(new Date(year, monthIndex + 1, 0).getDate()).padStart(2, "0")}`;

    // Convert to IST midnight
    const monthStart = getISTMidnightFromDateString(monthStartStr);
    const monthEnd = new Date(
      getISTMidnightFromDateString(monthEndStr).getTime() + 24 * 60 * 60 * 1000
    );

    // Fetch attendance for logged-in employee in that month
    const query = {
      employee: req.user._id,
      date: { $gte: monthStart, $lt: monthEnd },
    };

    const totalRecords = await Attendance.countDocuments(query);

    const records = await Attendance.find(query)
      .sort({ date: -1, _id: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Format attendance records
    const formattedRecords = records.map((rec) => ({
      _id: rec._id,
      date: toISTDateStringForAttendanceReport(rec.date),
      working_hours: rec.working_hours || 0,
      sessions: rec.sessions || [],
    }));

    // -------------------------
    // Calculate present / absent / ongoing
    // -------------------------
    const totalDaysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const todayStr = toISTDateStringForAttendanceReport(new Date());

    const datesWithAttendance = new Set(formattedRecords.map((r) => r.date));

    let presentCount = 0;
    let absentCount = 0;
    let ongoingCount = 0;

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dayStr = `${year}-${String(monthInput).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;

      if (dayStr > todayStr) {
        ongoingCount++;
      } else if (datesWithAttendance.has(dayStr)) {
        presentCount++;
      } else {
        absentCount++;
      }
    }

    return res.status(200).json({
      success: true,
      message: "Monthly attendance fetched successfully",
      month,
      stats: {
        present: presentCount,
        absent: absentCount,
        ongoing: ongoingCount,
        totalDays: totalDaysInMonth,
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limitNum),
      },
      attendanceRecords: formattedRecords,
    });
  } catch (error) {
    console.error("getMyMonthlyAttendance Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
