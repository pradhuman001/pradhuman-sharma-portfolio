import { PortfolioData, ThemeConfig } from "../types/portfolio";
import {
  generatePackageJson,
  generateTailwindConfig,
  generatePostcssConfig,
  generateTsConfig,
  generateNextConfig,
  generateGlobalsCss,
  generateLayout,
  generateMainPage,
  generateReadme,
  generateGitignore,
  generateNextEnvDts,
} from "./codeGenerator";

const GITHUB_API_BASE = "https://api.github.com";

export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  html_url: string;
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  html_url: string;
  default_branch: string;
}

// Store token in session storage for security
export function setGitHubToken(token: string): void {
  sessionStorage.setItem("github_token", token);
}

export function getGitHubToken(): string | null {
  return sessionStorage.getItem("github_token");
}

export function clearGitHubToken(): void {
  sessionStorage.removeItem("github_token");
}

// Verify token and get user info
export async function verifyGitHubToken(token: string): Promise<GitHubUser | null> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("GitHub verification failed:", error);
    return null;
  }
}

// Create a new repository
export async function createGitHubRepo(
  token: string,
  repoName: string,
  description: string,
  isPrivate: boolean = false
): Promise<GitHubRepo | null> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/user/repos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: repoName,
        description,
        private: isPrivate,
        auto_init: false,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create repository");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to create repo:", error);
    throw error;
  }
}

// Get file content as base64
function encodeBase64(content: string): string {
  return btoa(unescape(encodeURIComponent(content)));
}

// Create or update a file in the repository
async function createOrUpdateFile(
  token: string,
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  branch: string = "main"
): Promise<boolean> {
  try {
    // Check if file exists to get its SHA
    let sha: string | undefined;
    try {
      const existingFile = await fetch(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      if (existingFile.ok) {
        const data = await existingFile.json();
        sha = data.sha;
      }
    } catch {
      // File doesn't exist, which is fine
    }

    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          content: encodeBase64(content),
          branch,
          ...(sha ? { sha } : {}),
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error(`Failed to create file ${path}:`, error);
    return false;
  }
}

// Push all portfolio files to GitHub
export async function pushToGitHub(
  token: string,
  owner: string,
  repo: string,
  data: PortfolioData,
  theme: ThemeConfig,
  onProgress?: (progress: number, message: string) => void
): Promise<{ success: boolean; repoUrl: string }> {
  const files = [
    { path: "package.json", content: generatePackageJson(data.fullName) },
    { path: "tailwind.config.js", content: generateTailwindConfig() },
    { path: "postcss.config.js", content: generatePostcssConfig() },
    { path: "tsconfig.json", content: generateTsConfig() },
    { path: "next.config.js", content: generateNextConfig() },
    { path: "README.md", content: generateReadme(data.fullName || "My Portfolio") },
    { path: ".gitignore", content: generateGitignore() },
    { path: "next-env.d.ts", content: generateNextEnvDts() },
    { path: "app/globals.css", content: generateGlobalsCss(theme) },
    { path: "app/layout.tsx", content: generateLayout(data) },
    { path: "app/page.tsx", content: generateMainPage(data, theme) },
    { path: "public/.gitkeep", content: "" },
  ];

  let completed = 0;
  const total = files.length;

  for (const file of files) {
    onProgress?.(
      Math.round((completed / total) * 100),
      `Uploading ${file.path}...`
    );

    const success = await createOrUpdateFile(
      token,
      owner,
      repo,
      file.path,
      file.content,
      `Add ${file.path}`
    );

    if (!success) {
      throw new Error(`Failed to upload ${file.path}`);
    }

    completed++;
    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  onProgress?.(100, "Complete!");

  return {
    success: true,
    repoUrl: `https://github.com/${owner}/${repo}`,
  };
}

// Get user's repositories
export async function getUserRepos(token: string): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/user/repos?sort=updated&per_page=30`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch repos:", error);
    return [];
  }
}
