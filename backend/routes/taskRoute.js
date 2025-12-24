import express from "express";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getMyTask,
  acceptMyTask,
  rejectMyTask,
  updateMyTask,
} from "../controllers/taskController.js";
import { protectRoute, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protectRoute, getAllTasks);
router.post("/", protectRoute, createTask);
router.put("/:id", protectRoute, updateTask);
router.delete("/:id", protectRoute, deleteTask);
router.get("/my-task", protectRoute, getMyTask);
router.put("/my-task/:id", protectRoute, updateMyTask);
router.put("/my-task/accept/:id", protectRoute, acceptMyTask);
router.put("/my-task/reject/:id", protectRoute, rejectMyTask);

export default router;
