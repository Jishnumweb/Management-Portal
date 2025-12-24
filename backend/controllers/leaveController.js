import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";
import { LeaveType } from "../models/Master.js ";
import mongoose from "mongoose";

export const applyLeave = async (req, res) => {
  try {
    const { leaveType, leaveDates, duration, reason } = req.body;

    if (!leaveType || !leaveDates || leaveDates.length === 0 || !duration) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 1. Fetch leave type
    const type = await LeaveType.findById(leaveType);
    if (!type) {
      return res.status(404).json({
        success: false,
        message: "Leave type not found",
      });
    }

    const leaveTypeName = type.leave_type;
    const totalYearlyAllowed = type.total_leaves;
    const monthlyAllowed = type.leaves_per_month;

    // 2. Requested leave units
    const perDay = duration === "Half Day" ? 0.5 : 1;
    const totalRequested = leaveDates.length * perDay;

    // 3. YEARLY CHECK
    const yearStart = new Date(`${new Date().getFullYear()}-01-01`);
    const yearEnd = new Date(`${new Date().getFullYear()}-12-31`);

    const yearlyLeaves = await Leave.find({
      employee: req.user._id,
      leaveType: leaveTypeName,
      status: { $in: ["Pending", "Approved"] },
      leaveDates: {
        $elemMatch: {
          $gte: yearStart,
          $lte: yearEnd,
        },
      },
    });

    const totalYearlyUsed = yearlyLeaves.reduce((sum, l) => {
      const per = l.duration === "Half Day" ? 0.5 : 1;
      return sum + l.leaveDates.length * per;
    }, 0);

    const availableYearly = totalYearlyAllowed - totalYearlyUsed;

    if (totalRequested > availableYearly) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableYearly} yearly leaves left for ${leaveTypeName}.`,
      });
    }

    // 4. MONTHLY CHECK — FIXED (use selected dates)
    const firstDate = new Date(leaveDates[0]);
    const selectedMonth = firstDate.getMonth(); // the month user selected
    const selectedYear = firstDate.getFullYear();

    const monthStart = new Date(selectedYear, selectedMonth, 1);
    const monthEnd = new Date(selectedYear, selectedMonth + 1, 0);

    const monthlyLeaves = await Leave.find({
      employee: req.user._id,
      leaveType: leaveTypeName,
      status: { $in: ["Pending", "Approved"] },
      leaveDates: {
        $elemMatch: {
          $gte: monthStart,
          $lte: monthEnd,
        },
      },
    });

    const totalMonthlyUsed = monthlyLeaves.reduce((sum, l) => {
      const per = l.duration === "Half Day" ? 0.5 : 1;
      return sum + l.leaveDates.length * per;
    }, 0);

    const availableMonthly = monthlyAllowed - totalMonthlyUsed;

    if (totalRequested > availableMonthly) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableMonthly} monthly leaves left for ${leaveTypeName}.`,
      });
    }

    // 5. Create Leave Request
    const leave = await Leave.create({
      employee: req.user._id,
      leaveType: leaveTypeName,
      leaveDates,
      duration,
      reason,
    });

    return res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      leave,
    });
  } catch (error) {
    console.log("Apply Leave Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const changeLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params; // leave id
    const { status } = req.body; // Approved / Rejected

    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status provided" });
    }

    const leave = await Leave.findById(id);
    if (!leave) {
      return res
        .status(404)
        .json({ success: false, message: "Leave not found" });
    }

    leave.status = status;
    leave.approvedBy = req.user._id; // admin id
    await leave.save();

    res.status(200).json({
      success: true,
      message: `Leave ${status.toLowerCase()} successfully`,
      leave,
    });
  } catch (error) {
    console.log("Change Status Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllLeavesForAdmin = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      department = "",
      date,
    } = req.query;
    console.log(page, limit);
    page = Number(page);
    limit = Number(limit);

    const filter = {};

    // Date filter (check if date exists inside leaveDates array)
    if (date) {
      const targetDate = new Date(date).toISOString().split("T")[0]; // YYYY-MM-DD
      filter.leaveDates = { $elemMatch: { $eq: targetDate } };
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Department filter
    if (department) {
      const deptEmployees = await Employee.find({ department }).select("_id");
      const deptIds = deptEmployees.map((e) => e._id);
      filter.employee = { $in: deptIds };
    }

    // Search by employee name
    if (search) {
      const employees = await Employee.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");

      const searchIds = employees.map((e) => e._id);
      if (filter.employee) {
        // Keep intersection of department & search
        filter.employee.$in = filter.employee.$in.filter((id) =>
          searchIds.includes(id)
        );
      } else {
        filter.employee = { $in: searchIds };
      }
    }

    // Total count for pagination
    const total = await Leave.countDocuments(filter);

    // Fetch leaves with population
    const leaves = await Leave.find(filter)
      .populate({
        path: "employee",
        select: "name email department",
        populate: { path: "department", select: "name _id" },
      })
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total,
      leaves,
    });
  } catch (error) {
    console.log("Admin Get Leaves Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", status = "" } = req.query;

    page = Number(page);
    limit = Number(limit);

    search = search.trim();
    status = status.trim();

    // Base filter for logged-in employee
    const baseFilter = { employee: req.user._id };

    // Add search filter (leaveType + reason)
    if (search) {
      baseFilter.$or = [
        { leaveType: { $regex: search, $options: "i" } },
        { reason: { $regex: search, $options: "i" } },
      ];
    }

    // Add status filter
    if (status) {
      baseFilter.status = status;
    }

    const leaves = await Leave.find(baseFilter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Leave.countDocuments(baseFilter);

    return res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      leaves,
    });
  } catch (error) {
    console.log("My Leaves Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteSingleLeaveDate = async (req, res) => {
  try {
    const { id, date } = req.body;

    if (!id || !date) {
      return res.status(400).json({
        success: false,
        message: "Leave ID and date are required",
      });
    }

    // Find leave belonging to this employee
    const leave = await Leave.findOne({
      _id: id,
      employee: req.user._id,
    });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    // Remove the specific date
    const updatedDates = leave.leaveDates.filter((d) => d !== date);

    // If no dates left, delete the entire leave record
    if (updatedDates.length === 0) {
      await Leave.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: "Leave record deleted because no dates left",
      });
    }

    // Otherwise update only the leaveDates
    leave.leaveDates = updatedDates;
    await leave.save();

    return res.status(200).json({
      success: true,
      message: "Leave date removed successfully",
      leave,
    });
  } catch (error) {
    console.error("Delete Leave Date Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId, status, rejectedReason } = req.body;
    console.log(leaveId, status, rejectedReason);

    if (!leaveId || !status) {
      return res
        .status(400)
        .json({ success: false, message: "leaveId and status are required" });
    }

    // Only require rejectedReason if status is Rejected
    if (
      status === "Rejected" &&
      (!rejectedReason || rejectedReason.trim() === "")
    ) {
      return res.status(400).json({
        success: false,
        message: "rejectedReason is required when rejecting a leave",
      });
    }

    // Find the leave by ID
    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res
        .status(404)
        .json({ success: false, message: "Leave request not found" });
    }

    // Update status and rejectedReason
    leave.status = status;
    if (status === "Rejected") leave.rejectedReason = rejectedReason;
    if (status === "Approved") leave.rejectedReason = undefined; // clear previous rejected reason if any

    await leave.save();

    return res.status(200).json({ success: true, leave });
  } catch (error) {
    console.error("Error updating leave status:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
