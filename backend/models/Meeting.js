import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    date: { type: Date, required: true },

    time: { type: String, required: true },
    duration: { type: String },
    location: { type: String },
    organizer: { type: String },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Pending", "Cancelled"],
      default: "Sheduled",
    },
    type: {
      type: String,
      enum: ["Internal", "Client Meeting", "Team Meeting"],
      default: "Internal",
    },
    attendees: {
      type: [String],
      default: [],
    },
    notes: { type: String },

    meetingLink: { type: String }, // optional — required only for online meetings
  },
  { timestamps: true }
);

export default mongoose.models.Meeting ||
  mongoose.model("Meeting", MeetingSchema);
