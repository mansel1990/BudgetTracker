import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stocks = await prisma.companyAnalysis.findMany({
      select: {
        company_name: true,
        company_symbol: true,
        current_market_price: true,
      },
    });

    return NextResponse.json({ stocks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
