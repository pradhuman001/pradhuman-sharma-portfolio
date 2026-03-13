"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.22,
  });

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[70] h-1 origin-left bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500"
      style={{ scaleX }}
    />
  );
}
