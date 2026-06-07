import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { formatValidationErrors, validateSlug } from "@/lib/admin-validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AdminDbError = {
  code?: string;
  message?: string;
};

const TAG_SELECT =
  "id, name, slug, description, is_active, sort_rank, created_at, updated_at";

function asString(value: unknown) {
  return String(value ?? "").trim();
}

function isDuplicateError(error: AdminDbError) {
  return (
    error.code === "23505" ||
    String(error.message ?? "").toLowerCase().includes("duplicate key")
  );
}

function tagErrorResponse(error: AdminDbError) {
  if (isDuplicateError(error)) {
    return NextResponse.json(
      { error: "このスラッグのタグはすでに存在します。" },
      { status: 409 }
    );
  }

  return NextResponse.json(
    { error: error.message ?? "タグの保存に失敗しました。" },
    { status: 500 }
  );
}

function validateTagFields(input: Record<string, unknown>) {
  const errors: string[] = [];

  if (!asString(input.name)) {
    errors.push("タグ名は必須です。");
  }

  const slugError = validateSlug(input.slug, "タグスラッグ");
  if (slugError) errors.push(slugError);

  if (
    input.sortRank !== undefined &&
    input.sortRank !== null &&
    input.sortRank !== "" &&
    !Number.isFinite(Number(input.sortRank))
  ) {
    errors.push("表示順は数値で入力してください。");
  }

  return errors;
}

function getTagPayload(body: Record<string, unknown>) {
  const sortRankValue = body.sortRank;

  return {
    name: asString(body.name),
    slug: asString(body.slug),
    description: asString(body.description),
    is_active:
      body.isActive === undefined || body.isActive === null
        ? true
        : Boolean(body.isActive),
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
  const active = searchParams.get("active");

  if (id) {
    const { data, error } = await supabaseAdmin
      .from("tags")
      .select(TAG_SELECT)
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tag: data });
  }

  let query = supabaseAdmin.from("tags").select(TAG_SELECT);

  if (active === "true" || active === "1") {
    query = query.eq("is_active", true);
  }

  if (active === "false" || active === "0") {
    query = query.eq("is_active", false);
  }

  const { data, error } = await query
    .order("is_active", { ascending: false })
    .order("sort_rank", { ascending: true, nullsFirst: false })
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ tags: data ?? [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  const validationErrors = validateTagFields(body);

  if (validationErrors.length > 0) {
    return NextResponse.json(
      { error: formatValidationErrors(validationErrors) },
      { status: 400 }
    );
  }

  const payload = getTagPayload(body);

  const { data, error } = await supabaseAdmin
    .from("tags")
    .insert(payload)
    .select(TAG_SELECT)
    .single();

  if (error) {
    return tagErrorResponse(error);
  }

  return NextResponse.json({ ok: true, tag: data });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const id = asString(body.id);

  if (!id) {
    return NextResponse.json({ error: "idは必須です。" }, { status: 400 });
  }

  const validationErrors = validateTagFields(body);

  if (validationErrors.length > 0) {
    return NextResponse.json(
      { error: formatValidationErrors(validationErrors) },
      { status: 400 }
    );
  }

  const payload = getTagPayload(body);

  const { data, error } = await supabaseAdmin
    .from("tags")
    .update(payload)
    .eq("id", id)
    .select(TAG_SELECT)
    .single();

  if (error) {
    return tagErrorResponse(error);
  }

  return NextResponse.json({ ok: true, tag: data });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = asString(searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "idは必須です。" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("tags")
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(TAG_SELECT)
    .single();

  if (error) {
    return tagErrorResponse(error);
  }

  return NextResponse.json({ ok: true, tag: data });
}
