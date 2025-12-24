import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./lib/db.js";

import leadRoute from "./routes/leadRoute.js";
import adminRoute from "./routes/adminRoute.js";
import employeeRoute from "./routes/employeeRoute.js";
import authRoute from "./routes/authRoute.js";
// import departmentRoute from "./routes/departmentRoute.js";
import masterRoute from "./routes/masterRoute.js";
import clientRoute from "./routes/clientRoute.js";
import attendanceRoute from "./routes/attendanceRoute.js";
import leaveRoute from "./routes/leaveRoute.js";
import taskRoute from "./routes/taskRoute.js";
import meetingRoute from "./routes/meetingRoute.js";
import expenseRoute from "./routes/expenseRoute.js";
import contactRoute from "./routes/contactRoute.js";
import domainRoute from "./routes/domainRoute.js";
import inventoryRoute from "./routes/inventoryRoute.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/leads", leadRoute);
app.use("/api/admins", adminRoute);
app.use("/api/employees", employeeRoute);
app.use("/api/auth", authRoute);
// app.use("/api/department", departmentRoute);
app.use("/api/masters", masterRoute);
app.use("/api/clients", clientRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/leaves", leaveRoute);
app.use("/api/tasks", taskRoute);
app.use("/api/meetings", meetingRoute);
app.use("/api/expenses", expenseRoute);
app.use("/api/contacts", contactRoute);
app.use("/api/domains", domainRoute);
app.use("/api/inventories", inventoryRoute);

app.listen(PORT, async () => {
  console.log("Server is running on PORT: ", PORT);
  await connectDB();
});
