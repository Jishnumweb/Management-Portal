import mongoose from "mongoose";

const checkInOutSchema = new mongoose.Schema(
  {
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
    },
    duration: {
      type: Number, // in hours
      default: 0,
    },
  },
  { _id: true } // <-- each session gets its own _id
);

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    sessions: [checkInOutSchema], // multiple check-in/out pairs
    working_hours: {
      type: Number, // total hours worked in the day
      default: 0,
    },
  },
  { timestamps: true }
);

// ✅ Middleware to auto-calculate working hours before saving
attendanceSchema.pre("save", function (next) {
  let totalHours = 0;

  this.sessions.forEach((s) => {
    if (s.checkIn && s.checkOut) {
      const diffMs = s.checkOut - s.checkIn;
      const diffHours = diffMs / (1000 * 60 * 60); // convert ms → hours
      s.duration = Number(diffHours.toFixed(2));
      totalHours += diffHours;
    }
  });

  this.working_hours = Number(totalHours.toFixed(2));
  next();
});

const Attendance =
  mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);

export default Attendance;
