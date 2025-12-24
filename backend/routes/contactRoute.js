import express from "express";
import {
  createContact,
  getAllContacts,
  updateContact,
  deleteContact,
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", createContact);
router.get("/", getAllContacts);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

export default router;
