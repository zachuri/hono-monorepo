# 🔥 Hono API with Cloudflare Workers

A high-performance serverless API built with Hono and deployed on Cloudflare Workers, featuring authentication, database integration, and OpenAPI documentation.

## 📋 Table of Contents

1. [Quick Start](#-quick-start)
2. [Environment Variables](#-environment-variables)
3. [Authentication Setup](#-authentication-setup)
4. [Database Integration](#-database-integration)
5. [Cloudflare Workers Deployment](#-cloudflare-workers-deployment)
6. [Development](#-development)
7. [API Documentation](#-api-documentation)

---

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed
- [Cloudflare account](https://cloudflare.com/) with Workers enabled
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) installed

### Local Development

Start the development server:

```bash
# Start with local KV storage
bun run dev

# Start with remote KV storage (for testing production-like behavior)
bun run dev:remote
```

The API will be available at `http://localhost:8787`

### First-time Setup

1. **Install dependencies**:

   ```bash
   bun install
   ```

2. **Set up environment variables** (see [Environment Variables](#-environment-variables) section)

3. **Configure Cloudflare** (see [Cloudflare Workers Deployment](#-cloudflare-workers-deployment) section)

---

## 🔧 Environment Variables

### Required Variables

Create a `.dev.vars` file in the `packages/api` directory with the following variables:

```bash
# Environment
ENV=development

# Database
DATABASE_URL=your_neon_database_url

# Authentication
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:8787

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# API Configuration
API_URL=http://localhost:8787
```

### Environment-Specific Files

- `.dev.vars.local` - Local development
- `.dev.vars.staging` - Staging environment
- `.dev.vars.production` - Production environment

### Using Environment Variables

**Within Hono Context**:

```typescript
// Access environment variables
const dbUrl = env(c).DATABASE_URL;
const authSecret = env(c).BETTER_AUTH_SECRET;

// Set custom variables in context
c.set("CUSTOM_VAR", "value");
```

**Outside Hono Context**:

```typescript
import dotenv from "dotenv";
dotenv.config({ path: ".dev.vars" });

const dbUrl = process.env.DATABASE_URL;
```

## 🔐 Authentication Setup

This API uses [Better Auth](https://better-auth.com/) for modern authentication with multiple providers.

### Supported Providers

- **Google OAuth** - Social login with Google
- **GitHub OAuth** - Social login with GitHub
- **Email/Password** - Traditional authentication

### OAuth Provider Setup

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:8787/api/auth/callback/google` (development)
   - `https://your-domain.com/api/auth/callback/google` (production)

#### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL:
   - `http://localhost:8787/api/auth/callback/github` (development)
   - `https://your-domain.com/api/auth/callback/github` (production)

### Configuration

Add your OAuth credentials to `.dev.vars`:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Better Auth
BETTER_AUTH_SECRET=your_32_character_secret_key
BETTER_AUTH_URL=http://localhost:8787
```

### Adding New Providers

1. Update `.dev.vars` with new provider credentials
2. Configure the provider in your Better Auth setup
3. Update OAuth callback URLs in provider settings

## 🗄️ Database Integration

This API uses [Drizzle ORM](https://orm.drizzle.team/) with [Neon Database](https://neon.tech/) for PostgreSQL.

### Database Setup

1. **Create a Neon Database**:

   - Sign up at [Neon](https://neon.tech/)
   - Create a new database
   - Copy the connection string

2. **Configure Database URL**:
   ```bash
   DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
   ```

### Database Commands

```bash
# Generate migrations
bun run db:generate

# Run migrations
bun run db:migrate

# Push schema changes (development)
bun run db:push

# Open Drizzle Studio (database GUI)
bun run db:studio

# Seed the database
bun run db:seed
```

### Cloudflare Integration

1. **Connect Neon to Cloudflare**:

   - Go to Cloudflare Workers & Pages dashboard
   - Navigate to your worker settings
   - Go to Settings > Integrations
   - Connect your Neon database

2. **Environment Variables**:
   - The `DATABASE_URL` will be automatically available in your worker
   - No additional configuration needed for production

---

## 🚀 Cloudflare Workers Deployment

### Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI**: Install globally with `bun install -g wrangler`
3. **Authentication**: Run `wrangler login` to authenticate

### Initial Setup

#### 1. Create KV Namespaces

```bash
# Create staging KV namespace
bunx wrangler kv:namespace create "hono-monorepo-staging-kv" --env staging

# Create production KV namespace
bunx wrangler kv:namespace create "hono-monorepo-production-kv" --env production
```

#### 2. Update wrangler.toml

After creating KV namespaces, update the IDs in `wrangler.toml`:

```toml
[env.staging]
name = "hono-monorepo-staging"

[[env.staging.kv_namespaces]]
binding = "KV_BETTER_AUTH"
id = "your-actual-staging-kv-id-here"

[env.production]
name = "hono-monorepo-production"

[[env.production.kv_namespaces]]
binding = "KV_BETTER_AUTH"
id = "your-actual-production-kv-id-here"
```

#### 3. Deploy Secrets

```bash
# Deploy staging secrets
bun run push:secret:staging

# Deploy production secrets
bun run push:secret:production
```

### Deployment Commands

```bash
# Deploy to staging
bun run deploy:staging

# Deploy to production
bun run deploy:production

# Deploy to default environment
bun run deploy
```

### Environment Configuration

#### Staging Environment

- **URL**: `https://hono-monorepo-staging.your-subdomain.workers.dev`
- **Database**: Staging Neon database
- **KV Storage**: Staging namespace

#### Production Environment

- **URL**: `https://hono-monorepo-production.your-subdomain.workers.dev`
- **Database**: Production Neon database
- **KV Storage**: Production namespace

### Custom Domain Setup

1. **Add Custom Domain**:

   - Go to Cloudflare Workers dashboard
   - Select your worker
   - Go to Settings > Triggers
   - Add custom domain (e.g., `api.yourdomain.com`)

2. **DNS Configuration**:
   - Add CNAME record pointing to your worker
   - Enable Cloudflare proxy (orange cloud)

### Monitoring & Analytics

- **Real-time Metrics**: Available in Cloudflare dashboard
- **Error Tracking**: Built-in error reporting
- **Performance**: Edge performance metrics
- **Logs**: Real-time worker logs

## 🛠️ Development

### Local Development

```bash
# Start with local KV storage (faster, offline)
bun run dev

# Start with remote KV storage (production-like testing)
bun run dev:remote
```

### Development Tools

#### Database Management

```bash
# Open Drizzle Studio (database GUI)
bun run db:studio

# Generate new migration
bun run db:generate

# Apply migrations
bun run db:migrate

# Push schema changes (development only)
bun run db:push
```

#### KV Storage Management

```bash
# List all keys in local KV
bunx wrangler kv key list --namespace-id YOUR_NAMESPACE_ID --preview

# Get a specific key value
bunx wrangler kv key get "your-key-name" --namespace-id YOUR_NAMESPACE_ID --preview

# Set a key value
bunx wrangler kv key put "key-name" "value" --namespace-id YOUR_NAMESPACE_ID --preview

# Delete a key
bunx wrangler kv key delete "key-name" --namespace-id YOUR_NAMESPACE_ID --preview
```

#### Testing

```bash
# Run tests
bun test

# Run tests with coverage
bun test --coverage

# Run tests in watch mode
bun test --watch
```

## 📚 API Documentation

### OpenAPI Documentation

The API automatically generates OpenAPI documentation. Access it at:

- **Local**: `http://localhost:8787/api/docs`
- **Staging**: `https://hono-monorepo-staging.your-subdomain.workers.dev/api/docs`
- **Production**: `https://hono-monorepo-production.your-subdomain.workers.dev/api/docs`

### API Endpoints

#### Authentication Endpoints

- `POST /api/auth/signin` - Sign in with email/password
- `POST /api/auth/signup` - Sign up with email/password
- `GET /api/auth/signin/google` - Google OAuth sign in
- `GET /api/auth/signin/github` - GitHub OAuth sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session

#### User Endpoints

- `GET /api/user` - Get current user
- `PUT /api/user` - Update user profile
- `DELETE /api/user` - Delete user account

### Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Rate Limiting

- **Default**: 100 requests per minute per IP
- **Authentication**: 5 attempts per minute per IP
- **API**: 1000 requests per hour per authenticated user

---

## 🔗 Useful Links

- [Hono Documentation](https://hono.dev/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Better Auth Documentation](https://better-auth.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Neon Database Documentation](https://neon.tech/docs)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
