"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BuilderNavbar from "../components/BuilderNavbar";
import { clearAuthUser, getAuthUser } from "../utils/auth";

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const authUser = getAuthUser();
    if (!authUser) {
      router.replace("/login");
      return;
    }

    setEmail(authUser.email);
  }, [router]);

  const handleLogout = () => {
    clearAuthUser();
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-black px-6 pb-16 pt-28 text-white">
      <BuilderNavbar />
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.03] p-8">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="mt-2 text-zinc-400">Manage account access and billing entry points.</p>

        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
            <p className="text-sm text-zinc-400">Signed in email</p>
            <p className="mt-1 text-lg font-medium text-white">{email || "Not available"}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
            <p className="text-sm text-zinc-400">Billing</p>
            <button onClick={() => router.push("/pricing")} className="mt-3 rounded-full border border-emerald-500/30 px-4 py-2 text-sm text-emerald-300">
              Open Pricing
            </button>
          </div>
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
            <p className="text-sm text-rose-200">Session</p>
            <button onClick={handleLogout} className="mt-3 rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white">
              Logout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
