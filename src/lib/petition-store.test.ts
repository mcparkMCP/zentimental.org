import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSignatures, getSignatureCount, addSignature } from "./petition-store";
import type { PetitionSignature } from "@/types/petition";

// Mock fs
const mockReadFile = vi.fn().mockResolvedValue("[]");
const mockWriteFile = vi.fn().mockResolvedValue(undefined);
const mockMkdir = vi.fn().mockResolvedValue(undefined);
const mockAccess = vi.fn().mockResolvedValue(undefined);

vi.mock("fs", () => ({
  promises: {
    mkdir: (...args: unknown[]) => mockMkdir(...args),
    access: (...args: unknown[]) => mockAccess(...args),
    readFile: (...args: unknown[]) => mockReadFile(...args),
    writeFile: (...args: unknown[]) => mockWriteFile(...args),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockReadFile.mockResolvedValue("[]");
  mockWriteFile.mockResolvedValue(undefined);
});

describe("getSignatures", () => {
  it("returns an empty array when no signatures exist", async () => {
    const sigs = await getSignatures();
    expect(sigs).toEqual([]);
  });

  it("returns stored signatures", async () => {
    const mockSigs: PetitionSignature[] = [
      { id: "1", name: "Alice", createdAt: 1000 },
    ];
    mockReadFile.mockResolvedValue(JSON.stringify(mockSigs));

    const sigs = await getSignatures();
    expect(sigs).toHaveLength(1);
    expect(sigs[0].name).toBe("Alice");
  });
});

describe("getSignatureCount", () => {
  it("returns 0 when empty", async () => {
    mockReadFile.mockResolvedValue("[]");
    const count = await getSignatureCount();
    expect(count).toBe(0);
  });

  it("returns correct count", async () => {
    const mockSigs: PetitionSignature[] = [
      { id: "1", name: "Alice", createdAt: 1000 },
      { id: "2", name: "Bob", createdAt: 2000 },
    ];
    mockReadFile.mockResolvedValue(JSON.stringify(mockSigs));

    const count = await getSignatureCount();
    expect(count).toBe(2);
  });
});

describe("addSignature", () => {
  it("adds a signature and returns new count", async () => {
    mockReadFile.mockResolvedValue("[]");

    const sig: PetitionSignature = {
      id: "3",
      name: "Charlie",
      createdAt: 3000,
    };

    const count = await addSignature(sig);
    expect(count).toBe(1);
    expect(mockWriteFile).toHaveBeenCalled();
  });
});
