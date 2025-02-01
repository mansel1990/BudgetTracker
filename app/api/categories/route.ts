import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const paramType = searchParams.get("type");

  const validator = z.enum(["expense", "income"]).nullable();
  const queryParams = validator.safeParse(paramType);
  if (!queryParams.success) {
    return Response.json(queryParams.error, { status: 400 });
  }

  const type = queryParams.data;

  const userSettings = await prisma.user_settings.findUnique({
    where: { clerk_user_id: user.id },
    select: { group_id: true },
  });

  const categories = await prisma.category.findMany({
    where: {
      group_id: userSettings?.group_id,
      ...(type && { type }),
    },
    orderBy: {
      name: "asc",
    },
  });

  return Response.json(categories);
}
