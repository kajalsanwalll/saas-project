export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // ✅ Get userId from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // If no userId, return empty array
    if (!userId) {
      return NextResponse.json([], { status: 200 });
    }

    // ✅ Fetch only videos uploaded by this user
    const videos = await prisma.video.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(videos, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Error fetching videos", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
