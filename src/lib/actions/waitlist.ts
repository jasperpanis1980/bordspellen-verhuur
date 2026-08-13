"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function joinWaitlist(gameId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Niet ingelogd");

  await prisma.waitlist.upsert({
    where: { userId_gameId: { userId: session.user.id, gameId } },
    update: {},
    create: { userId: session.user.id, gameId },
  });

  revalidatePath(`/games/${gameId}`);
}

export async function leaveWaitlist(gameId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Niet ingelogd");

  await prisma.waitlist.deleteMany({
    where: { userId: session.user.id, gameId },
  });

  revalidatePath(`/games/${gameId}`);
}
