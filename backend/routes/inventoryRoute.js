import express from "express";
import {
  createInventory,
  getAllInventories,
  updateInventory,
  deleteInventory,
} from "../controllers/inventoryController.js";

const router = express.Router();

router.post("/", createInventory);
router.get("/", getAllInventories);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);

export default router;
