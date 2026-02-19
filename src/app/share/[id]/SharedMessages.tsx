"use client";

import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { Check, Copy, User, Bot } from "lucide-react";
import type { SharedMessage } from "@/types/shared-conversation";
import type { Components } from "react-markdown";

function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return extractText((node as any).props.children);
  }
  return "";
}

function CodeBlock({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const language = className?.replace("hljs language-", "") || "";

  const handleCopy = useCallback(() => {
    const text =
      typeof children === "string" ? children : extractText(children);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [children]);

  return (
    <div className="relative group my-3 rounded-lg overflow-hidden bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] text-xs text-gray-400">
        <span>{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

const markdownComponents: Components = {
  pre({ children }) {
    return <>{children}</>;
  },
  code({ className, children, ...props }) {
    const isBlock =
      className?.includes("language-") || className?.includes("hljs");
    if (isBlock) {
      return <CodeBlock className={className}>{children}</CodeBlock>;
    }
    return (
      <code
        className="bg-[#2d2d2d] px-1.5 py-0.5 rounded text-sm text-[#e06c75]"
        {...props}
      >
        {children}
      </code>
    );
  },
};

function SharedMessageBubble({ message }: { message: SharedMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 py-4 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#10a37f] flex items-center justify-center">
          <Bot size={18} className="text-white" />
        </div>
      )}
      <div
        className={`max-w-[80%] ${
          isUser
            ? "bg-[#2f2f2f] rounded-3xl px-5 py-3 text-white"
            : "prose prose-invert max-w-none prose-pre:p-0 prose-pre:bg-transparent"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.text}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={markdownComponents}
          >
            {message.text}
          </ReactMarkdown>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#5436DA] flex items-center justify-center">
          <User size={18} className="text-white" />
        </div>
      )}
    </div>
  );
}

export function SharedMessages({
  messages,
}: {
  messages: SharedMessage[];
}) {
  return (
    <div>
      {messages.map((message, index) => (
        <SharedMessageBubble key={index} message={message} />
      ))}
    </div>
  );
}
