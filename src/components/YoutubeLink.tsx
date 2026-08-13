"use client";

import { getInstructionVideoUrl } from "@/lib/game-options";

export function YoutubeLink({ title }: { title: string }) {
  return (
    <button
      type="button"
      title="Bekijk instructievideo op YouTube"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(getInstructionVideoUrl(title), "_blank", "noopener,noreferrer");
      }}
      className="shrink-0 transition hover:scale-110"
    >
      <svg viewBox="0 0 28 20" className="h-6 w-8" aria-hidden="true">
        <path
          d="M27.4 3.1a3.5 3.5 0 0 0-2.46-2.48C22.75 0 14 0 14 0S5.25 0 3.06.62A3.5 3.5 0 0 0 .6 3.1 36.6 36.6 0 0 0 0 10a36.6 36.6 0 0 0 .6 6.9 3.5 3.5 0 0 0 2.46 2.48C5.25 20 14 20 14 20s8.75 0 10.94-.62a3.5 3.5 0 0 0 2.46-2.48A36.6 36.6 0 0 0 28 10a36.6 36.6 0 0 0-.6-6.9z"
          fill="#FF0000"
        />
        <path d="M11.2 14.2V5.8L18.5 10l-7.3 4.2z" fill="#fff" />
      </svg>
    </button>
  );
}
