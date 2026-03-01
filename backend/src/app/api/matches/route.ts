import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../lib/auth";
import dbConnect from "../../../lib/db";
import User from "../../../models/User";
import Profile from "../../../models/Profile";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const currentUser = await User.findById(session.userId);

    if (!currentUser || !currentUser.profileCompleted) {
      return NextResponse.json(
        { error: "Complete your profile to see matches" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const gender = searchParams.get("gender");
    const minAge = searchParams.get("minAge");
    const maxAge = searchParams.get("maxAge");
    const caste = searchParams.get("caste");
    const location = searchParams.get("location");

    const matchQuery: any = {
      "user.profileCompleted": true,
      "user.status": "active", // Only show active users
      "user.marriageStatus": "single", // Only show single users
      "user._id": {
        $ne: new mongoose.Types.ObjectId(session.userId),
        $nin: currentUser.blockedUsers || [],
      },
    };

    if (gender && gender !== "All") {
      matchQuery.gender = gender;
    }

    if (caste) {
        matchQuery.caste = { $regex: caste, $options: "i" };
    }

    if (location) {
        matchQuery.location = { $regex: location, $options: "i" };
    }

    if (minAge || maxAge) {
        const today = new Date();
        const minDob = maxAge ? new Date(today.getFullYear() - parseInt(maxAge) - 1, today.getMonth(), today.getDate()) : null;
        const maxDob = minAge ? new Date(today.getFullYear() - parseInt(minAge), today.getMonth(), today.getDate()) : null;
        
        matchQuery.dob = {};
        if (minDob) matchQuery.dob.$gte = minDob; // Younger than max age means DOB is greater (later)
        if (maxDob) matchQuery.dob.$lte = maxDob; // Older than min age means DOB is smaller (earlier)
        
        // Clean up empty object if logic was skipped
        if (Object.keys(matchQuery.dob).length === 0) delete matchQuery.dob;
    }

    const matches = await Profile.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $match: matchQuery,
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          "user.password": 0,
          "user.email": 0,
          "user.phone": 0,
          "user.role": 0,
          "user.blockedUsers": 0,
          "user.reports": 0,
        },
      },
    ]);

    return NextResponse.json({ matches }, { status: 200 });
  } catch (error: any) {
    console.error("Matches fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
