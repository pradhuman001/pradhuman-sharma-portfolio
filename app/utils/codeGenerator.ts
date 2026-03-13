import { PortfolioData, ThemeConfig } from "../types/portfolio";

export function generatePackageJson(name: string): string {
  const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-") || "my-portfolio";
  return `{
  "name": "${safeName}-portfolio",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.16.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10",
    "postcss": "^8",
    "tailwindcss": "^3.4.0",
    "typescript": "^5"
  }
}`;
}

export function generateTailwindConfig(): string {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
}

export function generatePostcssConfig(): string {
  return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
}

export function generateTsConfig(): string {
  return `{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`;
}

export function generateNextConfig(): string {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {}
module.exports = nextConfig`;
}

export function generateGlobalsCss(theme: ThemeConfig): string {
  const bgColor = theme.mode === "dark" ? "#0a0a0a" : "#ffffff";
  const textColor = theme.mode === "dark" ? "#ededed" : "#171717";
  
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: ${bgColor};
  --foreground: ${textColor};
  --primary: ${theme.primaryColor};
  --accent: ${theme.accentColor};
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: system-ui, -apple-system, sans-serif;
}

html {
  scroll-behavior: smooth;
}

::selection {
  background-color: var(--primary);
  color: #fff;
}`;
}

export function generateLayout(data: PortfolioData): string {
  const seoTitle = data.seo.title || `${data.fullName} — ${data.profession}`;
  const seoDescription = data.seo.description || data.shortBio;
  const socialImage = data.seo.socialPreviewImage;

  return `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "${seoTitle.replace(/"/g, '\\"')}",
  description: "${seoDescription.replace(/"/g, '\\"')}",
  openGraph: {
    title: "${seoTitle.replace(/"/g, '\\"')}",
    description: "${seoDescription.replace(/"/g, '\\"')}",
    images: ${socialImage ? `["${socialImage.replace(/"/g, '\\"')}"]` : "[]"},
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`;
}

export function generateMainPage(data: PortfolioData, theme: ThemeConfig): string {
  const projectsJson = JSON.stringify(data.projects, null, 2);
  const experiencesJson = JSON.stringify(data.experiences, null, 2);
  const educationJson = JSON.stringify(data.education, null, 2);
  const achievementsJson = JSON.stringify(data.achievements, null, 2);
  const skillsJson = JSON.stringify(data.skills);
  const socialLinksJson = JSON.stringify(data.socialLinks, null, 2);

  return `"use client";

import { motion } from "framer-motion";

