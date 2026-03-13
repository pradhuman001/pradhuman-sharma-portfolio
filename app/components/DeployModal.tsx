"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeployModal({ isOpen, onClose }: DeployModalProps) {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);

  const handleVercelDeploy = () => {
    setIsDeploying(true);

    setTimeout(() => {
      setIsDeploying(false);
      setDeploySuccess(true);
      window.open("https://vercel.com/new", "_blank");
    }, 1200);
  };

  const handleNetlifyDeploy = () => {
    window.open("https://app.netlify.com/start", "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-zinc-500 hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="mb-2 text-2xl font-bold text-white">Deploy Your Portfolio</h2>
            <p className="mb-6 text-zinc-400">
              Choose a platform to deploy your portfolio. First, download code and push it to GitHub.
            </p>

            {isDeploying && (
              <div className="mb-5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-sm text-cyan-300">
                Preparing deployment workflow...
              </div>
            )}

            {deploySuccess && (
              <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
                Deployment flow launched successfully.
              </div>
            )}

            {/* Steps */}
            <div className="mb-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400">
                  1
                </div>
                <div>
                  <p className="font-medium text-white">Download the code</p>
                  <p className="text-sm text-zinc-500">Click &quot;Download Code&quot; to get your portfolio files</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400">
                  2
                </div>
                <div>
                  <p className="font-medium text-white">Push to GitHub</p>
                  <p className="text-sm text-zinc-500">Create a new repo and push your code</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400">
                  3
                </div>
                <div>
                  <p className="font-medium text-white">Deploy</p>
                  <p className="text-sm text-zinc-500">Import your repo on Vercel or Netlify</p>
                </div>
              </div>
            </div>

            {/* Deploy buttons */}
            <div className="space-y-3">
              <button
                onClick={handleVercelDeploy}
                disabled={isDeploying}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-white py-4 font-medium text-black transition-all hover:bg-zinc-200 disabled:opacity-70"
              >
                <svg className="h-5 w-5" viewBox="0 0 116 100" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M57.5 0L115 100H0L57.5 0z" />
                </svg>
                {isDeploying ? "Deploying..." : "Deploy"}
              </button>
              <button
                onClick={handleNetlifyDeploy}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#00C7B7] py-4 font-medium text-white transition-all hover:bg-[#00b3a4]"
              >
                <svg className="h-5 w-5" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M153.094 165.727l-62.98-36.36 62.98-36.36v72.72zm-72.72-36.36l-62.98 36.36V92.647l62.98 36.72zm62.98-46.1L80.374 46.907V0l62.98 36.36v46.907zm9.74 0V36.36L215.626 0v46.907l-62.532 36.36zm-9.74 138.466l-62.98-36.36V138.466l62.98 36.36v46.907zm9.74-46.907l62.532 36.36v46.907l-62.532-36.36v-46.907z" />
                </svg>
                Deploy to Netlify
              </button>
            </div>

            {/* CLI Instructions */}
            <div className="mt-6 rounded-xl bg-black/50 p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Or use CLI
              </p>
              <code className="block text-sm text-zinc-300">
                <span className="text-zinc-500">$</span> npx vercel
              </code>
            </div>

            <Button variant="ghost" onClick={onClose} className="mt-6 w-full">
              Close
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
