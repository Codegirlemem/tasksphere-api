import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import {
  deleteUser,
  getUserProfile,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

// Authenticated user route
router.get("/me", isAuthenticated, getUserProfile);
router.patch("/me", isAuthenticated, updateUser);
router.delete("/me", isAuthenticated, deleteUser);

export default router;
