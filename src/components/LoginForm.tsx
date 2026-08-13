"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    setPending(false);

    if (result?.error) {
      setError("Onjuist e-mailadres of wachtwoord");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="mb-6 font-display text-2xl font-semibold">Inloggen</h1>
      {justRegistered && (
        <p className="mb-4 rounded-md bg-green-100 px-3 py-2 text-sm text-green-800 dark:bg-green-950 dark:text-green-300">
          Account aangemaakt, je kunt nu inloggen.
        </p>
      )}
      <form action={handleSubmit} className="flex flex-col gap-4">
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
            className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-4 py-2 font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {pending ? "Bezig..." : "Inloggen"}
        </button>
      </form>
      <p className="mt-4 text-sm text-foreground/60">
        Nog geen account?{" "}
        <Link href="/register" className="text-primary underline">
          Registreer
        </Link>
      </p>
    </div>
  );
}
