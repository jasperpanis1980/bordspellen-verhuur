"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseLocalDate } from "@/lib/availability";

const requestSchema = z
  .object({
    gameId: z.string().min(1),
    variantId: z.string().optional(),
    startDate: z.string().min(1).transform(parseLocalDate),
    endDate: z.string().min(1).transform(parseLocalDate),
    note: z.string().optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "Einddatum moet na de startdatum liggen",
    path: ["endDate"],
  });

export type RentalRequestState = {
  error?: string;
  success?: boolean;
};

export async function createRentalRequest(
  _prevState: RentalRequestState,
  formData: FormData
): Promise<RentalRequestState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Je moet ingelogd zijn om een spel aan te vragen" };
  }

  const parsed = requestSchema.safeParse({
    gameId: formData.get("gameId"),
    variantId: formData.get("variantId") || undefined,
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    note: formData.get("note") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { gameId, variantId, startDate, endDate, note } = parsed.data;

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { variants: true },
  });
  if (!game) {
    return { error: "Spel niet gevonden" };
  }

  if (game.variants.length > 0) {
    const variant = game.variants.find((v) => v.id === variantId);
    if (!variant) {
      return { error: "Kies eerst een editie van dit spel" };
    }
  }

  if (startDate < new Date(new Date().toDateString())) {
    return { error: "Startdatum mag niet in het verleden liggen" };
  }

  await prisma.rental.create({
    data: {
      gameId,
      variantId: game.variants.length > 0 ? variantId : null,
      userId: session.user.id,
      startDate,
      endDate,
      note,
      status: "PENDING",
    },
  });

  revalidatePath(`/games/${gameId}`);
  revalidatePath("/mijn-aanvragen");

  return { success: true };
}

export async function cancelRental(rentalId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Niet ingelogd");

  const rental = await prisma.rental.findUnique({ where: { id: rentalId } });
  if (!rental || rental.userId !== session.user.id) {
    throw new Error("Aanvraag niet gevonden");
  }
  if (rental.status !== "PENDING") {
    throw new Error("Alleen openstaande aanvragen kunnen geannuleerd worden");
  }

  await prisma.rental.update({
    where: { id: rentalId },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/mijn-aanvragen");
}
