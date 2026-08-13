import { Wallet, CalendarHeart, PackageCheck, PiggyBank } from "lucide-react";

const STEPS = [
  {
    icon: Wallet,
    title: "1. Betaal de aanschafprijs",
    text: "Je betaalt vooraf het volledige bedrag, alsof je het spel koopt.",
  },
  {
    icon: CalendarHeart,
    title: "2. Speel zo lang je wilt",
    text: "Hoe korter je het houdt, hoe minder je uiteindelijk betaalt.",
  },
  {
    icon: PackageCheck,
    title: "3. Breng het terug",
    text: "Terugbrengen kan op elk moment binnen 8 weken.",
  },
  {
    icon: PiggyBank,
    title: "4. Krijg het verschil terug",
    text: "Je krijgt de aanschafprijs min het huurbedrag terug. Na 8 weken is het spel gewoon van jou.",
  },
];

export function LeasingExplainer() {
  return (
    <div className="mb-8 rounded-2xl border border-ink/10 bg-cream-muted p-6 dark:border-cream/10">
      <h2 className="mb-1 font-display text-xl font-semibold">
        Zo werkt huren bij ons
      </h2>
      <p className="mb-5 text-sm text-foreground/60">
        Geen vast bedrag per dag — je betaalt alleen voor de tijd dat je het
        spel echt hebt.
      </p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex flex-col items-start gap-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon size={20} />
            </span>
            <p className="font-display text-sm font-medium">{title}</p>
            <p className="text-xs text-foreground/60">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
