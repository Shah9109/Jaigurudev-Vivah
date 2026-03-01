import { NextRequest, NextResponse } from "next/server";
import { faker } from "@faker-js/faker";
import dbConnect from "../../../../lib/db";
import User from "../../../../models/User";
import Chat from "../../../../models/Chat";
import MarriageRequest from "../../../../models/MarriageRequest";
import Notification from "../../../../models/Notification";

export async function GET() {
  try {
    await dbConnect();

    // 1. Find Demo User
    const demoUser = await User.findOne({ email: "user@jaigurudev.com" });
    if (!demoUser) {
      return NextResponse.json({ error: "Demo User not found. Run /api/seed first." }, { status: 404 });
    }

    // 2. Find Admin User (or another random user)
    const otherUser = await User.findOne({ email: "admin@jaigurudev.com" });
    if (!otherUser) {
        return NextResponse.json({ error: "Other User not found." }, { status: 404 });
    }

    // 3. Create Accepted Marriage Request (Mutual Connection)
    // Check if exists
    let request = await MarriageRequest.findOne({
      $or: [
        { senderId: demoUser._id, receiverId: otherUser._id },
        { senderId: otherUser._id, receiverId: demoUser._id },
      ],
    });

    if (!request) {
      request = await MarriageRequest.create({
        senderId: otherUser._id,
        receiverId: demoUser._id,
        status: "accepted",
      });
      console.log("Created accepted marriage request");
    } else {
        request.status = "accepted";
        await request.save();
        console.log("Updated existing request to accepted");
    }

    // 4. Create or Update Chat
    let chat = await Chat.findOne({
      participants: { $all: [demoUser._id, otherUser._id] },
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [demoUser._id, otherUser._id],
        messages: [
            {
                sender: otherUser._id,
                content: "Jai Gurudev! Welcome to the platform.",
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            },
            {
                sender: demoUser._id,
                content: "Jai Gurudev! Thank you.",
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
            }
        ],
        startTime: new Date(),
        chatActive: true,
        status: "active",
      });
      console.log("Created new chat");
    } else {
        // Ensure it's active
        chat.status = "active";
        chat.chatActive = true;
        await chat.save();
        console.log("Ensured chat is active");
    }

    // 5. Create Notification for Demo User
    await Notification.create({
        userId: demoUser._id,
        type: "message",
        content: `New message from ${otherUser.name}`,
        relatedId: chat._id,
        isRead: false
    });

    return NextResponse.json({
      message: "Chat seeding successful",
      demoUserId: demoUser._id,
      otherUserId: otherUser._id,
      chatId: chat._id
    });
  } catch (error: any) {
    console.error("Chat seeding error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to seed chat" },
      { status: 500 }
    );
  }
}
