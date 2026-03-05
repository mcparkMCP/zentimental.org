import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSignatureCount, addSignature, getSignatures } from "@/lib/petition-store";

export async function GET() {
  try {
    const count = await getSignatureCount();
    const signatures = await getSignatures();
    const recentNames = signatures.slice(-10).reverse().map((s) => s.name);
    return NextResponse.json({ count, recentNames });
  } catch {
    return NextResponse.json({ error: "Failed to load petition" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body as { name?: string };

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim().slice(0, 50);

    const sig = {
      id: randomUUID(),
      name: trimmedName,
      createdAt: Date.now(),
    };

    const count = await addSignature(sig);
    return NextResponse.json({ count, signature: sig });
  } catch {
    return NextResponse.json(
      { error: "Failed to sign petition" },
      { status: 500 }
    );
  }
}
