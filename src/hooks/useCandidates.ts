import { create } from "zustand";
import candidatesData from "../data/candidates.json";
import { Candidate } from "../lib/types";

const initialCandidates = candidatesData as Candidate[];

interface CandidatesState {
    candidates: Candidate[];
    searchQuery: string;
    selectedModules: string[];
    selectedEngagements: ('Low' | 'Medium' | 'High')[];
    minProgress: number;

    setSearchQuery: (query: string) => void;
    toggleModule: (moduleName: string) => void;
    toggleEngagement: (engagement: 'Low' | 'Medium' | 'High') => void;
    setMinProgress: (progress: number) => void;
    resetFilters: () => void;

    getFilteredCandidates: () => Candidate[];
}

export const useCandidatesStore = create<CandidatesState>((set, get) => ({
    candidates: initialCandidates,
    searchQuery: "",
    selectedModules: [],
    selectedEngagements: [],
    minProgress: 0,

    setSearchQuery: (query) => set({ searchQuery: query }),
    toggleModule: (moduleName) => set((state) => {
        const isSelected = state.selectedModules.includes(moduleName);
        return {
            selectedModules: isSelected
                ? state.selectedModules.filter(m => m !== moduleName)
                : [...state.selectedModules, moduleName]
        };
    }),
    toggleEngagement: (engagement) => set((state) => {
        const isSelected = state.selectedEngagements.includes(engagement);
        return {
            selectedEngagements: isSelected
                ? state.selectedEngagements.filter(e => e !== engagement)
                : [...state.selectedEngagements, engagement]
        };
    }),
    setMinProgress: (progress) => set({ minProgress: progress }),
    resetFilters: () => set({ searchQuery: "", selectedModules: [], selectedEngagements: [], minProgress: 0 }),

    getFilteredCandidates: () => {
        const { candidates, searchQuery, selectedModules, selectedEngagements, minProgress } = get();
        return candidates.filter((item) => {
            if (searchQuery.trim() !== "") {
                const query = searchQuery.toLowerCase();
                if (!item.name.toLowerCase().includes(query)) return false;
            }

            if (selectedModules.length > 0) {
                const candidateModules = item.completedMissions
                    .filter(m => m.completed)
                    .map(m => m.module);

                const hasMatch = selectedModules.some(m => candidateModules.includes(m));
                if (!hasMatch) return false;
            }

            if (selectedEngagements.length > 0) {
                if (!selectedEngagements.includes(item.learningSignals.engagement)) return false;
            }

            if (item.cohortProgress < minProgress) return false;

            return true;
        });
    }
}));
