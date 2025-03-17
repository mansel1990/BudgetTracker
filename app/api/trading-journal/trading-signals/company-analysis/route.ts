import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const companyAnalysisData = await prisma.companyAnalysis.findMany({
      take: 1200,
    });
    return NextResponse.json(companyAnalysisData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch company analysis data" },
      { status: 500 }
    );
  }
}
