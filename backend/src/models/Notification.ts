import mongoose, { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["message", "request", "system"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    relatedId: {
      type: Schema.Types.ObjectId,
      // Can ref 'Chat' or 'MarriageRequest' depending on type
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = models.Notification || model("Notification", NotificationSchema);

export default Notification;
