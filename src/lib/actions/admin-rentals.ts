"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { calculateRefundAmount, daysBetween } from "@/lib/leasing";
import type { RentalStatus } from "@prisma/client";

const ALLOWED_TRANSITIONS: Record<RentalStatus, RentalStatus[]> = {
  PENDING: ["CONFIRMED", "REJECTED"],
  CONFIRMED: ["ACTIVE", "CANCELLED"],
  ACTIVE: ["RETURNED"],
  REJECTED: [],
  RETURNED: [],
  CANCELLED: [],
};

export async function updateRentalStatus(
  rentalId: string,
  nextStatus: RentalStatus
) {
  await requireAdmin();

  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
    include: { game: true },
  });
  if (!rental) throw new Error("Aanvraag niet gevonden");

  if (!ALLOWED_TRANSITIONS[rental.status].includes(nextStatus)) {
    throw new Error(
      `Kan status niet wijzigen van ${rental.status} naar ${nextStatus}`
    );
  }

  const now = new Date();
  const data: {
    status: RentalStatus;
    pickedUpAt?: Date;
    returnedAt?: Date;
    refundAmount?: number;
  } = { status: nextStatus };

  if (nextStatus === "ACTIVE") {
    data.pickedUpAt = now;
  }
  if (nextStatus === "RETURNED") {
    data.returnedAt = now;
    const daysHeld = daysBetween(rental.pickedUpAt ?? rental.startDate, now);
    data.refundAmount = calculateRefundAmount(rental.game.purchasePrice, daysHeld);
  }

  await prisma.rental.update({
    where: { id: rentalId },
    data,
  });

  revalidatePath("/admin/rentals");
  revalidatePath("/mijn-aanvragen");
}

export async function toggleDepositPaid(rentalId: string, paid: boolean) {
  await requireAdmin();
  await prisma.rental.update({
    where: { id: rentalId },
    data: { depositPaid: paid, depositPaidAt: paid ? new Date() : null },
  });
  revalidatePath("/admin/rentals");
}

export async function toggleRefundPaid(rentalId: string, paid: boolean) {
  await requireAdmin();
  await prisma.rental.update({
    where: { id: rentalId },
    data: { refundPaid: paid, refundPaidAt: paid ? new Date() : null },
  });
  revalidatePath("/admin/rentals");
}
