"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(2, "Naam moet minstens 2 tekens zijn"),
  email: z.string().email("Ongeldig e-mailadres"),
  password: z.string().min(8, "Wachtwoord moet minstens 8 tekens zijn"),
});

export type RegisterState = {
  error?: string;
  success?: boolean;
};

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Er bestaat al een account met dit e-mailadres" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, passwordHash, role: "CUSTOMER" },
  });

  return { success: true };
}
