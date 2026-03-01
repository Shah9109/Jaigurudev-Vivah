import { NextRequest, NextResponse } from "next/server";
import SystemSetting from "../../../../models/SystemSetting";
import dbConnect from "../../../../lib/db";
import { getSession } from "../../../../lib/auth";

// GET: Publicly accessible to fetch donation settings
export async function GET() {
  await dbConnect();

  try {
    const setting = await SystemSetting.findOne({ key: "donation_settings" });
    
    if (!setting) {
      // Return default empty values if not set
      return NextResponse.json({ 
        upiId: "", 
        qrCodeUrl: "" 
      });
    }

    return NextResponse.json(setting.value);
  } catch (error) {
    console.error("Error fetching donation settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// POST: Admin only to update donation settings
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { upiId, qrCodeUrl } = body;

    const value = {
      upiId: upiId || "",
      qrCodeUrl: qrCodeUrl || ""
    };

    const setting = await SystemSetting.findOneAndUpdate(
      { key: "donation_settings" },
      { value },
      { new: true, upsert: true }
    );

    return NextResponse.json(setting.value);
  } catch (error) {
    console.error("Error updating donation settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
