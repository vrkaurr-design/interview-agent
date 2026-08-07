import React from "react";
import Hero from "../../components/landing/Hero";
import StatCards from "../../components/landing/StatCards";
import SearchFilters from "../../components/landing/SearchFilters";
import CandidateGrid from "../../components/landing/CandidateGrid";
import Footer from "../../components/landing/Footer";

export default function LandingPage() {
    return (
        <div className="flex-1 flex flex-col w-full pb-8">
            <Hero />
            <StatCards />
            <SearchFilters />
            <CandidateGrid />
            <Footer />
        </div>
    );
}