const portfolioData = {
  fullName: "${data.fullName}",
  profession: "${data.profession}",
  profilePhoto: "${data.profilePhoto}",
  shortBio: \`${data.shortBio}\`,
  aboutSection: \`${data.aboutSection}\`,
  skills: ${skillsJson},
  projects: ${projectsJson},
  experiences: ${experiencesJson},
  education: ${educationJson},
  achievements: ${achievementsJson},
  socialLinks: ${socialLinksJson},
};

const theme = {
  primaryColor: "${theme.primaryColor}",
  accentColor: "${theme.accentColor}",
};

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {portfolioData.profilePhoto && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mb-8 h-32 w-32 overflow-hidden rounded-full border-4 border-white/20"
            >
              <img
                src={portfolioData.profilePhoto}
                alt={portfolioData.fullName}
                className="h-full w-full object-cover"
              />
            </motion.div>
          )}
          <p 
            className="mb-4 text-sm font-medium tracking-[0.3em] uppercase"
            style={{ color: theme.primaryColor }}
          >
            {portfolioData.profession}
          </p>
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-7xl">
            {portfolioData.fullName}
          </h1>
          <p className="mx-auto max-w-xl text-lg text-zinc-400">
            {portfolioData.shortBio}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#projects"
              className="inline-flex h-12 items-center rounded-full px-8 text-sm font-medium text-white"
              style={{ background: \`linear-gradient(135deg, \${theme.primaryColor}, \${theme.accentColor})\` }}
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="inline-flex h-12 items-center rounded-full border border-white/20 px-8 text-sm font-medium text-zinc-300 hover:border-white/40"
            >
              Get In Touch
            </a>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      {portfolioData.aboutSection && (
        <section id="about" className="px-6 py-32">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="mb-2 text-sm font-medium tracking-widest uppercase" style={{ color: theme.primaryColor }}>
                About Me
              </p>
              <h2 className="mb-8 text-3xl font-bold sm:text-4xl">Get to know me better</h2>
              <p className="text-lg leading-relaxed text-zinc-400">{portfolioData.aboutSection}</p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {portfolioData.skills.length > 0 && (
        <section id="skills" className="px-6 py-32">
          <div className="mx-auto max-w-4xl">
            <p className="mb-2 text-sm font-medium tracking-widest uppercase" style={{ color: theme.primaryColor }}>
              Skills
            </p>
            <h2 className="mb-12 text-3xl font-bold sm:text-4xl">Technologies I work with</h2>
            <div className="flex flex-wrap gap-3">
              {portfolioData.skills.map((skill: string) => (
                <motion.span
                  key={skill}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium"
                  style={{ background: \`\${theme.primaryColor}20\` }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {portfolioData.projects.length > 0 && (
        <section id="projects" className="px-6 py-32">
          <div className="mx-auto max-w-5xl">
            <p className="mb-2 text-sm font-medium tracking-widest uppercase" style={{ color: theme.primaryColor }}>
              Projects
            </p>
            <h2 className="mb-12 text-3xl font-bold sm:text-4xl">Featured Work</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {portfolioData.projects.map((project: any) => (
                <motion.div
                  key={project.id}
                  whileHover={{ y: -5 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-8"
                >
                  <h3 className="mb-3 text-xl font-bold">{project.title}</h3>
                  <p className="mb-4 text-sm text-zinc-400">{project.description}</p>
                  <div className="mb-6 flex flex-wrap gap-2">
                    {project.techStack.map((tech: string) => (
                      <span
                        key={tech}
                        className="rounded-full px-3 py-1 text-xs font-medium"
                        style={{ background: \`\${theme.primaryColor}20\`, color: theme.primaryColor }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 text-sm">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white">
                        Live Demo →
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white">
                        GitHub →
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section */}
      {portfolioData.experiences.length > 0 && (
        <section id="experience" className="px-6 py-32">
          <div className="mx-auto max-w-4xl">
            <p className="mb-2 text-sm font-medium tracking-widest uppercase" style={{ color: theme.primaryColor }}>
              Experience
            </p>
            <h2 className="mb-12 text-3xl font-bold sm:text-4xl">Work History</h2>
            <div className="space-y-8">
              {portfolioData.experiences.map((exp: any) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{exp.role}</h3>
                      <p style={{ color: theme.primaryColor }}>{exp.company}</p>
                    </div>
                    <span className="text-sm text-zinc-500">{exp.duration}</span>
                  </div>
                  {exp.description && <p className="mt-3 text-sm text-zinc-400">{exp.description}</p>}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {portfolioData.education.length > 0 && (
        <section id="education" className="px-6 py-32">
          <div className="mx-auto max-w-4xl">
            <p className="mb-2 text-sm font-medium tracking-widest uppercase" style={{ color: theme.primaryColor }}>
              Education
            </p>
            <h2 className="mb-12 text-3xl font-bold sm:text-4xl">Academic Background</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {portfolioData.education.map((edu: any) => (
                <div key={edu.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{edu.degree}</h3>
                      <p className="text-zinc-400">{edu.university}</p>
                    </div>
                    <span className="text-sm text-zinc-500">{edu.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Achievements Section */}
      {portfolioData.achievements.length > 0 && (
        <section id="achievements" className="px-6 py-32">
          <div className="mx-auto max-w-4xl">
            <p className="mb-2 text-sm font-medium tracking-widest uppercase" style={{ color: theme.primaryColor }}>
              Achievements
            </p>
            <h2 className="mb-12 text-3xl font-bold sm:text-4xl">Certifications & Awards</h2>
            <div className="space-y-4">
              {portfolioData.achievements.map((ach: any) => (
                <div key={ach.id} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-6">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{ background: \`\${theme.primaryColor}20\` }}
                  >
                    <svg className="h-5 w-5" style={{ color: theme.primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold">{ach.title}</h3>
                      {ach.year && <span className="text-sm text-zinc-500">{ach.year}</span>}
                    </div>
                    {ach.description && <p className="mt-1 text-sm text-zinc-400">{ach.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="px-6 py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 text-sm font-medium tracking-widest uppercase" style={{ color: theme.primaryColor }}>
            Contact
          </p>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Let&apos;s Work Together</h2>
          <p className="mb-10 text-zinc-400">Have a project in mind? I&apos;d love to hear from you.</p>
          
          {portfolioData.socialLinks.email && (
            <a
              href={\`mailto:\${portfolioData.socialLinks.email}\`}
              className="mb-10 inline-block text-2xl font-medium hover:opacity-80"
            >
              {portfolioData.socialLinks.email}
            </a>
          )}
          
          <div className="flex flex-wrap justify-center gap-4">
            {portfolioData.socialLinks.github && (
              <a
                href={portfolioData.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 text-sm text-zinc-300 hover:border-white/20"
              >
                GitHub
              </a>
            )}
            {portfolioData.socialLinks.linkedin && (
              <a
                href={portfolioData.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 text-sm text-zinc-300 hover:border-white/20"
              >
                LinkedIn
              </a>
            )}
            {portfolioData.socialLinks.twitter && (
              <a
                href={portfolioData.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 text-sm text-zinc-300 hover:border-white/20"
              >
                Twitter
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} {portfolioData.fullName}. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}`;
}

export function generateReadme(name: string): string {
  return `# ${name}'s Portfolio

A modern portfolio website built with Next.js, Tailwind CSS, and Framer Motion.

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy

The easiest way to deploy is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push this code to a GitHub repository
2. Import the repository on Vercel
3. Deploy!

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations

## License

MIT License - feel free to use this for your own portfolio!
`;
}

export function generateGitignore(): string {
  return `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`;
}

export function generateNextEnvDts(): string {
  return `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
`;
}
