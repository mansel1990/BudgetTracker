import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getUserGroup = async () => {
  const cookieStore = await cookies();
  const groupIdCookie = cookieStore.get("groupId");

  if (groupIdCookie) {
    return { groupId: Number(groupIdCookie.value) };
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.user_settings.findUnique({
    where: { clerk_user_id: user.id },
    select: { group_id: true },
  });

  if (!userSettings?.group_id) {
    throw new Error("User is not assigned to any group.");
  }

  // Store in cookies for future requests
  cookieStore.set("groupId", String(userSettings.group_id), {
    httpOnly: true,
    path: "/",
    maxAge: 86400,
  });

  return { groupId: userSettings.group_id };
};
