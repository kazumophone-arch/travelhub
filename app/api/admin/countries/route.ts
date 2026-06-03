import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  formatValidationErrors,
  validateCountryFields,
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

function countryErrorResponse(error: AdminDbError) {
  if (isDuplicateError(error)) {
    return NextResponse.json(
      { error: "このスラッグの国はすでに存在します。" },
      { status: 409 }
    );
  }

  return NextResponse.json(
    { error: error.message ?? "国の保存に失敗しました。" },
    { status: 500 }
  );
}

function getCountryPayload(body: Record<string, unknown>) {
  const sortRankValue = body.sortRank;

  return {
    name: String(body.name ?? "").trim(),
    slug: String(body.slug ?? "").trim(),
    iso_code: String(body.isoCode ?? "").trim(),
    region: String(body.region ?? "").trim(),
    image_url: String(body.imageUrl ?? "").trim(),
    image_source_url: String(body.imageSourceUrl ?? "").trim(),
    is_published: Boolean(body.isPublished),
    sort_rank:
      sortRankValue === undefined || sortRankValue === null || sortRankValue === ""
        ? null
        : Number(sortRankValue),
    updated_at: new Date().toISOString(),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const { data, error } = await supabaseAdmin
      .from("countries")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ country: data });
  }

  const { data, error } = await supabaseAdmin
    .from("countries")
    .select("*")
    .order("sort_rank", { ascending: true, nullsFirst: false })
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ countries: data ?? [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  const validationErrors = validateCountryFields(body);

  if (validationErrors.length > 0) {
    return NextResponse.json(
      { error: formatValidationErrors(validationErrors) },
      { status: 400 }
    );
  }

  const payload = getCountryPayload(body);

  const { data, error } = await supabaseAdmin
    .from("countries")
    .insert(payload)
    .select()
    .single();

  if (error) {
    return countryErrorResponse(error);
  }

  return NextResponse.json({ ok: true, country: data });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const id = String(body.id ?? "").trim();

  if (!id) {
    return NextResponse.json({ error: "idは必須です。" }, { status: 400 });
  }

  const validationErrors = validateCountryFields(body);

  if (validationErrors.length > 0) {
    return NextResponse.json(
      { error: formatValidationErrors(validationErrors) },
      { status: 400 }
    );
  }

  const payload = getCountryPayload(body);

  const { data, error } = await supabaseAdmin
    .from("countries")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return countryErrorResponse(error);
  }

  return NextResponse.json({ ok: true, country: data });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "idは必須です。" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("countries")
    .delete()
    .eq("id", id);

  if (error) {
    return countryErrorResponse(error);
  }

  return NextResponse.json({ ok: true });
}
