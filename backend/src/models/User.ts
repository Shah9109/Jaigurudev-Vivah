import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    blockedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reports: [
      {
        type: Schema.Types.ObjectId,
        ref: "Report",
      },
    ],
    isVerifiedByAdmin: {
      type: Boolean,
      default: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    agreedToTerms: {
      type: Boolean,
      required: [true, "You must agree to the terms"],
    },
    warnings: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },
    marriageStatus: {
      type: String,
      enum: ["single", "engaged", "married", "closed"],
      default: "single",
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
