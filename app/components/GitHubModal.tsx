"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitHubUser,
  GitHubRepo,
  verifyGitHubToken,
  setGitHubToken,
  getGitHubToken,
  clearGitHubToken,
  createGitHubRepo,
  pushToGitHub,
  getUserRepos,
} from "../utils/githubApi";
import { usePortfolioStore } from "../store/portfolioStore";

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalStep = "connect" | "configure" | "pushing" | "success";

export default function GitHubModal({ isOpen, onClose }: GitHubModalProps) {
  const [step, setStep] = useState<ModalStep>("connect");
  const [token, setToken] = useState("");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repoName, setRepoName] = useState("");
  const [repoDescription, setRepoDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [useExisting, setUseExisting] = useState(false);
  const [existingRepos, setExistingRepos] = useState<GitHubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [repoUrl, setRepoUrl] = useState("");

  const { portfolioData: data, themeConfig: theme } = usePortfolioStore();

  // Check for existing token on mount
  useEffect(() => {
    const savedToken = getGitHubToken();
    if (savedToken) {
      verifyExistingToken(savedToken);
    }
  }, []);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedToken = getGitHubToken();
      if (savedToken && user) {
        setStep("configure");
        loadRepos(savedToken);
      } else {
        setStep("connect");
      }
      setError("");
      setProgress(0);
      setProgressMessage("");
      setRepoName(
        data.fullName
          ?.toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "") + "-portfolio" || "my-portfolio"
      );
      setRepoDescription(
        `Portfolio website for ${data.fullName || "a developer"}`
      );
    }
  }, [isOpen, data.fullName, user]);

  const verifyExistingToken = async (savedToken: string) => {
    const githubUser = await verifyGitHubToken(savedToken);
    if (githubUser) {
      setUser(githubUser);
      setToken(savedToken);
    } else {
      clearGitHubToken();
    }
  };

  const loadRepos = async (tokenToUse: string) => {
    const repos = await getUserRepos(tokenToUse);
    setExistingRepos(repos);
  };

  const handleConnect = async () => {
    if (!token.trim()) {
      setError("Please enter your GitHub Personal Access Token");
      return;
    }

    setLoading(true);
    setError("");

    const githubUser = await verifyGitHubToken(token);

    if (githubUser) {
      setUser(githubUser);
      setGitHubToken(token);
      await loadRepos(token);
      setStep("configure");
    } else {
      setError(
        "Invalid token. Make sure your token has 'repo' scope permissions."
      );
    }

    setLoading(false);
  };

  const handleDisconnect = () => {
    clearGitHubToken();
    setUser(null);
    setToken("");
    setStep("connect");
    setExistingRepos([]);
  };

  const handlePush = async () => {
    if (!user) return;

    setLoading(true);
    setError("");
    setStep("pushing");

    try {
      let targetRepo = selectedRepo;

      // Create new repo if not using existing
      if (!useExisting) {
        if (!repoName.trim()) {
          setError("Please enter a repository name");
          setStep("configure");
          setLoading(false);
          return;
        }

        setProgressMessage("Creating repository...");
        setProgress(5);

        const newRepo = await createGitHubRepo(
          token,
          repoName,
          repoDescription,
          isPrivate
        );

        if (!newRepo) {
          throw new Error("Failed to create repository");
        }

        targetRepo = newRepo.name;
      }

      // Push files
      const result = await pushToGitHub(
        token,
        user.login,
        targetRepo,
        data,
        theme,
        (prog, msg) => {
          setProgress(5 + prog * 0.95);
          setProgressMessage(msg);
        }
      );

      setRepoUrl(result.repoUrl);
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to push to GitHub");
      setStep("configure");
    }

    setLoading(false);
  };

  const handleClose = () => {
    onClose();
    // Reset to configure if user is connected, otherwise connect
    if (user) {
      setStep("configure");
    } else {
      setStep("connect");
    }
    setError("");
    setProgress(0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 border border-gray-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Push to GitHub
                  </h2>
                  <p className="text-sm text-gray-400">
                    {step === "connect" && "Connect your GitHub account"}
                    {step === "configure" && "Configure repository"}
                    {step === "pushing" && "Uploading files..."}
                    {step === "success" && "Successfully pushed!"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Connect Step */}
              {step === "connect" && (
                <div className="space-y-4">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <h3 className="text-blue-400 font-medium mb-2">
                      How to get a Personal Access Token
                    </h3>
                    <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                      <li>
                        Go to{" "}
                        <a
                          href="https://github.com/settings/tokens/new"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          GitHub Token Settings
                        </a>
                      </li>
                      <li>Give your token a descriptive name</li>
                      <li>
                        Select <strong>repo</strong> scope (full control)
                      </li>
                      <li>Click &quot;Generate token&quot; and copy it</li>
                    </ol>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Personal Access Token
                    </label>
                    <input
                      type="password"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleConnect}
                    disabled={loading}
                    className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="w-5 h-5 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        Connect to GitHub
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Configure Step */}
              {step === "configure" && (
                <div className="space-y-4">
                  {/* Connected User */}
                  {user && (
                    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar_url}
                          alt={user.login}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="text-white font-medium">{user.name || user.login}</p>
                          <p className="text-sm text-gray-400">@{user.login}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleDisconnect}
                        className="text-sm text-gray-400 hover:text-red-400 transition-colors"
                      >
                        Disconnect
                      </button>
                    </div>
                  )}

                  {/* Repository Options */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUseExisting(false)}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        !useExisting
                          ? "bg-purple-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:text-white"
                      }`}
                    >
                      Create New Repo
                    </button>
                    <button
                      onClick={() => setUseExisting(true)}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        useExisting
                          ? "bg-purple-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:text-white"
                      }`}
                    >
                      Use Existing
                    </button>
                  </div>

                  {!useExisting ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Repository Name
                        </label>
                        <input
                          type="text"
                          value={repoName}
                          onChange={(e) =>
                            setRepoName(
                              e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9-]/g, "-")
                            )
                          }
                          placeholder="my-portfolio"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          value={repoDescription}
                          onChange={(e) => setRepoDescription(e.target.value)}
                          placeholder="My awesome portfolio website"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isPrivate}
                          onChange={(e) => setIsPrivate(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-300">
                          Make repository private
                        </span>
                      </label>
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Repository
                      </label>
                      <select
                        value={selectedRepo}
                        onChange={(e) => setSelectedRepo(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="">Select a repository...</option>
                        {existingRepos.map((repo) => (
                          <option key={repo.name} value={repo.name}>
                            {repo.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-yellow-400 mt-2">
                        Warning: This will overwrite existing files in the
                        repository.
                      </p>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handlePush}
                    disabled={
                      loading || (useExisting && !selectedRepo) || (!useExisting && !repoName)
                    }
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Push to GitHub
                  </button>
                </div>
              )}

              {/* Pushing Step */}
              {step === "pushing" && (
                <div className="space-y-4 py-8">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 relative">
                      <svg
                        className="w-20 h-20 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          className="opacity-75 text-purple-500"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-white font-medium">{progressMessage}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {Math.round(progress)}% complete
                    </p>
                  </div>

                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {/* Success Step */}
              {step === "success" && (
                <div className="space-y-4 py-8 text-center">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Successfully Pushed!
                    </h3>
                    <p className="text-gray-400">
                      Your portfolio code is now on GitHub
                    </p>
                  </div>

                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    View Repository
                  </a>

                  <div className="bg-gray-800 rounded-lg p-4 text-left">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">
                      Next Steps
                    </h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400">1.</span>
                        Clone and run <code className="text-purple-300">npm install</code>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400">2.</span>
                        Start dev server with <code className="text-purple-300">npm run dev</code>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400">3.</span>
                        Deploy by importing from GitHub
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
