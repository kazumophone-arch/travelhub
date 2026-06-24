import type { AffiliateLink, AffiliateLinkType } from "@/data/types";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getOptionalHttpUrl } from "@/lib/url-fields";
import { NextResponse } from "next/server";

type RedirectableAffiliateType = Extract<AffiliateLinkType, "hotels" | "tours">;

type SupabaseRedirectCity = {
  id: string;
  slug: string;
  city: string;
  country: string;
  affiliate_hotel_url?: string | null;
  affiliate_tour_url?: string | null;
};

type SupabaseRedirectSpot = {
  id: string;
  city_id: string | null;
  name: string;
  slug: string;
  affiliate_hotel_url: string | null;
  affiliate_tour_url: string | null;
};

type ClickLogInput = {
  type: RedirectableAffiliateType;
  cityId: string | null;
  spotId: string | null;
  citySlug: string | null;
  spotSlug: string | null;
  targetUrl: string;
  src: string;
  videoId: string;
  referer: string;
  userAgent: string;
};

type SupabaseError = {
  code?: string;
  message?: string;
};

type OutboundRouteContext = {
  params: Promise<{ type: string }>;
};

function isRedirectableAffiliateType(type: string): type is RedirectableAffiliateType {
  return type === "hotels" || type === "tours";
}

function isPrefetchRequest(request: Request) {
  const purpose = request.headers.get("purpose")?.toLowerCase();
  const secPurpose = request.headers.get("sec-purpose")?.toLowerCase();
  const nextRouterPrefetch = request.headers.get("next-router-prefetch");
  const middlewarePrefetch = request.headers.get("x-middleware-prefetch");
  const rsc = request.headers.get("rsc");
  const accept = request.headers.get("accept")?.toLowerCase();

  return (
    purpose === "prefetch" ||
    secPurpose?.includes("prefetch") === true ||
    nextRouterPrefetch === "1" ||
    nextRouterPrefetch === "true" ||
    middlewarePrefetch === "1" ||
    middlewarePrefetch === "true" ||
    rsc === "1" ||
    accept?.includes("text/x-component") === true
  );
}

function shouldLogOutboundClick(request: Request, src: string) {
  return (
    request.method.toUpperCase() !== "HEAD" &&
    !isPrefetchRequest(request) &&
    src !== "admin-preview"
  );
}

function isMissingCityAffiliateColumnError(error: SupabaseError) {
  const message = String(error.message ?? "").toLowerCase();

  return (
    message.includes("affiliate_hotel_url") ||
    message.includes("affiliate_tour_url")
  );
}

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
  const citySelect =
    "id, slug, city, country, affiliate_hotel_url, affiliate_tour_url";
  const { data, error } = await supabase
    .from("cities")
    .select(citySelect)
    .eq("slug", citySlug)
    .eq("is_published", true)
    .maybeSingle();

  if (!error && data) {
    return data as SupabaseRedirectCity;
  }

  if (!error || !isMissingCityAffiliateColumnError(error)) {
    return null;
  }

  const fallbackResult = await supabase
    .from("cities")
    .select("id, slug, city, country")
    .eq("slug", citySlug)
    .eq("is_published", true)
    .maybeSingle();

  if (fallbackResult.error || !fallbackResult.data) return null;

  return {
    ...(fallbackResult.data as SupabaseRedirectCity),
    affiliate_hotel_url: "",
    affiliate_tour_url: "",
  };
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
  type: RedirectableAffiliateType;
}): AffiliateLink | null {
  if (type === "hotels" && spot.affiliate_hotel_url) {
    const url = getOptionalHttpUrl(spot.affiliate_hotel_url);
    if (!url) return null;

    return {
      type,
      label: `Find hotels near ${spot.name}`,
      url,
      priority: 5,
      isActive: true,
    };
  }

  if (type === "tours" && spot.affiliate_tour_url) {
    const url = getOptionalHttpUrl(spot.affiliate_tour_url);
    if (!url) return null;

    return {
      type,
      label: `Book tours near ${spot.name}`,
      url,
      priority: 5,
      isActive: true,
    };
  }

  return null;
}

