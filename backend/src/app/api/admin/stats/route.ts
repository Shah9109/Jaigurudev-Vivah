import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth";
import dbConnect from "../../../../lib/db";
import User from "../../../../models/User";
import Profile from "../../../../models/Profile";
import Chat from "../../../../models/Chat";
import MarriageRequest from "../../../../models/MarriageRequest";
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // 1. Total Users
    const totalUsers = await User.countDocuments({ role: "user" });

    // 2. Active Users (Profile Completed)
    const activeUsers = await User.countDocuments({ role: "user", profileCompleted: true });

    // 3. Total Connected (Accepted Requests)
    // Each accepted request represents a connection (2 users)
    const connections = await MarriageRequest.countDocuments({ status: "accepted" });

    // 4. Pending Requests
    const pendingRequests = await MarriageRequest.countDocuments({ status: "pending" });

    return NextResponse.json({
        totalUsers,
        activeUsers,
        totalConnections: connections,
        pendingRequests
    });

  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
