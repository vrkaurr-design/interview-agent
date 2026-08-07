export interface Candidate {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  experience: string;
  status: 'passed' | 'failed' | 'pending' | 'scheduled';
  score?: number; // 0-100 overall score
  email?: string;
  matchScore?: number;

  cohortProgress: number;
  completedMissions: {
    module: string;
    completed: boolean;
  }[];
  learningSignals: {
    engagement: 'Low' | 'Medium' | 'High';
    strengths: string[];
    gaps: string[];
  };
  skippedTopicsCount: number;
}

export interface CurriculumDay {
  day: number;
  topic: string;
  description: string;
  durationMinutes: number;
}

export interface Curriculum {
  id: string;
  title: string;
  days: CurriculumDay[];
}

export interface InterviewMessage {
  id: string;
  sender: 'candidate' | 'interviewer' | 'ai';
  text: string;
  timestamp: string;
}

export interface InterviewFeedback {
  summary: string;
  strengths: string[];
  gaps: string[];
  next: string[]; // next steps / recommendations
}
