import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  formatValidationErrors,
  validateCityFields,
} from "@/lib/admin-validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AdminDbError = {
  code?: string;
  message?: string;
};

function isDuplicateError(error: AdminDbError) {
  return (
    error.code === "23505" ||
    String(error.message ?? "").toLowerCase().includes("duplicate key")
  );
}

function isForeignKeyError(error: AdminDbError) {
  return error.code === "23503";
}

function cityErrorResponse(error: AdminDbError) {
  if (isDuplicateError(error)) {
    return NextResponse.json(
      { error: "A city with this slug already exists." },
      { status: 409 }
    );
  }

  if (isForeignKeyError(error)) {
    return NextResponse.json(
      { error: "Delete this city's spots before deleting the city." },
      { status: 409 }
    );
  }

  return NextResponse.json(
    { error: error.message ?? "Failed to save city." },
    { status: 500 }
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const { data, error } = await supabaseAdmin
      .from("cities")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ city: data });
  }

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
  const validationErrors = validateCityFields(body);

  if (validationErrors.length > 0) {
    return NextResponse.json(
      { error: formatValidationErrors(validationErrors) },
      { status: 400 }
    );
  }

  const city = String(body.city ?? "").trim();
  const country = String(body.country ?? "").trim();
  const slug = String(body.slug ?? "").trim();

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
    .insert(payload)
    .select()
    .single();

  if (error) {
    return cityErrorResponse(error);
  }

  return NextResponse.json({ ok: true, city: data });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const validationErrors = validateCityFields(body);

  const id = String(body.id ?? "").trim();
  const city = String(body.city ?? "").trim();
  const country = String(body.country ?? "").trim();
  const slug = String(body.slug ?? "").trim();

  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  if (validationErrors.length > 0) {
    return NextResponse.json(
      { error: formatValidationErrors(validationErrors) },
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
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return cityErrorResponse(error);
  }

  return NextResponse.json({ ok: true, city: data });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("cities")
    .delete()
    .eq("id", id);

  if (error) {
    return cityErrorResponse(error);
  }

  return NextResponse.json({ ok: true });
}
