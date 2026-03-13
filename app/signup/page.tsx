"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { saveAuthUser } from "../utils/auth";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    // Demo-only auth state for local UI flow.
    saveAuthUser({ name, email, loggedIn: true });

    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 700);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 py-16 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-55" style={{ background: "radial-gradient(circle at 85% 20%, rgba(59,130,246,0.24), transparent 40%), radial-gradient(circle at 20% 78%, rgba(236,72,153,0.22), transparent 44%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative mx-auto w-full max-w-md rounded-2xl border border-white/15 bg-zinc-950/80 p-6 backdrop-blur-xl"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Create account</p>
        <h1 className="mt-2 text-3xl font-bold">Sign up for PortfolioAI</h1>
        <p className="mt-2 text-sm text-zinc-400">Start building your 3D portfolio in minutes.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm text-zinc-300">Full name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-lg border border-white/15 bg-zinc-900 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm text-zinc-300">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-lg border border-white/15 bg-zinc-900 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
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
              className="w-full rounded-lg border border-white/15 bg-zinc-900 px-4 py-3 text-sm outline-none transition focus:border-cyan-500"
              placeholder="Create a password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 text-sm font-semibold transition hover:from-cyan-500 hover:to-blue-500 disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-5 text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-cyan-300 hover:text-cyan-200">Log in</Link>
        </p>
      </motion.div>
    </main>
  );
}
