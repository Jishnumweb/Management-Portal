import express from "express";
import {
  createAdmin,
  getAllAdmins,
  toggleAdminStatus,
  updateAdmin,
  deleteAdmin,
} from "../controllers/adminController.js";
// import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createAdmin);
router.get("/", getAllAdmins);
router.put("/:id/status", toggleAdminStatus);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

export default router;

