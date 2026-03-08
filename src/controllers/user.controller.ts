import { Response, NextFunction } from "express";
import { UserRequest } from "../types/express.js";
import AppError from "../utils/appError.utils.js";
import { updateUserSchema } from "../zod/user.zod.js";
import UserModel from "../models/user.model.js";

export const getUserProfile = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) return next(new AppError("Access denied", 401));

    const user = await UserModel.findById(req.user._id)
      .select("-password -__v")
      .populate("totalTasks completedTasks")
      .lean();

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) return next(new AppError("Access denied", 401));

    const id = req.user._id;
    const updates = updateUserSchema.parse(req.body);

    let user = await UserModel.findById(id).select("-password -__v");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    user.set(updates);
    user = await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) return next(new AppError("Access denied", 401));

    const id = req.user._id;
    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return next(new AppError("User not found or already deleted", 404));
    }

    res.clearCookie(process.env.COOKIE_NAME!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(204).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
