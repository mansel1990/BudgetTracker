"use server";

import { prisma } from "@/lib/prisma";
import { UpdateUserCurrencySchema } from "@/schema/userSettings";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const GroupSchema = z.object({
  groupName: z.string().min(3, "Group name must be at least 3 characters"),
});

// Group code validation schema
const GroupCodeSchema = z.object({
  groupCode: z.number().min(3, "Group code must be at least 6 characters"),
});

export async function UpdateUserCurrency(currency: string) {
  const parsedBody = UpdateUserCurrencySchema.safeParse({ currency });
  if (!parsedBody.success) {
    throw parsedBody.error;
  }

  const user = await currentUser();
  if (!user) {
    redirect("sign-in");
  }

  const userSettings = await prisma.user_settings.update({
    where: { clerk_user_id: user.id },
    data: { currency },
  });

  return userSettings;
}

export async function handleEditGroup(formData: FormData): Promise<void> {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const groupName = formData.get("groupName") as string;
  const parsed = GroupSchema.safeParse({ groupName });

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0].message);
  }

  const userSettings = await prisma.user_settings.findUnique({
    where: { clerk_user_id: user.id },
    select: { group_id: true },
  });
  if (userSettings?.group_id) {
    await prisma.groups.update({
      where: {
        group_id: userSettings.group_id,
      },
      data: {
        group_name: groupName,
      },
    });
  }
}

export async function handleSwitchGroup(formData: FormData): Promise<void> {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const groupCodeValue = formData.get("groupCode");
  if (typeof groupCodeValue !== "string" || isNaN(Number(groupCodeValue))) {
    throw new Error("Invalid group code.");
  }
  const groupCode = Number(groupCodeValue);
  const parsed = GroupCodeSchema.safeParse({ groupCode });

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0].message);
  }

  // Fetch user settings to get current group_id
  const userSettings = await prisma.user_settings.findUnique({
    where: { clerk_user_id: user.id },
    select: { group_id: true },
  });

  if (!userSettings?.group_id) {
    throw new Error("User is not part of any group.");
  }

  // Fetch the group the user is trying to join
  const newGroup = await prisma.groups.findUnique({
    where: { group_id: groupCode },
  });

  if (!newGroup) {
    throw new Error("Group not found.");
  }

  // Update user settings to remove them from the current group and join the new group
  await prisma.user_settings.update({
    where: { clerk_user_id: user.id },
    data: { group_id: groupCode },
  });

  // Optionally, you can log this action or trigger some additional workflows.
}
