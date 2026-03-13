"use client";

import { PortfolioData, ThemeConfig } from "../../types/portfolio";

interface PreviewFooterProps {
  data: PortfolioData;
  theme: ThemeConfig;
}

export default function PreviewFooter({ data, theme }: PreviewFooterProps) {
  return (
    <footer className="border-t border-white/10 px-6 py-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} {data.fullName || "Your Name"}. All rights reserved.
        </p>
        <p className="text-xs text-zinc-600">
          Built with{" "}
          <span style={{ color: theme.primaryColor }}>Portfolio Builder</span>
        </p>
      </div>
    </footer>
  );
}
