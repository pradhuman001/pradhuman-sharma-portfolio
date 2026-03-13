"use client";

import { usePortfolioStore } from "../../store/portfolioStore";
import { ThemeMode, SceneStyle, TemplateStyle } from "../../types/portfolio";
import { motion } from "framer-motion";

const colors = [
  { name: "Violet", value: "#8b5cf6" },
  { name: "Fuchsia", value: "#d946ef" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Emerald", value: "#10b981" },
  { name: "Orange", value: "#f97316" },
  { name: "Rose", value: "#f43f5e" },
];

const sceneStyles: { value: SceneStyle; label: string; description: string }[] = [
  { value: "minimal", label: "Minimal", description: "Clean, subtle 3D elements" },
  { value: "futuristic", label: "Futuristic", description: "Glowing particles and grids" },
  { value: "developer", label: "Developer", description: "Code-inspired aesthetic" },
  { value: "creative", label: "Creative", description: "Artistic and dynamic" },
];

const templates: {
  value: TemplateStyle;
  label: string;
  description: string;
  sceneStyle: SceneStyle;
  primaryColor: string;
  accentColor: string;
}[] = [
  {
    value: "developer",
    label: "Developer",
    description: "Tech-focused with code vibes and structured sections",
    sceneStyle: "developer",
    primaryColor: "#06b6d4",
    accentColor: "#8b5cf6",
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "Elegant spacing, subtle visual noise, clean typography",
    sceneStyle: "minimal",
    primaryColor: "#64748b",
    accentColor: "#0ea5e9",
  },
  {
    value: "creative",
    label: "Creative",
    description: "Bold colors, expressive motion, standout visual style",
    sceneStyle: "creative",
    primaryColor: "#ec4899",
    accentColor: "#f97316",
  },
];

export default function ThemeStep() {
  const { themeConfig, setThemeConfig } = usePortfolioStore();

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Customize Theme</h2>
        <p className="mt-2 text-zinc-400">
          Make your portfolio uniquely yours
        </p>
      </div>

      {/* Theme Mode */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-zinc-400">Theme Mode</h3>
        <div className="flex gap-4">
          {(["dark", "light"] as ThemeMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setThemeConfig({ mode })}
              className={`flex-1 rounded-xl border-2 p-4 transition-all ${
                themeConfig.mode === mode
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <div
                className={`mx-auto mb-3 h-12 w-full max-w-[80px] rounded-lg ${
                  mode === "dark" ? "bg-zinc-900" : "bg-white"
                }`}
              />
              <p className="text-sm font-medium capitalize text-white">{mode}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-zinc-400">Portfolio Templates</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {templates.map((template) => (
            <button
              key={template.value}
              onClick={() =>
                setThemeConfig({
                  template: template.value,
                  sceneStyle: template.sceneStyle,
                  primaryColor: template.primaryColor,
                  accentColor: template.accentColor,
                })
              }
              className={`rounded-xl border-2 p-4 text-left transition-all ${
                themeConfig.template === template.value
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <p className="font-medium text-white">{template.label}</p>
              <p className="mt-1 text-xs text-zinc-400">{template.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Primary Color */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-zinc-400">Primary Color</h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <motion.button
              key={color.value}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setThemeConfig({ primaryColor: color.value })}
              className={`relative h-12 w-12 rounded-full transition-all ${
                themeConfig.primaryColor === color.value
                  ? "ring-2 ring-white ring-offset-2 ring-offset-black"
                  : ""
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Scene Style */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-zinc-400">3D Scene Style</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {sceneStyles.map((style) => (
            <button
              key={style.value}
              onClick={() => setThemeConfig({ sceneStyle: style.value })}
              className={`rounded-xl border-2 p-4 text-left transition-all ${
                themeConfig.sceneStyle === style.value
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <p className="font-medium text-white">{style.label}</p>
              <p className="mt-1 text-sm text-zinc-400">{style.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
