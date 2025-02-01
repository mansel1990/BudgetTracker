import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Fetch user's group ID from user_settings
  const userSettings = await prisma.user_settings.findUnique({
    where: { clerk_user_id: user.id },
    select: { group_id: true },
  });

  if (!userSettings?.group_id) {
    return Response.json(
      { error: "User is not part of any group." },
      { status: 404 }
    );
  }

  // Fetch group details
  const group = await prisma.groups.findUnique({
    where: { group_id: userSettings.group_id },
  });

  if (!group) {
    return Response.json({ error: "Group not found." }, { status: 404 });
  }

  return Response.json(group);
}
