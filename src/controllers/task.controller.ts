import { Response, NextFunction } from "express";
import { UserRequest } from "../types/express.js";
import {
  createTaskSchema,
  queryFilterShema,
  updateTaskSchema,
} from "../zod/task.zod.js";
import TaskModel from "../models/task.model.js";
import AppError from "../utils/appError.utils.js";
import { objectIdSchema } from "../zod/user.zod.js";

export const createTask = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) return next(new AppError("Access denied", 401));

    const validatedData = createTaskSchema.parse(req.body);

    const cleanedData = Object.fromEntries(
      Object.entries(validatedData).filter(([_, val]) => val != null),
    );
    const task = await TaskModel.create({
      ...cleanedData,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) return next(new AppError("Access denied", 401));

    const taskId = objectIdSchema.parse(req.params.taskId);
    const validatedData = updateTaskSchema.parse(req.body);

    const cleanedUpdate = Object.fromEntries(
      Object.entries(validatedData).filter(
        ([_, val]) => val != null && val !== "",
      ),
    );

    const updatedTask = await TaskModel.findOneAndUpdate(
      { _id: taskId, user: req.user._id },
      cleanedUpdate,
      { runValidators: true, returnDocument: "after" },
    );

    if (!updatedTask) return next(new AppError("Task not found", 404));

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyTasks = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) return next(new AppError("Access denied", 401));

    const { category, isCompleted } = queryFilterShema.parse(req.query);
    const queryFilters: Record<string, unknown> = { user: req.user._id };

    if (category) {
      queryFilters.category = category.toLowerCase();
    }

    if (isCompleted !== undefined) {
      queryFilters.isCompleted = isCompleted;
    }

    const tasks = await TaskModel.find(queryFilters)
      .sort({ deadline: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: tasks.length,
      message: "Tasks retrieved successfully",
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) return next(new AppError("Access denied", 401));

    const taskId = objectIdSchema.parse(req.params.taskId);

    const task = await TaskModel.findOne({
      _id: taskId,
      user: req.user._id,
    }).lean();

    if (!task) return next(new AppError("Task not found", 404));

    res.status(200).json({
      success: true,
      message: "Task retrieved successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) return next(new AppError("Access denied", 401));

    const taskId = objectIdSchema.parse(req.params.taskId);

    const task = await TaskModel.findOneAndDelete({
      _id: taskId,
      user: req.user._id,
    }).lean();

    if (!task)
      return next(new AppError("Task not found or already deleted", 404));

    res.status(204).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
