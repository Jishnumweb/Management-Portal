import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee", // reference to employee collection
      required: true,
    },

    leaveType: {
      type: String,
      required: true,
    },

    leaveDates: {
      type: [String], // array of dates
      required: true,
    },

    duration: {
      type: String,
      enum: ["Half Day", "Full Day"],
      required: true,
    },

    reason: {
      type: String,
      minlength: 3,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    rejectedReason: {
      type: String,
    },
  },
  { timestamps: true }
);

const Leave = mongoose.models.Leave || mongoose.model("Leave", LeaveSchema);

export default Leave;
