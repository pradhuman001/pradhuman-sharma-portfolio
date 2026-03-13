export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  images: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  university: string;
  year: string;
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  year?: string;
}

export interface SocialLinks {
  email: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
}

export interface SeoSettings {
  title: string;
  description: string;
  socialPreviewImage: string;
}

export interface PortfolioData {
  // Basic Info
  fullName: string;
  profession: string;
  username: string;
  profilePhoto: string;
  shortBio: string;
  aboutSection: string;
  seo: SeoSettings;

  // Skills
  skills: string[];

  // Projects
  projects: Project[];

  // Experience
  experiences: Experience[];

  // Education
  education: Education[];

  // Achievements
  achievements: Achievement[];

  // Contact
  socialLinks: SocialLinks;
}

export type ThemeMode = "dark" | "light";
export type SceneStyle = "minimal" | "futuristic" | "developer" | "creative";
export type TemplateStyle = "developer" | "minimal" | "creative";

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  accentColor: string;
  sceneStyle: SceneStyle;
  template: TemplateStyle;
}

export interface SavedPortfolio {
  id: string;
  title: string;
  username: string;
  profession: string;
  updatedAt: string;
  paymentStatus: "unpaid" | "paid";
  isPaidUnlocked: boolean;
  data: PortfolioData;
  theme: ThemeConfig;
}

export const defaultPortfolioData: PortfolioData = {
  fullName: "",
  profession: "",
  username: "",
  profilePhoto: "",
  shortBio: "",
  aboutSection: "",
  seo: {
    title: "",
    description: "",
    socialPreviewImage: "",
  },
  skills: [],
  projects: [],
  experiences: [],
  education: [],
  achievements: [],
  socialLinks: {
    email: "",
  },
};

export const defaultThemeConfig: ThemeConfig = {
  mode: "dark",
  primaryColor: "#8b5cf6",
  accentColor: "#ec4899",
  sceneStyle: "futuristic",
  template: "developer",
};
