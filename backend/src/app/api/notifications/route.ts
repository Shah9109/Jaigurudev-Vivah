import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const notifications = await Notification.find({ userId: session.userId })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error: any) {
    console.error("Notifications fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    // Mark all as read for now, or specific one if ID provided
    const { id } = await req.json();

    if (id) {
        await Notification.findByIdAndUpdate(id, { isRead: true });
    } else {
        await Notification.updateMany({ userId: session.userId }, { isRead: true });
    }

    return NextResponse.json({ message: "Marked as read" }, { status: 200 });
  } catch (error: any) {
    console.error("Notifications update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
