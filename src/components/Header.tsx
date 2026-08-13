import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function Header() {
  const session = await auth();

  return (
    <header className="border-b border-primary/30 bg-ink text-cream shadow-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-y-2 px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-semibold"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-lg shadow-inner">
            🎲
          </span>
          Level5 Lease &amp; Play
        </Link>
        <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm sm:gap-4">
          <Link href="/" className="hover:text-primary-hover hover:opacity-90">
            Catalogus
          </Link>
          {session?.user && (
            <Link
              href="/mijn-aanvragen"
              className="hover:opacity-80"
            >
              Mijn aanvragen
            </Link>
          )}
          {session?.user && (
            <Link href="/mijn-favorieten" className="hover:opacity-80">
              Favorieten
            </Link>
          )}
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin" className="hover:opacity-80">
              Beheer
            </Link>
          )}
          {session?.user ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <span className="mr-2 text-cream/60">{session.user.name}</span>
              <button
                type="submit"
                className="rounded-md bg-primary px-3 py-1.5 font-medium text-white hover:bg-primary-hover"
              >
                Uitloggen
              </button>
            </form>
          ) : (
            <>
              <Link href="/login" className="hover:opacity-80">
                Inloggen
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-primary px-3 py-1.5 font-medium text-white hover:bg-primary-hover"
              >
                Registreren
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
