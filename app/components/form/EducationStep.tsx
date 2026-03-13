"use client";

import { useState } from "react";
import { usePortfolioStore } from "../../store/portfolioStore";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Education } from "../../types/portfolio";
import { motion, AnimatePresence } from "framer-motion";

export default function EducationStep() {
  const { portfolioData, addEducation, removeEducation } = usePortfolioStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newEdu, setNewEdu] = useState<Partial<Education>>({
    degree: "",
    university: "",
    year: "",
  });

  const handleSave = () => {
    if (newEdu.degree && newEdu.university) {
      addEducation({
        id: Date.now().toString(),
        degree: newEdu.degree,
        university: newEdu.university,
        year: newEdu.year || "",
      });
      setNewEdu({ degree: "", university: "", year: "" });
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Education</h2>
          <p className="mt-2 text-zinc-400">Add your educational background</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} variant="secondary">
            + Add Education
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
              New Education
            </h3>
            <div className="space-y-4">
              <Input
                label="Degree / Certification"
                placeholder="B.S. Computer Science"
                value={newEdu.degree}
                onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
              />
              <Input
                label="University / Institution"
                placeholder="Stanford University"
                value={newEdu.university}
                onChange={(e) => setNewEdu({ ...newEdu, university: e.target.value })}
              />
              <Input
                label="Year"
                placeholder="2018 - 2022"
                value={newEdu.year}
                onChange={(e) => setNewEdu({ ...newEdu, year: e.target.value })}
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
        {portfolioData.education.map((edu, index) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-violet-500/30"
          >
            <button
              onClick={() => removeEducation(edu.id)}
              className="absolute right-4 top-4 text-zinc-500 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
            >
              Remove
            </button>
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white">{edu.degree}</h4>
                <p className="text-violet-400">{edu.university}</p>
              </div>
              <span className="text-sm text-zinc-500">{edu.year}</span>
            </div>
          </motion.div>
        ))}
        {portfolioData.education.length === 0 && !isAdding && (
          <p className="py-8 text-center text-zinc-500">
            No education added yet.
          </p>
        )}
      </div>
    </div>
  );
}
