"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import BuilderNavbar from "../components/BuilderNavbar";
import { usePortfolioStore } from "../store/portfolioStore";

export default function PortfoliosPage() {
  const router = useRouter();
  const { savedPortfolios, loadSavedPortfolio, deleteSavedPortfolio } = usePortfolioStore();

  const handleEditPortfolio = (id: string) => {
    loadSavedPortfolio(id);
    router.push("/dashboard#builder-form");
  };

  const handleDeletePortfolio = (id: string) => {
    deleteSavedPortfolio(id);
  };

  return (
    <main className="min-h-screen bg-black px-6 pb-16 pt-28 text-white">
      <BuilderNavbar />
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">My Portfolios</h1>
          <p className="mt-2 text-zinc-400">View the portfolios you generated from the builder.</p>
        </div>

        {savedPortfolios.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
            <p className="text-lg font-medium text-white">No portfolios saved yet</p>
            <p className="mt-2 text-zinc-400">Generate a preview once and your portfolio will appear here.</p>
            <Link href="/dashboard#builder-form" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">
              Start a new project
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {savedPortfolios.map((portfolio) => (
              <div key={portfolio.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-xl font-semibold text-white">{portfolio.title}</h2>
                <p className="mt-2 text-sm text-zinc-400">{portfolio.profession || "Portfolio project"}</p>
                <p className="mt-1 text-xs text-cyan-400">portfolioai.com/{portfolio.username}</p>
                <p className="mt-3 text-xs text-zinc-500">Updated {new Date(portfolio.updatedAt).toLocaleString()}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleEditPortfolio(portfolio.id)}
                    className="rounded-full border border-white/15 px-4 py-2 text-sm text-white"
                  >
                    Edit Portfolio
                  </button>
                  <Link href={`/${portfolio.username}`} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
                    Preview Portfolio
                  </Link>
                  <button
                    onClick={() => handleDeletePortfolio(portfolio.id)}
                    className="rounded-full border border-rose-400/30 px-4 py-2 text-sm text-rose-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
