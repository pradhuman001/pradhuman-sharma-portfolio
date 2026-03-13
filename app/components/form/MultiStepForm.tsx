"use client";

import { useEffect, useState } from "react";
import { usePortfolioStore } from "../../store/portfolioStore";
import { Button } from "../ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import BasicInfoStep from "./BasicInfoStep";
import SkillsStep from "./SkillsStep";
import ProjectsStep from "./ProjectsStep";
import ExperienceStep from "./ExperienceStep";
import EducationStep from "./EducationStep";
import AchievementsStep from "./AchievementsStep";
import ContactStep from "./ContactStep";
import ThemeStep from "./ThemeStep";
import { useRouter } from "next/navigation";

const steps = [
  { id: 0, title: "Basic Info", component: BasicInfoStep },
  { id: 1, title: "Skills", component: SkillsStep },
  { id: 2, title: "Projects", component: ProjectsStep },
  { id: 3, title: "Experience", component: ExperienceStep },
  { id: 4, title: "Education", component: EducationStep },
  { id: 5, title: "Achievements", component: AchievementsStep },
  { id: 6, title: "Contact", component: ContactStep },
  { id: 7, title: "Theme", component: ThemeStep },
];

export default function MultiStepForm() {
  const {
    currentStep,
    nextStep,
    prevStep,
    setCurrentStep,
    portfolioData,
    themeConfig,
    saveCurrentPortfolio,
    savedPortfolios,
  } =
    usePortfolioStore();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationDone, setGenerationDone] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const CurrentStepComponent = steps[currentStep].component;

  const handleGenerate = () => {
    saveCurrentPortfolio();
    setIsGenerating(true);

    setTimeout(() => {
      setGenerationDone(true);
    }, 900);

    setTimeout(() => {
      router.push("/preview");
    }, 1400);
  };

  const isLastStep = currentStep === steps.length - 1;
  const canGenerate = portfolioData.fullName && portfolioData.profession;
  const hasGeneratedBefore = savedPortfolios.length > 0;

  useEffect(() => {
    setIsAutoSaving(true);
    const timer = setTimeout(() => {
      setIsAutoSaving(false);
      setLastSavedAt(new Date());
    }, 450);

    return () => clearTimeout(timer);
  }, [portfolioData, themeConfig, currentStep]);

  return (
    <div className="mx-auto max-w-3xl">
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-950 p-6 text-center"
            >
              {!generationDone ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    className="mx-auto mb-4 h-12 w-12 rounded-full border-2 border-violet-500 border-t-transparent"
                  />
                  <p className="text-lg font-semibold text-white">Generating your portfolio</p>
                  <p className="mt-2 text-sm text-zinc-400">Crafting sections, layout, and motion...</p>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20"
                  >
                    <svg className="h-7 w-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <p className="text-lg font-semibold text-white">Portfolio ready</p>
                  <p className="mt-2 text-sm text-zinc-400">Opening preview...</p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-3 flex justify-end">
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-400">
            {isAutoSaving
              ? "Auto-saving..."
              : lastSavedAt
                ? `Saved ${lastSavedAt.toLocaleTimeString()}`
                : "Saved"}
          </span>
        </div>
        <div className="mb-4 flex justify-between">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all ${
                index === currentStep
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                  : index < currentStep
                    ? "bg-violet-500/20 text-violet-300"
                    : "bg-white/5 text-zinc-500"
              }`}
            >
              {index < currentStep ? "✓" : index + 1}
            </button>
          ))}
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="mt-2 text-center text-sm text-zinc-500">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
        </p>
      </div>

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-white/10 bg-white/[.02] p-8"
        >
          <CurrentStepComponent />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={currentStep === 0}
          className={currentStep === 0 ? "invisible" : ""}
        >
          ← Previous
        </Button>

        <div className="flex gap-3">
          {canGenerate && (
            <Button variant="secondary" onClick={handleGenerate}>
              Preview Portfolio
            </Button>
          )}
          {!isLastStep ? (
            <Button onClick={nextStep}>Next →</Button>
          ) : (
            <Button onClick={handleGenerate} disabled={!canGenerate}>
              {hasGeneratedBefore ? "Regenerate Portfolio" : "Generate Portfolio 🚀"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
