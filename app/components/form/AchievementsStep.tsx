"use client";

import { useState } from "react";
import { usePortfolioStore } from "../../store/portfolioStore";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import { Button } from "../ui/Button";
import { Achievement } from "../../types/portfolio";
import { motion, AnimatePresence } from "framer-motion";

export default function AchievementsStep() {
  const { portfolioData, addAchievement, removeAchievement } = usePortfolioStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newAch, setNewAch] = useState<Partial<Achievement>>({
    title: "",
    description: "",
    year: "",
  });

  const handleSave = () => {
    if (newAch.title) {
      addAchievement({
        id: Date.now().toString(),
        title: newAch.title,
        description: newAch.description,
        year: newAch.year,
      });
      setNewAch({ title: "", description: "", year: "" });
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Achievements & Certifications
          </h2>
          <p className="mt-2 text-zinc-400">
            Highlight your accomplishments
          </p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} variant="secondary">
            + Add Achievement
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <h3 className="mb-4 text-lg font-semibold text-white">
              New Achievement
            </h3>
            <div className="space-y-4">
              <Input
                label="Title"
                placeholder="AWS Certified Solutions Architect"
                value={newAch.title}
                onChange={(e) => setNewAch({ ...newAch, title: e.target.value })}
              />
              <TextArea
                label="Description (optional)"
                placeholder="Brief description..."
                rows={2}
                value={newAch.description}
                onChange={(e) => setNewAch({ ...newAch, description: e.target.value })}
              />
              <Input
                label="Year (optional)"
                placeholder="2023"
                value={newAch.year}
                onChange={(e) => setNewAch({ ...newAch, year: e.target.value })}
              />
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {portfolioData.achievements.map((ach, index) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-violet-500/30"
          >
            <button
              onClick={() => removeAchievement(ach.id)}
              className="absolute right-4 top-4 text-zinc-500 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
            >
              Remove
            </button>
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white">{ach.title}</h4>
                {ach.description && (
                  <p className="mt-1 text-sm text-zinc-400">{ach.description}</p>
                )}
              </div>
              {ach.year && <span className="text-sm text-zinc-500">{ach.year}</span>}
            </div>
          </motion.div>
        ))}
        {portfolioData.achievements.length === 0 && !isAdding && (
          <p className="py-8 text-center text-zinc-500">
            No achievements added yet.
          </p>
        )}
      </div>
    </div>
  );
}
