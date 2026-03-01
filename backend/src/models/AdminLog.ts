import mongoose, { Schema, model, models } from "mongoose";

const AdminLogSchema = new Schema(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    targetId: {
      type: String, // Can be UserId, ReportId, etc.
      required: true,
    },
    details: {
      type: String,
    },
  },
  { timestamps: true }
);

const AdminLog = models.AdminLog || model("AdminLog", AdminLogSchema);

export default AdminLog;
