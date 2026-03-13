"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  PortfolioData,
  ThemeConfig,
  defaultPortfolioData,
  defaultThemeConfig,
  SavedPortfolio,
  Project,
  Experience,
  Education,
  Achievement,
} from "../types/portfolio";

interface PortfolioStore {
  // Data
  portfolioData: PortfolioData;
  themeConfig: ThemeConfig;
  currentStep: number;
  savedPortfolios: SavedPortfolio[];
  currentPortfolioId: string | null;

  // Actions - Basic Info
  setBasicInfo: (data: Partial<PortfolioData>) => void;

  // Actions - Skills
  setSkills: (skills: string[]) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;

  // Actions - Projects
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;

  // Actions - Experience
  addExperience: (experience: Experience) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;

  // Actions - Education
  addEducation: (education: Education) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  // Actions - Achievements
  addAchievement: (achievement: Achievement) => void;
  updateAchievement: (id: string, achievement: Partial<Achievement>) => void;
  removeAchievement: (id: string) => void;

  // Actions - Social Links
  setSocialLinks: (links: PortfolioData["socialLinks"]) => void;

  // Actions - Theme
  setThemeConfig: (config: Partial<ThemeConfig>) => void;

  // Actions - Navigation
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  unlockPaidAccessForCurrentPortfolio: () => void;
  isCurrentPortfolioPaid: () => boolean;
  saveCurrentPortfolio: () => void;
  loadSavedPortfolio: (id: string) => void;
  deleteSavedPortfolio: (id: string) => void;

