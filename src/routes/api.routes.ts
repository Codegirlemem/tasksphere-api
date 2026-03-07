import express from "express";
import authRouter from "./auth.route.js";
import userRouter from "./user.route.js";
import tasksRouter from "./task.route.js";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/tasks", tasksRouter);

export default apiRouter;
