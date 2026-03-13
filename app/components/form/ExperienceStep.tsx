"use client";

import { useState } from "react";
import { usePortfolioStore } from "../../store/portfolioStore";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import { Button } from "../ui/Button";
import { Experience } from "../../types/portfolio";
import { motion, AnimatePresence } from "framer-motion";

export default function ExperienceStep() {
  const { portfolioData, addExperience, removeExperience } = usePortfolioStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newExp, setNewExp] = useState<Partial<Experience>>({
    company: "",
    role: "",
    duration: "",
    description: "",
  });

  const handleSave = () => {
    if (newExp.company && newExp.role) {
      addExperience({
        id: Date.now().toString(),
        company: newExp.company,
        role: newExp.role,
        duration: newExp.duration || "",
        description: newExp.description || "",
      });
      setNewExp({ company: "", role: "", duration: "", description: "" });
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Work Experience</h2>
          <p className="mt-2 text-zinc-400">Add your professional experience</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} variant="secondary">
            + Add Experience
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
              New Experience
            </h3>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Company"
                  placeholder="Google"
                  value={newExp.company}
                  onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                />
                <Input
                  label="Role"
                  placeholder="Senior Developer"
                  value={newExp.role}
                  onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                />
              </div>
              <Input
                label="Duration"
                placeholder="Jan 2020 - Present"
                value={newExp.duration}
                onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })}
              />
              <TextArea
                label="Description"
                placeholder="What did you accomplish?"
                rows={3}
                value={newExp.description}
                onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
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
        {portfolioData.experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-violet-500/30"
          >
            <button
              onClick={() => removeExperience(exp.id)}
              className="absolute right-4 top-4 text-zinc-500 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
            >
              Remove
            </button>
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white">{exp.role}</h4>
                <p className="text-violet-400">{exp.company}</p>
              </div>
              <span className="text-sm text-zinc-500">{exp.duration}</span>
            </div>
            {exp.description && (
              <p className="mt-3 text-sm text-zinc-400">{exp.description}</p>
            )}
          </motion.div>
        ))}
        {portfolioData.experiences.length === 0 && !isAdding && (
          <p className="py-8 text-center text-zinc-500">
            No experience added yet.
          </p>
        )}
      </div>
    </div>
  );
}
