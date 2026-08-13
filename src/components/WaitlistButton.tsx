"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Bell, BellOff } from "lucide-react";
import { joinWaitlist, leaveWaitlist } from "@/lib/actions/waitlist";

export function WaitlistButton({
  gameId,
  onWaitlist,
  isLoggedIn,
}: {
  gameId: string;
  onWaitlist: boolean;
  isLoggedIn: boolean;
}) {
  const [joined, setJoined] = useState(onWaitlist);
  const [pending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <p className="mt-1 text-xs text-foreground/60">
        <Link href="/login" className="text-primary underline">
          Log in
        </Link>{" "}
        om een melding te krijgen zodra dit spel weer beschikbaar is.
      </p>
    );
  }

  function toggle() {
    const next = !joined;
    setJoined(next);
    startTransition(async () => {
      if (next) {
        await joinWaitlist(gameId);
      } else {
        await leaveWaitlist(gameId);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className={`mt-1 flex items-center gap-1.5 text-xs font-medium disabled:opacity-50 ${
        joined ? "text-primary" : "text-foreground/60 hover:text-primary"
      }`}
    >
      {joined ? <Bell size={13} className="fill-current" /> : <BellOff size={13} />}
      {joined
        ? "Je krijgt een melding zodra dit spel beschikbaar is"
        : "Meld mij zodra dit spel beschikbaar is"}
    </button>
  );
}
