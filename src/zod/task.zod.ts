import * as z from "zod";

export const createTaskSchema = z.strictObject({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  description: z.string().trim().max(500).optional(),
  category: z.string().trim().toLowerCase().max(20).default("general"),
  deadline: z.iso
    .date({ error: "Invalid date format: Enter date as YYYY-MM-DD" })
    .refine((val) => new Date(val) > new Date(), {
      message: "Deadline must be in the future!",
    }),
});

export const updateTaskSchema = createTaskSchema
  .partial()
  .refine(
    (data) =>
      Object.values(data).some((value) => value != null && value !== ""),
    { message: "At least one field must be provided" },
  );

export const queryFilterShema = z.object({
  category: z.string().trim().optional(),
  isCompleted: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
});
