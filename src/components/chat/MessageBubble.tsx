"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { Check, Copy, User, Bot, Pencil, RefreshCw } from "lucide-react";
import type { UIMessage } from "ai";
import type { Components } from "react-markdown";

interface MessageBubbleProps {
  message: UIMessage;
  isLoading?: boolean;
  onEdit?: (messageId: string, newText: string) => void;
  onRegenerate?: (messageId: string) => void;
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
      typeof children === "string"
        ? children
        : extractText(children);
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

function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return extractText((node as any).props.children);
  }
  return "";
}

export function MessageBubble({ message, isLoading, onEdit, onRegenerate }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const textContent = message.parts
    ?.filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
    .map((p) => p.text)
    .join("") || "";

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [isEditing]);

  const handleStartEdit = useCallback(() => {
    if (!onEdit) return;
    setEditText(textContent);
    setIsEditing(true);
  }, [textContent, onEdit]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditText("");
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!editText.trim() || !onEdit) return;
    onEdit(message.id, editText.trim());
    setIsEditing(false);
    setEditText("");
  }, [editText, message.id, onEdit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSaveEdit();
      } else if (e.key === "Escape") {
        handleCancelEdit();
      }
    },
    [handleSaveEdit, handleCancelEdit]
  );

  const markdownComponents: Components = {
    pre({ children }) {
      return <>{children}</>;
    },
    code({ className, children, ...props }) {
      const isBlock = className?.includes("language-") || className?.includes("hljs");
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

  return (
    <div className={`group/msg flex gap-3 py-4 ${isUser ? "justify-end" : ""}`}>
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
          isEditing ? (
            <div className="min-w-[300px]">
              <textarea
                ref={textareaRef}
                value={editText}
                onChange={(e) => {
                  setEditText(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                onKeyDown={handleKeyDown}
                className="w-full bg-[#212121] text-white rounded-xl px-3 py-2 text-sm resize-none outline-none border border-[#444] focus:border-[#10a37f] transition-colors"
                rows={1}
              />
              <div className="flex gap-2 mt-2 justify-end">
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-[#444] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1.5 text-xs bg-[#10a37f] text-white rounded-lg hover:bg-[#0d8c6d] transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <p
              className="whitespace-pre-wrap cursor-pointer"
              onClick={handleStartEdit}
              title="Click to edit"
            >
              {textContent}
            </p>
          )
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={markdownComponents}
          >
            {textContent}
          </ReactMarkdown>
        )}
      </div>
      {isUser && !isEditing && (
        <div className="flex items-center gap-1">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#5436DA] flex items-center justify-center">
            <User size={18} className="text-white" />
          </div>
          {onEdit && (
            <button
              onClick={handleStartEdit}
              className="opacity-0 group-hover/msg:opacity-100 p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-[#2f2f2f] transition-all"
              title="Edit message"
            >
              <Pencil size={14} />
            </button>
          )}
        </div>
      )}
      {isUser && isEditing && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#5436DA] flex items-center justify-center">
          <User size={18} className="text-white" />
        </div>
      )}
      {!isUser && onRegenerate && !isLoading && (
        <div className="flex items-center self-end">
          <button
            onClick={() => onRegenerate(message.id)}
            className="opacity-0 group-hover/msg:opacity-100 p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-[#2f2f2f] transition-all"
            title="Regenerate response"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
