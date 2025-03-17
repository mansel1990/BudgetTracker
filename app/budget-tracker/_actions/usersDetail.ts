"use server";

import { clerkClient } from "@clerk/nextjs/server";

export async function getUserDetails(userId: string) {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Convert to a plain object
    return {
      id: user.id,
      firstName: user.firstName,
      imageUrl: user.imageUrl,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
