"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import GitHubModal from "./GitHubModal";
import { getGitHubToken, verifyGitHubToken, GitHubUser } from "../utils/githubApi";
import { clearAuthUser, getAuthUser, AuthUser } from "../utils/auth";
import { usePortfolioStore } from "../store/portfolioStore";

export default function BuilderNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [connectedUser, setConnectedUser] = useState<GitHubUser | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { portfolioData, resetPortfolio } = usePortfolioStore();

  useEffect(() => {
    const checkGitHubConnection = async () => {
      const token = getGitHubToken();
      if (token) {
        const user = await verifyGitHubToken(token);
        setConnectedUser(user);
      }
    };
    checkGitHubConnection();
  }, [isGitHubModalOpen]);

  useEffect(() => {
    const syncAuth = () => {
      setAuthUser(getAuthUser());
      setAuthLoaded(true);
    };

    syncAuth();
    window.addEventListener("storage", syncAuth);

    return () => window.removeEventListener("storage", syncAuth);
  }, [pathname]);

  const displayName = authUser?.name || authUser?.email?.split("@")[0] || "User";
  const livePreviewHref = portfolioData.username ? `/${portfolioData.username}` : "/preview";
  const hasStartedBuilding = Boolean(
    portfolioData.fullName ||
      portfolioData.profession ||
      portfolioData.skills.length ||
      portfolioData.projects.length ||
      portfolioData.experiences.length ||
      portfolioData.education.length ||
      portfolioData.achievements.length
  );

  const handleStartNewProject = () => {
    resetPortfolio();
    setIsProfileMenuOpen(false);
    router.push(authUser ? "/dashboard#builder-form" : "/#builder-form");
  };

  const handleLogout = () => {
    clearAuthUser();
    setAuthUser(null);
    setIsProfileMenuOpen(false);
    router.push("/login");
  };

  const profileMenuItems = [
    { label: "My Profile", href: "/profile" },
    { label: "My Portfolios", href: "/portfolios" },
    { label: "Edit Portfolio", href: "/dashboard#builder-form" },
    { label: "Preview Portfolio", href: livePreviewHref },
    { label: "Deploy / Export", href: "/preview" },
    { label: "Account Settings", href: "/settings" },
    { label: "Billing / Pricing", href: "/pricing" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600">
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <span className="text-lg font-bold text-white">
              Portfolio<span className="text-violet-400">AI</span>
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-4 pr-2">
            <button
              onClick={handleStartNewProject}
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Builder
            </button>
            {hasStartedBuilding && (
              <Link
                href={livePreviewHref}
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Preview
              </Link>
            )}
            {authLoaded && authUser && !hasStartedBuilding && pathname !== "/dashboard" && (
              <Link
                href="/dashboard"
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/pricing"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Pricing
            </Link>
            
            {/* GitHub Connect Section */}
            <button
              onClick={() => setIsGitHubModalOpen(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                connectedUser
                  ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                  : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-600"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              {connectedUser ? (
                <span className="flex items-center gap-2">
                  <img
                    src={connectedUser.avatar_url}
                    alt={connectedUser.login}
                    className="w-4 h-4 rounded-full"
                  />
                  Connected
                </span>
              ) : (
                "Connect GitHub"
              )}
            </button>

            {authLoaded && authUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-xs font-bold text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                  <span>{displayName}</span>
                  <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-12 w-60 rounded-2xl border border-white/10 bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-xl">
                    <div className="mb-2 border-b border-white/10 px-3 pb-3 pt-2">
                      <p className="text-sm font-medium text-white">{displayName}</p>
                      <p className="text-xs text-zinc-400">{authUser.email}</p>
                    </div>

                    <div className="space-y-1">
                      {profileMenuItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="block rounded-xl px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="block w-full rounded-xl px-3 py-2 text-left text-sm text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : authLoaded ? (
              <>
                <Link
                  href="/login"
                  className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white transition hover:bg-white/10"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
                >
                  Sign Up
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </motion.nav>
      <GitHubModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />
    </>
  );
}
