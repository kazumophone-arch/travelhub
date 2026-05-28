import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const { data, error } = await supabaseAdmin
      .from("spots")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ spot: data });
  }

  const { data, error } = await supabaseAdmin
    .from("spots")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ spots: data ?? [] });
}
export async function POST(request: Request) {
  const body = await request.json();

  const citySlug = String(body.citySlug ?? "").trim();
  const cityId = String(body.cityId ?? "").trim();
  const name = String(body.name ?? "").trim();
  const slug = slugify(String(body.slug ?? body.name ?? ""));

  if (!citySlug || !name || !slug) {
    return NextResponse.json(
      { error: "citySlug, name, and slug are required." },
      { status: 400 }
    );
  }

  const payload = {
    city_slug: citySlug,
    city_id: cityId || null,
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
      onConflict: "city_slug,slug",
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

  const citySlug = String(body.citySlug ?? "").trim();
  const cityId = String(body.cityId ?? "").trim();
  const name = String(body.name ?? "").trim();
  const slug = slugify(String(body.slug ?? body.name ?? ""));

  if (!citySlug || !name || !slug) {
    return NextResponse.json(
      { error: "citySlug, name, and slug are required." },
      { status: 400 }
    );
  }

  const payload = {
    city_slug: citySlug,
    city_id: cityId || null,
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

