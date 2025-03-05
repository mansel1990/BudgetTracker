"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Fetch all users with their expiry dates
export const getUsers = async () => {
  try {
    const users = await prisma.account.findMany({
      select: {
        account_id: true,
        name: true,
        userId: true,
        tradeSignalAccess: {
          select: {
            status: true,
            expires_at: true,
          },
        },
      },
    });

    return users.map((user) => ({
      id: user.account_id,
      name: user.name,
      email: user.userId, // Assuming userId is an email
      status: user.tradeSignalAccess?.status || "not_requested",
      expiryDate: user.tradeSignalAccess?.expires_at || null,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users.");
  }
};

// Fetch pending trade signal requests
export const getPendingRequests = async () => {
  try {
    const requests = await prisma.tradeSignalAccess.findMany({
      where: { status: "pending" },
      select: {
        access_id: true,
        account: {
          select: {
            name: true,
            userId: true,
          },
        },
      },
    });

    return requests.map((request) => ({
      id: request.access_id,
      user: {
        name: request.account?.name || "Unknown",
        email: request.account?.userId || "Unknown",
      },
    }));
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    throw new Error("Failed to fetch pending requests.");
  }
};

export const denyRequest = async (requestId: number) => {
  try {
    await prisma.tradeSignalAccess.update({
      where: { access_id: requestId },
      data: { status: "rejected" },
    });

    return { success: true };
  } catch (error) {
    console.error("Error denying request:", error);
    throw new Error("Failed to deny request.");
  }
};
