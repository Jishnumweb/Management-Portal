import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Priority",
      required: true,
    },

    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaskStatus",
      required: true,
    },

    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: false,
      },
    ],

    clientName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: false,
    },

    description: {
      type: String,
      default: "",
    },

    dueDate: {
      type: Date,
      required: true,
    },
    accepted: {
      type: String,
      enum: ["Accepted", "Rejected", "Pending"],
      default: "Pending",
    },
    percentageComplete: {
      type: Number,
      min: 0,
      max: 100,
    },
    timeSpent: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
