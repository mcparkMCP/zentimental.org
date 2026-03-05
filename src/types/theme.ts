export interface Theme {
  id: string;
  name: string;
  bg: string;
  sidebar: string;
  input: string;
  border: string;
  accent: string;
  userBubble: string;
}

export const THEMES: Theme[] = [
  {
    id: "classic",
    name: "Classic Green",
    bg: "#212121",
    sidebar: "#171717",
    input: "#2f2f2f",
    border: "#2f2f2f",
    accent: "#10a37f",
    userBubble: "#2f2f2f",
  },
  {
    id: "midnight",
    name: "Midnight Blue",
    bg: "#1a1b2e",
    sidebar: "#12132a",
    input: "#252745",
    border: "#2a2c50",
    accent: "#6366f1",
    userBubble: "#252745",
  },
  {
    id: "ocean",
    name: "Ocean",
    bg: "#0f1729",
    sidebar: "#0a1120",
    input: "#1a2744",
    border: "#1e2d4f",
    accent: "#0ea5e9",
    userBubble: "#1a2744",
  },
  {
    id: "rose",
    name: "Rose",
    bg: "#1f1520",
    sidebar: "#171017",
    input: "#2d1f2e",
    border: "#352538",
    accent: "#f43f5e",
    userBubble: "#2d1f2e",
  },
  {
    id: "oled",
    name: "OLED Black",
    bg: "#000000",
    sidebar: "#000000",
    input: "#1a1a1a",
    border: "#1a1a1a",
    accent: "#10a37f",
    userBubble: "#1a1a1a",
  },
];
