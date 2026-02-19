import { notFound } from "next/navigation";
import { getSharedConversation } from "@/lib/share-store";
import { SharedMessages } from "./SharedMessages";

export default async function SharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conversation = await getSharedConversation(id);

  if (!conversation) {
    notFound();
  }

  const sharedDate = new Date(conversation.sharedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="min-h-dvh bg-[#212121] text-white">
      <header className="border-b border-[#2f2f2f] px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-lg font-semibold">{conversation.title}</h1>
          <p className="text-sm text-gray-400 mt-1">
            Shared on {sharedDate}
          </p>
        </div>
      </header>

      <main className="px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <SharedMessages messages={conversation.messages} />
        </div>
      </main>

      <footer className="border-t border-[#2f2f2f] px-4 py-4 text-center">
        <p className="text-sm text-gray-500">
          This is a read-only shared conversation.
        </p>
      </footer>
    </div>
  );
}
