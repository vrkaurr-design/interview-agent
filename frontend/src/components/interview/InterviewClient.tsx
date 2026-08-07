"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./Header";
import ProfileSidebar from "./ProfileSidebar";
import ChatArea from "./ChatArea";
import CoverageSidebar from "./CoverageSidebar";
import InputBox from "./InputBox";
import StatusBar from "./StatusBar";
import { useInterviewSession } from "../../hooks/useInterviewSession";
import { useFeedbackStore } from "../../hooks/useFeedbackStore";
import { useApertureStore } from "../shared/Background3D";
import { Candidate } from "../../lib/types";

interface InterviewClientProps {
    candidate: Candidate;
    initialSessionId: string | null;
}

export default function InterviewClient({ candidate, initialSessionId }: InterviewClientProps) {
    const router = useRouter();
    const {
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
    } = useInterviewSession(candidate.id, initialSessionId);

    const [leftCollapsed, setLeftCollapsed] = useState(false);
    const [leftOpenMobile, setLeftOpenMobile] = useState(false);
    const [rightOpenMobile, setRightOpenMobile] = useState(false);

    // Compute live coverage percentage based on 6 total modules
    const totalModules = 6;
    const coveragePercent = Math.min(100, Math.round((coveredModules.length / totalModules) * 100));

    useEffect(() => {
        useApertureStore.getState().setOpenness(coveragePercent / 100);
    }, [coveragePercent]);

    useEffect(() => {
        initializeSession(candidate);
    }, [candidate, initializeSession]);

    useEffect(() => {
        if (done && feedback) {
            const sessionData = {
                feedback,
                candidateId: candidate.id,
                modulesCovered: coveredModules,
                questionCount,
                totalQuestions: 8,
                daysCoveredCount: coveredDays.length,
                totalDaysCovered: 4,
            };

            useFeedbackStore.getState().setFeedbackSession(sessionId, sessionData);

            try {
                sessionStorage.setItem(`feedback-${sessionId}`, JSON.stringify(sessionData));
            } catch (e) {
                console.error("sessionStorage write failed:", e);
            }

            const timer = setTimeout(() => {
                router.push(`/feedback/${sessionId}`);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [done, feedback, sessionId, questionCount, coveredDays, coveredModules, candidate.id, router]);

    const handleEndInterview = () => {
        const fallbackFeedback = {
            summary: "Interview concluded early by evaluator. Candidate details saved.",
            strengths: ["Evaluated topics parsed successfully"],
            gaps: ["Evaluation incomplete"],
            next: ["Schedule follow-up review"],
        };

        const sessionData = {
            feedback: fallbackFeedback,
            candidateId: candidate.id,
            modulesCovered: coveredModules,
            questionCount,
            totalQuestions: 8,
            daysCoveredCount: coveredDays.length,
            totalDaysCovered: 4,
        };

        useFeedbackStore.getState().setFeedbackSession(sessionId, sessionData);

        try {
            sessionStorage.setItem(`feedback-${sessionId}`, JSON.stringify(sessionData));
        } catch (e) {
            console.error("sessionStorage write failed:", e);
        }

        router.push(`/feedback/${sessionId}`);
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-transparent relative z-10">
            <Header
                candidate={candidate}
                isLoading={isLoading}
                onEndInterview={handleEndInterview}
                onToggleLeft={() => setLeftOpenMobile((prev) => !prev)}
                onToggleRight={() => setRightOpenMobile((prev) => !prev)}
                done={done}
            />

            <div className="flex-1 flex overflow-hidden relative">
                <ProfileSidebar
                    candidate={candidate}
                    isCollapsed={leftCollapsed}
                    onToggleCollapse={() => setLeftCollapsed((p) => !p)}
                    isOpenMobile={leftOpenMobile}
                    onCloseMobile={() => setLeftOpenMobile(false)}
                />

                <div className="flex-1 flex flex-col min-h-0 relative bg-black/20">
                    <ChatArea
                        messages={messages}
                        isLoading={isLoading}
                        error={error}
                        onRetry={retry}
                    />

                    <InputBox
                        onSend={sendMessage}
                        isLoading={isLoading}
                        done={done}
                    />
                </div>

                <CoverageSidebar
                    questionCount={questionCount}
                    coveredDays={coveredDays}
                    coveredModules={coveredModules}
                    coverage={coveragePercent}
                    isOpenMobile={rightOpenMobile}
                    onCloseMobile={() => setRightOpenMobile(false)}
                />
            </div>

            <StatusBar
                latency={latency}
                turnCount={messages.filter((m) => m.sender === "candidate").length}
                isLoading={isLoading}
            />
        </div>
    );
}
