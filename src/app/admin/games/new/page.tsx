import { GameForm } from "@/components/GameForm";
import { createGame } from "@/lib/actions/games";

export default function NewGamePage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold">
        Nieuw spel toevoegen
      </h1>
      <GameForm action={createGame} />
    </div>
  );
}
