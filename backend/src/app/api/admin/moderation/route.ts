import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Chat from "@/models/Chat";
import User from "@/models/User";

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session || session.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await dbConnect();

        // Fetch recent active chats
        const chats = await Chat.find({ status: "active" })
            .populate("participants", "name email")
            .sort({ updatedAt: -1 })
            .limit(20);

        return NextResponse.json({ chats }, { status: 200 });
    } catch (error: any) {
        console.error("Admin chats fetch error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
