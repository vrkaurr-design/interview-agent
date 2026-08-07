import React from "react";
import { notFound } from "next/navigation";
import { api } from "../../../lib/api";
import InterviewClient from "../../../components/interview/InterviewClient";

interface PageProps {
    params: Promise<{
        candidateId: string;
    }>;
    searchParams: Promise<{
        sessionId?: string;
    }>;
}

export default async function InterviewPage({ params, searchParams }: PageProps) {
    const { candidateId } = await params;
    const { sessionId } = await searchParams;

    const candidate = await api.getCandidateById(candidateId);
    if (!candidate) {
        notFound();
    }

    return (
        <InterviewClient
            candidate={candidate}
            initialSessionId={sessionId || null}
        />
    );
}
