"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const gameSchema = z.object({
  title: z.string().min(1, "Titel is verplicht"),
  shortDescription: z.string().min(1, "Korte beschrijving is verplicht"),
  description: z.string().min(1, "Beschrijving is verplicht"),
  category: z.string().min(1, "Classificatie is verplicht"),
  theme: z.string().min(1, "Thema is verplicht"),
  complexity: z.coerce.number().min(1).max(5),
  minAge: z.coerce.number().int().min(0).max(18),
  minPlayers: z.coerce.number().int().min(1),
  maxPlayers: z.coerce.number().int().min(1),
  playTime: z.coerce.number().int().min(1),
  imageUrl: z.string().url().optional().or(z.literal("")),
  productImageUrl: z.string().url().optional().or(z.literal("")),
  galleryImages: z.string().optional(),
  variants: z.string().optional(),
  purchasePrice: z.coerce.number().min(0),
  totalCopies: z.coerce.number().int().min(1),
  rating: z.coerce.number().min(1).max(5),
  reviewCount: z.coerce.number().int().min(0),
});

export type GameFormState = {
  error?: string;
};

function parseGalleryUrls(raw?: string) {
  return (raw ?? "")
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);
}

const variantSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().optional(),
  productImageUrl: z.string().optional(),
  totalCopies: z.coerce.number().int().min(0),
});

function parseVariants(raw?: string) {
  if (!raw) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];
  return data
    .map((entry) => variantSchema.safeParse(entry))
    .filter((result) => result.success && result.data.name.trim().length > 0)
    .map((result) => result.data as z.infer<typeof variantSchema>);
}

export async function createGame(
  _prevState: GameFormState,
  formData: FormData
): Promise<GameFormState> {
  await requireAdmin();

  const parsed = gameSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { galleryImages, variants, ...data } = parsed.data;
  const gameId = await prisma.game
    .create({
      data: {
        ...data,
        imageUrl: data.imageUrl || null,
        productImageUrl: data.productImageUrl || null,
      },
    })
    .then((game) => game.id);

  const urls = parseGalleryUrls(galleryImages);
  if (urls.length > 0) {
    await prisma.gameImage.createMany({
      data: urls.map((url, order) => ({ gameId, url, order })),
    });
  }

  const variantList = parseVariants(variants);
  if (variantList.length > 0) {
    await prisma.gameVariant.createMany({
      data: variantList.map((v, order) => ({
        gameId,
        name: v.name,
        imageUrl: v.imageUrl || null,
        productImageUrl: v.productImageUrl || null,
        totalCopies: v.totalCopies,
        order,
      })),
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/games");
  redirect("/admin/games");
}

export async function updateGame(
  gameId: string,
  _prevState: GameFormState,
  formData: FormData
): Promise<GameFormState> {
  await requireAdmin();

  const parsed = gameSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { galleryImages, variants, ...data } = parsed.data;
  await prisma.game.update({
    where: { id: gameId },
    data: {
      ...data,
      imageUrl: data.imageUrl || null,
      productImageUrl: data.productImageUrl || null,
    },
  });

  const urls = parseGalleryUrls(galleryImages);
  await prisma.gameImage.deleteMany({ where: { gameId } });
  if (urls.length > 0) {
    await prisma.gameImage.createMany({
      data: urls.map((url, order) => ({ gameId, url, order })),
    });
  }

  const variantList = parseVariants(variants);
  await prisma.gameVariant.deleteMany({ where: { gameId } });
  if (variantList.length > 0) {
    await prisma.gameVariant.createMany({
      data: variantList.map((v, order) => ({
        gameId,
        name: v.name,
        imageUrl: v.imageUrl || null,
        productImageUrl: v.productImageUrl || null,
        totalCopies: v.totalCopies,
        order,
      })),
    });
  }

  revalidatePath("/");
  revalidatePath(`/games/${gameId}`);
  revalidatePath("/admin/games");
  redirect("/admin/games");
}

export async function deleteGame(gameId: string) {
  await requireAdmin();
  await prisma.game.delete({ where: { id: gameId } });
  revalidatePath("/");
  revalidatePath("/admin/games");
}
