import mongoose, { Schema, model, models } from "mongoose";

const MarriageRequestSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const MarriageRequest =
  models.MarriageRequest || model("MarriageRequest", MarriageRequestSchema);

export default MarriageRequest;
