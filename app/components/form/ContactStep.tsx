"use client";

import { usePortfolioStore } from "../../store/portfolioStore";
import { Input } from "../ui/Input";

export default function ContactStep() {
  const { portfolioData, setSocialLinks } = usePortfolioStore();

  const updateLink = (key: string, value: string) => {
    setSocialLinks({ ...portfolioData.socialLinks, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Contact Information</h2>
        <p className="mt-2 text-zinc-400">
          How can people reach you?
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="hello@example.com"
          value={portfolioData.socialLinks.email || ""}
          onChange={(e) => updateLink("email", e.target.value)}
        />

        <Input
          label="LinkedIn"
          placeholder="https://linkedin.com/in/yourprofile"
          value={portfolioData.socialLinks.linkedin || ""}
          onChange={(e) => updateLink("linkedin", e.target.value)}
        />

        <Input
          label="GitHub"
          placeholder="https://github.com/yourusername"
          value={portfolioData.socialLinks.github || ""}
          onChange={(e) => updateLink("github", e.target.value)}
        />

        <Input
          label="Twitter / X"
          placeholder="https://twitter.com/yourhandle"
          value={portfolioData.socialLinks.twitter || ""}
          onChange={(e) => updateLink("twitter", e.target.value)}
        />

        <Input
          label="Personal Website"
          placeholder="https://yourwebsite.com"
          value={portfolioData.socialLinks.website || ""}
          onChange={(e) => updateLink("website", e.target.value)}
        />
      </div>
    </div>
  );
}
