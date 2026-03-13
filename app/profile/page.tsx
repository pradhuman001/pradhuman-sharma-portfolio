"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BuilderNavbar from "../components/BuilderNavbar";
import { getAuthUser, saveAuthUser, type AuthUser } from "../utils/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    const authUser = getAuthUser();
    if (!authUser) {
      router.replace("/login");
      return;
    }

    setUser(authUser);
    setName(authUser.name || "");
    setPhoto(authUser.photo || "");
    setBio(authUser.bio || "");
  }, [router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      return;
    }

    const nextUser = { ...user, name, photo, bio };
    saveAuthUser(nextUser);
    setUser(nextUser);
  };

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black px-6 pb-16 pt-28 text-white">
      <BuilderNavbar />
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.03] p-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="mt-2 text-zinc-400">Edit your display details for PortfolioAI.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Name</label>
            <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-violet-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Photo URL</label>
            <input value={photo} onChange={(event) => setPhoto(event.target.value)} className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-violet-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Bio</label>
            <textarea value={bio} onChange={(event) => setBio(event.target.value)} rows={4} className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-violet-500" />
          </div>
          <button type="submit" className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white">
            Save Profile
          </button>
        </form>
      </div>
    </main>
  );
}
