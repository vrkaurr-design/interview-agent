"use client";

import React, { useState, useMemo } from "react";
import Panel from "../../components/shared/ui/Panel";
import StatusChip from "../../components/shared/ui/StatusChip";
import curriculumData from "../../data/curriculum.json";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface CurriculumDay {
  day: number;
  topic: string;
  description: string;
  durationMinutes: number;
}

const getCompetency = (topic: string, description: string) => {
  const searchStr = `${topic} ${description}`.toLowerCase();
  if (searchStr.includes("render") || searchStr.includes("dom") || searchStr.includes("hooks")) {
    return "React Hooks & Rendering";
  } else if (searchStr.includes("zustand") || searchStr.includes("context") || searchStr.includes("state")) {
    return "State Management";
  } else if (searchStr.includes("route") || searchStr.includes("component") || searchStr.includes("actions") || searchStr.includes("server")) {
    return "Next.js Routing & RSCs";
  } else if (
    searchStr.includes("three") ||
    searchStr.includes("r3f") ||
    searchStr.includes("particle") ||
    searchStr.includes("webgl")
  ) {
    return "Graphics (Three.js)";
  } else if (searchStr.includes("test") || searchStr.includes("vitest") || searchStr.includes("playwright")) {
    return "Testing & Integration";
  } else {
    return "Architecture & Builds";
  }
};

const competenciesList = [
  "React Hooks & Rendering",
  "State Management",
  "Next.js Routing & RSCs",
  "Graphics (Three.js)",
  "Testing & Integration",
  "Architecture & Builds",
];

export default function QuestionsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const curriculum = curriculumData.days as CurriculumDay[];

  const questions = useMemo(() => {
    return curriculum.map((q) => ({
      ...q,
      competency: getCompetency(q.topic, q.description),
    }));
  }, [curriculum]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchSearch =
        search.trim() === "" ||
        q.topic.toLowerCase().includes(search.toLowerCase()) ||
        q.description.toLowerCase().includes(search.toLowerCase());

      const matchCategory = !selectedCategory || q.competency === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [questions, search, selectedCategory]);

  const getStatusType = (comp: string) => {
    switch (comp) {
      case "React Hooks & Rendering":
        return "focus";
      case "State Management":
        return "resolve";
      case "Next.js Routing & RSCs":
        return "confirm";
      case "Graphics (Three.js)":
        return "focus";
      case "Testing & Integration":
        return "resolve";
      default:
        return "confirm";
    }
  };

  const handleClear = () => {
    setSearch("");
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen text-text-primary px-space-6 py-space-8 md:py-space-16 max-w-6xl mx-auto overflow-y-auto relative z-10 flex flex-col gap-space-8 pb-20 select-text">
      {/* Header */}
      <div className="border-b border-hairline pb-space-6">
        <StatusChip status="confirm" label="Curriculum Bank" />
        <h1 className="text-3xl md:text-5xl font-display text-text-primary mt-space-3.5 tracking-wide leading-none select-none">
          EVALUATOR QUESTION BANK
        </h1>
        <p className="text-xs text-text-muted font-body font-semibold mt-1 select-none uppercase tracking-wider">
          Browse active topics mapped to developer paths.
        </p>
      </div>

      {/* Filter Section */}
      <div className="sticky top-4 z-30 w-full mb-space-4">
        <Panel className="p-space-4 md:p-space-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-4 border-b border-hairline pb-space-3 mb-space-4">
            <div className="flex items-center gap-space-2">
              <SlidersHorizontal className="w-4 h-4 text-accent-focus" />
              <h2 className="font-body text-xs font-semibold text-text-primary tracking-wider uppercase">
                Filter Curriculum Matrix
              </h2>
            </div>
            {(search !== "" || selectedCategory !== null) && (
              <button
                onClick={handleClear}
                className="self-end md:self-auto text-[10px] font-mono font-bold text-accent-resolve hover:text-text-primary flex items-center gap-space-1.5 bg-accent-resolve/10 hover:bg-accent-resolve/20 px-space-3 py-1 border border-accent-resolve/20 rounded-sm transition-all cursor-pointer"
              >
                Clear Filters
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-6">
            {/* Input Search */}
            <div className="relative">
              <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-space-2 font-body">
                Search Topic or Description
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter by keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent border-b border-hairline py-space-2 pl-space-8 pr-space-8 text-sm text-text-primary placeholder-text-muted/40 focus:outline-none focus:border-accent-focus transition-all"
                />
                <Search className="w-4 h-4 text-text-muted absolute left-1 top-2.5" />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-1 top-2.5 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-space-2 font-body">
                Filter by Competency Area
              </label>
              <div className="flex gap-space-2 overflow-x-auto pb-space-2 max-w-full scrollbar-none custom-scrollbar">
                {competenciesList.map((comp) => {
                  const isActive = selectedCategory === comp;
                  return (
                    <button
                      key={comp}
                      onClick={() => setSelectedCategory(isActive ? null : comp)}
                      className="shrink-0 focus:outline-none cursor-pointer"
                    >
                      {isActive ? (
                        <StatusChip status={getStatusType(comp)} label={comp} />
                      ) : (
                        <span className="inline-flex items-center px-space-2 py-[2px] rounded-sm text-[10px] font-semibold border border-hairline text-text-muted hover:text-text-primary transition-all">
                          {comp}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* Roster count readout */}
      <div className="text-[10px] font-mono font-bold text-text-muted self-end select-none">
        MATCHED <span className="text-accent-focus font-extrabold">{filteredQuestions.length}</span> / {questions.length} TOPICS
      </div>

      {/* Grid of panels */}
      {filteredQuestions.length === 0 ? (
        <Panel className="flex flex-col items-center justify-center p-space-12 text-center">
          <p className="text-text-muted text-sm font-semibold uppercase tracking-wider font-body">
            No curriculum topics match your current filter query.
          </p>
        </Panel>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-6">
          {filteredQuestions.map((q) => (
            <Panel
              key={q.day}
              className="p-space-6 flex flex-col justify-between border border-hairline hover:border-accent-focus/40 transition-colors duration-300 relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between gap-space-4">
                  <span className="text-xs font-mono font-bold text-accent-focus">
                    DAY {q.day.toString().padStart(2, "0")}
                  </span>
                  <StatusChip status={getStatusType(q.competency)} label={q.competency} />
                </div>
                <h3 className="font-semibold text-text-primary text-base font-body tracking-wide mt-space-3">
                  {q.topic}
                </h3>
                <p className="text-xs text-text-muted font-body leading-relaxed mt-space-2">
                  {q.description}
                </p>
              </div>
              <div className="mt-space-6 pt-space-3 border-t border-hairline text-[9px] font-mono font-bold text-text-muted">
                ESTIMATED_DURATION: {q.durationMinutes} MIN
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
