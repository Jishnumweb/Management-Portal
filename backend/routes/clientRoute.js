import express from "express";
import {
  createClient,
  updateClient,
  deleteClient,
  getAllClients,
} from "../controllers/clientController.js";

const router = express.Router();

router.post("/", createClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);
router.get("/", getAllClients);

export default router;
