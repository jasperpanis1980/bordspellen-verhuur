import { Heart } from "lucide-react";
import { toggleFavorite } from "@/lib/actions/favorites";

export function FavoriteButton({
  gameId,
  favorited,
  className = "",
}: {
  gameId: string;
  favorited: boolean;
  className?: string;
}) {
  return (
    <form action={toggleFavorite.bind(null, gameId)} className={className}>
      <button
        type="submit"
        title={favorited ? "Verwijder uit favorieten" : "Bewaar voor later"}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-cream-muted/90 shadow ring-1 ring-ink/10 backdrop-blur-sm transition hover:bg-cream-muted dark:bg-ink/90 dark:ring-cream/10"
      >
        <Heart
          size={15}
          className={
            favorited
              ? "fill-red-500 text-red-500"
              : "text-foreground/60"
          }
        />
      </button>
    </form>
  );
}
