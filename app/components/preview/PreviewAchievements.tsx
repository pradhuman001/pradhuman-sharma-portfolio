"use client";

import { motion } from "framer-motion";
import { PortfolioData, ThemeConfig } from "../../types/portfolio";

interface PreviewAchievementsProps {
  data: PortfolioData;
  theme: ThemeConfig;
}

export default function PreviewAchievements({ data, theme }: PreviewAchievementsProps) {
  if (data.achievements.length === 0) return null;

  return (
    <section id="achievements" className="px-6 py-32">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="mb-2 text-sm font-medium tracking-widest uppercase"
            style={{ color: theme.primaryColor }}
          >
            Achievements
          </p>
          <h2 className="mb-12 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Certifications & Awards
          </h2>
        </motion.div>

        <div className="space-y-4">
          {data.achievements.map((ach, index) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{ background: `${theme.primaryColor}20` }}
              >
                <svg
                  className="h-5 w-5"
                  style={{ color: theme.primaryColor }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-white">{ach.title}</h3>
                  {ach.year && (
                    <span className="text-sm text-zinc-500">{ach.year}</span>
                  )}
                </div>
                {ach.description && (
                  <p className="mt-1 text-sm text-zinc-400">{ach.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