function getSupabaseCityAffiliateLink({
  city,
  type,
}: {
  city: SupabaseRedirectCity;
  type: RedirectableAffiliateType;
}): AffiliateLink | null {
  if (type === "hotels") {
    const url = getOptionalHttpUrl(city.affiliate_hotel_url);

    return url
      ? {
          type,
          label: `Find hotels in ${city.city}`,
          url,
          priority: 10,
          isActive: true,
        }
      : null;
  }

  if (type === "tours") {
    const url = getOptionalHttpUrl(city.affiliate_tour_url);

    return url
      ? {
          type,
          label: `Book tours in ${city.city}`,
          url,
          priority: 10,
          isActive: true,
        }
      : null;
  }

  return null;
}

async function logOutboundClick(input: ClickLogInput) {
  try {
    const { error } = await supabaseAdmin.from("click_logs").insert({
      type: input.type,
      city_id: input.cityId,
      spot_id: input.spotId,
      city_slug: input.citySlug,
      spot_slug: input.spotSlug,
      target_url: input.targetUrl,
      src: input.src,
      v: input.videoId,
      referer: input.referer || null,
      user_agent: input.userAgent || null,
    });

    if (error) {
      console.warn("[TravelHub click log failed]", error.message);
    }
  } catch (error) {
    console.warn("[TravelHub click log failed]", error);
  }
}

async function handleOutboundRedirect(request: Request, context: OutboundRouteContext) {
  const { type } = await context.params;

  if (!isRedirectableAffiliateType(type)) {
    return new NextResponse("Outbound affiliate type not found", { status: 404 });
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
  const shouldLogClick = shouldLogOutboundClick(request, src);

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
  let supabaseSpot: SupabaseRedirectSpot | null = null;

  if (supabaseCity && inferredSpotSlug) {
    supabaseSpot = await getPublishedSupabaseSpot({
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

  if (!affiliateLink && !inferredSpotSlug) {
    affiliateLink = getSupabaseCityAffiliateLink({
      city: supabaseCity,
      type,
    });
  }

  if (!affiliateLink) {
    const fallbackUrl = new URL(
      supabaseSpot
        ? `/c/${supabaseCity.slug}/spot/${supabaseSpot.slug}`
        : `/c/${supabaseCity.slug}`,
      url.origin
    );
    fallbackUrl.searchParams.set("src", src);
    fallbackUrl.searchParams.set("v", videoId);

    if (shouldLogClick) {
      await logOutboundClick({
        type,
        cityId: supabaseCity.id,
        spotId: supabaseSpot?.id ?? null,
        citySlug: supabaseCity.slug,
        spotSlug: (supabaseSpot?.slug ?? inferredSpotSlug) || null,
        targetUrl: fallbackUrl.toString(),
        src,
        videoId,
        referer,
        userAgent,
      });
    }

    return NextResponse.redirect(fallbackUrl, 302);
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

  if (shouldLogClick) {
    console.info("[TravelHub click]", JSON.stringify(clickEvent));

    await logOutboundClick({
      type,
      cityId: supabaseCity.id,
      spotId: supabaseSpot?.id ?? null,
      citySlug: supabaseCity.slug,
      spotSlug: (supabaseSpot?.slug ?? inferredSpotSlug) || null,
      targetUrl: affiliateLink.url,
      src,
      videoId,
      referer,
      userAgent,
    });
  }

  return NextResponse.redirect(affiliateLink.url, 302);
}

export async function GET(request: Request, context: OutboundRouteContext) {
  return handleOutboundRedirect(request, context);
}

export async function HEAD(request: Request, context: OutboundRouteContext) {
  return handleOutboundRedirect(request, context);
}

