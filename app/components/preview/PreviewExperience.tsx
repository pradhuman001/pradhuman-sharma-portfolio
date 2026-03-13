"use client";

import { motion } from "framer-motion";
import { PortfolioData, ThemeConfig } from "../../types/portfolio";

interface PreviewExperienceProps {
  data: PortfolioData;
  theme: ThemeConfig;
}

export default function PreviewExperience({ data, theme }: PreviewExperienceProps) {
  if (data.experiences.length === 0) return null;

  return (
    <section id="experience" className="px-6 py-32">
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
            Experience
          </p>
          <h2 className="mb-12 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Work History
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-0 top-0 h-full w-px md:left-1/2"
            style={{ background: `linear-gradient(to bottom, ${theme.primaryColor}, transparent)` }}
          />

          {data.experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative mb-12 pl-8 md:w-1/2 md:pl-0 ${
                index % 2 === 0 ? "md:pr-12" : "md:ml-auto md:pl-12"
              }`}
            >
              {/* Timeline dot */}
              <div
                className="absolute left-0 top-0 h-4 w-4 -translate-x-1/2 rounded-full border-4 md:left-auto"
                style={{
                  backgroundColor: theme.primaryColor,
                  borderColor: "#0a0a0a",
                  [index % 2 === 0 ? "right" : "left"]: "-8px",
                }}
              />

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20">
                <span className="mb-2 inline-block text-xs text-zinc-500">
                  {exp.duration}
                </span>
                <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                <p style={{ color: theme.primaryColor }}>{exp.company}</p>
                {exp.description && (
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {exp.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
