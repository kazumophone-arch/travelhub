// Phase 1: read-only validation endpoint for the AI Content Import Desk.
//
// This route ONLY selects existing countries/cities/spots to compare a
// pasted content packet against. Supabase write operations are intentionally
// not implemented in this preview-only PR: no row is ever created, changed,
// or removed. This route also never touches click_logs, never calls /out,
// and never calls an AI API.
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { parseContentPacket } from "@/lib/content-packet-schema";
import {
  buildPacketReport,
  type ExistingCityRow,
  type ExistingCountryRow,
  type ExistingSpotRow,
} from "@/lib/content-packet-validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const rawText = typeof body?.rawText === "string" ? body.rawText : "";

  const parseResult = parseContentPacket(rawText);

  if (!parseResult.ok) {
    return NextResponse.json({ error: parseResult.error }, { status: 400 });
  }

  const [countriesResult, citiesResult, spotsResult] = await Promise.all([
    supabaseAdmin
      .from("countries")
      .select("id, slug, name, region, image_url, image_source_url"),
    supabaseAdmin
      .from("cities")
      .select(
        "id, slug, city, country, summary, description, image_url, image_credit, image_source_url, affiliate_hotel_url, affiliate_tour_url"
      ),
    supabaseAdmin
      .from("spots")
      .select(
        "id, slug, city_id, name, summary, description, image_url, image_credit, image_source_url, affiliate_hotel_url, affiliate_tour_url, notes"
      ),
  ]);

  if (countriesResult.error) {
    return NextResponse.json({ error: countriesResult.error.message }, { status: 500 });
  }

  if (citiesResult.error) {
    return NextResponse.json({ error: citiesResult.error.message }, { status: 500 });
  }

  // Spots select includes the optional "notes" column; degrade gracefully
  // if it does not exist yet in some environment rather than failing the
  // whole validation pass.
  let spotRows = spotsResult.data ?? [];
  if (spotsResult.error) {
    const message = String(spotsResult.error.message ?? "").toLowerCase();
    const missingNotesColumn =
      spotsResult.error.code === "42703" || message.includes("notes");

    if (!missingNotesColumn) {
      return NextResponse.json({ error: spotsResult.error.message }, { status: 500 });
    }

    const fallback = await supabaseAdmin
      .from("spots")
      .select(
        "id, slug, city_id, name, summary, description, image_url, image_credit, image_source_url, affiliate_hotel_url, affiliate_tour_url"
      );

    if (fallback.error) {
      return NextResponse.json({ error: fallback.error.message }, { status: 500 });
    }

    spotRows = (fallback.data ?? []).map((row) => ({ ...row, notes: null }));
  }

  const report = buildPacketReport(parseResult.packet, {
    countries: (countriesResult.data ?? []) as ExistingCountryRow[],
    cities: (citiesResult.data ?? []) as ExistingCityRow[],
    spots: spotRows as ExistingSpotRow[],
  });

  return NextResponse.json({ ok: true, report });
}
