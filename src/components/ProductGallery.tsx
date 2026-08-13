"use client";

import { useState } from "react";
import { AvailabilityBadge } from "@/components/AvailabilityBadge";
import type { AvailabilityStatus } from "@/lib/availability";

export function ProductGallery({
  title,
  mainImage,
  extraImages,
  availability,
}: {
  title: string;
  mainImage: string | null;
  extraImages: string[];
  availability: AvailabilityStatus;
}) {
  const images = [mainImage, ...extraImages].filter((url): url is string => !!url);
  const [selected, setSelected] = useState(0);
  const current = images[selected];

  return (
    <div>
      <div className="relative">
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current}
            alt={title}
            className="w-full rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-64 w-full items-center justify-center rounded-xl bg-ink/10 text-6xl">
            🎲
          </div>
        )}
        <div className="absolute left-3 top-3">
          <AvailabilityBadge status={availability} />
        </div>
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((url, i) => (
            <button
              key={url + i}
              type="button"
              onClick={() => setSelected(i)}
              className={`h-16 w-16 overflow-hidden rounded-md border-2 ${
                i === selected ? "border-primary" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`${title} foto ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
