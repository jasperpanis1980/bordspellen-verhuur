import { notFound } from "next/navigation";
import { GameForm } from "@/components/GameForm";
import { updateGame } from "@/lib/actions/games";
import { prisma } from "@/lib/prisma";

export default async function EditGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await prisma.game.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: { orderBy: { order: "asc" } },
    },
  });
  if (!game) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold">
        {game.title} bewerken
      </h1>
      <GameForm action={updateGame.bind(null, game.id)} game={game} />
    </div>
  );
}
