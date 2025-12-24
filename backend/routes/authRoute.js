import express from "express";
import { login, logout, getProfile } from "../controllers/authController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectRoute, getProfile);

export default router;
