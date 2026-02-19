export interface SharedMessage {
  role: "user" | "assistant";
  text: string;
}

export interface SharedConversation {
  id: string;
  title: string;
  sharedAt: number;
  messages: SharedMessage[];
}
