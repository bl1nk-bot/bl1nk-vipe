# Vibe Coding Agent

Vibe Coding Agent is an AI-powered application that connects multiple services (Agent, Sandbox, Kilo Gateway, Vercel, Modal Serverless) with a focus on easy-to-use interface for agent monitoring and control, dashboard with GitHub heatmap, Apple Watch chart, Line chart for agent activity tracking, trust-building features for users who want to let agents work autonomously. NOT a dev tool, but a connector/interface that makes complex things simple.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-description=A+full-stack+agent+monitoring+connector+built+with+Vercel%27s+AI+Cloud%2C+AI+SDK%2C+and+Next.js.&demo-image=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fv1754588832%2FOSSvibecodingplatform%2Fscreenshot.png&demo-title=Vibe+Coding+Agent&demo-url=https%3A%2F%2Fvercel.fyi%2Fvibes&project-name=Vibe+Coding+Agent&repository-name=vibe-coding-platform&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fapps%2Fvibe-coding-platform&from=vibe-coding-platform-app)

## Features

- Agent activity monitoring (GitHub heatmap, Apple Watch chart, Line chart)
- Trust-building features for autonomous agent operation
- Multi-service connector (Kilo Gateway, Modal Serverless, Vercel, Sandbox)
- Session management with lock interfaces
- Workflow orchestration with Upstash
- Real-time dashboard and controls

## Tech Stack

- [Next.js](https://nextjs.org) with Turbopack
- [AI SDK](https://ai-sdk.dev) v7
- [Kilo Gateway](https://api.kilo.ai/api/gateway) - OpenAI-compatible API endpoint
- [Modal Serverless](https://modal.com/docs) - Serverless functions and containers
- [Agent Client Protocol (ACP) SDK](https://acp-sdk.dev) - Standardized communication between editors and coding agents
- [uipro-cli](https://uipro-cli.dev) - UI/UX Pro Max skill for AI coding assistants
- [Upstash](https://upstash.com/docs) - Workflow orchestration with durable execution
- [Vercel Edge Runtime](https://vercel.com/docs/concepts/functions/edge-functions) - For proxy and webhook handling
- [Vercel AI Gateway](https://vercel.com/docs/ai-gateway)
- [Vercel Sandbox](https://vercel.com/docs/vercel-sandbox)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [zod](https://zod.dev) - Schema validation
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

### AI Services Architecture

Note: This application leverages a multi-service AI architecture.

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

- Models accessible via Kilo Gateway (Claude, GPT, Grok series)
- Qwen models for code assistance
- Upcoming integrations with other providers

## Architecture

Brief link to [docs/architecture.md](docs/architecture.md)

## API Documentation

Link to [docs/openapi.yaml](docs/openapi.yaml)

## Schemas

Link to [schemas/](schemas/) directory

## Deploy

Click the deploy button above or run:

```bash
vc deploy
```