import mongoose, { Schema, model, models } from "mongoose";

const ReportSchema = new Schema(
  {
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "dismissed"],
      default: "pending",
    },
    adminNotes: String,
  },
  { timestamps: true }
);

const Report = models.Report || model("Report", ReportSchema);

export default Report;
