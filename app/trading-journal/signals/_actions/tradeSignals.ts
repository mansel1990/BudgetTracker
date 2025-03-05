"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

import {
  RequestTradeSignalSchema,
  RequestTradeSignalType,
  ApproveTradeSignalSchema,
  ApproveTradeSignalType,
  RevokeTradeSignalSchema,
  RevokeTradeSignalType,
} from "@/schema/tradeSignals";

export async function requestTradeSignalAccess() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const userId = user.id;
  const parsedBody = RequestTradeSignalSchema.safeParse({ userId });
  if (!parsedBody.success) throw new Error(parsedBody.error.message);

  const existingRequest = await prisma.tradeSignalAccess.findUnique({
    where: { userId },
  });

  if (existingRequest) throw new Error("Request already exists");

  await prisma.tradeSignalAccess.create({
    data: { userId, status: "pending" },
  });

  return { message: "Request submitted" };
}

export async function approveTradeSignalAccess(form: ApproveTradeSignalType) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const userId = user.id;

  const account = await prisma.account.findUnique({
    where: { userId },
    select: {
      is_admin: true,
    },
  });

  if (!account || !account.is_admin) {
    throw new Error("Forbidden");
  }

  const parsedBody = ApproveTradeSignalSchema.safeParse(form);
  if (!parsedBody.success) throw new Error(parsedBody.error.message);

  const { targetUserId, days } = parsedBody.data;

  const existingRecord = await prisma.tradeSignalAccess.findUnique({
    where: { access_id: targetUserId },
  });

  if (!existingRecord)
    throw new Error(`TradeSignalAccess not found for ID: ${targetUserId}`);

  await prisma.tradeSignalAccess.update({
    where: { access_id: targetUserId },
    data: {
      status: "approved",
      expires_at: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
    },
  });

  return { message: "Access granted" };
}

export async function revokeTradeSignalAccess(form: RevokeTradeSignalType) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const userId = user.id;

  const isAdmin = process.env.ADMIN_USERS?.split(",").includes(userId);
  if (!isAdmin) throw new Error("Forbidden");

  const parsedBody = RevokeTradeSignalSchema.safeParse(form);
  if (!parsedBody.success) throw new Error(parsedBody.error.message);

  await prisma.tradeSignalAccess.delete({
    where: { userId: parsedBody.data.targetUserId },
  });

  return { message: "Access revoked" };
}

export async function checkTradeSignalAccess() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const userId = user.id;
  if (!userId) return { hasAccess: false };

  const access = await prisma.tradeSignalAccess.findUnique({
    where: { userId },
  });

  return {
    hasAccess:
      access && access.status === "approved" && access.expires_at
        ? access.expires_at > new Date()
        : false,
  };
}
