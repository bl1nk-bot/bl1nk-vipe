# Vibe Coding Agent

An end-to-end coding platform where users enter text prompts and an AI agent generates full-stack applications in a sandboxed environment with live preview, file explorer, and command logs.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-description=A+full-stack+coding+platform+built+with+Vercel%27s+AI+Cloud%2C+AI+SDK%2C+and+Next.js.&demo-image=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fv1754588832%2FOSSvibecodingplatform%2Fscreenshot.png&demo-title=Vibe+Coding+Platform&demo-url=https%3A%2F%2Fvercel.fyi%2Fvibes&project-name=Vibe+Coding+Platform&repository-name=vibe-coding-platform&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fapps%2Fvibe-coding-platform&from=vibe-coding-platform-app)

## Features

- Multi-model support via AI Gateway (Claude, GPT, Grok)
- Secure code execution with Vercel Sandbox
- Real-time live preview of generated apps
- File explorer for browsing project files
- Command logs and error monitoring
- One-click deploy to Vercel
- Qwen Code integration for AI-assisted development
- Comprehensive tooling (Biome, Knip, CSpell, Playwright)

## Tech Stack

- [Next.js](https://nextjs.org) with Turbopack
- [AI SDK](https://ai-sdk.dev) v6
- [Vercel AI Gateway](https://vercel.com/docs/ai-gateway)
- [Vercel Sandbox](https://vercel.com/docs/vercel-sandbox)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Biome](https://biomejs.dev) - Linter and formatter
- [Knip](https://knip.dev) - Unused detection
- [CSpell](https://cspell.org) - Spell checking
- [Playwright](https://playwright.dev) - E2E testing
- [Qwen Code](https://qwenlm.github.io/qwen-code-docs/)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Run Locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Development Environment

For full development environment with Python, Node, Rust tools, use Dev Containers:

1. Open in VS Code
2. `Dev Containers: Reopen in Container` when prompted
3. Tools will be automatically installed

## Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Lint code with Biome
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code with Biome
- `pnpm type-check` - TypeScript checking
- `pnpm test` - Unit tests with Vitest
- `pnpm test:run` - Run tests once
- `pnpm test:e2e` - Run end-to-end tests with Playwright
- `pnpm spellcheck` - Spell check with CSpell
- `pnpm knip` - Check for unused files/exports
- `pnpm markdownlint` - Lint markdown files
- `pnpm playwright:install` - Install Playwright browsers

## Code Quality

This project uses several tools for maintaining code quality:

- **Biome**: Fast linter and formatter replacing ESLint + Prettier
- **Knip**: Detects unused files, exports, and dependencies
- **CSpell**: Spell checker for code and documentation
- **Markdownlint**: Lints markdown files
- **Playwright**: End-to-end testing framework
- **.editorconfig**: Ensures consistent editor settings

## Supported Models

- Claude Opus 4.6
- Claude Sonnet 4.6
- GPT-5.3 Codex
- Grok 4.1 Reasoning
- Qwen models via Qwen Code integration

## Deploy

Click the deploy button above or run:

```bash
vc deploy
```