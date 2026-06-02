import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET_NAME = "travelhub-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function sanitizePathPart(value: string, fallback: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "") || fallback
  );
}

function getStringField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getUploadPath(formData: FormData, file: File, extension: string) {
  const kind = getStringField(formData, "kind");
  const safeCitySlug = sanitizePathPart(getStringField(formData, "citySlug"), "city");
  const safeSpotSlug = sanitizePathPart(getStringField(formData, "spotSlug"), "spot");
  const baseFilename = file.name.replace(/\.[^.]+$/, "");
  const safeFilename = `${sanitizePathPart(baseFilename, "upload")}.${extension}`;
  const timestamp = Date.now();

  if (kind === "city") {
    return `cities/${safeCitySlug}/${timestamp}-${safeFilename}`;
  }

  return `spots/${safeCitySlug}/${safeSpotSlug}/${timestamp}-${safeFilename}`;
}

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "multipart/form-data で送信してください。" },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  const kind = getStringField(formData, "kind");

  if (!file) {
    return NextResponse.json({ error: "ファイルは必須です。" }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "画像ファイルを選択してください。" },
      { status: 400 }
    );
  }

  if (kind !== "city" && kind !== "spot") {
    return NextResponse.json(
      { error: "kind は city または spot を指定してください。" },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "ファイルサイズは5MB以下にしてください。" },
      { status: 413 }
    );
  }

  const extension = MIME_EXTENSIONS[file.type];

  if (!extension) {
    return NextResponse.json(
      { error: "JPEG、PNG、WebP の画像を選択してください。" },
      { status: 415 }
    );
  }

  const path = getUploadPath(formData, file, extension);
  const bytes = await file.arrayBuffer();

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(path, bytes, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const storedPath = data.path;
  const { data: publicData } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storedPath);

  return NextResponse.json({
    ok: true,
    publicUrl: publicData.publicUrl,
    path: storedPath,
  });
}
