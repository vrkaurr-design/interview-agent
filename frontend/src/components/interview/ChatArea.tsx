"use client";

import React, { useEffect, useRef } from "react";
import { InterviewMessage } from "../../lib/types";
import { motion, AnimatePresence } from "framer-motion";
import Panel from "../shared/ui/Panel";
import { cn } from "../../lib/utils";

interface ChatAreaProps {
  messages: InterviewMessage[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

// Lightweight zero-dependency markdown code block parser
function renderMessageText(text: string) {
  if (!text) return null;

  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, index) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const codeLines = part.slice(3, -3).trim().split("\n");
      let language = "";
      let lines = codeLines;

      if (codeLines[0] && !codeLines[0].includes(" ") && codeLines[0].length < 15) {
        language = codeLines[0];
        lines = codeLines.slice(1);
      }

      const codeText = lines.join("\n");

      // Simple keyword highlighting for Javascript/Typescript/CSS code segments
      const highlightCode = (rawCode: string) => {
        const keywords = /\b(const|let|var|function|return|import|export|default|class|interface|type|extends|implements|if|else|for|while|async|await|from)\b/g;
        const strings = /("(.*?)"|'(.*?)'|`(.*?)`)/g;

        let html = rawCode
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        // String highlighting (accent-resolve / orange-gold)
        html = html.replace(strings, '<span class="text-accent-resolve">$1</span>');
        // Keyword highlighting (accent-focus / cyan)
        html = html.replace(keywords, '<span class="text-accent-focus">$1</span>');

        return <code dangerouslySetInnerHTML={{ __html: html }} />;
      };

      return (
        <pre
          key={index}
          className="my-space-3 p-space-4 bg-[#0B0D10] border border-hairline font-mono text-xs text-text-primary overflow-x-auto rounded-sm leading-relaxed"
        >
          {language && (
            <div className="text-[9px] text-text-muted font-mono uppercase tracking-wider mb-space-2 border-b border-hairline pb-1">
              {language}
            </div>
          )}
          {highlightCode(codeText)}
        </pre>
      );
    } else {
      // Parse inline `code`
      const inlineParts = part.split(/(`[^`\n]+`)/g);
      return (
        <span key={index}>
          {inlineParts.map((inlinePart, subIndex) => {
            if (inlinePart.startsWith("`") && inlinePart.endsWith("`")) {
              return (
                <code
                  key={subIndex}
                  className="px-1.5 py-0.5 bg-[#0B0D10] border border-hairline font-mono text-xs text-accent-focus rounded-sm mx-0.5"
                >
                  {inlinePart.slice(1, -1)}
                </code>
              );
            }
            return inlinePart;
          })}
        </span>
      );
    }
  });
}

export default function ChatArea({ messages, isLoading, error, onRetry }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div
      className="flex-1 overflow-y-auto px-space-6 py-space-6 space-y-space-6 flex flex-col custom-scrollbar pb-24"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {messages.map((msg) => {
          const isAI = msg.sender === "ai" || msg.sender === "interviewer";
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 18 }}
              className={cn("flex w-full mb-space-2", isAI ? "justify-start" : "justify-end")}
            >
              {isAI ? (
                <div className="max-w-[85%] md:max-w-[70%]">
                  <Panel className="p-space-4 border-l-2 border-l-accent-focus rounded-sm">
                    <div className="text-sm text-text-primary leading-relaxed font-body font-medium select-text break-words">
                      {renderMessageText(msg.text)}
                    </div>
                    <span className="text-[8px] text-text-muted font-mono font-bold mt-space-2.5 block text-right">
                      {msg.timestamp}
                    </span>
                  </Panel>
                </div>
              ) : (
                <div className="max-w-[85%] md:max-w-[70%]">
                  <div className="p-space-4 rounded-sm bg-surface-raised border border-hairline text-text-primary shadow-md">
                    <div className="text-sm leading-relaxed font-body font-medium select-text break-words">
                      {renderMessageText(msg.text)}
                    </div>
                    <span className="text-[8px] text-text-muted font-mono font-bold mt-space-2.5 block text-right">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex justify-start w-full mb-space-2"
          >
            <div className="max-w-[100px]">
              <div className="flex gap-space-2 items-center py-space-2 px-space-3 bg-surface-raised border border-hairline rounded-sm">
                <span
                  className="w-1.5 h-1.5 bg-accent-focus rounded-full animate-pulse"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-accent-focus rounded-full animate-pulse"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-accent-focus rounded-full animate-pulse"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex justify-center py-space-2"
          >
            <div className="bg-accent-focus/10 border border-accent-focus/30 text-text-primary text-xs px-space-4 py-space-3 rounded-sm flex items-center gap-space-3 font-mono">
              <span className="font-semibold">{error}</span>
              <button
                onClick={onRetry}
                className="text-accent-focus hover:text-text-primary bg-accent-focus/10 hover:bg-accent-focus/20 px-space-2.5 py-space-1 rounded-sm border border-accent-focus/20 font-bold transition-all cursor-pointer"
              >
                Retry
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={bottomRef} />
    </div>
  );
}
