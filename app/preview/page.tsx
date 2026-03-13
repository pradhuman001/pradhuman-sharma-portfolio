"use client";

import { useEffect, useState } from "react";
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
import DeployModal from "../components/DeployModal";
import GitHubModal from "../components/GitHubModal";
import PaymentModal from "../components/PaymentModal";
import ScrollProgress from "../components/ScrollProgress";
import { Button } from "../components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";
import { downloadPortfolioCode } from "../utils/exportUtils";

type PaidAction = "download" | "github" | "deploy" | null;

export default function PreviewPage() {
  const {
    portfolioData,
    themeConfig,
    currentPortfolioId,
    isCurrentPortfolioPaid,
    unlockPaidAccessForCurrentPortfolio,
    saveCurrentPortfolio,
  } = usePortfolioStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<PaidAction>(null);
  const isPaidUnlocked = isCurrentPortfolioPaid();

  useEffect(() => {
    saveCurrentPortfolio();
  }, [saveCurrentPortfolio]);

  const bgColor = themeConfig.mode === "dark" ? "#0a0a0a" : "#ffffff";
  const textColor = themeConfig.mode === "dark" ? "#ffffff" : "#0a0a0a";

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadPortfolioCode(portfolioData, themeConfig);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePaidAction = async (action: Exclude<PaidAction, null>) => {
    if (!isPaidUnlocked) {
      setPendingAction(action);
      return;
    }

    if (action === "download") {
      await handleDownload();
      return;
    }

    if (action === "github") {
      setShowGitHubModal(true);
      return;
    }

    setShowDeployModal(true);
  };

  const handleUnlockSuccess = async () => {
    unlockPaidAccessForCurrentPortfolio();

    if (pendingAction === "download") {
      await handleDownload();
    } else if (pendingAction === "github") {
      setShowGitHubModal(true);
    } else if (pendingAction === "deploy") {
      setShowDeployModal(true);
    }

    setPendingAction(null);
  };

  return (
    <div style={{ backgroundColor: bgColor, color: textColor }}>
      <ScrollProgress />

      {/* Floating action bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/80 px-6 py-3 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-lg font-bold text-white">
            ← Back to Editor
          </Link>
          <div className="flex gap-3">
            {!isPaidUnlocked && (
              <span className="hidden items-center rounded-full border border-amber-500/30 bg-amber-500/15 px-3 text-xs font-medium text-amber-300 sm:flex">
                Pay Rs. 5 to export or deploy
              </span>
            )}
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => void handlePaidAction("download")}
              disabled={isDownloading}
            >
              {isDownloading ? "Downloading..." : "Download Code"}
            </Button>
            <button
              onClick={() => void handlePaidAction("github")}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors border border-gray-600"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Push to GitHub
            </button>
            <Button size="sm" onClick={() => void handlePaidAction("deploy")}>
              Deploy
            </Button>
          </div>
        </div>
      </motion.div>

      <PaymentModal
        isOpen={pendingAction !== null}
        onClose={() => setPendingAction(null)}
        title="Unlock export and deploy for Rs. 5"
        message="Pay Rs. 5 to export or deploy your portfolio. After payment, GitHub push, Deploy, and Download Code will be enabled."
        ctaLabel="Pay Rs. 5 with Razorpay"
        portfolioReference={
          currentPortfolioId || portfolioData.username || portfolioData.fullName || "portfolio"
        }
        onPaymentSuccess={() => {
          void handleUnlockSuccess();
        }}
        isUnlocked={isPaidUnlocked}
      />

      {/* Deploy Modal */}
      <DeployModal 
        isOpen={showDeployModal} 
        onClose={() => setShowDeployModal(false)} 
      />

      {/* GitHub Modal */}
      <GitHubModal
        isOpen={showGitHubModal}
        onClose={() => setShowGitHubModal(false)}
      />

      {/* Portfolio Preview */}
      <PreviewHero data={portfolioData} theme={themeConfig} />
      <PreviewAbout data={portfolioData} theme={themeConfig} />
      <PreviewSkills data={portfolioData} theme={themeConfig} />
      <PreviewProjects data={portfolioData} theme={themeConfig} />
      <PreviewExperience data={portfolioData} theme={themeConfig} />
      <PreviewEducation data={portfolioData} theme={themeConfig} />
      <PreviewAchievements data={portfolioData} theme={themeConfig} />
      <PreviewContact data={portfolioData} theme={themeConfig} />
      <PreviewFooter data={portfolioData} theme={themeConfig} />
    </div>
  );
}
