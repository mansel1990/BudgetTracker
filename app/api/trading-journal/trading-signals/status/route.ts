import { checkTradeSignalAccess } from "@/app/trading-journal/signals/_actions/tradeSignals";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await checkTradeSignalAccess();
    return NextResponse.json(response);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 400 }
    );
  }
}
