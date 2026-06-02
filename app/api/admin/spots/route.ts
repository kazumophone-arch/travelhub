import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_SPOT_SELECT =
  "id, city_id, name, slug, summary, description, image_url, image_alt, image_credit, image_source_url, affiliate_hotel_url, affiliate_tour_url, is_published, created_at, updated_at";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function resolveCityForSpot(cityId: string) {
  if (!cityId) {
    return {
      cityId: null,
      error: null,
    };
  }

  const { data, error } = await supabaseAdmin
    .from("cities")
    .select("id")
    .eq("id", cityId)
    .maybeSingle();

  if (error || !data?.id) {
    return {
      cityId: null,
      error: "Selected city was not found.",
    };
  }

  return {
    cityId: data.id as string,
    error: null,
  };
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const { data, error } = await supabaseAdmin
      .from("spots")
      .select(ADMIN_SPOT_SELECT)
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ spot: data });
  }

  const { data, error } = await supabaseAdmin
    .from("spots")
    .select(ADMIN_SPOT_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ spots: data ?? [] });
}
export async function POST(request: Request) {
  const body = await request.json();

  const cityId = String(body.cityId ?? "").trim();
  const name = String(body.name ?? "").trim();
  const slug = slugify(String(body.slug ?? body.name ?? ""));
  const city = await resolveCityForSpot(cityId);

  if (city.error) {
    return NextResponse.json({ error: city.error }, { status: 400 });
  }

  if (!city.cityId || !name || !slug) {
    return NextResponse.json(
      { error: "cityId, name, and slug are required." },
      { status: 400 }
    );
  }

  const payload = {
    city_id: city.cityId,
    name,
    slug,
    summary: String(body.summary ?? ""),
    description: String(body.description ?? ""),
    image_url: String(body.imageUrl ?? ""),
    image_alt: String(body.imageAlt ?? ""),
    image_credit: String(body.imageCredit ?? ""),
    image_source_url: String(body.imageSourceUrl ?? ""),
    affiliate_hotel_url: String(body.affiliateHotelUrl ?? ""),
    affiliate_tour_url: String(body.affiliateTourUrl ?? ""),
    is_published: Boolean(body.isPublished),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from("spots")
    .upsert(payload, {
      onConflict: "city_id,slug",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, spot: data });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const id = String(body.id ?? "").trim();

  if (!id) {
    return NextResponse.json(
      { error: "id is required." },
      { status: 400 }
    );
  }

  const cityId = String(body.cityId ?? "").trim();
  const name = String(body.name ?? "").trim();
  const slug = slugify(String(body.slug ?? body.name ?? ""));
  const city = await resolveCityForSpot(cityId);

  if (city.error) {
    return NextResponse.json({ error: city.error }, { status: 400 });
  }

  if (!city.cityId || !name || !slug) {
    return NextResponse.json(
      { error: "cityId, name, and slug are required." },
      { status: 400 }
    );
  }

  const payload = {
    city_id: city.cityId,
    name,
    slug,
    summary: String(body.summary ?? ""),
    description: String(body.description ?? ""),
    image_url: String(body.imageUrl ?? ""),
    image_alt: String(body.imageAlt ?? ""),
    image_credit: String(body.imageCredit ?? ""),
    image_source_url: String(body.imageSourceUrl ?? ""),
    affiliate_hotel_url: String(body.affiliateHotelUrl ?? ""),
    affiliate_tour_url: String(body.affiliateTourUrl ?? ""),
    is_published: Boolean(body.isPublished),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from("spots")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, spot: data });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "id is required." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("spots")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

