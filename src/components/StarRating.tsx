import { Star } from "lucide-react";

export function StarRating({
  rating,
  reviewCount,
  size = "sm",
}: {
  rating: number;
  reviewCount: number;
  size?: "sm" | "md";
}) {
  const iconSize = size === "sm" ? 13 : 15;
  const textClass = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1 ${textClass} text-foreground/70`}
    >
      <Star size={iconSize} className="fill-amber-400 text-amber-400" />
      <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
      <span className="text-foreground/50">({reviewCount})</span>
    </span>
  );
}
