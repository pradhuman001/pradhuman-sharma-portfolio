"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import BuilderNavbar from "../components/BuilderNavbar";
import PaymentModal from "../components/PaymentModal";
import { usePortfolioStore } from "../store/portfolioStore";

export default function PricingPage() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const {
    portfolioData,
    currentPortfolioId,
    isCurrentPortfolioPaid,
    unlockPaidAccessForCurrentPortfolio,
    saveCurrentPortfolio,
  } = usePortfolioStore();
  const isPaidUnlocked = isCurrentPortfolioPaid();
  const previewHref = "/preview";

  const handleOpenPayment = () => {
    saveCurrentPortfolio();
    setIsPaymentOpen(true);
  };

  return (
    <main className="min-h-screen bg-black px-6 pb-16 pt-28 text-white">
      <BuilderNavbar />

      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-400">
            Pricing
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Free to build, Rs. 5 per portfolio to export and deploy
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Build and preview portfolios for free. Pay once to unlock Download Code,
            GitHub Push, and Deploy actions.
          </p>
          <Link
            href={previewHref}
            className="mt-6 inline-flex rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Preview portfolio for free
          </Link>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-[0_20px_100px_rgba(17,24,39,0.4)]"
        >
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="text-2xl font-bold">PortfolioAI Unlock</h2>
              <p className="mt-2 text-zinc-400">
                Pay Rs. 5 to unlock export and deployment for this portfolio.
              </p>

              <div className="mt-6 space-y-3 text-sm text-zinc-300">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
                  1. Build portfolio: Free
                </div>
                <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
                  2. Preview portfolio: Free
                </div>
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  3. Download, GitHub Push, Deploy: Requires Rs. 5 unlock
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/15 to-cyan-500/10 p-6">
              <p className="text-sm uppercase tracking-wide text-emerald-300">Single plan</p>
              <p className="mt-4 text-5xl font-black">Rs. 5</p>
              <p className="mt-3 text-sm text-zinc-300">
                One-time unlock for premium actions
              </p>
              <button
                onClick={handleOpenPayment}
                className="mt-8 w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                {isPaidUnlocked ? "This portfolio is unlocked" : "Unlock Export & Deploy"}
              </button>
            </div>
          </div>
        </motion.section>
      </div>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        title="Unlock premium actions for Rs. 5"
        message="Pay Rs. 5 to export or deploy this portfolio. After payment, GitHub push, Deploy, and Download Code will be enabled for this portfolio."
        ctaLabel="Secure Payment (Rs. 5)"
        portfolioReference={
          currentPortfolioId || portfolioData.username || portfolioData.fullName || "portfolio"
        }
        onPaymentSuccess={unlockPaidAccessForCurrentPortfolio}
        isUnlocked={isPaidUnlocked}
      />
    </main>
  );
}
