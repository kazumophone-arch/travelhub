import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";

type JoinTable = "city_tags" | "spot_tags";
type EntityIdColumn = "city_id" | "spot_id";

type TagIdResult = {
  tagIds: string[];
  error: string | null;
};

type UpdateResult = {
  error: string | null;
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function normalizeTagIds(value: unknown) {
  if (!Array.isArray(value)) return [];

  const tagIds: string[] = [];
  const seen = new Set<string>();

  for (const item of value) {
    const tagId = String(item ?? "").trim();

    if (!tagId || seen.has(tagId)) continue;

    seen.add(tagId);
    tagIds.push(tagId);
  }

  return tagIds;
}

export async function validateAssignableTagIds(tagIds: string[]) {
  if (tagIds.length === 0) return null;

  if (tagIds.some((tagId) => !uuidPattern.test(tagId))) {
    return "選択したタグが無効です。";
  }

  const { data, error } = await supabaseAdmin
    .from("tags")
    .select("id")
    .eq("is_active", true)
    .in("id", tagIds);

  if (error) {
    return error.message ?? "タグの確認に失敗しました。";
  }

  const activeTagIds = new Set((data ?? []).map((tag) => String(tag.id)));

  if (tagIds.some((tagId) => !activeTagIds.has(tagId))) {
    return "選択したタグが見つからないか、アーカイブされています。";
  }

  return null;
}

export function hasTagIdsField(body: Record<string, unknown>) {
  return Object.prototype.hasOwnProperty.call(body, "tagIds");
}

export async function getCityTagIds(cityId: string) {
  return getActiveEntityTagIds("city_tags", "city_id", cityId);
}

export async function getSpotTagIds(spotId: string) {
  return getActiveEntityTagIds("spot_tags", "spot_id", spotId);
}

export async function replaceCityTags(cityId: string, tagIds: string[]) {
  return replaceEntityTags("city_tags", "city_id", cityId, tagIds);
}

export async function replaceSpotTags(spotId: string, tagIds: string[]) {
  return replaceEntityTags("spot_tags", "spot_id", spotId, tagIds);
}

async function getActiveEntityTagIds(
  table: JoinTable,
  idColumn: EntityIdColumn,
  entityId: string
): Promise<TagIdResult> {
  const rawResult = await getRawEntityTagIds(table, idColumn, entityId);

  if (rawResult.error || rawResult.tagIds.length === 0) {
    return rawResult;
  }

  const { data, error } = await supabaseAdmin
    .from("tags")
    .select("id")
    .eq("is_active", true)
    .in("id", rawResult.tagIds);

  if (error) {
    return {
      tagIds: [],
      error: error.message ?? "タグの読み込みに失敗しました。",
    };
  }

  const activeTagIds = new Set((data ?? []).map((tag) => String(tag.id)));

  return {
    tagIds: rawResult.tagIds.filter((tagId) => activeTagIds.has(tagId)),
    error: null,
  };
}

async function replaceEntityTags(
  table: JoinTable,
  idColumn: EntityIdColumn,
  entityId: string,
  tagIds: string[]
): Promise<UpdateResult> {
  const desiredTagIds = normalizeTagIds(tagIds);
  const validationError = await validateAssignableTagIds(desiredTagIds);

  if (validationError) {
    return { error: validationError };
  }

  const currentResult = await getRawEntityTagIds(table, idColumn, entityId);

  if (currentResult.error) {
    return { error: currentResult.error };
  }

  const currentTagIds = currentResult.tagIds;
  const currentSet = new Set(currentTagIds);
  const desiredSet = new Set(desiredTagIds);
  const toAdd = desiredTagIds.filter((tagId) => !currentSet.has(tagId));
  const toRemove = currentTagIds.filter((tagId) => !desiredSet.has(tagId));

  if (toAdd.length > 0) {
    const now = new Date().toISOString();
    const rows = toAdd.map((tagId) => ({
      [idColumn]: entityId,
      tag_id: tagId,
      updated_at: now,
    }));

    const { error } = await supabaseAdmin.from(table).insert(rows);

    if (error) {
      return { error: error.message ?? "タグの追加に失敗しました。" };
    }
  }

  if (toRemove.length > 0) {
    const { error } = await supabaseAdmin
      .from(table)
      .delete()
      .eq(idColumn, entityId)
      .in("tag_id", toRemove);

    if (error) {
      return { error: error.message ?? "タグの削除に失敗しました。" };
    }
  }

  return { error: null };
}

async function getRawEntityTagIds(
  table: JoinTable,
  idColumn: EntityIdColumn,
  entityId: string
): Promise<TagIdResult> {
  const { data, error } = await supabaseAdmin
    .from(table)
    .select("tag_id")
    .eq(idColumn, entityId);

  if (error) {
    return {
      tagIds: [],
      error: error.message ?? "タグの読み込みに失敗しました。",
    };
  }

  return {
    tagIds: normalizeTagIds((data ?? []).map((row) => row.tag_id)),
    error: null,
  };
}
