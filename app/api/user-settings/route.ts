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
    const group = await prisma.groups.create({
      data: {
        group_name: "My group",
        created_by: user.id,
      },
    });

    userSettings = await prisma.user_settings.create({
      data: {
        clerk_user_id: user.id,
        group_id: group.group_id,
        currency: "INR",
      },
    });
  }

  revalidatePath("/");
  return Response.json(userSettings);
}
