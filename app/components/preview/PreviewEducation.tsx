"use client";

import { motion } from "framer-motion";
import { PortfolioData, ThemeConfig } from "../../types/portfolio";

interface PreviewEducationProps {
  data: PortfolioData;
  theme: ThemeConfig;
}

export default function PreviewEducation({ data, theme }: PreviewEducationProps) {
  if (data.education.length === 0) return null;

  return (
    <section id="education" className="px-6 py-32">
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
            Education
          </p>
          <h2 className="mb-12 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Academic Background
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {data.education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20"
            >
              <div className="mb-4 flex items-start justify-between">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: `${theme.primaryColor}20` }}
                >
                  <svg
                    className="h-6 w-6"
                    style={{ color: theme.primaryColor }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-zinc-500">{edu.year}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{edu.degree}</h3>
              <p className="text-zinc-400">{edu.university}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
