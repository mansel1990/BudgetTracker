import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as z from "zod";
import { currentUser } from "@clerk/nextjs/server";

// Trade validation schema
export const tradeSchema = z.object({
  company_symbol: z.string(),
  company_name: z.string(),
  price: z.number().nullable(),
  shares: z.number(),
  amount: z.number(),
  type: z.enum(["buy", "sell"]),
  profit_loss: z.number(),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
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
      account = await prisma.account.create({
        data: {
          userId: user.id,
          name: user.firstName || "Default Account",
        },
      });
    }

    const body = await req.json();
    const parsedData = tradeSchema.parse(body);

    // Create trade with the user's account_id
    const trade = await prisma.trade.create({
      data: {
        ...parsedData,
        account_id: account.account_id, // Ensure trade is linked to user's account
      },
    });

    return NextResponse.json({ success: true, trade });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof z.ZodError ? error.errors : "Something went wrong",
      },
      { status: 400 }
    );
  }
}
