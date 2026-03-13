"use client";

import { ChangeEvent, useMemo } from "react";
import { usePortfolioStore } from "../../store/portfolioStore";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";

export default function BasicInfoStep() {
  const { portfolioData, setBasicInfo, savedPortfolios, currentPortfolioId } =
    usePortfolioStore();
  const seo = portfolioData.seo ?? {
    title: "",
    description: "",
    socialPreviewImage: "",
  };

  const normalizedUsername = portfolioData.username
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");

  const reservedRoutes = useMemo(
    () =>
      new Set([
        "login",
        "signup",
        "dashboard",
        "preview",
        "pricing",
        "profile",
        "portfolios",
        "settings",
      ]),
    []
  );

  const isUsernameTaken = savedPortfolios.some(
    (portfolio) =>
      portfolio.username.toLowerCase() === normalizedUsername &&
      portfolio.id !== currentPortfolioId
  );
  const isReservedUsername = reservedRoutes.has(normalizedUsername);
  const usernameStatus = !normalizedUsername
    ? "Username required"
    : isReservedUsername
      ? "This username is reserved"
      : isUsernameTaken
        ? "Username is already taken"
        : "Username is available";

  const usernameStatusColor = !normalizedUsername
    ? "text-zinc-500"
    : isReservedUsername || isUsernameTaken
      ? "text-rose-400"
      : "text-emerald-400";

  const handleProfileImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setBasicInfo({ profilePhoto: result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Basic Information</h2>
        <p className="mt-2 text-zinc-400">
          Let&apos;s start with your basic details
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Input
          label="Full Name"
          placeholder="John Doe"
          value={portfolioData.fullName}
          onChange={(e) => setBasicInfo({ fullName: e.target.value })}
        />
        <Input
          label="Profession / Title"
          placeholder="Full Stack Developer"
          value={portfolioData.profession}
          onChange={(e) => setBasicInfo({ profession: e.target.value })}
        />
      </div>

      <Input
        label="Custom Username URL"
        placeholder="pradhuman"
        value={portfolioData.username}
        onChange={(e) =>
          setBasicInfo({
            username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
          })
        }
      />
      <p className="-mt-3 text-xs text-zinc-500">
        Public URL format: portfolioai.com/{portfolioData.username || "username"}
      </p>
      <p className={`-mt-2 text-xs ${usernameStatusColor}`}>{usernameStatus}</p>

      <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <p className="text-sm font-medium text-zinc-200">Profile Photo Upload</p>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-white transition hover:bg-white/[0.08]">
          <input
            type="file"
            accept="image/*"
            onChange={handleProfileImageUpload}
            className="hidden"
          />
          Upload Image
        </label>
        {portfolioData.profilePhoto ? (
          <div className="flex items-center gap-4">
            <img
              src={portfolioData.profilePhoto}
              alt="Profile preview"
              className="h-16 w-16 rounded-full border border-white/20 object-cover"
            />
            <button
              type="button"
              onClick={() => setBasicInfo({ profilePhoto: "" })}
              className="rounded-full border border-rose-400/40 px-3 py-1.5 text-xs text-rose-300"
            >
              Remove
            </button>
          </div>
        ) : (
          <p className="text-xs text-zinc-500">Upload JPG, PNG, or WEBP image.</p>
        )}
      </div>

      <TextArea
        label="Short Bio"
        placeholder="A brief one-liner about yourself..."
        rows={2}
        value={portfolioData.shortBio}
        onChange={(e) => setBasicInfo({ shortBio: e.target.value })}
      />

      <TextArea
        label="About Section"
        placeholder="Tell your story in detail. What drives you? What's your journey?"
        rows={6}
        value={portfolioData.aboutSection}
        onChange={(e) => setBasicInfo({ aboutSection: e.target.value })}
      />

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <h3 className="mb-4 text-lg font-semibold text-white">SEO Settings</h3>
        <div className="space-y-4">
          <Input
            label="Portfolio Title"
            placeholder="Pradhuman - Full Stack Developer"
            value={seo.title}
            onChange={(e) =>
              setBasicInfo({ seo: { ...seo, title: e.target.value } })
            }
          />
          <TextArea
            label="Meta Description"
            placeholder="Short SEO description for search engines and social shares"
            rows={3}
            value={seo.description}
            onChange={(e) =>
              setBasicInfo({
                seo: { ...seo, description: e.target.value },
              })
            }
          />
          <Input
            label="Social Preview Image URL"
            placeholder="https://example.com/og-image.jpg"
            value={seo.socialPreviewImage}
            onChange={(e) =>
              setBasicInfo({
                seo: { ...seo, socialPreviewImage: e.target.value },
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
