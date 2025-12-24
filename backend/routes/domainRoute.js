import express from "express";
import {
  createDomain,
  getAllDomains,
  updateDomain,
  deleteDomain,
} from "../controllers/domainController.js";

const router = express.Router();

router.post("/", createDomain);
router.get("/", getAllDomains);
router.put("/:id", updateDomain);
router.delete("/:id", deleteDomain);

export default router;
