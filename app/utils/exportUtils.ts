import JSZip from "jszip";
import { saveAs } from "file-saver";
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

export async function downloadPortfolioCode(
  data: PortfolioData,
  theme: ThemeConfig
): Promise<void> {
  const zip = new JSZip();
  const folderName = data.fullName
    ? `${data.fullName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-portfolio`
    : "my-portfolio";

  // Root files
  zip.file("package.json", generatePackageJson(data.fullName));
  zip.file("tailwind.config.js", generateTailwindConfig());
  zip.file("postcss.config.js", generatePostcssConfig());
  zip.file("tsconfig.json", generateTsConfig());
  zip.file("next.config.js", generateNextConfig());
  zip.file("README.md", generateReadme(data.fullName || "My Portfolio"));
  zip.file(".gitignore", generateGitignore());
  zip.file("next-env.d.ts", generateNextEnvDts());

  // App directory
  const appFolder = zip.folder("app");
  if (appFolder) {
    appFolder.file("globals.css", generateGlobalsCss(theme));
    appFolder.file("layout.tsx", generateLayout(data));
    appFolder.file("page.tsx", generateMainPage(data, theme));
  }

  // Public directory (placeholder)
  const publicFolder = zip.folder("public");
  if (publicFolder) {
    publicFolder.file(".gitkeep", "");
  }

  // Generate and download
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${folderName}.zip`);
}

export function getVercelDeployUrl(repoUrl?: string): string {
  const baseUrl = "https://vercel.com/new/clone";
  
  if (repoUrl) {
    return `${baseUrl}?repository-url=${encodeURIComponent(repoUrl)}`;
  }
  
  // Default: redirect to Vercel's new project page
  return "https://vercel.com/new";
}

export function generateDeployInstructions(): string {
  return `
## How to Deploy Your Portfolio

### Option 1: Deploy via GitHub (Recommended)

1. Extract the downloaded ZIP file
2. Create a new GitHub repository
3. Push the code to GitHub:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   \`\`\`
4. Go to [vercel.com/new](https://vercel.com/new)
5. Import your GitHub repository
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI: \`npm i -g vercel\`
2. Navigate to your project folder
3. Run: \`vercel\`
4. Follow the prompts

Your portfolio will be live in seconds!
  `.trim();
}
