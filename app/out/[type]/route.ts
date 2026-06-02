import { isAffiliateLinkType } from "@/data/affiliate-links";
import type { AffiliateLink, AffiliateLinkType } from "@/data/types";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

type SupabaseRedirectCity = {
  id: string;
  slug: string;
  city: string;
  country: string;
};

type SupabaseRedirectSpot = {
  id: string;
  city_id: string | null;
  name: string;
  slug: string;
  affiliate_hotel_url: string;
  affiliate_tour_url: string;
};

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

  if (videoId.includes(spotPrefix)) {
    return videoId.slice(videoId.indexOf(spotPrefix) + spotPrefix.length);
  }

  const spotPathMatch = referer.match(/\/spot\/([^/?#]+)/);

  if (spotPathMatch?.[1]) {
    return spotPathMatch[1];
  }

  return "";
}

async function getPublishedSupabaseCity(citySlug: string) {
  const { data, error } = await supabase
    .from("cities")
    .select("id, slug, city, country")
    .eq("slug", citySlug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) return null;

  return data as SupabaseRedirectCity;
}

async function getPublishedSupabaseSpot({
  city,
  spotSlug,
}: {
  city: SupabaseRedirectCity;
  spotSlug: string;
}) {
  const selectFields =
    "id, city_id, name, slug, affiliate_hotel_url, affiliate_tour_url";

  const { data: idMatchedSpots, error } = await supabase
    .from("spots")
    .select(selectFields)
    .eq("city_id", city.id)
    .eq("slug", spotSlug)
    .eq("is_published", true)
    .limit(1);

  if (!error && idMatchedSpots?.[0]) {
    return idMatchedSpots[0] as SupabaseRedirectSpot;
  }

  return null;
}

function getSupabaseSpotAffiliateLink({
  spot,
  type,
}: {
  spot: SupabaseRedirectSpot;
  type: AffiliateLinkType;
}): AffiliateLink | null {
  if (type === "hotels" && spot.affiliate_hotel_url) {
    return {
      type,
      label: `Find hotels near ${spot.name}`,
      url: spot.affiliate_hotel_url,
      priority: 5,
      isActive: true,
    };
  }

  if (type === "tours" && spot.affiliate_tour_url) {
    return {
      type,
      label: `Book tours near ${spot.name}`,
      url: spot.affiliate_tour_url,
      priority: 5,
      isActive: true,
    };
  }

  return null;
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

  const supabaseCity = citySlug
    ? await getPublishedSupabaseCity(citySlug)
    : null;

  let affiliateLink: AffiliateLink | null = null;

  if (supabaseCity && inferredSpotSlug) {
    const supabaseSpot = await getPublishedSupabaseSpot({
      city: supabaseCity,
      spotSlug: inferredSpotSlug,
    });

    if (supabaseSpot) {
      affiliateLink = getSupabaseSpotAffiliateLink({
        spot: supabaseSpot,
        type,
      });
    }
  }

  if (!supabaseCity) {
    return new NextResponse("City not found", { status: 404 });
  }

  if (!affiliateLink) {
    return new NextResponse("Destination not found", { status: 404 });
  }

  const clickEvent = {
    event: "affiliate_click",
    clicked_at: new Date().toISOString(),

    citySlug: supabaseCity.slug,
    city_name: supabaseCity.city,
    country: supabaseCity.country,

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
