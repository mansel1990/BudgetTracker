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

    let computedProfitLoss = 0;
    let totalCostBasis = 0;

    // For sell trades, calculate FIFO cost basis on the fly
    if (parsedData.type === "sell") {
      // 1. Retrieve all previous trades for this company/account in FIFO order.
      const trades = await prisma.trade.findMany({
        where: {
          account_id: account.account_id,
          company_symbol: parsedData.company_symbol,
        },
        orderBy: { created_at: "asc" },
      });

      // 2. Build a simulated FIFO inventory.
      // Each lot is represented as: { shares, price }.
      const inventory: { shares: number; price: number }[] = [];

      for (const trade of trades) {
        if (trade.type === "buy") {
          // Convert Decimal to number for price.
          const price = trade.price ? Number(trade.price.toString()) : 0;
          inventory.push({ shares: Number(trade.shares), price });
        } else if (trade.type === "sell") {
          // For previous sells, remove shares from inventory in FIFO order.
          let sharesToAllocate = Number(trade.shares);
          while (sharesToAllocate > 0 && inventory.length > 0) {
            const lot = inventory[0];
            if (lot.shares <= sharesToAllocate) {
              sharesToAllocate -= lot.shares;
              inventory.shift(); // Remove the lot completely.
            } else {
              lot.shares -= sharesToAllocate;
              sharesToAllocate = 0;
            }
          }
        }
      }

      // 3. Allocate shares for the current sell.
      let sharesToSell = parsedData.shares;
      while (sharesToSell > 0 && inventory.length > 0) {
        const lot = inventory[0];
        if (lot.shares <= sharesToSell) {
          totalCostBasis += lot.shares * lot.price;
          sharesToSell -= lot.shares;
          inventory.shift();
        } else {
          totalCostBasis += sharesToSell * lot.price;
          lot.shares -= sharesToSell;
          sharesToSell = 0;
        }
      }

      // If there aren’t enough shares available, return an error.
      if (sharesToSell > 0) {
        return NextResponse.json(
          { success: false, error: "Not enough shares available to sell" },
          { status: 400 }
        );
      }

      // 4. Compute profit/loss as: sale proceeds - total cost basis.
      computedProfitLoss = parsedData.amount - totalCostBasis;
      parsedData.profit_loss = computedProfitLoss;
    }

    // Create trade with the user's account_id
    const trade = await prisma.trade.create({
      data: {
        ...parsedData,
        account_id: account.account_id, // Ensure trade is linked to user's account
      },
    });

    // Update the FundTransaction summary.
    // Retrieve the latest fund transaction to get previous funds in market.
    const lastFundTx = await prisma.fundTransaction.findFirst({
      where: { account_id: account.account_id },
      orderBy: { created_at: "desc" },
    });
    const previousFundsInMarket = lastFundTx
      ? Number(lastFundTx.amount_in_market?.toString())
      : 0;
    let newFundsInMarket = previousFundsInMarket;
    let fundNotes = "";

    if (parsedData.type === "buy") {
      // For a buy, add the invested amount.
      newFundsInMarket += parsedData.amount;
      fundNotes = `Buy: Invested ${parsedData.amount} in ${parsedData.company_symbol}`;
    } else {
      // For a sell, subtract the cost basis (freeing up capital).
      newFundsInMarket -= totalCostBasis;
      fundNotes = `Sell: Sold for ${parsedData.amount} with profit ${computedProfitLoss} in ${parsedData.company_symbol}`;
    }

    await prisma.fundTransaction.create({
      data: {
        account_id: account.account_id,
        amount: parsedData.amount,
        type: parsedData.type === "buy" ? "deposit" : "withdraw",
        notes: fundNotes,
        amount_in_market: newFundsInMarket,
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
