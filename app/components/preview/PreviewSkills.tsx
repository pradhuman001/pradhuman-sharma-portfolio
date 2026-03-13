"use client";

import { motion } from "framer-motion";
import { PortfolioData, ThemeConfig } from "../../types/portfolio";

interface PreviewSkillsProps {
  data: PortfolioData;
  theme: ThemeConfig;
}

export default function PreviewSkills({ data, theme }: PreviewSkillsProps) {
  if (data.skills.length === 0) return null;

  return (
    <section id="skills" className="px-6 py-32">
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
            Skills
          </p>
          <h2 className="mb-12 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Technologies I work with
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-3"
        >
          {data.skills.map((skill, index) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-white transition-all"
              style={{
                background: `linear-gradient(135deg, ${theme.primaryColor}20, transparent)`,
                borderColor: `${theme.primaryColor}30`,
              }}
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
