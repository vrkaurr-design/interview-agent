"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { cn } from "../../lib/utils";

interface InputBoxProps {
    onSend: (text: string) => void;
    isLoading: boolean;
    done: boolean;
}

export default function InputBox({ onSend, isLoading, done }: InputBoxProps) {
    const [text, setText] = useState("");
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
    };

    return (
        <div className="absolute bottom-6 left-0 right-0 px-4 md:px-8 z-30 select-none">
            <div className={cn(
                "max-w-4xl mx-auto bg-black/70 border border-white/10 rounded-2xl p-2 flex items-end gap-3 shadow-2xl backdrop-blur-xl relative transition-all duration-300",
                isLoading && "animate-pulse border-primary/30 shadow-[0_0_20px_rgba(109,94,245,0.1)]"
            )}>
                <textarea
                    ref={textareaRef}
                    rows={1}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading || done}
                    placeholder={done ? "Interview session completed" : isLoading ? "AI is reviewing input..." : "Type your answer..."}
                    className="flex-1 bg-transparent max-h-40 min-h-[44px] resize-none outline-none py-3 px-3.5 text-sm text-slate-100 placeholder-slate-500 overflow-y-auto custom-scrollbar focus:ring-0 disabled:opacity-50"
                />

                <button
                    onClick={handleSubmit}
                    disabled={text.trim() === "" || isLoading || done}
                    className={cn(
                        "p-3 rounded-xl transition-all cursor-pointer shrink-0 mb-0.5",
                        text.trim() !== "" && !isLoading && !done
                            ? "bg-primary text-white shadow-lg hover:scale-105"
                            : "bg-white/5 text-slate-550 pointer-events-none"
                    )}
                >
                    <Send className="w-4.5 h-4.5" />
                </button>
            </div>
        </div>
    );
}
