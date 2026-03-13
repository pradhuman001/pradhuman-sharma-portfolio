"use client";

import { motion } from "framer-motion";
import { PortfolioData, ThemeConfig } from "../../types/portfolio";
import dynamic from "next/dynamic";

const Hero3D = dynamic(() => import("../3d/Hero3D"), { ssr: false });

interface PreviewHeroProps {
  data: PortfolioData;
  theme: ThemeConfig;
}

export default function PreviewHero({ data, theme }: PreviewHeroProps) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      <Hero3D primaryColor={theme.primaryColor} sceneStyle={theme.sceneStyle} />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 text-center"
      >
        {data.profilePhoto && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mx-auto mb-8 h-32 w-32 overflow-hidden rounded-full border-4 border-white/20 shadow-2xl"
            style={{ boxShadow: `0 0 60px ${theme.primaryColor}40` }}
          >
            <img
              src={data.profilePhoto}
              alt={data.fullName}
              className="h-full w-full object-cover"
            />
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-4 text-sm font-medium tracking-[0.3em] uppercase"
          style={{ color: theme.primaryColor }}
        >
          {data.profession}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-7xl"
        >
          {data.fullName || "Your Name"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mx-auto max-w-xl text-lg leading-relaxed text-zinc-400"
        >
          {data.shortBio || "Your short bio will appear here"}
        </motion.p>

        {data.username && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-4 text-sm text-zinc-500"
          >
            portfolioai.com/{data.username}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <a
            href="#projects"
            className="inline-flex h-12 items-center rounded-full px-8 text-sm font-medium text-white transition-transform hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})` }}
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="inline-flex h-12 items-center rounded-full border border-white/20 px-8 text-sm font-medium text-zinc-300 transition-all hover:border-white/40 hover:text-white"
          >
            Get In Touch
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-wider uppercase text-zinc-600">Scroll</span>
        <div className="h-10 w-px bg-gradient-to-b from-zinc-500 to-transparent" />
      </motion.div>
    </section>
  );
}
