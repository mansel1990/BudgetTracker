"use server";

import { prisma } from "@/lib/prisma";
import { getUserGroup } from "@/lib/session";
import {
  CreateCategoryScehma,
  CreateCategoryScehmaType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
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

export const DeleteCategory = async (form: DeleteCategorySchemaType) => {
  const parsedBody = DeleteCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw parsedBody.error;
  }

  const { groupId } = await getUserGroup();

  return await prisma.category.delete({
    where: {
      group_id_name_type: {
        group_id: groupId,
        name: parsedBody.data.name,
        type: parsedBody.data.type,
      },
    },
  });
};
