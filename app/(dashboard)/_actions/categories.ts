"use server";

import { prisma } from "@/lib/prisma";
import {
  CreateCategoryScehma,
  CreateCategoryScehmaType,
} from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const CreateCatergory = async (form: CreateCategoryScehmaType) => {
  const parsedBody = CreateCategoryScehma.safeParse(form);
  if (!parsedBody.success) {
    throw parsedBody.error;
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.user_settings.findUnique({
    where: { clerk_user_id: user.id },
    select: { group_id: true },
  });

  const { name, icon, type } = parsedBody.data;

  if (!userSettings?.group_id) {
    throw new Error("User is not assigned to any group.");
  }

  return await prisma.category.create({
    data: {
      name,
      icon,
      type,
      group_id: userSettings?.group_id,
    },
  });
};
