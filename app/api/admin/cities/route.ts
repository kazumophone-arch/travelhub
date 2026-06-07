import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  formatValidationErrors,
  validateCityFields,
} from "@/lib/admin-validation";
import {
  getCityTagIds,
  hasTagIdsField,
  normalizeTagIds,
  replaceCityTags,
  validateAssignableTagIds,
} from "@/lib/admin-tag-assignments";
import { normalizeImagePosition } from "@/lib/url-fields";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AdminDbError = {
  code?: string;
  message?: string;
};

const CITY_HAS_SPOTS_ERROR =
  "この都市にはスポットが登録されています。先にスポットを削除してください。";

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
      { error: "このスラッグの都市はすでに存在します。" },
      { status: 409 }
    );
  }

  if (isForeignKeyError(error)) {
    return NextResponse.json(
      { error: CITY_HAS_SPOTS_ERROR },
      { status: 409 }
    );
  }

  return NextResponse.json(
    { error: error.message ?? "都市の保存に失敗しました。" },
    { status: 500 }
  );
}

async function resolveCountryForCity(countryId: string) {
  if (!countryId) {
    return {
      countryId: null,
      countryName: "",
      countryRegion: "",
      error: null,
    };
  }

  const { data, error } = await supabaseAdmin
    .from("countries")
    .select("id, name, region")
    .eq("id", countryId)
    .maybeSingle();

  if (error || !data?.id) {
    return {
      countryId: null,
      countryName: "",
      countryRegion: "",
      error: "選択した国が見つかりません。",
    };
  }

  return {
    countryId: String(data.id).trim(),
    countryName: String(data.name ?? "").trim(),
    countryRegion: String(data.region ?? "").trim(),
    error: null,
  };
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

    const tagResult = await getCityTagIds(id);

    if (tagResult.error) {
      return NextResponse.json({ error: tagResult.error }, { status: 500 });
    }

    return NextResponse.json({ city: data, tagIds: tagResult.tagIds });
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
  const countryId = String(body.countryId ?? "").trim();
  const country = await resolveCountryForCity(countryId);

  if (country.error) {
    return NextResponse.json({ error: country.error }, { status: 400 });
  }

  const normalizedBody = {
    ...body,
    countryId,
    country: country.countryName || body.country,
  };
  const validationErrors = validateCityFields(normalizedBody);

  if (validationErrors.length > 0) {
    return NextResponse.json(
      { error: formatValidationErrors(validationErrors) },
      { status: 400 }
    );
  }

  const tagIds = normalizeTagIds(body.tagIds);
  const tagValidationError = await validateAssignableTagIds(tagIds);

  if (tagValidationError) {
    return NextResponse.json({ error: tagValidationError }, { status: 400 });
  }

  const city = String(body.city ?? "").trim();
  const countryName = String(normalizedBody.country ?? "").trim();
  const slug = String(body.slug ?? "").trim();
  const imagePosition = normalizeImagePosition(body.imagePosition);

  const payload = {
    slug,
    city,
    country_id: country.countryId,
    country: countryName,
    region: String(body.region ?? country.countryRegion ?? ""),
    summary: String(body.summary ?? ""),
    description: String(body.description ?? ""),
    image_url: String(body.imageUrl ?? ""),
    image_alt: String(body.imageAlt ?? ""),
    image_credit: String(body.imageCredit ?? ""),
    image_source_url: String(body.imageSourceUrl ?? ""),
    image_position: imagePosition,
    affiliate_hotel_url: String(body.affiliateHotelUrl ?? ""),
    affiliate_tour_url: String(body.affiliateTourUrl ?? ""),
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

  const createdCityId = String(data?.id ?? "").trim();

  if (!createdCityId) {
    return NextResponse.json(
      { error: "都市のタグ保存に必要なidを取得できませんでした。" },
      { status: 500 }
    );
  }

  const tagUpdate = await replaceCityTags(createdCityId, tagIds);

  if (tagUpdate.error) {
    return NextResponse.json({ error: tagUpdate.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, city: data, tagIds });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const shouldUpdateTags = hasTagIdsField(body);
  const tagIds = shouldUpdateTags ? normalizeTagIds(body.tagIds) : [];

  const id = String(body.id ?? "").trim();
  const countryId = String(body.countryId ?? "").trim();
  const country = await resolveCountryForCity(countryId);

  if (country.error) {
    return NextResponse.json({ error: country.error }, { status: 400 });
  }

  const normalizedBody = {
    ...body,
    countryId,
    country: country.countryName || body.country,
  };
  const validationErrors = validateCityFields(normalizedBody);
  const city = String(body.city ?? "").trim();
  const countryName = String(normalizedBody.country ?? "").trim();
  const slug = String(body.slug ?? "").trim();
  const imagePosition = normalizeImagePosition(body.imagePosition);

  if (!id) {
    return NextResponse.json({ error: "idは必須です。" }, { status: 400 });
  }

  if (validationErrors.length > 0) {
    return NextResponse.json(
      { error: formatValidationErrors(validationErrors) },
      { status: 400 }
    );
  }

  if (shouldUpdateTags) {
    const tagValidationError = await validateAssignableTagIds(tagIds);

    if (tagValidationError) {
      return NextResponse.json({ error: tagValidationError }, { status: 400 });
    }
  }

  const payload = {
    slug,
    city,
    country_id: country.countryId,
    country: countryName,
    region: String(body.region ?? country.countryRegion ?? ""),
    summary: String(body.summary ?? ""),
    description: String(body.description ?? ""),
    image_url: String(body.imageUrl ?? ""),
    image_alt: String(body.imageAlt ?? ""),
    image_credit: String(body.imageCredit ?? ""),
    image_source_url: String(body.imageSourceUrl ?? ""),
    image_position: imagePosition,
    affiliate_hotel_url: String(body.affiliateHotelUrl ?? ""),
    affiliate_tour_url: String(body.affiliateTourUrl ?? ""),
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

  if (shouldUpdateTags) {
    const tagUpdate = await replaceCityTags(id, tagIds);

    if (tagUpdate.error) {
      return NextResponse.json({ error: tagUpdate.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true, city: data, tagIds });
  }

  return NextResponse.json({ ok: true, city: data });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "idは必須です。" }, { status: 400 });
  }

  const { count: spotCount, error: spotCountError } = await supabaseAdmin
    .from("spots")
    .select("id", { count: "exact", head: true })
    .eq("city_id", id);

  if (spotCountError) {
    return NextResponse.json(
      { error: spotCountError.message ?? "関連スポットの確認に失敗しました。" },
      { status: 500 }
    );
  }

  if ((spotCount ?? 0) > 0) {
    return NextResponse.json(
      { error: CITY_HAS_SPOTS_ERROR },
      { status: 409 }
    );
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
