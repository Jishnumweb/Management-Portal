import express from "express";
import {
  createExpense,
  deleteExpense,
  getAllExpenses,
  getExpenseStats,
  updateExpense,
} from "../controllers/expenseController.js";
import upload, { uploadToCloudinary } from "../middlewares/uploadReciept.js";

const router = express.Router();

// Upload + send to Cloudinary
router.post(
  "/",
  upload.single("receipt"),
  uploadToCloudinary("bank-details/expense-receipts"),
  createExpense
);

router.get("/", getAllExpenses);
router.get("/stats", getExpenseStats);

router.put(
  "/:id",
  upload.single("receipt"),
  uploadToCloudinary("bank-details/expense-receipts"),
  updateExpense
);

router.delete("/:id", deleteExpense);

export default router;
