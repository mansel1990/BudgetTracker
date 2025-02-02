"use server";

import { prisma } from "@/lib/prisma";
import { getUserGroup } from "@/lib/session";
import {
  CreateCategoryScehma,
  CreateCategoryScehmaType,
} from "@/schema/categories";

export const CreateCatergory = async (form: CreateCategoryScehmaType) => {
  const parsedBody = CreateCategoryScehma.safeParse(form);
  if (!parsedBody.success) {
    throw parsedBody.error;
  }

  const { groupId } = await getUserGroup();

  const { name, icon, type } = parsedBody.data;
  return await prisma.category.create({
    data: {
      name,
      icon,
      type,
      group_id: groupId,
    },
  });
};
