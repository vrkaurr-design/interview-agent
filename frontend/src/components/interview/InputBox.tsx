"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Mic } from "lucide-react";
import { cn } from "../../lib/utils";

interface InputBoxProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  done: boolean;
}

export default function InputBox({ onSend, isLoading, done }: InputBoxProps) {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (text.trim() === "" || isLoading || done) return;
    onSend(text.trim());
    setText("");
    setIsRecording(false);
  };

  const handleToggleRecording = () => {
    if (isLoading || done) return;
    setIsRecording((prev) => !prev);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 select-none bg-background border-t border-hairline p-space-4">
      <div
        className={cn(
          "max-w-4xl mx-auto flex items-end gap-space-3 relative transition-all duration-300",
          isLoading && "animate-pulse"
        )}
      >
        {/* Mic toggle mock */}
        <button
          onClick={handleToggleRecording}
          disabled={isLoading || done}
          className={cn(
            "p-space-3 rounded-sm transition-all cursor-pointer shrink-0 mb-[3px] border",
            isRecording
              ? "text-accent-focus bg-accent-focus/10 border-accent-focus/25"
              : "text-text-muted hover:text-text-primary bg-surface-raised border-hairline"
          )}
          title="Toggle audio input"
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Text area input */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || done}
          placeholder={
            done
              ? "Interview session completed"
              : isLoading
              ? "AI is reviewing input..."
              : isRecording
              ? "Listening (mock)..."
              : "Type your answer..."
          }
          className="flex-1 bg-transparent max-h-40 min-h-[38px] resize-none outline-none py-space-2 px-space-3.5 text-sm text-text-primary placeholder-text-muted/40 overflow-y-auto custom-scrollbar focus:ring-0 disabled:opacity-50 border border-hairline rounded-sm"
        />

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={text.trim() === "" || isLoading || done}
          className={cn(
            "p-space-3 rounded-sm transition-all cursor-pointer shrink-0 mb-[3px] border",
            text.trim() !== "" && !isLoading && !done
              ? "bg-accent-focus/15 text-accent-focus border-accent-focus/30 hover:bg-accent-focus/25"
              : "bg-surface-raised border-hairline text-text-muted pointer-events-none"
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
