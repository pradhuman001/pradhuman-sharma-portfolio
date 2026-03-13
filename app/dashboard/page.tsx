"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import BuilderNavbar from "../components/BuilderNavbar";
import MultiStepForm from "../components/form/MultiStepForm";
import ScrollProgress from "../components/ScrollProgress";
import { usePortfolioStore } from "../store/portfolioStore";
import { getAuthUser } from "../utils/auth";

const Hero3D = dynamic(() => import("../components/3d/Hero3D"), { ssr: false });

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { resetPortfolio } = usePortfolioStore();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.42], [0, 110]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0.4]);

  useEffect(() => {
    const authUser = getAuthUser();

    if (!authUser) {
      router.replace("/login");
      return;
    }

    setIsAuthorized(true);
  }, [router]);

  if (!isAuthorized) {
    return null;
  }

  return (
    <>
      <ScrollProgress />
      <BuilderNavbar />

      <section className="relative flex min-h-[72vh] flex-col items-center justify-center overflow-hidden px-6 pt-20">
        <Hero3D primaryColor="#22d3ee" sceneStyle="developer" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-cyan-300"
          >
            User Dashboard
          </motion.div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Your Portfolio Builder
            <span className="block bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              is ready to create
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-400">
            Manage your details, personalize the theme, and generate a polished 3D
            portfolio from one workspace.
          </p>

          <motion.a
            href="#builder-form"
            onClick={resetPortfolio}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-violet-600 to-fuchsia-600 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_48px_rgba(34,211,238,0.28)] transition"
          >
            Start Building Your 3D Portfolio
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.a>
        </motion.div>
      </section>

      <section id="builder-form" className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 44, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            <h2 className="mb-2 text-center text-sm font-medium uppercase tracking-widest text-cyan-400">
              Dashboard Builder
            </h2>
            <h3 className="mb-12 text-center text-2xl font-bold text-white sm:text-3xl">
              Build and preview your portfolio
            </h3>

            <MultiStepForm />
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} PortfolioAI. Your dashboard keeps the full builder one click away.
          </p>
        </div>
      </footer>
    </>
  );
}
