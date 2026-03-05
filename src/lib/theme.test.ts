import { describe, it, expect } from "vitest";
import { THEMES } from "@/types/theme";

describe("THEMES", () => {
  it("has at least 3 themes", () => {
    expect(THEMES.length).toBeGreaterThanOrEqual(3);
  });

  it("includes a classic theme", () => {
    const classic = THEMES.find((t) => t.id === "classic");
    expect(classic).toBeDefined();
    expect(classic!.name).toBe("Classic Green");
  });

  it("includes an OLED theme", () => {
    const oled = THEMES.find((t) => t.id === "oled");
    expect(oled).toBeDefined();
    expect(oled!.bg).toBe("#000000");
  });

  it("all themes have required fields", () => {
    for (const theme of THEMES) {
      expect(theme.id).toBeTruthy();
      expect(theme.name).toBeTruthy();
      expect(theme.bg).toMatch(/^#[0-9a-f]{6}$/i);
      expect(theme.sidebar).toMatch(/^#[0-9a-f]{6}$/i);
      expect(theme.input).toMatch(/^#[0-9a-f]{6}$/i);
      expect(theme.border).toMatch(/^#[0-9a-f]{6}$/i);
      expect(theme.accent).toMatch(/^#[0-9a-f]{6}$/i);
      expect(theme.userBubble).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("all theme IDs are unique", () => {
    const ids = THEMES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
