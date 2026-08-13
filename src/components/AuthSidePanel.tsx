export function AuthSidePanel({
  images,
  tagline,
}: {
  images: { id: string; title: string; imageUrl: string | null }[];
  tagline: string;
}) {
  return (
    <div className="hero-surface relative hidden shrink-0 flex-col justify-between overflow-hidden rounded-2xl p-8 text-cream shadow-lg lg:flex lg:w-80">
      <div>
        <p className="font-display text-lg font-semibold">
          Level5 Lease &amp; Play
        </p>
        <p className="mt-2 max-w-[16rem] text-sm text-cream/80">{tagline}</p>
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {images.map((game, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={game.id}
              src={game.imageUrl!}
              alt={game.title}
              className={`h-24 w-full rounded-lg object-cover object-top shadow-md ring-2 ring-cream/20 ${
                i % 2 === 1 ? "mt-4" : ""
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
