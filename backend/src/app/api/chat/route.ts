import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Chat from "@/models/Chat";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Find chats where current user is a participant
    const chats = await Chat.find({
      participants: session.userId,
    })
      .populate("participants", "name profileImage") // Populate user details
      .sort({ updatedAt: -1 });

    return NextResponse.json({ chats }, { status: 200 });
  } catch (error: any) {
    console.error("Chats fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
