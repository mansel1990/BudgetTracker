import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure you have a prisma client setup
import { z } from "zod";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

const TradeSchema = z.object({
  account_id: z.number(),
});

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find or create account for the user
    let account = await prisma.account.findUnique({
      where: { userId: user.id },
    });

    if (!account) {
      redirect("/sign-in");
    }

    const account_id = account.account_id;

    // Fetch trades for the account
    const trades = await prisma.trade.findMany({
      where: { account_id },
      select: {
        trade_id: true,
        company_symbol: true,
        company_name: true,
        shares: true,
        amount: true,
        price: true,
        profit_loss: true,
        created_at: true,
        type: true,
      },
    });

    return NextResponse.json(trades, { status: 200 });
  } catch (error) {
    console.error("Error fetching trades:", error);
    return NextResponse.json(
      { error: "Failed to fetch trades" },
      { status: 500 }
    );
  }
}
