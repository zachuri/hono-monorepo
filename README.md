# 🚀 Hono Monorepo with Next.js and Cloudflare

![Static Badge](https://img.shields.io/badge/Hono-4.9.4-blue?link=https%3A%2F%2Fhono.dev)
![Static Badge](https://img.shields.io/badge/Next.js-15.1.8-black?link=https%3A%2F%2Fnextjs.org)
![Static Badge](https://img.shields.io/badge/shadcn%2Fui-0.8.0-blue?link=https%3A%2F%2Fgithub.com%2Fshadcn%2Fui)

![Bun](https://img.shields.io/badge/Bun-1.1.17-000000.svg?&logo=bun&logoColor=white)

A modern full-stack monorepo featuring Hono API, Next.js frontend, and a shared shadcn/ui component library, powered by Bun, Vitest, Playwright, Storybook, and Biome.

- [🌟 Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [📦 What's Inside?](#-whats-inside)
- [🛠️ Useful Commands](#️-useful-commands)
- [🧰 Development Tools](#-development-tools)
- [🔐 Authentication](#-authentication)
- [🗄️ Database](#️-database)
- [🚀 Deployment](#-deployment)
- [🔗 Useful Links](#-useful-links)

## 🌟 Features

- 📦 Monorepo structure with Turborepo for efficient build system and caching
- ⚡ Next.js 15 with App Router for fast, server-side rendered React applications
- 🔥 Hono API with Cloudflare Workers for high-performance serverless functions
- 🎨 shadcn/ui for beautiful, customizable UI components
- 🔐 Better Auth for modern authentication with multiple providers
- 🗄️ Drizzle ORM with Neon Database for type-safe database operations
- 🐰 Bun as a fast, all-in-one JavaScript runtime
- 🧪 Vitest for speedy unit testing
- 🎭 Playwright for reliable end-to-end testing
- 📖 Storybook for isolated component development and documentation
- 🌿 Biome for fast, opinionated linting and formatting
- 🔄 Git hooks with Lefthook for automated code quality
- 🚀 CI/CD setup with GitHub Actions

## 🚀 Quick Start

```sh
# Clone the repository
git clone <your-repo-url>

# Navigate to the project directory
cd hono-monorepo

# Install dependencies
bun install

# Set up environment variables
cp packages/api/.dev.vars.example packages/api/.dev.vars.local

# Start development servers
bun dev
```

### Add UI Components

```sh
bun ui:add:component <component-name>
```

> This works just like the add command in the `shadcn/ui` CLI. 🎨

## What's inside? 📦

```mermaid
graph TD
    A[Turborepo] --> B[Apps]
    A --> C[Packages]
    B --> D[@acme/web]
    B --> E[@acme/storybook]
    C --> F[@acme/api]
    C --> G[@acme/ui]
    C --> H[@acme/app]
    C --> I[@acme/tsconfig]
```

| App/Package       | Description                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| `@acme/web`       | Next.js web application with App Router 🌐                                                             |
| `@acme/api`       | Hono API with Cloudflare Workers and OpenAPI documentation 🔥 ([API README](./packages/api/README.md)) |
| `@acme/ui`        | Core React components and design system shared by applications (powered by shadcn/ui) 🎨               |
| `@acme/app`       | Shared app utilities and providers 🛠️                                                                  |
| `@acme/storybook` | Storybook for component development and documentation 📚                                               |
| `@acme/tsconfig`  | Shared `tsconfig.json` configurations 🛡️                                                               |

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/). 💪

### Utilities 🧰

This Turborepo has some additional tools already set up for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking ✅
- [Biome](https://biomejs.dev/) for code linting, formatting, and fixing 🌿
- [Vitest](https://vitest.dev/) for unit tests 🧪
- [Playwright](https://playwright.dev/) for end-to-end tests 🧪
- [Changesets](https://github.com/changesets/changesets) for managing versioning, changelogs, and publishing 📝
- [Storybook](https://storybook.js.org/) for component development and documentation 📚
- [Lefthook](https://github.com/evilmartians/lefthook) for Git hooks 🔗

### Storybook 📚

This Turborepo includes Storybook for component development and documentation. Storybook is set up for both the `@acme/web` and `@acme/ui` packages, allowing the development and showcasing of components from both your main application and your shared UI library.

To run Storybook:

```sh
bun storybook
```

This will start Storybook and open it in your default browser.

#### Story Location

Storybook is configured to find stories in the following locations:

- `apps/storybook/src/**/*.mdx`
- `apps/storybook/src/**/*.stories.@(js|jsx|mjs|ts|tsx)`
- `apps/web/src/**/*.stories.@(js|jsx|mjs|ts|tsx)`
- `packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)`

This configuration allows you to write stories for components in both your web application and your shared UI library.

## 🛠️ Useful Commands

- `bun build` - Build all apps and packages
- `bun dev` - Develop all apps and packages
- `bun test` - Run all tests with vitest
- `bun test:cov` - Run all unit tests with vitest and generate a coverage report
- `bun test:cov:ui` - Run all unit tests with vitest and display the vitest UI
- `bun test:e2e` - Run all end-to-end tests with playwright
- `bun lint` - Lint and format all packages
- `bun lint:fix` - Lint, format, and fix all packages
- `bun changeset` - Generate a changeset 🧑‍🔧
- `bun clean` - Clean up all `node_modules` and `dist` folders
- `bun ui:add:component` - Add a shadcn/ui component to the `@acme/ui` package
- `bun storybook` - Run Storybook for component development and documentation

### API Commands

> 📖 **API Documentation**: For detailed API setup, environment configuration, and Cloudflare deployment instructions, see the [API README](./packages/api/README.md).

- `bun run dev --filter=@acme/api` - Start API development server
- `bun run deploy:staging --filter=@acme/api` - Deploy API to staging
- `bun run deploy:production --filter=@acme/api` - Deploy API to production
- `bun run db:generate --filter=@acme/api` - Generate database migrations
- `bun run db:migrate --filter=@acme/api` - Run database migrations
- `bun run db:studio --filter=@acme/api` - Open Drizzle Studio

### Add a new app or package 📦

Turborepo offers a simple command to add new apps or packages to the monorepo. To add a new app, run the following command:

```sh
bun turbo gen workspace [--name <app-name>]
```

You will be prompted to choose the name and workspace type (app or package) to use.

You can copy an existing app or package with:

```sh
bun turbo gen workspace [--name <app-name>] --copy
```

You will be prompted to choose the name and workspace type of the new app and which app or package to copy.

> [! NOTE]
> Remember to run `bun install` after copying an app. ⚠️

## 🔐 Authentication

This project uses [Better Auth](https://better-auth.com/) for authentication, which provides:

- Multiple authentication providers (OAuth, email/password, etc.)
- Session management
- Type-safe authentication
- Built-in security features

### Authentication Setup

1. Configure your authentication providers in the API
2. Set up the required environment variables
3. The web app automatically connects to the API for authentication

## 🗄️ Database

This project uses:

- **Drizzle ORM** for type-safe database operations
- **Neon Database** as the PostgreSQL provider
- **Database migrations** with Drizzle Kit
- **Drizzle Studio** for database management

### Database Commands

```sh
# Generate migrations
bun run db:generate --filter=@acme/api

# Run migrations
bun run db:migrate --filter=@acme/api

# Open Drizzle Studio
bun run db:studio --filter=@acme/api

# Seed the database
bun run db:seed --filter=@acme/api
```

## 🚀 Deployment

This Turborepo is set up for easy deployment of its various applications.

### Environment Setup 🔧

This project supports multiple environments: development, staging, and production. Each environment has its own configuration files and deployment process.

#### Environment Files Structure

```
packages/api/
├── .dev.vars.local      # Local development variables
├── .dev.vars.staging    # Staging environment variables
├── .dev.vars.production # Production environment variables
└── wrangler.toml        # Wrangler configuration
```

#### Required Environment Variables

**Client-Side (Next.js Apps)**

```bash
NEXT_PUBLIC_APP_URL=    # Your app's public URL
NEXT_PUBLIC_API_URL=    # Your API's public URL
```

**Server-Side (API)**

```bash
API_URL=                # Internal API URL
ENV=                    # "development", "staging", or "production"
DATABASE_URL=           # Database connection string
# Add other API-specific variables as needed
```

#### API Deployment (Cloudflare Workers)

The `packages/api` uses Wrangler for deployment to Cloudflare Workers.

**Available Scripts:**

```bash
# Staging deployment
bun run deploy:staging --filter=@acme/api

# Production deployment
bun run deploy:production --filter=@acme/api

# Push secrets to staging
bun run push:secret:staging --filter=@acme/api

# Push secrets to production
bun run push:secret:production --filter=@acme/api
```

**Deployment Process:**

1. Ensure your `.dev.vars.staging` and `.dev.vars.production` files are properly configured
2. Run the appropriate deployment command
3. Secrets are automatically pushed to the corresponding environment

### Web App Deployment

The `apps/web` can be deployed to Vercel or any other Next.js hosting platform.

**Vercel Deployment:**

1. Connect your repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Storybook Deployment 📚

The `apps/storybook` can be deployed to any static hosting platform or GitHub Pages.

## 🔗 Useful Links

### Build Tools and Configuration

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Bun Documentation](https://bun.sh/docs)
- [Biome Documentation](https://biomejs.dev/guides/getting-started/)

### Frameworks and Libraries

- [Next.js Documentation](https://nextjs.org/docs)
- [Hono Documentation](https://hono.dev/)
- [Better Auth Documentation](https://better-auth.com/)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)

### Testing Tools

- [Vitest Documentation](https://vitest.dev/guide/)
- [Playwright Documentation](https://playwright.dev/docs/intro)

### Development Tools

- [Storybook Documentation](https://storybook.js.org/docs)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [Lefthook Documentation](https://github.com/evilmartians/lefthook)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
