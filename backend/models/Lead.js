import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    company: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    country: { type: String },
    product: {
      type: String,
    },
    service: {
      type: String,
    },
    source: {
      type: String,
      enum: [
        "LinkedIn",
        "Social Media",
        "Website",
        "Advertising",
        "Friend",
        "Professional Network",
        "Customer Referral",
        "Sales",
        "BNI",
        "Association",
      ],
      default: "Website",
    },

    status: {
      type: String,
      enum: [
        "Draft",
        "New",
        "In Negotiation",
        "Won",
        "Loose",
        "Canceled",
        "Assigned",
        "On Hold",
      ],
      default: "New",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    notes: { type: String },
    followUpDate: { type: Date },
  },
  { timestamps: true }
);

// Safe export to prevent model overwrite errors
const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

export default Lead;
