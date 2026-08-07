import { create } from "zustand";
import { InterviewFeedback } from "../lib/types";

interface FeedbackSession {
    feedback: InterviewFeedback;
    candidateId: string;
    modulesCovered: string[];
    questionCount: number;
    totalQuestions: number;
    daysCoveredCount: number;
    totalDaysCovered: number;
}

interface FeedbackStore {
    sessions: Record<string, FeedbackSession>;
    setFeedbackSession: (sessionId: string, session: FeedbackSession) => void;
    getFeedbackSession: (sessionId: string) => FeedbackSession | undefined;
}

export const useFeedbackStore = create<FeedbackStore>((set, get) => ({
    sessions: {},
    setFeedbackSession: (sessionId, session) => set((state) => ({
        sessions: {
            ...state.sessions,
            [sessionId]: session
        }
    })),
    getFeedbackSession: (sessionId) => get().sessions[sessionId],
}));
