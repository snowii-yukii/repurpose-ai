import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

export async function requireUser() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return prisma.user.upsert({
    where: {
      clerkUserId: userId,
    },
    update: {},
    create: {
      clerkUserId: userId,
    },
  });
}