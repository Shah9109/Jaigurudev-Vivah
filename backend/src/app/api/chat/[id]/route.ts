import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth";
import dbConnect from "../../../../lib/db";
import Chat from "../../../../models/Chat";
import User from "../../../../models/User";
import Notification from "../../../../models/Notification";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const chat = await Chat.findById(params.id)
      .populate("participants", "name profileImage")
      .populate("messages.sender", "name");

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      (p: any) => p._id.toString() === session.userId
    );

    if (!isParticipant) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({ chat }, { status: 200 });
  } catch (error: any) {
    console.error("Chat fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { detectInappropriateContent } from "@/lib/moderation";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    await dbConnect();
    
    // Check sender status first
    const sender = await User.findById(session.userId);
    if (!sender || sender.status === 'banned') {
        return NextResponse.json({ error: "Your account is banned." }, { status: 403 });
    }
    if (sender.status === 'suspended') {
        return NextResponse.json({ error: "Your account is suspended." }, { status: 403 });
    }

    const chat = await Chat.findById(params.id);

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Use string comparison for objectId
    const isParticipant = chat.participants.some(
      (p: any) => p.toString() === session.userId
    );

    if (!isParticipant) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    
    // Anti-Dating / Content Filter Check
    const moderation = detectInappropriateContent(content);
    if (moderation.detected) {
        // Increment warning
        if (!sender.warnings) sender.warnings = 0;
        sender.warnings += 1;
        
        // Logic for warnings
        if (sender.warnings >= 3) {
            sender.status = 'banned';
            await sender.save();
            return NextResponse.json({ 
                error: "Your account has been permanently banned due to repeated policy violations." 
            }, { status: 403 });
        } else if (sender.warnings === 2) {
            sender.status = 'suspended'; // Or just chat freeze
            // For now, let's just warn
             await sender.save();
             return NextResponse.json({
                 error: "Warning: Inappropriate content detected. This is your 2nd warning. Next violation will result in a ban.",
                 warning: true
             }, { status: 400 });
        } else {
            await sender.save();
             return NextResponse.json({
                 error: "Warning: Inappropriate content detected. Please adhere to community guidelines. (1st Warning)",
                 warning: true
             }, { status: 400 });
        }
    }

    // Check limits
    // 1. 7 days limit
    const daysSinceStart =
      (Date.now() - new Date(chat.startTime).getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceStart > 7) {
      return NextResponse.json(
        { error: "Chat expired (7 days limit)" },
        { status: 403 }
      );
    }

    // 2. 20 messages limit
    if (chat.messages.length >= 20) {
      return NextResponse.json(
        { error: "Message limit reached (20 messages)" },
        { status: 403 }
      );
    }

    // 3. Check status
    if (!chat.chatActive || chat.status !== "active") {
      return NextResponse.json(
        { error: "Chat is not active" },
        { status: 403 }
      );
    }

    // Add message
    chat.messages.push({
      sender: session.userId,
      content,
      timestamp: new Date(),
    });

    await chat.save();

    // Create Notification for the other participant
    const otherParticipantId = chat.participants.find(
      (p: any) => p.toString() !== session.userId
    );

    if (otherParticipantId) {
      await Notification.create({
        userId: otherParticipantId,
        type: "message",
        content: `New message from ${sender.name}`,
        relatedId: chat._id,
      });
    }

    return NextResponse.json({ message: "Message sent", chat }, { status: 201 });
  } catch (error: any) {
    console.error("Message send error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
