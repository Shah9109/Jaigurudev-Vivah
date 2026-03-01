import mongoose, { Schema, model, models } from "mongoose";

const ChatSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        sender: { type: Schema.Types.ObjectId, ref: "User" },
        content: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    chatActive: {
      type: Boolean,
      default: false,
    },
    dayCounter: {
      type: Number,
      default: 0,
    },
    bothAgreedMarriage: {
      type: Boolean,
      default: false,
    },
    startTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "closed", "completed"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Chat = models.Chat || model("Chat", ChatSchema);

export default Chat;
