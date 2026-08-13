import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 py-6 text-center text-sm text-foreground/60 dark:border-cream/10">
      <Link href="/voorwaarden" className="hover:text-primary hover:underline">
        Algemene voorwaarden
      </Link>
    </footer>
  );
}
