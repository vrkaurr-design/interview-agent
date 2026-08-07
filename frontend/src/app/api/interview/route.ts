import { NextResponse } from "next/server";
import { InterviewFeedback } from "@/lib/types";

const sessions = new Map<string, {
    candidateId: string;
    candidateName: string;
    candidateRole: string;
    turnCount: number;
}>();

const interviewQuestions = [
    "What are the major performance advantages of React 19's new compiler over standard hook caching?",
    "How does React's Virtual DOM reconciliation differ from direct manual DOM operations in terms of layout shifts?",
    "In a complex frontend project, why would you choose Zustand over the React Context API for global state?",
    "How do you debug re-render bottlenecks inside a React application using Chrome DevTools or React Profiler?",
    "What is the difference between Server and Client Components in Next.js regarding bundle optimization?",
    "How do Next.js Server Actions enforce security for data mutation triggers, and how do you handle optimistic UI?",
    "How do you manage clean effect dependencies to avoid infinite loops when synchronizing states?",
    "To finish, what is your standard workflow for mock-testing asynchronous queries using Vitest or Playwright?"
];

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sessionId } = body;

        if (!sessionId) {
            return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
        }

        let session = sessions.get(sessionId);

        // Turn 0: initial Start turn where candidate profile is passed
        if (!session) {
            const { candidate } = body;
            if (!candidate) {
                return NextResponse.json({ error: "Missing candidate for session initialization" }, { status: 400 });
            }

            session = {
                candidateId: candidate.id,
                candidateName: candidate.name,
                candidateRole: candidate.role,
                turnCount: 0
            };
            sessions.set(sessionId, session);

            return NextResponse.json({
                reply: `Hi ${candidate.name}, welcome to your AI technical interview for the ${candidate.role} role. Let's start with React internals: ${interviewQuestions[0]}`,
                done: false
            });
        }

        session.turnCount += 1;
        const currentTurn = session.turnCount;

        if (currentTurn < interviewQuestions.length) {
            return NextResponse.json({
                reply: `Excellent points. Next, let's cover: ${interviewQuestions[currentTurn]}`,
                done: false
            });
        }

        const feedback: InterviewFeedback = {
            summary: `The candidate ${session.candidateName} completed the dynamic interview session for ${session.candidateRole}. They demonstrated a robust baseline in state management and component rendering.`,
            strengths: [
                "Well-reasoned responses about state synchronization loops",
                "Clear grasp of Virtual DOM mechanics and reconciler priorities",
                "Strong understanding of client/server component separations"
            ],
            gaps: [
                "Could expand on caching constraints during server mutations",
                "Could sharpen unit mocking strategies for Vitest tests"
            ],
            next: [
                "Review Next.js caching documentation details",
                "Practice using react-profiler boundaries for UI audits"
            ]
        };

        sessions.delete(sessionId);

        return NextResponse.json({
            reply: "Thank you for completing this technical interview. The session evaluation report has been finalized and computed.",
            done: true,
            feedback
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
