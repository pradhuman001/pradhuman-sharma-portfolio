"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import MultiStepForm from "./components/form/MultiStepForm";
import BuilderNavbar from "./components/BuilderNavbar";
import dynamic from "next/dynamic";
import ScrollProgress from "./components/ScrollProgress";
import { usePortfolioStore } from "./store/portfolioStore";

const Hero3D = dynamic(() => import("./components/3d/Hero3D"), { ssr: false });

export default function Home() {
  const { resetPortfolio } = usePortfolioStore();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0.35]);

  return (
    <>
      <ScrollProgress />
      <BuilderNavbar />
      
      {/* Hero Section */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 pt-20">
        <Hero3D primaryColor="#8b5cf6" sceneStyle="futuristic" />
        
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600"
          >
            <span className="text-2xl font-bold text-white">P</span>
          </motion.div>
          
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Build Your{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              3D Portfolio
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-lg text-lg text-zinc-400">
            Create a stunning, AI-powered portfolio website with immersive 3D
            animations. No coding required.
          </p>

          <motion.a
            href="#builder-form"
            onClick={resetPortfolio}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 px-7 py-3 text-sm font-semibold text-white shadow-[0_0_40px_rgba(139,92,246,0.35)] transition"
          >
            Start Building Your 3D Portfolio
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.a>
          
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-violet-500" /> 3D Animations
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-fuchsia-500" /> Custom Themes
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-500" /> One-Click Deploy
            </span>
          </div>
        </motion.div>
      </section>

      {/* Form Section */}
      <section id="builder-form" className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 44, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            <h2 className="mb-2 text-center text-sm font-medium tracking-widest uppercase text-violet-400">
              Get Started
            </h2>
            <h3 className="mb-12 text-center text-2xl font-bold text-white sm:text-3xl">
              Fill in your details
            </h3>
            
            <MultiStepForm />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} PortfolioAI. Built with Next.js, Three.js & Framer Motion.
          </p>
        </div>
      </footer>
    </>
  );
}
