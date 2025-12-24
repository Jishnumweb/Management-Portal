import express from "express";
import {
  getAllMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  getMyMeetings,
} from "../controllers/meetingController.js";
import { protectRoute, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protectRoute, getAllMeetings);
router.post("/", protectRoute, createMeeting);
router.put("/:id", protectRoute, updateMeeting);
router.delete("/:id", protectRoute, deleteMeeting);
router.get("/my-meeting", protectRoute, getMyMeetings);

export default router;
