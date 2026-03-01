import mongoose, { Schema, model, models } from "mongoose";

const SystemSettingSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

const SystemSetting = models.SystemSetting || model("SystemSetting", SystemSettingSchema);

export default SystemSetting;
