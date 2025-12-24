import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

//Bankdetails Schema
const BankDetailsSchema = new mongoose.Schema(
  {
    accountHolderName: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
    },
    branchName: {
      type: String,
      required: true,
      trim: true,
    },
    ifscCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    panNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    upiId: {
      type: String,
      required: true,
      trim: true,
    },
    qrCode: {
      type: String, // Store QR code URL or base64
      default: "",
    },
  },
  { timestamps: true }
);

const leaveTypeSchema = new mongoose.Schema(
  {
    leave_type: {
      type: String,
      required: true,
      trim: true,
    },

    short_form: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    total_leaves: {
      type: Number,
      required: true,
      min: 0,
    },

    leaves_per_month: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

//Lead reference Schema
const LeadReferenceSchema = new mongoose.Schema(
  {
    leadReference: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

//Lead status Schema
const LeadStatusSchema = new mongoose.Schema(
  {
    leadStatus: {
      type: String,
      required: true,
      trim: true,
    },
    shortForm: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    colorCode: {
      type: String,
      required: true,
      trim: true, // Ex: "#FF5733"
    },
  },
  { timestamps: true }
);

const LeadTypeSchema = new mongoose.Schema(
  {
    leadType: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const HolidaySchema = new mongoose.Schema(
  {
    holidayName: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    holidayType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HolidayType",
      required: true,
    },
  },
  { timestamps: true }
);

const HolidayTypeSchema = new mongoose.Schema(
  {
    holidayType: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      trim: true, // hex or any color string (#FF0000, red, etc.)
    },
  },
  { timestamps: true }
);

// Department Schema
const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Position Schema
const positionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const TaskStatusSchema = new mongoose.Schema(
  {
    taskStatus: {
      type: String,
      required: true,
      trim: true,
    },

    shortForm: {
      type: String,
      required: true,
      trim: true,
      uppercase: true, // Example: "IP", "TD", "DN"
    },

    colorCode: {
      type: String,
      required: true,
      trim: true, // Example: "#FF0000"
    },
  },
  { timestamps: true }
);

const PrioritySchema = new mongoose.Schema(
  {
    priority: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Priority = models.Priority || model("Priority", PrioritySchema);

export const TaskStatus =
  models.TaskStatus || model("TaskStatus", TaskStatusSchema);

export const Holiday = models.Holiday || model("Holiday", HolidaySchema);

export const HolidayType =
  models.HolidayType || model("HolidayType", HolidayTypeSchema);

export const LeadType = models.LeadType || model("LeadType", LeadTypeSchema);

export const LeadStatus =
  models.LeadStatus || model("LeadStatus", LeadStatusSchema);

export const LeadReference =
  models.LeadReference || model("LeadReference", LeadReferenceSchema);

export const BankDetails =
  models.BankDetails || model("BankDetails", BankDetailsSchema);

export const LeaveType =
  models.LeaveType || model("LeaveType", leaveTypeSchema);

export const Department =
  models.Department || model("Department", departmentSchema);

export const Position = models.Position || model("Position", positionSchema);
