"use client";

import { useState } from "react";
import { usePortfolioStore } from "../../store/portfolioStore";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { motion, AnimatePresence } from "framer-motion";

const suggestedSkills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "Go",
  "Rust",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "SASS",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "AWS",
  "Docker",
  "Kubernetes",
  "Git",
  "GraphQL",
  "REST API",
  "Firebase",
  "Supabase",
  "Figma",
  "Adobe XD",
  "Three.js",
  "TensorFlow",
];

export default function SkillsStep() {
  const { portfolioData, addSkill, removeSkill } = usePortfolioStore();
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim() && !portfolioData.skills.includes(newSkill.trim())) {
      addSkill(newSkill.trim());
      setNewSkill("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const availableSuggestions = suggestedSkills.filter(
    (skill) => !portfolioData.skills.includes(skill)
  );

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Skills & Technologies</h2>
        <p className="mt-2 text-zinc-400">
          Add the skills and technologies you work with
        </p>
      </div>

      <div className="flex gap-3">
        <Input
          placeholder="Add a skill..."
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={handleAddSkill} variant="secondary">
          Add
        </Button>
      </div>

      {/* Current Skills */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-400">Your Skills</h3>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {portfolioData.skills.map((skill) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 px-4 py-2 text-sm text-white"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-zinc-400 transition-colors hover:text-red-400"
                >
                  ×
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
          {portfolioData.skills.length === 0 && (
            <p className="text-sm text-zinc-500">No skills added yet</p>
          )}
        </div>
      </div>

      {/* Suggestions */}
      {availableSuggestions.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium text-zinc-400">
            Quick Add Suggestions
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.slice(0, 12).map((skill) => (
              <button
                key={skill}
                onClick={() => addSkill(skill)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-400 transition-all hover:border-violet-500/50 hover:text-white"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
