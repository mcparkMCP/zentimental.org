import { promises as fs } from "fs";
import path from "path";
import type { PetitionSignature } from "@/types/petition";

const DATA_FILE = path.join(process.cwd(), "data", "petition.json");

async function ensureFile() {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

export async function getSignatures(): Promise<PetitionSignature[]> {
  await ensureFile();
  const data = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

export async function getSignatureCount(): Promise<number> {
  const sigs = await getSignatures();
  return sigs.length;
}

export async function addSignature(sig: PetitionSignature): Promise<number> {
  const sigs = await getSignatures();
  sigs.push(sig);
  await fs.writeFile(DATA_FILE, JSON.stringify(sigs, null, 2), "utf-8");
  return sigs.length;
}
