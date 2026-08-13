import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminNav } from "@/components/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <div>
      <AdminNav />
      {children}
    </div>
  );
}
