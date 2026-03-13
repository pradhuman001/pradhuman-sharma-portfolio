"use client";

import { motion } from "framer-motion";
import { PortfolioData, ThemeConfig } from "../../types/portfolio";

interface PreviewProjectsProps {
  data: PortfolioData;
  theme: ThemeConfig;
}

export default function PreviewProjects({ data, theme }: PreviewProjectsProps) {
  if (data.projects.length === 0) return null;

  return (
    <section id="projects" className="px-6 py-32">
      <div className="mx-auto max-w-5xl">
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
            Projects
          </p>
          <h2 className="mb-12 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Featured Work
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {data.projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${theme.primaryColor}05, transparent)`,
              }}
            >
              {/* Gradient overlay on hover */}
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor}10, transparent)`,
                }}
              />

              <div className="relative z-10">
                <h3 className="mb-3 text-xl font-bold text-white">
                  {project.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-zinc-400">
                  {project.description}
                </p>

                <div className="mb-6 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        background: `${theme.primaryColor}20`,
                        color: theme.primaryColor,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-400 transition-colors hover:text-white"
                    >
                      Live Demo →
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-400 transition-colors hover:text-white"
                    >
                      GitHub →
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
