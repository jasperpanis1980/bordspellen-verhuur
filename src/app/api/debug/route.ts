import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function safeStat(p: string) {
  try {
    const s = fs.statSync(p);
    return { exists: true, size: s.size, isFile: s.isFile() };
  } catch (e) {
    return { exists: false, error: (e as Error).message };
  }
}

export async function GET() {
  const cwd = process.cwd();
  const dirname = __dirname;
  const candidates = [
    path.join(cwd, "prisma", "dev.db"),
    path.join(cwd, "dev.db"),
    path.join(dirname, "dev.db"),
  ];

  let prismaDirListing: string[] | string = "n/a";
  try {
    prismaDirListing = fs.readdirSync(path.join(cwd, "prisma"));
  } catch (e) {
    prismaDirListing = "error: " + (e as Error).message;
  }

  let cwdListing: string[] | string = "n/a";
  try {
    cwdListing = fs.readdirSync(cwd);
  } catch (e) {
    cwdListing = "error: " + (e as Error).message;
  }

  return NextResponse.json({
    cwd,
    dirname,
    databaseUrlEnv: process.env.DATABASE_URL,
    candidates: candidates.map((p) => ({ path: p, ...safeStat(p) })),
    prismaDirListing,
    cwdListing,
  });
}
