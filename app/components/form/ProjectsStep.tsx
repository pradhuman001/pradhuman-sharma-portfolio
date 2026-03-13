"use client";

import { useState } from "react";
import { usePortfolioStore } from "../../store/portfolioStore";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import { Button } from "../ui/Button";
import { Project } from "../../types/portfolio";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectsStep() {
  const { portfolioData, addProject, removeProject } = usePortfolioStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: "",
    description: "",
    techStack: [],
    images: [],
    githubUrl: "",
    liveUrl: "",
  });
  const [techInput, setTechInput] = useState("");

  const handleAddTech = () => {
    if (techInput.trim() && !newProject.techStack?.includes(techInput.trim())) {
      setNewProject({
        ...newProject,
        techStack: [...(newProject.techStack || []), techInput.trim()],
      });
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setNewProject({
      ...newProject,
      techStack: newProject.techStack?.filter((t) => t !== tech),
    });
  };

  const handleSaveProject = () => {
    if (newProject.title && newProject.description) {
      addProject({
        id: Date.now().toString(),
        title: newProject.title,
        description: newProject.description,
        techStack: newProject.techStack || [],
        images: newProject.images || [],
        githubUrl: newProject.githubUrl,
        liveUrl: newProject.liveUrl,
      });
      setNewProject({
        title: "",
        description: "",
        techStack: [],
        images: [],
        githubUrl: "",
        liveUrl: "",
      });
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Projects</h2>
          <p className="mt-2 text-zinc-400">Showcase your best work</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} variant="secondary">
            + Add Project
          </Button>
        )}
      </div>

      {/* Add Project Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <h3 className="mb-4 text-lg font-semibold text-white">
              New Project
            </h3>
            <div className="space-y-4">
              <Input
                label="Project Title"
                placeholder="My Awesome Project"
                value={newProject.title}
                onChange={(e) =>
                  setNewProject({ ...newProject, title: e.target.value })
                }
              />
              <TextArea
                label="Description"
                placeholder="Describe what this project does..."
                rows={3}
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Tech Stack
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add technology..."
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTech())}
                  />
                  <Button onClick={handleAddTech} variant="ghost" size="sm">
                    Add
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {newProject.techStack?.map((tech) => (
                    <span
                      key={tech}
                      className="flex items-center gap-1 rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-300"
                    >
                      {tech}
                      <button onClick={() => handleRemoveTech(tech)}>×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="GitHub URL"
                  placeholder="https://github.com/..."
                  value={newProject.githubUrl}
                  onChange={(e) =>
                    setNewProject({ ...newProject, githubUrl: e.target.value })
                  }
                />
                <Input
                  label="Live URL"
                  placeholder="https://..."
                  value={newProject.liveUrl}
                  onChange={(e) =>
                    setNewProject({ ...newProject, liveUrl: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProject}>Save Project</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project List */}
      <div className="space-y-4">
        {portfolioData.projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-violet-500/30"
          >
            <button
              onClick={() => removeProject(project.id)}
              className="absolute right-4 top-4 text-zinc-500 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
            >
              Remove
            </button>
            <h4 className="text-lg font-semibold text-white">{project.title}</h4>
            <p className="mt-2 text-sm text-zinc-400">{project.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs text-violet-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
        {portfolioData.projects.length === 0 && !isAdding && (
          <p className="py-8 text-center text-zinc-500">
            No projects added yet. Click &quot;Add Project&quot; to get started.
          </p>
        )}
      </div>
    </div>
  );
}
