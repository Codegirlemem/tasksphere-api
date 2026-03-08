import { Schema, Document, Types, model } from "mongoose";

export const taskSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      select: false,
    },
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    category: {
      type: String,
      trim: true,
      lowercase: true,
      default: "general",
    },
    deadline: {
      type: Date,
      required: [true, "Please set a deadline for the task"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

taskSchema.index({ user: 1, category: 1 });
taskSchema.index({ user: 1, isCompleted: 1 });

const TaskModel = model("Task", taskSchema);

export default TaskModel;
