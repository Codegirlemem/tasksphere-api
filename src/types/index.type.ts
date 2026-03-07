import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

export interface AuthPayload extends JwtPayload {
  id: mongoose.Types.ObjectId;
}
