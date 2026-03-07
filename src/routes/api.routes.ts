import express from "express";
import authRouter from "./auth.route.js";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);

export default apiRouter;
