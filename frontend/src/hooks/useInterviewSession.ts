"use client";

import { useState, useCallback, useRef } from "react";
import { api } from "../lib/api";
import { InterviewMessage, InterviewFeedback, Candidate, CurriculumDay } from "../lib/types";
import curriculumData from "../data/curriculum.json";

const curriculum = curriculumData.days as CurriculumDay[];

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

export function useInterviewSession(candidateId: string, initialSessionId: string | null) {
    const [sessionId] = useState(() => initialSessionId || `sess-${Date.now()}`);
    const [messages, setMessages] = useState<InterviewMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [latency, setLatency] = useState(0);

    const lastSentTextRef = useRef<string>("");
    const isInitializedRef = useRef(false);

    const [coveredDays, setCoveredDays] = useState<number[]>([]);
    const [coveredModules, setCoveredModules] = useState<string[]>([]);
    const [questionCount, setQuestionCount] = useState(0);

    const moduleForDay = useCallback((day: number) => {
        if (day <= 3) return "Environment & Tooling";
        if (day <= 6) return "Data Foundations";
        if (day <= 10) return "Embeddings & Vector Search";
        if (day <= 15) return "LLM Core, Prompting & Fine-Tuning";
        if (day <= 20) return "Chatbot Application Build";
        if (day <= 24) return "Agentic AI & MCP";
        if (day <= 28) return "Evaluation, Security & Deployment";
        return "Production & Capstone";
    }, []);

    const addDayCoverage = useCallback((day: number) => {
        setCoveredDays((prev) => Array.from(new Set([...prev, day])));
        setCoveredModules((prev) => Array.from(new Set([...prev, moduleForDay(day)])));
    }, [moduleForDay]);

    const evaluateCoverage = useCallback((text: string, dayFocus?: number) => {
        if (dayFocus) {
            addDayCoverage(dayFocus);
            return;
        }

        const matchedDays = new Set<number>();
        const matchedModules = new Set<string>();

        curriculum.forEach((item) => {
            const searchStr = `${item.topic} ${item.description}`.toLowerCase();
            const textLower = text.toLowerCase();

            const wordsToSearch = item.topic
                .split(/[&\s\-]+/)
                .map((w) => w.trim().toLowerCase())
                .filter((w) => w.length > 2);

            const isMatch =
                wordsToSearch.some((word) => textLower.includes(word)) ||
                textLower.includes(item.topic.toLowerCase());

            if (isMatch) {
                matchedDays.add(item.day);

                if (searchStr.includes("render") || searchStr.includes("dom") || searchStr.includes("hooks")) {
                    matchedModules.add("React Hooks & Rendering");
                } else if (searchStr.includes("zustand") || searchStr.includes("context") || searchStr.includes("state")) {
                    matchedModules.add("State Management");
                } else if (searchStr.includes("route") || searchStr.includes("component") || searchStr.includes("actions") || searchStr.includes("server")) {
                    matchedModules.add("Next.js Routing & RSCs");
                } else if (
                    searchStr.includes("three") ||
                    searchStr.includes("r3f") ||
                    searchStr.includes("particle") ||
                    searchStr.includes("webgl")
                ) {
                    matchedModules.add("Graphics (Three.js)");
                } else if (searchStr.includes("test") || searchStr.includes("vitest") || searchStr.includes("playwright")) {
                    matchedModules.add("Testing & Integration");
                } else {
                    matchedModules.add("Architecture & Builds");
                }
            }
        });

        setCoveredDays((prev) => Array.from(new Set([...prev, ...matchedDays])));
        setCoveredModules((prev) => Array.from(new Set([...prev, ...matchedModules])));
    }, [addDayCoverage]);

    const initializeSession = useCallback(async (candidate: Candidate) => {
        if (isInitializedRef.current) return;
        isInitializedRef.current = true;

        setIsLoading(true);
        setError(null);
        try {
            const response = await api.postInterviewTurn({
                sessionId,
                candidate,
            });

            const initialMessage: InterviewMessage = {
                id: `ai-${Date.now()}`,
                sender: "ai",
                text: response.reply,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };

            setMessages([initialMessage]);
            setQuestionCount(1);
            evaluateCoverage(response.reply, response.dayFocus);
            if (response.latency) setLatency(response.latency);
        } catch (err: unknown) {
            isInitializedRef.current = false;
            setError(getErrorMessage(err, "Failed to initiate session. Please check connection."));
        } finally {
            setIsLoading(false);
        }
    }, [sessionId, evaluateCoverage]);

    const sendMessage = useCallback(async (text: string) => {
        if (isLoading || done) return;

        setError(null);
        setIsLoading(true);
        lastSentTextRef.current = text;

        const userMsg: InterviewMessage = {
            id: `user-${Date.now()}`,
            sender: "candidate",
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, userMsg]);

        try {
            const response = await api.postInterviewTurn({
                sessionId,
                message: text,
            });

            const replyMsg: InterviewMessage = {
                id: `ai-${Date.now()}`,
                sender: "ai",
                text: response.reply,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };

            setMessages((prev) => [...prev, replyMsg]);
            setQuestionCount((q) => q + 1);
            evaluateCoverage(response.reply, response.dayFocus);
            if (response.latency) setLatency(response.latency);

            if (response.done) {
                setDone(true);
                if (response.feedback) {
                    setFeedback(response.feedback);
                }
            }
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Message delivery failed."));
        } finally {
            setIsLoading(false);
        }
    }, [sessionId, isLoading, done, evaluateCoverage]);

    const retry = useCallback(async () => {
        if (!lastSentTextRef.current) return;
        sendMessage(lastSentTextRef.current);
    }, [sendMessage]);

    return {
        messages,
        sessionId,
        isLoading,
        done,
        feedback,
        error,
        latency,
        sendMessage,
        retry,
        coveredDays,
        coveredModules,
        questionCount,
        initializeSession,
    };
}
