"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { saveAuthUser } from "../utils/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    // Demo-only auth state for local UI flow.
    saveAuthUser({ email, loggedIn: true });

    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 650);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 py-16 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at 15% 20%, rgba(139,92,246,0.28), transparent 42%), radial-gradient(circle at 80% 15%, rgba(236,72,153,0.2), transparent 36%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative mx-auto w-full max-w-md rounded-2xl border border-white/15 bg-zinc-950/80 p-6 backdrop-blur-xl"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-violet-400">Welcome back</p>
        <h1 className="mt-2 text-3xl font-bold">Log in to PortfolioAI</h1>
        <p className="mt-2 text-sm text-zinc-400">Continue building and publishing your portfolio.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm text-zinc-300">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-lg border border-white/15 bg-zinc-900 px-4 py-3 text-sm outline-none transition focus:border-violet-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm text-zinc-300">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-lg border border-white/15 bg-zinc-900 px-4 py-3 text-sm outline-none transition focus:border-violet-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-semibold transition hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-5 text-sm text-zinc-400">
          New user?{" "}
          <Link href="/signup" className="font-medium text-violet-300 hover:text-violet-200">Create an account</Link>
        </p>
      </motion.div>
    </main>
  );
}
