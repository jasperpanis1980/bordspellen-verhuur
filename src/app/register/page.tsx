import { prisma } from "@/lib/prisma";
import { RegisterForm } from "@/components/RegisterForm";
import { AuthSidePanel } from "@/components/AuthSidePanel";

export default async function RegisterPage() {
  const images = await prisma.game.findMany({
    where: { imageUrl: { not: null } },
    orderBy: { reviewCount: "desc" },
    skip: 8,
    take: 4,
    select: { id: true, title: true, imageUrl: true },
  });

  return (
    <div className="mx-auto flex max-w-3xl items-start justify-center gap-8">
      <RegisterForm />
      <AuthSidePanel
        images={images}
        tagline="Maak een account aan en huur je eerste bordspel binnen een paar minuten."
      />
    </div>
  );
}
