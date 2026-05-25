import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { AdminSpot } from "@/data/admin-spots";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const filePath = path.join(process.cwd(), "data", "admin-spots.json");

function readSpots(): AdminSpot[] {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }

    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSpots(spots: AdminSpot[]) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(spots, null, 2), "utf8");
}

export async function GET() {
  return NextResponse.json({
    spots: readSpots(),
  });
}

export async function POST(request: Request) {
  const incoming = (await request.json()) as AdminSpot;

  if (!incoming.citySlug || !incoming.name || !incoming.slug) {
    return NextResponse.json(
      { error: "citySlug, name, and slug are required." },
      { status: 400 }
    );
  }

  const spots = readSpots();

  const nextSpot: AdminSpot = {
    ...incoming,
    id:
      incoming.id ||
      `spot-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    slug: incoming.slug
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""),
    categories: Array.isArray(incoming.categories) ? incoming.categories : [],
    canOpen: incoming.canOpen !== false,
  };

  const existingIndex = spots.findIndex(
    (spot) =>
      spot.citySlug === nextSpot.citySlug && spot.slug === nextSpot.slug
  );

  const nextSpots =
    existingIndex >= 0
      ? spots.map((spot, index) =>
          index === existingIndex ? nextSpot : spot
        )
      : [nextSpot, ...spots];

  writeSpots(nextSpots);

  return NextResponse.json({
    ok: true,
    spot: nextSpot,
    spots: nextSpots,
  });
}
