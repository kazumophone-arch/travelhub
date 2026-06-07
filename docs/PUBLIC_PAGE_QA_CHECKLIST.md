# TravelHub Public Page QA Checklist

Use this checklist after adding or editing cities/spots in the admin UI. The goal is to confirm that published TravelHub content appears correctly, unpublished content stays private, and affiliate CTAs behave safely.

## Home And Directory Checks

Check these public routes:

- `/`
- `/discover`
- `/cities`
- `/spots`

Verify:

- Published cities appear where expected.
- Published spots appear where expected.
- Unpublished cities do not appear publicly.
- Unpublished spots do not appear publicly.
- Search still returns expected city/spot results.
- Filters still narrow results correctly.
- Empty search/filter states look reasonable.
- City and spot cards link to the expected public pages.

## City Page Checks

Check each edited or newly published city page:

- `/c/[slug]` loads without a 404.
- City title is correct.
- Country is correct.
- Summary is readable and appropriate.
- Description is readable and appropriate.
- Hero image loads.
- Hero image position keeps the main subject visible on desktop and mobile.
- Published spots for the city appear.
- Unpublished spots for the city do not appear.
- Hotel CTA appears only when the city has a valid city-level hotel affiliate URL.
- Tour CTA appears only when the city has a valid city-level tour affiliate URL.
- CTA links point to `/out/hotels` and `/out/tours`.
- CTA links include the correct `c`, `src`, and `v` query params.
- If city affiliate URLs are blank, city-level CTA buttons are hidden.

## Spot Page Checks

Check each edited or newly published spot page:

- `/c/[slug]/spot/[spotSlug]` loads without a 404.
- Spot title is correct.
- City/country context is correct.
- Summary is readable and appropriate.
- Description is readable and appropriate.
- Hero image loads.
- Hero image position keeps the main subject visible on desktop and mobile.
- Spot hotel CTA appears only when the spot itself has a valid direct hotel affiliate URL.
- Spot tour CTA appears only when the spot itself has a valid direct tour affiliate URL.
- If spot affiliate URLs are blank, spot-level CTA buttons do not appear.
- City-level fallback CTA is not surfaced on the public spot page.
- Back link returns to the correct city page.

## Outbound Link Checks

Check outbound routes using realistic city/spot params:

- `/out/hotels?...` redirects when a valid hotel affiliate URL exists.
- `/out/tours?...` redirects when a valid tour affiliate URL exists.
- Unsupported outbound types such as `/out/flights` return 404.
- Missing or invalid affiliate URLs fall back safely.
- Missing or invalid affiliate URLs do not create open redirects.
- Redirect URLs preserve expected `c`, `s`, `src`, and `v` behavior.
- Click logging should not block redirects.
- Prefetch or HEAD-style checks should not create misleading user-facing failures.

## Admin-To-Public Checks

After admin changes:

- Publish a city and verify it appears on public pages.
- Unpublish a city and verify it disappears from public pages.
- Publish a spot and verify it appears on the city page and `/spots`.
- Unpublish a spot and verify it disappears from public pages.
- Edit image URL or image position and verify the public page updates.
- Edit summary/description and verify public copy updates.
- Edit city affiliate URL and verify city page CTA behavior updates.
- Edit spot affiliate URL and verify spot page CTA behavior updates.
- Remember that future caching may delay public updates if caching is added later.

## Admin-Only Tag Checks

Check tag management in admin:

- Create a tag in `/admin/tags`.
- Edit the tag name, slug, description, active status, or sort rank.
- Archive a tag and verify it becomes inactive rather than hard-deleted.
- Assign active tags to a city in city create/edit forms.
- Assign active tags to a spot in spot create/edit forms.
- Save a city with no tags and verify saving still works.
- Save a spot with no tags and verify saving still works.
- Reopen city/spot edit forms and verify selected tags load.
- Confirm assigned tags do not appear on public city or spot pages yet.
- Confirm assigned tags do not change `/`, `/discover`, `/cities`, `/spots`, public search, public filters, CTA visibility, or outbound affiliate behavior.

## SEO And Metadata Checks

Check:

- Page title is reasonable.
- Page description is reasonable.
- Open graph image behavior is acceptable.
- `/sitemap.xml` includes published city pages.
- `/sitemap.xml` includes published spot pages.
- `/sitemap.xml` does not include unpublished city/spot pages.
- `/robots.txt` is reachable.
- Broken image URLs are fixed before promotion.

## Final Promotion Checklist

Before promoting a city or spot from social/video traffic:

- Check desktop layout.
- Check mobile layout.
- Check all visible CTA buttons.
- Check outbound redirects.
- Check affiliate disclosure visibility.
- Check footer/navigation links.
- Check no admin-only UI appears publicly.
- Check no draft or placeholder copy appears publicly.
- Check no placeholder affiliate URLs are used.
- Check the final public URL matches the intended slug.
