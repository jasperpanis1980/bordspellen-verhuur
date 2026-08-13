function complexityLevel(value: number) {
  if (value < 1.8) return 1;
  if (value < 3) return 2;
  return 3;
}

function complexityLabel(value: number) {
  if (value < 1.8) return "Licht";
  if (value < 3) return "Gemiddeld";
  return "Zwaar";
}

export function ComplexityMeter({
  value,
  size = "sm",
}: {
  value: number;
  size?: "sm" | "md";
}) {
  const level = complexityLevel(value);
  const dotSize = size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2";

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex items-center gap-0.5">
        {[1, 2, 3].map((dot) => (
          <span
            key={dot}
            className={`${dotSize} rounded-full ${
              dot <= level ? "bg-primary" : "bg-ink/15 dark:bg-cream/20"
            }`}
          />
        ))}
      </span>
      {complexityLabel(value)}
    </span>
  );
}
