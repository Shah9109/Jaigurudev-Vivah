import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../../lib/auth";
import dbConnect from "../../../../../lib/db";
import Profile from "../../../../../models/Profile";
import User from "../../../../../models/User";
import MarriageRequest from "../../../../../models/MarriageRequest";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profileUserId = params.id; // This is the USER ID, not Profile ID

    await dbConnect();

    // 1. Fetch User to get name/email
    const user = await User.findById(profileUserId).select("name email phone");
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Fetch Profile
    const profile = await Profile.findOne({ userId: profileUserId });
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // 3. Check Connection Status
    let isConnected = false;
    if (session.userId === profileUserId) {
        isConnected = true;
    } else {
        // Check if there is an ACCEPTED request between them
        const connection = await MarriageRequest.findOne({
            $or: [
                { senderId: session.userId, receiverId: profileUserId, status: "accepted" },
                { senderId: profileUserId, receiverId: session.userId, status: "accepted" }
            ]
        });
        if (connection) {
            isConnected = true;
        }
    }

    // 4. Construct Response Data
    const profileData = profile.toObject();
    
    // Always Visible Data (Public Profile)
    const publicData = {
        _id: profileData._id,
        userId: user._id,
        name: user.name,
        gender: profileData.gender,
        dob: profileData.dob, 
        height: profileData.height,
        education: profileData.education,
        occupation: profileData.occupation,
        location: profileData.location,
        about: profileData.about,
        profileImage: profileData.profileImage,
        caste: profileData.caste,
        spiritualDetails: profileData.spiritualDetails,
        diet: profileData.diet,
        galleryImages: profileData.galleryImages,
    };

    // Sensitive Data (Only for Mutual Connections)
    const sensitiveData = {
        email: user.email,
        phone: user.phone,
        familyDetails: profileData.familyDetails,
        annualIncome: profileData.annualIncome,
        monthlyIncome: profileData.monthlyIncome,
        // Add more sensitive fields here if needed
    };

    if (isConnected) {
        return NextResponse.json({ 
            profile: { ...publicData, ...sensitiveData },
            isConnected: true 
        }, { status: 200 });
    } else {
        return NextResponse.json({ 
            profile: publicData,
            isConnected: false 
        }, { status: 200 });
    }

  } catch (error: any) {
    console.error("Public profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
