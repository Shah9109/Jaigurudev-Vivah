import mongoose, { Schema, model, models } from "mongoose";

const ProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    height: {
      type: String, // e.g., "5'10""
      required: true,
    },
    education: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    location: {
      type: String, // City, State, Country
      required: true,
    },
    familyDetails: {
      type: String,
      required: true,
    },
    caste: {
      type: String, // e.g., "Brahmin", "Kshatriya"
    },
    annualIncome: {
      type: Number, // in currency units
    },
    monthlyIncome: {
      type: Number, // in currency units
    },
    spiritualDetails: {
      type: String,
      required: true,
    },
    diet: {
      type: String,
      enum: ["Vegetarian", "Vegan", "Non-Vegetarian", "Eggetarian"],
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String, // URL
      required: true,
    },
    galleryImages: {
      type: [String], // Array of URLs
      validate: [
        (val: string[]) => val.length <= 5,
        "{PATH} exceeds the limit of 5",
      ],
    },
    hiddenContactInfo: {
      type: Boolean,
      default: true,
    },
    // Partner Preferences
    partnerMinAge: { type: Number },
    partnerMaxAge: { type: Number },
    partnerMinHeight: { type: String }, // e.g. 5'0"
    partnerEducation: { type: [String] }, // e.g. ["B.Tech", "MBA"] or just simple text check
    partnerMinIncome: { type: Number }, // Minimum annual income
    partnerMaxIncome: { type: Number }, // Maximum annual income
    partnerCaste: { type: [String] }, // e.g. ["Brahmin", "Any"]
    partnerDiet: { type: [String] },
  },
  { timestamps: true }
);

const Profile = models.Profile || model("Profile", ProfileSchema);

export default Profile;
