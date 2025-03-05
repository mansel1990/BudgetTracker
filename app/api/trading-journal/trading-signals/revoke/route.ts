import { revokeTradeSignalAccess } from "@/app/trading-journal/signals/_actions/tradeSignals";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await revokeTradeSignalAccess(body);
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
