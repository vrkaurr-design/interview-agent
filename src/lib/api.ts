import { Candidate, InterviewMessage, InterviewFeedback } from "./types";
import candidatesData from "../data/candidates.json";

export interface StartPayload {
    sessionId: string;
    candidate: Candidate;
}

export interface TurnPayload {
    sessionId: string;
    message: string;
}

export interface InterviewResponse {
    reply: string;
    done: boolean;
    feedback?: InterviewFeedback | null;
    latency?: number;
}

const candidates = candidatesData as Candidate[];

export const api = {
    getCandidates: async (): Promise<Candidate[]> => {
        return candidates;
    },
    getCandidateById: async (id: string): Promise<Candidate | null> => {
        return candidates.find(c => c.id === id) || null;
    },
    getCurriculum: async () => {
        return null;
    },
    saveFeedback: async (feedback: any) => {
        return { success: true };
    },
    postInterviewTurn: async (payload: StartPayload | TurnPayload): Promise<InterviewResponse> => {
        const start = performance.now();
        const res = await fetch("/api/interview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            throw new Error(`API error: ${res.statusText}`);
        }
        const data = await res.json();
        const latency = Math.round(performance.now() - start);
        return { ...data, latency };
    }
};
