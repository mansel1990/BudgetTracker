import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  let userSettings = await prisma.user_settings.findUnique({
    where: {
      clerk_user_id: user.id,
    },
  });

  if (!userSettings) {
    userSettings = await prisma.user_settings.create({
      data: {
        clerk_user_id: user.id,
        currency: "INR",
      },
    });
  }

  revalidatePath("/");
  return Response.json(userSettings);
}
