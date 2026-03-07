import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import {
  createTask,
  deleteTask,
  getMyTasks,
  getTaskById,
  updateTask,
} from "../controllers/task.controller.js";

const router = express.Router();

// Authenticated user route
router.post("/", isAuthenticated, createTask);
router.patch("/:taskId", isAuthenticated, updateTask);
router.get("/", isAuthenticated, getMyTasks);
router.get("/:taskId", isAuthenticated, getTaskById);
router.delete("/:taskId", isAuthenticated, deleteTask);

export default router;
