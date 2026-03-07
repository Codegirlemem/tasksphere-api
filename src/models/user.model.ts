import { model, Schema, Types } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      immutable: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
      select: false,
    },
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required"],
      minLength: [3, "Username must be atleast three characters"],
      maxLength: [20, "Username must not exceed 20 characters"],
    },
  },
  {
    timestamps: true,
    methods: {
      async comparePassword(enteredPassword: string) {
        return bcrypt.compare(enteredPassword, this.password);
      },
    },
  },
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const UserModel = model("User", userSchema);

export default UserModel;
