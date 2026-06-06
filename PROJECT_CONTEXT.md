# TravelHub Project Context

## Project Purpose

TravelHub is a lightweight travel affiliate hub. Its near-term purpose is to send users from short-form social videos to focused city pages, show useful travel links, and eventually guide visitors toward hotel and tour affiliate links.

This is not meant to be a full travel-planning app yet. Keep the product simple, fast, and easy to scale by adding more cities and spots.

## Tech Stack

- Next.js App Router on Next.js 16
- React 19
- TypeScript
- Supabase for public city/spot data, admin data, uploads, and click logs
- Vercel deployment
- Tailwind CSS v4
- ESLint flat config
- GitHub repository: `kazumophone-arch/travelhub`
- Production URL: `https://travelhub-murex.vercel.app/`

Important environment variables inferred from the code:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`
- Optional site URL values: `NEXT_PUBLIC_SITE_URL`, `SITE_URL`, `VERCEL_URL`

## Main Routes

- `/` - Landing page using published Supabase cities.
- `/discover` - Discovery-oriented city browsing page.
- `/cities` - City directory with filters/search.
- `/spots` - Spot directory across published cities.
- `/c/[slug]` - Public city detail page.
- `/c/[slug]/spot/[spotSlug]` - Public spot detail page.
- `/out/[type]` - Affiliate redirect and click logging route.
- `/about`, `/affiliate-disclosure`, `/privacy`, `/terms`, `/contact` - Static informational pages.
- `/sitemap.xml`, `/robots.txt`, `/opengraph-image` - Metadata routes.
- `/admin` - Admin dashboard.
- `/admin/login` - Admin login.
- `/admin/countries`, `/admin/countries/new`, `/admin/countries/edit/[id]` - Country admin.
- `/admin/cities`, `/admin/cities/new`, `/admin/cities/edit/[id]` - City admin.
- `/admin/spots`, `/admin/spots/new`, `/admin/spots/edit/[id]` - Spot admin.
- `/admin/analytics` - Affiliate click analytics.
- `/api/admin/auth/login`, `/api/admin/auth/logout` - Admin auth API.
- `/api/admin/countries`, `/api/admin/cities`, `/api/admin/spots`, `/api/admin/uploads` - Protected admin APIs.

## Main Data Files

- `data/types.ts` - Core TypeScript models for cities, spots, affiliate links, regions, styles, and seasons.
- `data/supabase-public-cities.ts` - Public Supabase city fetchers and city row normalization.
- `data/supabase-public-spots.ts` - Public Supabase spot fetchers and spot row normalization.
- `data/city-data/*.ts` - Legacy/static city data used mostly as fallback/reference material.
- `data/admin-spots.ts` and `data/admin-spots.json` - Legacy/admin-oriented spot data.
- `data/travel-images.ts` - Fallback/generated-looking image metadata.
- `lib/supabase.ts` - Browser/public Supabase client.
- `lib/supabase-admin.ts` - Service-role Supabase client for admin/server work.
- `lib/admin-auth.ts` - Password-based admin session cookie helpers.
- `supabase/migrations/*.sql` - Database structure for countries, cities, spots, affiliate URLs, image positions, and click logs.

## Documentation

- `PROJECT_CONTEXT.md` - Project handoff and source-of-truth context for future Codex sessions.
- `docs/DATA_ENTRY_GUIDE.md` - Admin data-entry guide for adding cities and spots consistently, including slug rules, affiliate URL rules, image guidance, publishing checklist, and spot CTA product rules. Read this guide before adding or editing many cities/spots.

## Current Features

- Public landing page that highlights published cities and routes visitors into city pages.
- City and spot directory pages with client-side search/filtering.
- Public city detail pages with hero imagery, city metadata, affiliate CTA buttons, and spot cards.
- Public spot detail pages with hero imagery, content, and optional affiliate CTA buttons.
- Affiliate outbound redirect route with support for city-level and spot-level affiliate URLs.
- Click logging into the `click_logs` Supabase table, including type, city/spot, source, version, referer, and user agent.
- Password-protected admin area guarded by `proxy.ts`.
- Admin CRUD-style flows for countries, cities, and spots.
- Supabase storage upload support through the admin uploads API.
- Admin analytics dashboard for click counts, breakdowns, and recent click logs.
- Dynamic sitemap generation from published Supabase cities and spots.
- Basic static legal/info pages and global site navigation/footer.

## Product Rules

- Spot pages should show hotel/tour CTA buttons only when the spot itself has valid direct affiliate URLs.
- Spot pages should not show city-level fallback CTA buttons when the spot has no direct affiliate URL.
- The internal `/out/hotels` and `/out/tours` city-level fallback may remain for direct or stale URLs, but that fallback should not be surfaced in the public spot page UI.

## Caching Strategy

- Do not implement caching yet.
- Current public catalog/detail routes are mostly forced dynamic.
- `/`, `/discover`, `/cities`, `/spots`, `/c/[slug]`, `/c/[slug]/spot/[spotSlug]`, and `/sitemap.xml` currently query Supabase at request time.
- `/out/[type]` must remain request-time because it resolves redirects and logs clicks.
- Admin pages/APIs must remain dynamic.
- The project is on Next.js 16, and caching behavior may differ depending on whether Cache Components are enabled.
- Before any caching implementation, future sessions must inspect `next.config.*`, the relevant local Next.js 16 docs in `node_modules/next/dist/docs/`, whether `cacheComponents` is enabled, and whether the project should use the previous caching model or the newer `use cache` / `cacheLife` model.
- Potential future caching candidates are `/`, `/discover`, `/cities`, `/spots`, and `/sitemap.xml`.
- Keep `/out/[type]`, `/c/[slug]`, `/c/[slug]/spot/[spotSlug]`, and all admin pages/APIs dynamic for now.
- Caching can delay admin changes such as publish/unpublish, image edits, summaries, affiliate URLs, and sitemap updates.
- Detail pages use tracking params such as `src` and `v`; careless route-level caching could freeze or break tracking behavior.

## Known Issues and Risks

- The project uses Next.js 16, which has breaking App Router changes. Future sessions must read relevant docs in `node_modules/next/dist/docs/` before changing Next-specific code.
- `TemporaryAdminTab` is mounted in the root layout, so a floating admin entry point can appear on public production pages unless hidden in local storage.
- Supabase row-to-view-model mapping is duplicated across public data helpers, `/cities`, and the outbound redirect route. This increases the chance of inconsistent behavior. The safe refactor already completed was only `/spots` reusing the shared public spot select/mapper from `data/supabase-public-spots.ts`.
- `/cities` still has duplicated city normalization logic, but a direct replacement with `getPublishedSupabaseDirectoryCities()` is not behavior-equivalent. The main risk is `stops`: current `/cities` uses `stops: []`, while the shared helper can populate stops from published spots plus city/country/region fallbacks. Changing stops could affect visible city card chips, search text, category inference, filters, and reason copy, so `/cities` normalization should not be centralized until that visible behavior change is intentional.
- Some static/legacy files and unused components remain in the repo, including older city data and fallback image data. The unused public Supabase components `components/PublicSupabaseCities.tsx` and `components/PublicSupabaseSpots.tsx` were removed, and `npm run build` passed after the deletion.
- `data/types.ts` defines `City.stops` as a fixed 3-item tuple, but several dynamic mappings treat stops like a variable-length array and use casts.
- Most public pages are marked `dynamic = "force-dynamic"`, so they query Supabase on every request. See the caching strategy above before changing this behavior.
- The Supabase clients throw during import when required environment variables are missing. Builds and local development need the Supabase env vars present.
- The `/out/[type]` route supports more affiliate types than the current UI exposes. Tracking also depends on `c`, `s`, `src`, and `v` query conventions.
- Images are mostly raw URLs/CSS backgrounds rather than `next/image`. That keeps the app simple, but image sizing/optimization is limited.
- There are no automated tests in the repo yet. Verification currently depends on `npm run build` and manual checks.
- A tracked root file named `h` appears to contain command/diff output rather than application source.
- Admin create/edit forms share a lot of similar validation, preview, slug, and upload logic.

## Next Recommended Tasks

1. Run `npm run build` after this handoff document is created and fix only safe build errors.
2. Decide whether the public `TemporaryAdminTab` should remain visible in production.
3. Centralize Supabase city/spot normalization so all routes use one mapper.
4. Clean up or archive legacy/static data and unused components after confirming they are no longer needed.
5. Add lightweight smoke tests or route-level checks for the public pages and `/out/[type]`.
6. Revisit public route caching only after inspecting the active Next.js 16 caching model and confirming the intended freshness tradeoffs.
7. Review the tracked root `h` file and remove it only after confirming it is not intentionally kept.
8. Use `docs/DATA_ENTRY_GUIDE.md` before bulk adding or editing cities/spots in the admin UI.

## Development Rules for Future Codex Sessions

- Keep TravelHub lightweight and affiliate-oriented. Do not redesign it into a full travel app without explicit confirmation.
- Before changing Next.js code, read the relevant Next.js 16 docs in `node_modules/next/dist/docs/`; this project warns that the version differs from older Next.js assumptions.
- Preserve the current product direction: short-form video traffic, city hubs, useful links, affiliate CTAs.
- Make small, scoped changes that follow the existing App Router and Supabase patterns.
- Do not change UI direction, navigation strategy, or affiliate flow without asking first.
- Prefer shared mappers/helpers over adding more duplicated Supabase normalization logic.
- Keep public routes fast and simple; avoid heavy client-side state unless it clearly improves the current workflow.
- Treat `ADMIN_PASSWORD`, service-role keys, and Supabase credentials as secrets. Do not print or commit them.
- Use service-role Supabase only in server/admin code.
- Keep `/api/admin/*` protected by `proxy.ts`; auth endpoints are the only admin API exception.
- After code changes, run `npm run build`. Run `npm run lint` when touching code likely to affect lint rules.
- Fix only build errors or clearly safe TypeScript/runtime issues unless the user asks for broader work.
- If a change may affect the service concept, stop and ask for confirmation.
