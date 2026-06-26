import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  formatValidationErrors,
  normalizeGalleryForWrite,
  normalizeSpotNotesForWrite,
  validateSpotFields,
} from "@/lib/admin-validation";
import {
  getSpotTagIds,
  hasTagIdsField,
  normalizeTagIds,
  replaceSpotTags,
  validateAssignableTagIds,
} from "@/lib/admin-tag-assignments";
import { normalizeImagePosition } from "@/lib/url-fields";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_SPOT_SELECT =
  "id, city_id, name, slug, summary, description, image_url, image_alt, image_credit, image_source_url, image_position, affiliate_hotel_url, affiliate_tour_url, is_published, gallery, notes, created_at, updated_at";

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

function spotErrorResponse(error: AdminDbError) {
  if (isDuplicateError(error)) {
    return NextResponse.json(
      { error: "選択した都市には、このスラッグのスポットがすでに存在します。" },
      { status: 409 }
    );
  }

  return NextResponse.json(
    { error: error.message ?? "スポットの保存に失敗しました。" },
    { status: 500 }
  );
}

async function resolveCityForSpot(cityId: string) {
  if (!cityId) {
    return {
      cityId: "",
      error: "都市を選択してください。",
    };
  }

  const { data, error } = await supabaseAdmin
    .from("cities")
    .select("id")
    .eq("id", cityId)
    .maybeSingle();

  if (error || !data?.id) {
    return {
      cityId: "",
      error: "選択した都市が見つかりません。",
    };
  }

  return {
    cityId: String(data.id).trim(),
    error: null,
  };
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const cityId = searchParams.get("cityId");

  if (id) {
    const { data, error } = await supabaseAdmin
      .from("spots")
      .select(ADMIN_SPOT_SELECT)
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const tagResult = await getSpotTagIds(id);

    if (tagResult.error) {
      return NextResponse.json({ error: tagResult.error }, { status: 500 });
    }

    return NextResponse.json({ spot: data, tagIds: tagResult.tagIds });
  }

  let query = supabaseAdmin
    .from("spots")
    .select(ADMIN_SPOT_SELECT)
    .order("created_at", { ascending: false });

  if (cityId) {
    query = query.eq("city_id", cityId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ spots: data ?? [] });
}
export async function POST(request: Request) {
  const body = await request.json();
  const cityId = String(body.cityId ?? "").trim();

  if (!cityId) {
    return NextResponse.json(
      { error: "都市を選択してください。" },
      { status: 400 }
    );
  }

  const normalizedBody = {
    ...body,
    cityId,
  };
  const validationErrors = validateSpotFields(normalizedBody);

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

  const name = String(body.name ?? "").trim();
  const slug = String(body.slug ?? "").trim();
  const city = await resolveCityForSpot(cityId);
  const imagePosition = normalizeImagePosition(body.imagePosition);

  if (city.error) {
    return NextResponse.json({ error: city.error }, { status: 400 });
  }

  if (!name || !slug) {
    return NextResponse.json(
      { error: "スポット名、スラッグは必須です。" },
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
    image_position: imagePosition,
    affiliate_hotel_url: String(body.affiliateHotelUrl ?? ""),
    affiliate_tour_url: String(body.affiliateTourUrl ?? ""),
    is_published: Boolean(body.isPublished),
    gallery: normalizeGalleryForWrite(body.gallery),
    notes: normalizeSpotNotesForWrite(body.notes),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from("spots")
    .insert(payload)
    .select()
    .single();

  if (error) {
    return spotErrorResponse(error);
  }

  const createdSpotId = String(data?.id ?? "").trim();

  if (!createdSpotId) {
    return NextResponse.json(
      { error: "スポットのタグ保存に必要なidを取得できませんでした。" },
      { status: 500 }
    );
  }

  const tagUpdate = await replaceSpotTags(createdSpotId, tagIds);

  if (tagUpdate.error) {
    return NextResponse.json({ error: tagUpdate.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, spot: data, tagIds });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const shouldUpdateTags = hasTagIdsField(body);
  const tagIds = shouldUpdateTags ? normalizeTagIds(body.tagIds) : [];

  const id = String(body.id ?? "").trim();

  if (!id) {
    return NextResponse.json(
      { error: "idは必須です。" },
      { status: 400 }
    );
  }

  const cityId = String(body.cityId ?? "").trim();

  if (!cityId) {
    return NextResponse.json(
      { error: "都市を選択してください。" },
      { status: 400 }
    );
  }

  const normalizedBody = {
    ...body,
    cityId,
  };
  const validationErrors = validateSpotFields(normalizedBody);

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

  const name = String(body.name ?? "").trim();
  const slug = String(body.slug ?? "").trim();
  const city = await resolveCityForSpot(cityId);
  const imagePosition = normalizeImagePosition(body.imagePosition);

  if (city.error) {
    return NextResponse.json({ error: city.error }, { status: 400 });
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
    image_position: imagePosition,
    affiliate_hotel_url: String(body.affiliateHotelUrl ?? ""),
    affiliate_tour_url: String(body.affiliateTourUrl ?? ""),
    is_published: Boolean(body.isPublished),
    gallery: normalizeGalleryForWrite(body.gallery),
    notes: normalizeSpotNotesForWrite(body.notes),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from("spots")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return spotErrorResponse(error);
  }

  if (shouldUpdateTags) {
    const tagUpdate = await replaceSpotTags(id, tagIds);

    if (tagUpdate.error) {
      return NextResponse.json({ error: tagUpdate.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true, spot: data, tagIds });
  }

  return NextResponse.json({ ok: true, spot: data });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "idは必須です。" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("spots")
    .delete()
    .eq("id", id);

  if (error) {
    return spotErrorResponse(error);
  }

  return NextResponse.json({ ok: true });
}

