import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Alleen beheerders mogen dit doen");
  }
  return session;
}
