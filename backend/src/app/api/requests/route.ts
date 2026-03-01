import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import MarriageRequest from "@/models/MarriageRequest";
import User from "@/models/User";
import Profile from "@/models/Profile";
import Notification from "@/models/Notification";
import mongoose from "mongoose";

// Helper to calculate age from DOB
function getAge(dob: Date) {
    const diff_ms = Date.now() - new Date(dob).getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.profileCompleted) {
      // Double check from DB because session might be stale
      await dbConnect();
      const user = await User.findById(session.userId);
      if (!user?.profileCompleted) {
        return NextResponse.json(
            { error: "Complete your profile to send requests" },
            { status: 403 }
        );
      }
    }

    const { receiverId } = await req.json();

    if (!receiverId) {
      return NextResponse.json(
        { error: "Receiver ID is required" },
        { status: 400 }
      );
    }

    if (receiverId === session.userId) {
      return NextResponse.json(
        { error: "Cannot send request to yourself" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if request already exists
    const existingRequest = await MarriageRequest.findOne({
      $or: [
        { senderId: session.userId, receiverId: receiverId },
        { senderId: receiverId, receiverId: session.userId },
      ],
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "Request already exists" },
        { status: 400 }
      );
    }

    // --- PREFERENCE VALIDATION ---
    // Fetch sender and receiver profiles
    const senderProfile = await Profile.findOne({ userId: session.userId });
    const receiverProfile = await Profile.findOne({ userId: receiverId });

    if (senderProfile && receiverProfile) {
        // 1. Age Check
        const senderAge = getAge(senderProfile.dob);
        if (receiverProfile.partnerMinAge && senderAge < receiverProfile.partnerMinAge) {
             return NextResponse.json({ 
                 error: `Receiver requires minimum age of ${receiverProfile.partnerMinAge}. You are ${senderAge}.` 
             }, { status: 403 });
        }
        if (receiverProfile.partnerMaxAge && senderAge > receiverProfile.partnerMaxAge) {
             return NextResponse.json({ 
                 error: `Receiver requires maximum age of ${receiverProfile.partnerMaxAge}. You are ${senderAge}.` 
             }, { status: 403 });
        }

        // 2. Income Check (Annual Income)
        if (receiverProfile.partnerMinIncome && (!senderProfile.annualIncome || senderProfile.annualIncome < receiverProfile.partnerMinIncome)) {
            return NextResponse.json({ 
                 error: `Receiver requires minimum annual income of ${receiverProfile.partnerMinIncome}.` 
             }, { status: 403 });
        }
        if (receiverProfile.partnerMaxIncome && senderProfile.annualIncome && senderProfile.annualIncome > receiverProfile.partnerMaxIncome) {
             return NextResponse.json({ 
                 error: `Receiver requires maximum annual income of ${receiverProfile.partnerMaxIncome}.` 
             }, { status: 403 });
        }

        // 3. Caste Check
        if (receiverProfile.partnerCaste && receiverProfile.partnerCaste.length > 0 && !receiverProfile.partnerCaste.includes("Any")) {
            // Case-insensitive check
            const allowedCastes = receiverProfile.partnerCaste.map((c: string) => c.toLowerCase());
            const senderCaste = senderProfile.caste ? senderProfile.caste.toLowerCase() : "";
            
            if (!allowedCastes.includes(senderCaste)) {
                return NextResponse.json({ 
                    error: `Receiver requires caste: ${receiverProfile.partnerCaste.join(", ")}` 
                }, { status: 403 });
            }
        }

        // 3. Education Check
        if (receiverProfile.partnerEducation && receiverProfile.partnerEducation.length > 0) {
            // Check if sender's education is in the allowed list
            // receiverProfile.partnerEducation is array of strings e.g. ["B.Tech", "MBA"]
            // senderProfile.education is string e.g. "B.Tech Computer Science"
            
            // Loose matching: check if sender's education contains any of the preferred keywords
            const senderEdu = senderProfile.education.toLowerCase();
            const allowed = receiverProfile.partnerEducation.some((edu: string) => 
                senderEdu.includes(edu.toLowerCase())
            );
            
            // Only block if restriction is strictly set (not empty)
            if (!allowed && !receiverProfile.partnerEducation.includes("Any")) {
                 return NextResponse.json({ 
                     error: `Receiver requires education: ${receiverProfile.partnerEducation.join(", ")}` 
                 }, { status: 403 });
            }
        }
    }
    // --- END PREFERENCE VALIDATION ---

    const newRequest = await MarriageRequest.create({
      senderId: session.userId,
      receiverId: receiverId,
      status: "pending",
    });

    // Create Notification for receiver
    const sender = await User.findById(session.userId);
    await Notification.create({
      userId: receiverId,
      type: "request",
      content: `New marriage request from ${sender?.name || "someone"}`,
      relatedId: newRequest._id,
    });

    return NextResponse.json(
      { message: "Request sent", request: newRequest },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Request send error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get requests where I am receiver (incoming) or sender (outgoing)
    // Maybe query param type=incoming|outgoing
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "incoming";

    let query: any = {};
    if (type === "incoming") {
      query.receiverId = session.userId;
      query.status = "pending";
    } else if (type === "outgoing") {
      query.senderId = session.userId;
    } else if (type === "history") {
        query = {
            $or: [{ senderId: session.userId }, { receiverId: session.userId }],
            status: { $ne: "pending" }
        }
    }

    const requests = await MarriageRequest.find(query)
      .populate("senderId", "name email phone profileCompleted") // We might need profile details too
      .populate("receiverId", "name email phone profileCompleted")
      .sort({ createdAt: -1 });
      
    // Populate profile details manually or via virtuals?
    // Better to aggregate if we want profile images.
    // For now, basic info.

    return NextResponse.json({ requests }, { status: 200 });
  } catch (error: any) {
    console.error("Requests fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
