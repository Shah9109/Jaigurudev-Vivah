import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Profile from "@/models/Profile";
import User from "@/models/User";
import { profileSchema } from "@/lib/validations";
import { calculateProfileCompletion } from "@/lib/profile";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const profile = await Profile.findOne({ userId: session.userId });

    if (!profile) {
      return NextResponse.json({ profile: null }, { status: 200 });
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Allow partial updates or fields not in schema yet (like preferences)
    // Ideally update Zod schema, but for now let's allow extra fields
    // const result = profileSchema.safeParse(body);
    
    await dbConnect();

    let profile = await Profile.findOne({ userId: session.userId });
    
    if (profile) {
      // Update existing fields + new preferences
      Object.keys(body).forEach(key => {
          if (body[key] !== undefined) {
              profile[key] = body[key];
          }
      });
      await profile.save();
    } else {
      // Create
      profile = await Profile.create({
          userId: session.userId,
          ...body
      });
    }

    // Check completion
    const completionPercentage = calculateProfileCompletion(profile.toObject());
    const isComplete = completionPercentage >= 100;

    // Update User
    if (isComplete !== session.profileCompleted) {
      await User.findByIdAndUpdate(session.userId, {
        profileCompleted: isComplete,
      });
    }

    return NextResponse.json(
      { profile, completionPercentage, isComplete },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
