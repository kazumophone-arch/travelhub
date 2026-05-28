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

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("cities")
    .select("*")
    .order("sort_rank", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ cities: data ?? [] });
}

export async function POST(request: Request) {
  const body = await request.json();

  const city = String(body.city ?? "").trim();
  const country = String(body.country ?? "").trim();
  const slug = slugify(String(body.slug ?? body.city ?? ""));

  if (!city || !country || !slug) {
    return NextResponse.json(
      { error: "city, country, and slug are required." },
      { status: 400 }
    );
  }

  const payload = {
    slug,
    city,
    country,
    region: String(body.region ?? ""),
    summary: String(body.summary ?? ""),
    description: String(body.description ?? ""),
    image_url: String(body.imageUrl ?? ""),
    image_alt: String(body.imageAlt ?? ""),
    image_credit: String(body.imageCredit ?? ""),
    image_source_url: String(body.imageSourceUrl ?? ""),
    is_published: Boolean(body.isPublished),
    sort_rank: Number(body.sortRank ?? 999),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from("cities")
    .upsert(payload, {
      onConflict: "slug",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, city: data });
}
