import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストの形式が正しくありません。" },
      { status: 400 }
    );
  }

  const email = String((body as { email?: unknown })?.email ?? "")
    .trim()
    .toLowerCase();

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { error: "有効なメールアドレスを入力してください。" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("waitlist")
    .insert({ email, source: "homepage" });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, alreadyRegistered: true });
    }

    return NextResponse.json(
      { error: "登録に失敗しました。しばらくしてから再度お試しください。" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
