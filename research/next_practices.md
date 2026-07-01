# Next.js App Router: File Structure & Component Organization

> **Last updated:** July 2026
> **Sources:** Next.js official docs, Vercel Academy, Vercel team recommendations (Lee Robinson, Delba), community production patterns, and real-world project structures from 50+ production apps.

---

## Table of Contents

1. [Philosopy: Server-First](#1-philosophy-server-first)
2. [Organizing the `app/` Directory](#2-organizing-the-app-directory)
3. [Route Groups](#3-route-groups)
4. [Private Folders (Underscore Prefix)](#4-private-folders-underscore-prefix)
5. [Server Components vs Client Components](#5-server-components-vs-client-components)
6. [Naming Conventions](#6-naming-conventions)
7. [Colocation Patterns](#7-colocation-patterns)
8. [Shared Code Organization](#8-shared-code-organization)
9. [Feature-Based Organization](#9-feature-based-organization)
10. [The `src/` Folder Convention](#10-the-src-folder-convention)
11. [Project-Wide Structure Blueprint](#11-project-wide-structure-blueprint)
12. [Anti-Patterns to Avoid](#12-anti-patterns-to-avoid)
13. [Sources](#13-sources)

---

## 1. Philosophy: Server-First

The single most important principle in the App Router:

> **Every component is a Server Component by default.** You opt into client-side behavior with `'use client'` only when you need interactivity.

This inverts the mental model from Pages Router. Instead of asking "should I SSR this?", you now ask "does this component need browser APIs or interactivity? If not, keep it on the server." (Source: [Next.js Server and Client Components docs](https://nextjs.org/docs/app/getting-started/server-and-client-components))

**Consequences for file structure:**

- Most of your code stays on the server -- no JavaScript shipped to the browser.
- Client Components are the exception, not the rule. They should be "islands" of interactivity pushed to the leaves of your component tree.
- The `app/` directory maps directly to your route tree -- every folder is a potential URL segment.

---

## 2. Organizing the `app/` Directory

The `app/` directory serves one purpose: **routing**. It should be thin.

### What goes in `app/` -- only these special files:

| File | Purpose |
|------|---------|
| `page.tsx` | Route UI -- makes the URL accessible |
| `layout.tsx` | Shared UI that persists across navigations |
| `loading.tsx` | Automatic Suspense boundary while data loads |
| `error.tsx` | Error boundary for the segment |
| `global-error.tsx` | Global error boundary |
| `not-found.tsx` | 404 UI for the segment |
| `template.tsx` | Like layout but remounts on navigation |
| `route.ts` | API route handler (no UI) |
| `default.tsx` | Fallback for parallel routes |

(Source: [Next.js Project Structure docs](https://nextjs.org/docs/app/getting-started/project-structure))

### What does NOT go in `app/`:

- **Business logic** -- that goes in `lib/`, `actions/`, or `features/`
- **Reusable UI components** -- that goes in `components/`
- **Custom hooks** -- that goes in `hooks/` or `features/*/hooks/`
- **Database queries** -- that goes in `lib/db/` or `features/*/queries/`
- **Type definitions** -- that goes in `types/` or `features/*/types/`

> **Rule of thumb:** A `page.tsx` file should be readable in 30 seconds. It composes components from elsewhere and delegates data fetching to feature modules. (Source: [How I Structure a Production Next.js App in 2026 - DEV](https://dev.to/bilalshahdev/how-i-structure-a-production-nextjs-app-in-2026-5cgj))

### The three official organization strategies

Next.js is "unopinionated" but documents three strategies (all valid, choose one):

1. **Store files outside `app/`** -- Keep `app/` purely for routing; shared code in root-level folders (`components/`, `lib/`, etc.)
2. **Store files in top-level folders inside `app/`** -- Common folders like `app/components/`, `app/lib/`
3. **Split by feature or route** -- Global shared code in root `app/`, route-specific code in route segments

(Source: [Next.js Project Organization docs](https://nextjs.org/docs/app/getting-started/project-structure#examples))

**Community consensus (2025-2026):** Strategy #1 or #3 are preferred for production apps. Strategy #2 tends to clutter the `app/` directory. Most production Next.js apps use `src/` folder with strategy #1.

---

## 3. Route Groups

Route groups are created with parentheses: `(folderName)`. They organize routes without affecting the URL.

### When to use them

**Separate layouts for different sections:**

```
app/
  (marketing)/              # No URL prefix
    page.tsx                # → /
    about/page.tsx          # → /about
    pricing/page.tsx        # → /pricing
    layout.tsx              # Marketing header + footer

  (app)/                    # No URL prefix
    dashboard/page.tsx      # → /dashboard
    settings/page.tsx       # → /settings
    layout.tsx              # Sidebar layout, auth guard

  (auth)/                   # No URL prefix
    login/page.tsx          # → /login
    register/page.tsx       # → /register
    layout.tsx              # Centered minimal layout
```

(Source: [Lee Robinson on Route Groups - LinkedIn](https://www.linkedin.com/posts/leeerob_nextjs-tip-route-groups), [Next.js Route Groups docs](https://nextjs.org/docs/app/getting-started/project-structure#route-groups))

### Key benefits

- Each group gets its own layout without affecting URLs
- Auth checking goes in the group layout, not on individual pages
- Multiple root layouts: remove top-level `layout.tsx`, add one per route group
- Loading states can be scoped to a group

> "Use route groups from day one -- retrofitting them means moving files and fixing all import paths." - [DEV Community: Next.js App Router Best Practices in 2026](https://dev.to/thekitbase/nextjs-app-router-best-practices-in-2026-2b0f)

### Common route group patterns

```
app/
  (marketing)/         # Public pages
  (app)/               # Authenticated dashboard
  (auth)/              # Login, register, password reset
  api/                 # Route handlers (webhooks, external APIs)
```

---

## 4. Private Folders (Underscore Prefix)

Private folders use the `_folderName` convention. They are excluded from routing entirely.

### When to use them

- **Route-specific components** that don't need to be globally shared
- **Route-specific utilities, schemas, or actions** used only by one route
- **Keeping related code colocated** without polluting the URL namespace

```
app/
  dashboard/
    page.tsx
    _components/
      StatsCard.tsx         # Only used by dashboard
      ChartWidget.tsx       # Only used by dashboard
    _lib/
      actions.ts            # Server actions for dashboard
      schemas.ts            # Zod schemas for dashboard
```

(Source: [Next.js Private Folders docs](https://nextjs.org/docs/app/getting-started/project-structure#private-folders))

### Private folders vs colocation

Even though files in `app/` are safely colocated by default (a file without `page.tsx` or `route.tsx` is not routable), private folders add:

- **Visible intent** -- developers immediately know the folder is not a route
- **Editor sorting** -- folders starting with `_` sort to the top/bottom
- **Future-proofing** -- avoids naming conflicts with future Next.js conventions
- **Consistency** -- works the same way across the project and ecosystem

> "The `_components` folder inside a route directory is one of the most underused patterns. If a component is only used on one page, it should live next to that page. When you delete the page, you delete the components with it. No orphaned files." - [Velox Studio Blog](https://velox.studio/blog/nextjs-project-structure)

---

## 5. Server Components vs Client Components

### Decision rules

| Use Server Component (default) when... | Use Client Component (`'use client'`) when... |
|---------------------------------------|----------------------------------------------|
| Fetching data from a database or API | Using React hooks (`useState`, `useEffect`, `useRef`) |
| Accessing backend resources (DB, filesystem) | Handling browser events (`onClick`, `onChange`) |
| Keeping sensitive logic (API keys, tokens) | Accessing browser APIs (`window`, `localStorage`) |
| Rendering static or heavy content | Using real-time subscriptions |
| Reducing client bundle size | Using third-party libs that need client APIs |

(Source: [Vercel Academy: Client-Server Component Boundaries](https://vercel.com/academy/nextjs-foundations/client-server-boundaries), [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components))

### The composition pattern

The most important structural pattern in Next.js 15/16:

```
// Server Component (default) -- no 'use client'
// Fetches data, renders most content on server
import { InteractiveWidget } from './_components/interactive-widget'

export default async function Page() {
  const data = await fetchData()

  return (
    <div>
      {/* This renders as HTML -- no JavaScript */}
      <ServerRenderedContent data={data} />

      {/* Small client island -- only this ships JS */}
      <InteractiveWidget initialData={data} />
    </div>
  )
}
```

```tsx
// Client Component -- 'use client' at the top
'use client'
import { useState } from 'react'

export function InteractiveWidget({ initialData }) {
  const [state, setState] = useState(initialData)
  // ...interactive logic
}
```

**Push the `'use client'` boundary as deep as possible.** Don't make a container a client component because it contains one interactive child. Make the child a client component and keep the container on the server.

### The server children pattern

Pass Server Components as `children` to Client Components:

```tsx
// Client wrapper
'use client'
export function ExpandableWrapper({ children, title }) {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>{title}</button>
      {isOpen && children}  {/* Server-rendered content streams through */}
    </div>
  )
}
```

```tsx
// Usage in a Server Component -- children are Server Components
<ExpandableWrapper title="Products">
  {/* These cards are Server Components -- no JS shipped */}
  {products.map(p => <ProductCard key={p.id} product={p} />)}
</ExpandableWrapper>
```

(Source: [Vercel Academy: Client-Server Component Boundaries](https://vercel.com/academy/nextjs-foundations/client-server-boundaries))

---

## 6. Naming Conventions

### Component files

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `UserCard.tsx`, `PricingTable.tsx` |
| Page folders | kebab-case | `app/blog/[slug]/page.tsx` |
| Route groups | parenthesized | `(marketing)`, `(app)` |
| Private folders | underscore-prefixed | `_components/`, `_lib/` |
| Utility files | camelCase | `formatDate.ts`, `cn.ts` |
| Hooks | `use`-prefix camelCase | `useAuth.ts`, `useDebounce.ts` |

### Server/Client naming patterns

There are two emerging conventions in the community:

**Option A: `.server.tsx` / `.client.tsx` suffix**

```
PokemonList.server.tsx   # Server Component (data fetching)
PokemonList.client.tsx   # Client Component (interactivity)
index.ts                 # Re-exports server by default
```

**Option B: `*Client.tsx` suffix**

```
PokemonList.tsx          # Server Component
PokemonListClient.tsx    # Client Component
```

**Option C: Directory-based**

```
PokemonList/
  index.ts               # Re-exports PokemonList.server.tsx
  PokemonList.server.tsx
  PokemonList.client.tsx
```

(Source: [ProNextJS: Naming and Organizing Server and Client Components](https://www.pronextjs.dev/workshops/next-js-production-project-setup-and-infrastructure-fq4qc/naming-and-organizing-server-and-client-components-mbtsl))

> **Note:** Next.js does not assign special meaning to `.server` or `.client` suffixes -- the `'use client'` directive is what matters. These suffixes are purely organizational conventions.

### Enforcing boundaries

Use the `server-only` and `client-only` packages to prevent accidental imports:

```ts
// lib/db.ts
import 'server-only'  // This file will error if imported by a Client Component
export const db = new PrismaClient()
```

```ts
// hooks/use-local-storage.ts
import 'client-only'  // This file will error if imported by a Server Component
export function useLocalStorage(key: string) { ... }
```

(Source: [Next.js Server and Client Components docs](https://nextjs.org/docs/app/getting-started/server-and-client-components))

---

## 7. Colocation Patterns

Colocation means placing related code (components, styles, tests, types) near the routes that use them.

### What colocation looks like

```
app/
  blog/
    [slug]/
      page.tsx
      _components/
        BlogContent.tsx
        ShareButtons.tsx
      _lib/
        getPost.ts
        actions.ts
      blog-post.test.ts
      blog-post.css
```

(Source: [Next.js Colocation docs](https://nextjs.org/docs/app/getting-started/project-structure#colocation))

### The graduation rule

> **If a component is used by exactly one route, it lives in that route's `_components/` folder. If two or more routes share it, promote it to `components/` or `features/`.**

```
# Step 1: Colocate with the only route that uses it
app/
  dashboard/
    page.tsx
    _components/
      StatsCard.tsx    # Only dashboard uses this

# Step 2: Promote when shared
components/
  stats/
    StatsCard.tsx      # Now used by dashboard + reports + admin
```

(Source: [Matthews Wong: Scalable Next.js Project Structure](https://www.matthewswong.com/en/blog/nextjs-project-structure-scalable/))

### What to colocate

- **Route-specific components** in `_components/`
- **Route-specific utilities** in `_lib/`
- **Route-specific actions** inline or in `_lib/actions.ts`
- **Route-specific schemas** in `_lib/schemas.ts`
- **Tests** next to the file they test (e.g., `button.test.tsx` next to `button.tsx`)
- **CSS Modules** next to the component that uses them

### The "30-second page" rule

A `page.tsx` should be readable in under 30 seconds. It should:

1. Import components from `_components/` or shared folders
2. Call a data-fetching function from `_lib/` or `features/`
3. Compose the page from those pieces

No business logic directly in the page file.

---

## 8. Shared Code Organization

### The `components/` directory

Structure shared components by role, not by feature:

```
components/
  ui/                    # Design system primitives (Button, Input, Modal, Card)
    button.tsx
    input.tsx
    dialog.tsx
    card.tsx
  layout/                # Structural layout components
    header.tsx
    footer.tsx
    sidebar.tsx
    navbar.tsx
  forms/                 # Composable form components
    form-field.tsx
    form-section.tsx
  sections/              # Page-level sections (domain-aware but page-agnostic)
    hero-section.tsx
    pricing-table.tsx
    testimonial-section.tsx
```

**Key rule:** `components/ui/` should contain **domain-agnostic** primitives. They accept props, render HTML, and know nothing about your business logic. The moment a component has business logic or knows about your domain, it belongs in `features/` or `components/sections/`.

(Source: [Nextcraft: How to Structure a Next.js Project for Scale](https://www.nextcraft.agency/resources/insights/nextjs-project-structure))

### The `lib/` directory

Infrastructure and utilities -- no JSX, no React:

```
lib/
  db/                    # Database client + queries
    client.ts            # Prisma / Drizzle singleton
    queries/
      users.ts
      posts.ts
  auth.ts                # Auth configuration (NextAuth, Clerk, etc.)
  stripe.ts              # Stripe client
  email.ts               # Email service (Resend, SendGrid)
  utils/
    cn.ts                # Class name utility (clsx + tailwind-merge)
    date.ts              # Date formatting
    string.ts            # String utilities
  validations/
    schemas.ts           # Zod schemas
```

> **Dependency rule:** Nothing in `lib/` should import from `components/` or `app/`. The dependency graph flows one way: `app/` -> `components/` -> `lib/`.

### The `hooks/` directory

Global client-side hooks (shared across features):

```
hooks/
  use-debounce.ts
  use-media-query.ts
  use-intersection-observer.ts
  use-local-storage.ts
```

Feature-specific hooks go in `features/*/hooks/`.

### The `types/` directory

Global TypeScript types:

```
types/
  user.ts
  post.ts
  api.ts
  index.ts
```

Feature-specific types go in `features/*/types/`.

### The `config/` directory

Application-wide configuration, often validated with Zod:

```
config/
  site.ts                # Site metadata, navigation links
  constants.ts           # App-wide constants
  env.ts                 # Validated environment variables with @t3-oss/env-nextjs
```

---

## 9. Feature-Based Organization

For apps beyond ~100 files, the flat `components/` + `lib/` pattern breaks down. Feature modules solve this.

### The feature module pattern

```
features/
  auth/
    components/
      login-form.tsx
      register-form.tsx
      auth-provider.tsx
    hooks/
      use-auth.ts
      use-session.ts
    actions/
      login.ts
      register.ts
    queries/
      get-session.ts
    types.ts
    index.ts               # Public API -- only what other features can import

  billing/
    components/
      pricing-table.tsx
      subscription-card.tsx
      invoice-list.tsx
    hooks/
      use-subscription.ts
    actions/
      checkout.ts
      cancel-subscription.ts
    queries/
      get-subscription.ts
    types.ts
    index.ts

  dashboard/
    components/
      stats-grid.tsx
      recent-activity.tsx
    hooks/
      use-dashboard-data.ts
    actions/
      export-data.ts
    queries/
      get-dashboard-stats.ts
    types.ts
    index.ts
```

(Source: [DEV: The Next.js 15 App Router Project Structure That Scales](https://dev.to/krunal_groovy/the-nextjs-15-app-router-project-structure-that-scales-with-examples-47ha))

### Key rules for features

1. **A file in `features/billing` should never import from `features/auth/internal`.** Features communicate through their `index.ts` public API.
2. **Each feature owns its own types, hooks, actions, and components.** Nothing leaks between features without explicit export.
3. **When a component is used by multiple features, promote it to `components/`.**
4. **Server Actions live in `features/*/actions/`**, not in `app/`.

### Feature index pattern

```ts
// features/auth/index.ts -- public API
export { LoginForm, RegisterForm } from './components'
export { useAuth, useSession } from './hooks'
export { login, register } from './actions'
export type { AuthSession, LoginInput, RegisterInput } from './types'
```

This creates a clear contract and prevents accidental internal imports.

---

## 10. The `src/` Folder Convention

Next.js supports an optional `src/` folder that houses application code, separating it from config files at the project root.

### With `src/`

```
my-app/
  src/
    app/                  # App Router
    components/
    features/
    lib/
    hooks/
    types/
    config/
  public/                 # Static assets
  next.config.ts
  package.json
  tsconfig.json
  .env.local
  .gitignore
```

### Without `src/`

```
my-app/
  app/                    # App Router
  components/
  features/
  lib/
  public/
  next.config.ts
  package.json
```

(Source: [Next.js `src` folder docs](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder))

**Community preference:** Most production apps use the `src/` folder to keep root-level config files clean, especially as the project adds more config (`eslint.config.mjs`, `instrumentation.ts`, `proxy.ts`, etc.).

---

## 11. Project-Wide Structure Blueprint

Below is a composite of patterns used in production Next.js apps (synthesized from multiple sources):

```
my-app/
  src/
    app/                              # Routes only -- thin orchestration
      (marketing)/                    # Route group: public pages
        page.tsx                      # /
        about/page.tsx
        pricing/page.tsx
        blog/
          page.tsx
          [slug]/page.tsx
        layout.tsx                    # Marketing layout (header + footer)

      (app)/                          # Route group: authenticated
        layout.tsx                    # Auth guard + sidebar layout
        dashboard/
          page.tsx
          _components/
            stats-grid.tsx
            recent-activity.tsx
          _lib/
            get-dashboard-stats.ts
          loading.tsx
        settings/
          page.tsx
          _components/
            profile-form.tsx
          _lib/
            actions.ts
            schemas.ts

      (auth)/                         # Route group: authentication
        layout.tsx                    # Centered layout, no nav
        login/page.tsx
        register/page.tsx
        password-reset/page.tsx

      api/                            # Route handlers (webhooks, external API)
        webhooks/
          stripe/route.ts
        health/route.ts

      layout.tsx                      # Root layout (<html>, <body>, fonts)
      loading.tsx                     # Global loading state
      error.tsx                       # Global error boundary
      not-found.tsx                   # 404 page
      sitemap.ts                      # Dynamic sitemap
      robots.ts                       # Robots configuration

    features/                         # Domain modules
      auth/
        components/                   # Auth-specific UI
        hooks/
        actions/                      # Server Actions
        queries/                      # Data fetching
        types.ts
        index.ts                      # Public API

      billing/
        components/
        hooks/
        actions/
        queries/
        types.ts
        index.ts

      projects/
        components/
        hooks/
        actions/
        queries/
        types.ts
        index.ts

    components/                       # Shared UI
      ui/                             # Design system primitives
        button.tsx
        input.tsx
        dialog.tsx
        card.tsx
        badge.tsx
        ...
      layout/                         # App shell components
        header.tsx
        footer.tsx
        sidebar.tsx
      forms/                          # Composable form components
        form-field.tsx
        form-section.tsx
      sections/                       # Page-level sections
        hero-section.tsx
        pricing-table.tsx

    lib/                              # Infrastructure & utilities
      db/
        client.ts                     # Database client singleton
        queries/
          users.ts
          posts.ts
      auth.ts                         # Auth config
      stripe.ts                       # Payment integration
      email.ts                        # Email service
      utils/
        cn.ts                         # Class names utility
        date.ts
        string.ts
      validations/
        schemas.ts                    # Shared Zod schemas

    hooks/                            # Shared client hooks
      use-debounce.ts
      use-media-query.ts
      use-intersection-observer.ts

    types/                            # Shared TypeScript types
      index.ts

    config/                           # App configuration
      site.ts                         # Site metadata
      constants.ts
      env.ts                          # Zod-validated env vars

  public/                             # Static assets
    images/
    fonts/

  # Root-level config files
  next.config.ts
  package.json
  tsconfig.json
  eslint.config.mjs
  .env.local
  .env.production
  .gitignore
```

---

## 12. Anti-Patterns to Avoid

### 1. Putting everything in `components/`

The flat `components/` folder works for the first 20 components. At 200, it's unmaintainable. Feature modules (`features/`) solve this.

### 2. Making entire pages client-side

```tsx
// BAD -- entire page ships JavaScript
'use client'
export default function DashboardPage() {
  const [data, setData] = useState([])
  useEffect(() => { fetch('/api/data').then(...) }, [])
  return <div>...</div>
}
```

```tsx
// GOOD -- only the interactive parts are client components
export default async function DashboardPage() {
  const data = await getData()
  return (
    <div>
      <DashboardHeader />
      <StatsGrid data={data} />
      <InteractiveWidget />
    </div>
  )
}
```

### 3. Barrel files with circular dependencies

Large `index.ts` barrel files can cause circular dependency issues and tree-shaking problems. Import directly where possible.

### 4. Putting business logic in `page.tsx`

A `page.tsx` should compose, not implement. No database calls, no validation logic, no complex business rules.

### 5. Forgetting `server-only` for sensitive code

```ts
// lib/db.ts
import 'server-only'  // Prevents accidental client import
export const db = createClient()
```

### 6. Over-nesting route groups

```
// HARD TO REASON ABOUT
app/[locale]/(pages)/(dashboard)/(settings)/profile/page.tsx
```

Keep route groups flat. If you need more than 2 levels of nesting, reconsider the structure.

### 7. Pre-optimizing for monorepo

Don't introduce Turborepo or monorepo structure until you feel real pain. A well-structured single Next.js app is simpler and faster for most projects.

### 8. Mixing `app/` with heavy feature code

The `app/` directory should be thin. If your `app/dashboard/page.tsx` is 400 lines, extract the logic into `features/dashboard/`.

### 9. Treating `lib/utils.ts` as a junk drawer

If your utils file grows beyond 5-10 functions, split it: `lib/utils/date.ts`, `lib/utils/string.ts`, `lib/utils/currency.ts`.

---

## 13. Sources

### Official Next.js Documentation

- [Project Structure and Organization](https://nextjs.org/docs/app/getting-started/project-structure) -- June 2026
- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) -- Latest
- [Routing Fundamentals](https://nextjs.org/docs/app/building-your-application/routing) -- Latest
- [Route Groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups) -- Latest

### Vercel / Official Team

- [Vercel Academy: Client-Server Component Boundaries](https://vercel.com/academy/nextjs-foundations/client-server-boundaries) -- 2026
- [Lee Robinson: My Stack](https://leerob.com/stack) -- 2026
- [Lee Robinson: Route Groups Tip](https://www.linkedin.com/posts/leeerob_nextjs-tip-route-groups) -- 2024
- [Next.js Blog: Building APIs with Next.js](https://nextjs.org/blog/building-apis-with-nextjs) -- Feb 2025

### Community & Production Patterns

- [DEV: Next.js App Router Best Practices in 2026](https://dev.to/thekitbase/nextjs-app-router-best-practices-in-2026-2b0f) -- June 2026
- [DEV: The Next.js 15 App Router Project Structure That Scales](https://dev.to/krunal_groovy/the-nextjs-15-app-router-project-structure-that-scales-with-examples-47ha) -- April 2026
- [DEV: How I Structure a Production Next.js App in 2026](https://dev.to/bilalshahdev/how-i-structure-a-production-nextjs-app-in-2026-5cgj) -- June 2026
- [Makerkit: Next.js 16 App Router Project Structure: The Definitive Guide](https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure) -- Dec 2024
- [Velox Studio: Next.js Project Structure That Scales](https://velox.studio/blog/nextjs-project-structure) -- April 2026
- [Nextcraft: How to Structure a Next.js Project for Scale](https://www.nextcraft.agency/resources/insights/nextjs-project-structure) -- May 2026
- [Cadence: How to Structure a Next.js Project for Scale](https://cadence.withremote.ai/blog/structure-nextjs-project-scale) -- May 2026
- [Matthews Wong: Scalable Next.js Project Structure](https://www.matthewswong.com/en/blog/nextjs-project-structure-scalable/) -- June 2025
- [Groovy Web: Next.js Project Structure 2026](https://www.groovyweb.co/blog/nextjs-project-structure-full-stack) -- Feb 2026
- [ProNextJS: Naming and Organizing Server and Client Components](https://www.pronextjs.dev/workshops/next-js-production-project-setup-and-infrastructure-fq4qc/naming-and-organizing-server-and-client-components-mbtsl) -- 2025
- [Amit Divekar: The Ultimate Next.js 15 App Router Architecture Guide](https://amitdevx.tech/blogs/nextjs-15-app-router-architecture-guide) -- April 2026
- [Baransel: How I Structure Next.js Projects](https://baransel.dev/post/how-i-structure-nextjs-projects/) -- March 2026
- [YogiJS: Next.js Architecture in 2026](https://www.yogijs.tech/blog/nextjs-project-architecture-app-router) -- April 2026
- [StackNotice: Next.js App Router Complete Guide 2026](https://stacknotice.com/blog/nextjs-app-router-complete-guide-2026) -- May 2026
- [Stanza: Next.js App Router File Conventions & Patterns](https://www.stanza.dev/concepts/nextjs-app-router) -- Feb 2026
- [DEV: Building a Production-Ready Next.js App Router Architecture](https://dev.to/yukionishi1129/building-a-production-ready-nextjs-app-router-architecture-a-complete-playbook-3f3h) -- Oct 2025
- [UsamaSoft: How I Structure Large Next.js Apps](https://usamasoft.com/blog/structuring-large-nextjs-apps) -- March 2026