  // Actions - Reset
  resetPortfolio: () => void;
}

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set, get) => ({
      portfolioData: defaultPortfolioData,
      themeConfig: defaultThemeConfig,
      currentStep: 0,
      savedPortfolios: [],
      currentPortfolioId: null,

      setBasicInfo: (data) =>
        set((state) => ({
          portfolioData: { ...state.portfolioData, ...data },
        })),

      setSkills: (skills) =>
        set((state) => ({
          portfolioData: { ...state.portfolioData, skills },
        })),

      addSkill: (skill) =>
        set((state) => ({
          portfolioData: {
            ...state.portfolioData,
            skills: [...state.portfolioData.skills, skill],
          },
        })),

      removeSkill: (skill) =>
        set((state) => ({
          portfolioData: {
            ...state.portfolioData,
            skills: state.portfolioData.skills.filter((s) => s !== skill),
          },
        })),

      addProject: (project) =>
        set((state) => ({
          portfolioData: {
            ...state.portfolioData,
            projects: [...state.portfolioData.projects, project],
          },
        })),

      updateProject: (id, project) =>
        set((state) => ({
          portfolioData: {
            ...state.portfolioData,
            projects: state.portfolioData.projects.map((p) =>
              p.id === id ? { ...p, ...project } : p
            ),
          },
        })),

      removeProject: (id) =>
        set((state) => ({
          portfolioData: {
            ...state.portfolioData,
            projects: state.portfolioData.projects.filter((p) => p.id !== id),
          },
        })),

      addExperience: (experience) =>
        set((state) => ({
          portfolioData: {
            ...state.portfolioData,
            experiences: [...state.portfolioData.experiences, experience],
          },
        })),

      updateExperience: (id, experience) =>
        set((state) => ({
          portfolioData: {
            ...state.portfolioData,
            experiences: state.portfolioData.experiences.map((e) =>
              e.id === id ? { ...e, ...experience } : e
            ),
          },
        })),

      removeExperience: (id) =>
        set((state) => ({
          portfolioData: {
            ...state.portfolioData,
            experiences: state.portfolioData.experiences.filter(
              (e) => e.id !== id
            ),
          },
        })),

      addEducation: (education) =>
        set((state) => ({
          portfolioData: {
            ...state.portfolioData,
            education: [...state.portfolioData.education, education],
          },
        })),

      updateEducation: (id, education) =>
        set((state) => ({
          portfolioData: {
            ...state.portfolioData,
            education: state.portfolioData.education.map((e) =>
              e.id === id ? { ...e, ...education } : e
            ),
          },
        })),

      removeEducation: (id) =>
        set((state) => ({
          portfolioData: {
            ...state.portfolioData,
            education: state.portfolioData.education.filter((e) => e.id !== id),
          },
        })),

      addAchievement: (achievement) =>
        set((state) => ({
          portfolioData: {
            ...state.portfolioData,
            achievements: [...state.portfolioData.achievements, achievement],
          },
        })),

      updateAchievement: (id, achievement) =>
        set((state) => ({
          portfolioData: {
            ...state.portfolioData,
            achievements: state.portfolioData.achievements.map((a) =>
              a.id === id ? { ...a, ...achievement } : a
            ),
          },
        })),

      removeAchievement: (id) =>
        set((state) => ({
          portfolioData: {
            ...state.portfolioData,
            achievements: state.portfolioData.achievements.filter(
              (a) => a.id !== id
            ),
          },
        })),

      setSocialLinks: (links) =>
        set((state) => ({
          portfolioData: { ...state.portfolioData, socialLinks: links },
        })),

      setThemeConfig: (config) =>
        set((state) => ({
          themeConfig: { ...state.themeConfig, ...config },
        })),

      setCurrentStep: (step) => set({ currentStep: step }),

      nextStep: () =>
        set((state) => ({ currentStep: Math.min(state.currentStep + 1, 7) })),

      prevStep: () =>
        set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),

      unlockPaidAccessForCurrentPortfolio: () =>
        set((state) => {
          if (!state.currentPortfolioId) {
            return state;
          }

          return {
            savedPortfolios: state.savedPortfolios.map((portfolio) =>
              portfolio.id === state.currentPortfolioId
                ? {
                    ...portfolio,
                    isPaidUnlocked: true,
                    paymentStatus: "paid",
                  }
                : portfolio
            ),
          };
        }),

      isCurrentPortfolioPaid: () => {
        const state = get();
        if (!state.currentPortfolioId) {
          return false;
        }

        return state.savedPortfolios.some(
          (portfolio) =>
            portfolio.id === state.currentPortfolioId &&
            (portfolio.isPaidUnlocked || portfolio.paymentStatus === "paid")
        );
      },

      saveCurrentPortfolio: () =>
        set((state) => {
          const portfolioTitle = state.portfolioData.fullName || "Untitled Portfolio";
          const normalizedUsername =
            state.portfolioData.username
              .toLowerCase()
              .replace(/[^a-z0-9-]/g, "") ||
            portfolioTitle.toLowerCase().replace(/[^a-z0-9]/g, "-");

          const existing = state.savedPortfolios.find(
            (portfolio) => portfolio.id === state.currentPortfolioId
          );

          const nextPortfolio: SavedPortfolio = {
            id: existing?.id || `${Date.now()}`,
            title: portfolioTitle,
            username: normalizedUsername,
            profession: state.portfolioData.profession,
            updatedAt: new Date().toISOString(),
            paymentStatus: existing?.paymentStatus || "unpaid",
            isPaidUnlocked: existing?.isPaidUnlocked || false,
            data: state.portfolioData,
            theme: state.themeConfig,
          };

          const existingIndex = state.savedPortfolios.findIndex((portfolio) => {
            if (state.currentPortfolioId) {
              return portfolio.id === state.currentPortfolioId;
            }

            return portfolio.title === portfolioTitle;
          });

          if (existingIndex >= 0) {
            const updatedPortfolios = [...state.savedPortfolios];
            updatedPortfolios[existingIndex] = {
              ...updatedPortfolios[existingIndex],
              ...nextPortfolio,
            };

            return {
              savedPortfolios: updatedPortfolios,
              currentPortfolioId: updatedPortfolios[existingIndex].id,
            };
          }

          return {
            savedPortfolios: [nextPortfolio, ...state.savedPortfolios].slice(0, 12),
            currentPortfolioId: nextPortfolio.id,
          };
        }),

      loadSavedPortfolio: (id) =>
        set((state) => {
          const foundPortfolio = state.savedPortfolios.find(
            (portfolio) => portfolio.id === id
          );

          if (!foundPortfolio) {
            return state;
          }

          return {
            portfolioData: foundPortfolio.data,
            themeConfig: foundPortfolio.theme,
            currentPortfolioId: foundPortfolio.id,
          };
        }),

      deleteSavedPortfolio: (id) =>
        set((state) => ({
          savedPortfolios: state.savedPortfolios.filter(
            (portfolio) => portfolio.id !== id
          ),
          currentPortfolioId:
            state.currentPortfolioId === id ? null : state.currentPortfolioId,
        })),

      resetPortfolio: () =>
        set({
          portfolioData: defaultPortfolioData,
          themeConfig: defaultThemeConfig,
          currentStep: 0,
          currentPortfolioId: null,
        }),
    }),
    {
      name: "portfolio-builder-storage",
      version: 3,
      migrate: (persistedState: unknown) => {
        const state = (persistedState as Partial<PortfolioStore>) || {};

        const mergedPortfolioData: PortfolioData = {
          ...defaultPortfolioData,
          ...(state.portfolioData || {}),
          socialLinks: {
            ...defaultPortfolioData.socialLinks,
            ...(state.portfolioData?.socialLinks || {}),
          },
          seo: {
            ...defaultPortfolioData.seo,
            ...(state.portfolioData?.seo || {}),
          },
        };

        const mergedThemeConfig: ThemeConfig = {
          ...defaultThemeConfig,
          ...(state.themeConfig || {}),
        };

        const mergedSavedPortfolios: SavedPortfolio[] = (state.savedPortfolios || []).map(
          (portfolio) => ({
            ...portfolio,
            username:
              portfolio.username ||
              portfolio.title.toLowerCase().replace(/[^a-z0-9]/g, "-"),
            paymentStatus:
              portfolio.paymentStatus ||
              (portfolio.isPaidUnlocked ? "paid" : "unpaid"),
            isPaidUnlocked: Boolean(portfolio.isPaidUnlocked),
            data: {
              ...defaultPortfolioData,
              ...portfolio.data,
              socialLinks: {
                ...defaultPortfolioData.socialLinks,
                ...(portfolio.data?.socialLinks || {}),
              },
              seo: {
                ...defaultPortfolioData.seo,
                ...(portfolio.data?.seo || {}),
              },
            },
            theme: {
              ...defaultThemeConfig,
              ...portfolio.theme,
            },
          })
        );

        return {
          ...state,
          portfolioData: mergedPortfolioData,
          themeConfig: mergedThemeConfig,
          savedPortfolios: mergedSavedPortfolios,
        } as PortfolioStore;
      },
    }
  )
);
