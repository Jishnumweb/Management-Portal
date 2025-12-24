import express from "express";
import {
  applyLeave,
  changeLeaveStatus,
  deleteSingleLeaveDate,
  getAllLeavesForAdmin,
  getMyLeaves,
  updateLeaveStatus,
} from "../controllers/leaveController.js";
import { protectRoute, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/apply", protectRoute, applyLeave);
router.put("/:id/status", protectRoute, adminOnly, changeLeaveStatus);
router.get("/admin", protectRoute, adminOnly, getAllLeavesForAdmin);
router.get("/my", protectRoute, getMyLeaves);
router.delete("/my", protectRoute, deleteSingleLeaveDate);
router.put("/status/update", protectRoute, updateLeaveStatus);

export default router;
