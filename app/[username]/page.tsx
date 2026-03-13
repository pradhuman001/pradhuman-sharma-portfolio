"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { usePortfolioStore } from "../store/portfolioStore";
import PreviewHero from "../components/preview/PreviewHero";
import PreviewAbout from "../components/preview/PreviewAbout";
import PreviewSkills from "../components/preview/PreviewSkills";
import PreviewProjects from "../components/preview/PreviewProjects";
import PreviewExperience from "../components/preview/PreviewExperience";
import PreviewEducation from "../components/preview/PreviewEducation";
import PreviewAchievements from "../components/preview/PreviewAchievements";
import PreviewContact from "../components/preview/PreviewContact";
import PreviewFooter from "../components/preview/PreviewFooter";
import { SavedPortfolio } from "../types/portfolio";

export default function UsernamePortfolioPage() {
  const params = useParams<{ username: string }>();
  const { savedPortfolios } = usePortfolioStore();

  const selectedPortfolio = useMemo(() => {
    const username = (params.username || "").toLowerCase();
    return savedPortfolios.find(
      (portfolio: SavedPortfolio) =>
        portfolio.username.toLowerCase() === username
    );
  }, [params.username, savedPortfolios]);

  if (!selectedPortfolio) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <h1 className="text-2xl font-bold">Portfolio not found</h1>
          <p className="mt-2 text-zinc-400">No portfolio exists for this username yet.</p>
        </div>
      </main>
    );
  }

  return (
    <div style={{ backgroundColor: selectedPortfolio.theme.mode === "dark" ? "#0a0a0a" : "#ffffff", color: selectedPortfolio.theme.mode === "dark" ? "#ffffff" : "#0a0a0a" }}>
      <PreviewHero data={selectedPortfolio.data} theme={selectedPortfolio.theme} />
      <PreviewAbout data={selectedPortfolio.data} theme={selectedPortfolio.theme} />
      <PreviewSkills data={selectedPortfolio.data} theme={selectedPortfolio.theme} />
      <PreviewProjects data={selectedPortfolio.data} theme={selectedPortfolio.theme} />
      <PreviewExperience data={selectedPortfolio.data} theme={selectedPortfolio.theme} />
      <PreviewEducation data={selectedPortfolio.data} theme={selectedPortfolio.theme} />
      <PreviewAchievements data={selectedPortfolio.data} theme={selectedPortfolio.theme} />
      <PreviewContact data={selectedPortfolio.data} theme={selectedPortfolio.theme} />
      <PreviewFooter data={selectedPortfolio.data} theme={selectedPortfolio.theme} />
    </div>
  );
}
