"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser, type RegisterState } from "@/lib/actions/auth";

const initialState: RegisterState = {};

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    registerUser,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      router.push("/login?registered=1");
    }
  }, [state.success, router]);

  return (
    <div className="w-full max-w-sm">
      <h1 className="mb-6 font-display text-2xl font-semibold">
        Account aanmaken
      </h1>
      <form action={formAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Naam
          <input
            name="name"
            type="text"
            required
            className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          E-mailadres
          <input
            name="email"
            type="email"
            required
            className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Wachtwoord
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
          />
        </label>
        {state.error && (
          <p className="text-sm text-red-600">{state.error}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-4 py-2 font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {pending ? "Bezig..." : "Registreren"}
        </button>
      </form>
      <p className="mt-4 text-sm text-foreground/60">
        Heb je al een account?{" "}
        <Link href="/login" className="text-primary underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
