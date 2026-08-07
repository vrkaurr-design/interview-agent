"use client";

import React, { useEffect, useRef } from "react";
import { InterviewMessage } from "../../lib/types";
import { motion, AnimatePresence } from "framer-motion";
import GlassPanel from "../shared/GlassPanel";
import { cn } from "../../lib/utils";

interface ChatAreaProps {
    messages: InterviewMessage[];
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
}

export default function ChatArea({ messages, isLoading, error, onRetry }: ChatAreaProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    return (
        <div
            className="flex-1 overflow-y-auto px-4 py-6 space-y-6 flex flex-col custom-scrollbar pb-24"
            aria-live="polite"
        >
            <AnimatePresence initial={false}>
                {messages.map((msg) => {
                    const isAI = msg.sender === "ai" || msg.sender === "interviewer";
                    return (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", stiffness: 120, damping: 14 }}
                            className={cn(
                                "flex w-full mb-2",
                                isAI ? "justify-start" : "justify-end"
                            )}
                        >
                            {isAI ? (
                                <div className="max-w-[85%] md:max-w-[70%]">
                                    <GlassPanel className="p-4 rounded-t-2xl rounded-br-2xl rounded-bl-sm border border-primary/20 bg-primary/5 shadow-md">
                                        <p className="text-sm text-slate-100 leading-relaxed font-medium select-text break-words">
                                            {msg.text}
                                        </p>
                                        <span className="text-[9px] text-slate-500 font-semibold mt-2.5 block text-right">
                                            {msg.timestamp}
                                        </span>
                                    </GlassPanel>
                                </div>
                            ) : (
                                <div className="max-w-[85%] md:max-w-[70%]">
                                    <div className="p-4 rounded-t-2xl rounded-bl-2xl rounded-br-sm bg-black/60 border border-white/10 text-slate-200 shadow-md">
                                        <p className="text-sm leading-relaxed select-text break-words font-medium">
                                            {msg.text}
                                        </p>
                                        <span className="text-[9px] text-slate-500 font-semibold mt-2.5 block text-right">
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
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-start w-full mb-2"
                    >
                        <div className="max-w-[120px]">
                            <GlassPanel className="p-3.5 rounded-t-2xl rounded-br-2xl rounded-bl-sm border border-primary/20 bg-primary/5 flex items-center justify-center">
                                <div className="flex gap-1.5 items-center py-1">
                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-2 h-2 bg-primary/80 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-2 h-2 bg-primary/55 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </GlassPanel>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full flex justify-center py-2"
                    >
                        <div className="bg-caution/10 border border-caution/30 text-slate-200 text-xs px-4 py-3 rounded-xl flex items-center gap-3">
                            <span className="font-semibold">{error}</span>
                            <button
                                onClick={onRetry}
                                className="text-caution hover:text-white bg-caution/15 hover:bg-caution/25 px-2.5 py-1 rounded-lg border border-caution/20 font-bold transition-all cursor-pointer"
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
