import { NextResponse } from "next/server";
import { cities } from "@/data/cities";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params; // ← ここが修正点

  const url = new URL(req.url);
  const c = url.searchParams.get("c") || "";
  const src = url.searchParams.get("src") || "";
  const v = url.searchParams.get("v") || "";

  const city = cities[c];
  if (!city) return NextResponse.json({ error: "Unknown city" }, { status: 404 });

  const dest =
    type === "hotels" ? city.affHotelsUrl :
    type === "tours" ? (city.affToursUrl || "") :
    "";

  if (!dest) {
    return NextResponse.json({ error: "Unknown type or missing url" }, { status: 404 });
  }

  console.log(JSON.stringify({
    at: new Date().toISOString(),
    type, c, src, v,
    ua: req.headers.get("user-agent") || "",
  }));

  return NextResponse.redirect(dest, 302);
}