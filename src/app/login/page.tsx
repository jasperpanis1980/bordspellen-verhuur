import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { LoginForm } from "@/components/LoginForm";
import { AuthSidePanel } from "@/components/AuthSidePanel";

export default async function LoginPage() {
  const images = await prisma.game.findMany({
    where: { imageUrl: { not: null } },
    orderBy: { reviewCount: "desc" },
    skip: 4,
    take: 4,
    select: { id: true, title: true, imageUrl: true },
  });

  return (
    <div className="mx-auto flex max-w-3xl items-start justify-center gap-8">
      <Suspense>
        <LoginForm />
      </Suspense>
      <AuthSidePanel
        images={images}
        tagline="Log in om je aanvragen te beheren en nieuwe spellen te huren."
      />
    </div>
  );
}
