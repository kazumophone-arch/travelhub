# TravelHub Data Entry Guide

## Purpose

TravelHub is a lightweight travel affiliate hub. Data entry should keep the site easy to scale while supporting useful city pages, precise spot pages, public search/filtering, SEO metadata, and hotel/tour affiliate CTAs.

The goal is consistency, not exhaustive travel coverage. Add enough clean information for a visitor arriving from a short-form travel video to understand the destination and choose the next useful link.

## City Data Entry Rules

### City name

- Use the common English travel name for the city.
- Keep capitalization natural, for example `Rome`, `Kyoto`, or `New York`.
- Do not add country codes or marketing copy to the city name field.

### Slug

- Use a lowercase, hyphen-separated slug.
- Include a country suffix when it helps avoid ambiguity, for example `rome-it` or `kyoto-jp`.
- Keep the slug stable after publishing.

### Country

- Use the common English country name.
- Keep spelling consistent across cities in the same country.

### Region

- Use a broad, useful region label for browsing and filtering.
- Keep region names consistent, for example `Europe`, `East Asia`, or `North America`.
- Avoid overly specific labels unless the product intentionally needs them.

### Summary and description

- Summary should be short, readable, and useful in cards or previews.
- Description can be longer and should explain why the city is worth visiting.
- Avoid placeholder copy, keyword stuffing, or text that only repeats the city name.
- Write for a traveler who may have arrived from a short video and wants quick context.

### Hero image URL

- Use a stable, publicly accessible image URL.
- Prefer a visually strong wide landscape image that clearly represents the city.
- Avoid broken, temporary, watermarked, or low-quality URLs.

### Image position

- Set image position so the main subject remains visible in the hero crop.
- Use values like `center`, `top`, `bottom`, `left`, or `right` when available.
- Check the public page after saving because CSS background crops can differ by screen size.

### Seasons

- Use seasons to describe when the city is especially useful or attractive.
- Keep labels simple, for example `Spring`, `Summer`, `Autumn`, `Winter`, or `All year`.
- Do not force seasonal labels if the admin UI does not currently expose them.

### Travel styles

- Use travel styles to support discovery and filtering.
- Prefer reusable labels such as `Culture`, `Food`, `Nature`, `Shopping`, `Nightlife`, `Family`, or `Romantic`.
- Avoid one-off labels that will only apply to one city.

### Themes

- Use themes for the main reason a traveler might choose the city.
- Keep theme wording short and scannable.
- Avoid duplicating the exact same values as travel styles unless that is intentional.

### Sort rank

- Lower numbers should appear earlier.
- Use sort rank to prioritize important or launch-ready cities.
- Leave enough gaps between numbers, such as `10`, `20`, `30`, so future cities can be inserted easily.

### Affiliate hotel URL

- Enter only a valid `http` or `https` hotel affiliate URL.
- Use a city-level hotel link that is genuinely appropriate for the whole city.
- Leave blank if there is no valid affiliate destination yet.

### Affiliate tour URL

- Enter only a valid `http` or `https` tour affiliate URL.
- Use a city-level tour link that is genuinely appropriate for the whole city.
- Leave blank if there is no valid affiliate destination yet.

### Publish status

- Publish only when the page has a clean slug, useful copy, a working image, and any intended affiliate URLs.
- Keep incomplete or draft cities unpublished.
- Remember that published cities can appear on public pages and in the sitemap.

## Spot Data Entry Rules

### Spot name

- Use the common English travel name for the attraction, landmark, neighborhood, or experience.
- Keep the name specific and recognizable.
- Do not add the city name unless it is part of the official/common name.

### Slug

- Use a lowercase, hyphen-separated slug.
- Keep it short but recognizable, for example `colosseum` or `fushimi-inari-taisha`.
- Keep the slug stable after publishing.

### Parent city

- Select the correct published or soon-to-be-published city.
- Do not create duplicate city records to support one spot.

### Summary and description

- Summary should explain the spot in one quick, useful line.
- Description should give enough context for the spot page to stand on its own.
- Avoid generic filler such as "a must-see spot" without concrete detail.

### Hero image URL

- Use a stable, publicly accessible image URL that shows the actual spot.
- Prefer wide landscape images for the hero area.
- Avoid temporary URLs, broken images, or images where the main subject is too small.

### Image position

- Adjust image position so the spot remains visible in the hero crop.
- Check the spot page after saving, especially on mobile.

### Category and tags

- Use category or tags only when the admin UI supports them.
- Prefer reusable labels such as `Landmark`, `Temple`, `Museum`, `Viewpoint`, `Neighborhood`, `Food`, or `Nature`.
- Keep tags useful for filtering and discovery, not decorative.

### Affiliate hotel URL

- Enter only a valid `http` or `https` hotel affiliate URL.
- Spot-level hotel links should be directly relevant to that spot, such as hotels near the attraction.
- Do not paste a generic city-level hotel URL into a spot unless it is truly spot-relevant.

### Affiliate tour URL

- Enter only a valid `http` or `https` tour affiliate URL.
- Spot-level tour links should be directly relevant to that spot.
- Leave blank if there is no good direct affiliate URL.

### Publish status

- Publish only when the spot has a valid parent city, stable slug, readable copy, and working image.
- Keep incomplete spots unpublished.
- Published spots can appear on city pages, spot directories, and the sitemap.

## Slug Rules

- Use lowercase letters and numbers.
- Separate words with hyphens.
- Avoid spaces, underscores, punctuation, emoji, accented characters, and special characters.
- Keep slugs stable after publishing because public URLs, social links, and search indexing may depend on them.
- Prefer clarity over cleverness.

Examples:

- `rome-it`
- `kyoto-jp`
- `colosseum`
- `fushimi-inari-taisha`

## Affiliate URL Rules

- Only enter valid `http` or `https` URLs.
- Do not enter placeholder URLs.
- City pages can show city-level hotel and tour CTAs when the city has valid affiliate URLs.
- Spot pages only show hotel/tour CTA buttons when the spot itself has valid direct affiliate URLs.
- Spot pages should not surface city-level fallback CTAs.
- Do not add generic city-level affiliate URLs to spots unless they are truly spot-relevant.
- If an affiliate URL is uncertain, leave it blank until it can be verified.

## Image Guidance

- Use visually strong travel images that clearly show the city or spot.
- Prefer wide landscape images for hero sections.
- Use image position to keep the main subject visible in different crops.
- Avoid broken, temporary, watermarked, low-resolution, or low-quality URLs.
- Check the public page after saving because background images may crop differently across desktop and mobile.
- Use accurate alt text or image labels when the admin UI provides those fields.

## Publishing Checklist

Before publishing a city or spot:

- Check the page preview in the admin UI if available.
- Check the public city page.
- Check the public spot page.
- Check CTA visibility and confirm only intended hotel/tour buttons appear.
- Check that affiliate URLs open the intended partner destination.
- Check the slug for lowercase, hyphen-separated, stable wording.
- Check image position on desktop and mobile.
- Check summary readability in cards and page headers.
- Check that incomplete pages remain unpublished.

## Do-Not-Change Notes

- Do not change existing slugs casually after pages are public.
- Do not publish incomplete pages.
- Do not enter placeholder affiliate URLs.
- Do not use city fallback CTAs on spot pages unless the product rule changes later.
- Do not force future-only data such as seasons, travel styles, themes, categories, or tags into unrelated fields if the admin UI does not expose them yet.
