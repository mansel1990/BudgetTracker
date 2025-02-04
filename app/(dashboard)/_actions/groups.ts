import { prisma } from "@/lib/prisma";
import { RemoveMemberSchema, RemoveMemberSchemaType } from "@/schema/groups";

export const RemoveMember = async (form: RemoveMemberSchemaType) => {
  const parsedBody = RemoveMemberSchema.safeParse(form);
  if (!parsedBody.success) {
    throw parsedBody.error;
  }

  return await prisma.user_settings.update({
    where: { clerk_user_id: parsedBody.data.userId },
    data: { group_id: 2 },
  });
};
