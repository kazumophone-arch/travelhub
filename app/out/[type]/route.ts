import { getAffiliateLink, isAffiliateLinkType } from "@/data/affiliate-links";
import { cities } from "@/data/cities";
import { NextResponse } from "next/server";

function inferSpotSlug({
  citySlug,
  videoId,
  explicitSpotSlug,
  referer,
}: {
  citySlug: string;
  videoId: string;
  explicitSpotSlug: string;
  referer: string;
}) {
  if (explicitSpotSlug) return explicitSpotSlug;

  const spotPrefix = `spot_${citySlug}_`;

  if (videoId.startsWith(spotPrefix)) {
    return videoId.replace(spotPrefix, "");
  }

  const spotPathMatch = referer.match(/\/spot\/([^/?#]+)/);

  if (spotPathMatch?.[1]) {
    return spotPathMatch[1];
  }

  return "";
}

export async function GET(
  request: Request,
  context: {
    params: Promise<{ type: string }>;
  }
) {
  const { type } = await context.params;

  if (!isAffiliateLinkType(type)) {
    return new NextResponse("Invalid link type", { status: 404 });
  }

  const url = new URL(request.url);

  const citySlug = url.searchParams.get("c") ?? "";
  const src = url.searchParams.get("src") ?? "unknown";
  const videoId = url.searchParams.get("v") ?? "unknown";
  const explicitSpotSlug = url.searchParams.get("s") ?? "";

  const city = cities[citySlug];

  if (!city) {
    return new NextResponse("City not found", { status: 404 });
  }

  const affiliateLink = getAffiliateLink({
    city,
    type,
  });

  if (!affiliateLink) {
    return new NextResponse("Destination not found", { status: 404 });
  }

  const referer = request.headers.get("referer") ?? "";
  const userAgent = request.headers.get("user-agent") ?? "";
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "";
  const realIp = request.headers.get("x-real-ip") ?? "";

  const inferredSpotSlug = inferSpotSlug({
    citySlug,
    videoId,
    explicitSpotSlug,
    referer,
  });

  const clickEvent = {
    event: "affiliate_click",
    clicked_at: new Date().toISOString(),

    city_slug: city.slug,
    city_name: city.city,
    country: city.country,

    link_type: affiliateLink.type,
    link_label: affiliateLink.label,
    destination_url: affiliateLink.url,

    src,
    video_id: videoId,
    spot_slug: inferredSpotSlug || null,

    referer: referer || null,
    user_agent: userAgent || null,
    ip_hint: forwardedFor || realIp || null,
  };

  console.info("[TravelHub click]", JSON.stringify(clickEvent));

  return NextResponse.redirect(affiliateLink.url, 302);
}