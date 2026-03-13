"use client";

import { motion } from "framer-motion";
import { PortfolioData, ThemeConfig } from "../../types/portfolio";

interface PreviewAboutProps {
  data: PortfolioData;
  theme: ThemeConfig;
}

export default function PreviewAbout({ data, theme }: PreviewAboutProps) {
  if (!data.aboutSection) return null;

  return (
    <section id="about" className="px-6 py-32">
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
            About Me
          </p>
          <h2 className="mb-12 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Get to know me better
          </h2>
        </motion.div>

        <div className="grid gap-12 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-2"
          >
            <div className="space-y-4 text-lg leading-relaxed text-zinc-400">
              {data.aboutSection.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <div
              className="rounded-2xl border border-white/10 p-6"
              style={{ background: `${theme.primaryColor}10` }}
            >
              <h3 className="mb-1 text-3xl font-bold text-white">
                {data.projects.length}+
              </h3>
              <p className="text-sm text-zinc-400">Projects Completed</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-1 text-3xl font-bold text-white">
                {data.experiences.length}+
              </h3>
              <p className="text-sm text-zinc-400">Years Experience</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-1 text-3xl font-bold text-white">
                {data.skills.length}+
              </h3>
              <p className="text-sm text-zinc-400">Technologies</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
