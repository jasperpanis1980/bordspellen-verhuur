import {
  TrainFront,
  Mountain,
  Eye,
  Sparkles,
  Gem,
  Landmark,
  Rocket,
  Swords,
  Trees,
  Dices,
  Users,
  Brain,
  HeartHandshake,
  Shapes,
  Music,
  Baby,
  Clapperboard,
  type LucideIcon,
} from "lucide-react";

export const THEME_ICONS: Record<string, LucideIcon> = {
  Treinen: TrainFront,
  Kolonisatie: Mountain,
  Spionage: Eye,
  Fantasie: Sparkles,
  Handel: Gem,
  Geschiedenis: Landmark,
  "Ruimte & Sci-fi": Rocket,
  Avontuur: Swords,
  Natuur: Trees,
  Familie: Users,
  Strategie: Brain,
  Coöperatief: HeartHandshake,
  Abstract: Shapes,
  Muziek: Music,
  Kinderen: Baby,
  Popcultuur: Clapperboard,
  Overig: Dices,
};

export const THEME_OPTIONS = Object.keys(THEME_ICONS);

export function getThemeIcon(theme: string): LucideIcon {
  return THEME_ICONS[theme] ?? Dices;
}
