import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth";
import dbConnect from "../../../../lib/db";
import User from "../../../../models/User";

// GET: Fetch all users (with pagination and search)
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const filter = searchParams.get("filter") || "all"; // all, active, blocked

    await dbConnect();

    const query: any = { role: "user" };

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
        ];
    }

    if (filter === "blocked") {
        query.status = { $in: ["suspended", "banned"] };
    } else if (filter === "active") {
        query.status = "active";
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return NextResponse.json({
        users,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        }
    });

  } catch (error: any) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT: Update user status (Block/Unblock)
export async function PUT(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session || session.role !== "admin") {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        const body = await req.json();
        const { userId, status } = body; // status: 'active', 'suspended'
    
        if (!userId || !status) {
             return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();
        
        const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
        
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User status updated", user });

    } catch (error: any) {
        console.error("Admin user update error:", error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
    }
}
