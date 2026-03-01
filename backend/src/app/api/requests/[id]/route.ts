import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import MarriageRequest from "@/models/MarriageRequest";
import Chat from "@/models/Chat";
import mongoose from "mongoose";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json();

    if (!["accepted", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    await dbConnect();

    const request = await MarriageRequest.findById(params.id);

    if (!request) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    // Only receiver can accept/reject
    if (request.receiverId.toString() !== session.userId) {
      return NextResponse.json(
        { error: "You are not authorized to update this request" },
        { status: 403 }
      );
    }

    request.status = status;
    await request.save();

    if (status === "accepted") {
      // Create Chat room
      // Check if chat already exists (shouldn't, but safe check)
      const existingChat = await Chat.findOne({
        participants: { $all: [request.senderId, request.receiverId] },
      });

      if (!existingChat) {
        await Chat.create({
          participants: [request.senderId, request.receiverId],
          chatActive: true,
          startTime: new Date(),
        });
      }
    }

    return NextResponse.json(
      { message: `Request ${status}`, request },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Request update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
