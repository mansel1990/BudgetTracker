import { calculateFundStats } from "@/lib/calculations";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { userId: user.id },
      include: {
        transactions: {
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });

    if (!account) {
      // create account if it doesn't exist
      await prisma.account.create({
        data: {
          userId: user.id,
          name: user.firstName || "Default Account",
        },
      });
      return NextResponse.json(calculateFundStats([]));
    }

    const stats = calculateFundStats(account.transactions);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Failed to fetch trading funds stats:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
