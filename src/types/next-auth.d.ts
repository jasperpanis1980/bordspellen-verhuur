import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "CUSTOMER";
    } & DefaultSession["user"];
  }

  interface User {
    role: "ADMIN" | "CUSTOMER";
  }
}
