"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function toggleFavorite(gameId: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_gameId: { userId: session.user.id, gameId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({
      data: { userId: session.user.id, gameId },
    });
  }

  revalidatePath("/");
  revalidatePath(`/games/${gameId}`);
  revalidatePath("/mijn-favorieten");
}
