"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";

type Props = {
  id: string;
};

type CityForm = {
  id: string;
  city: string;
  slug: string;
  country: string;
  region: string;
  summary: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imageCredit: string;
  imageSourceUrl: string;
  isPublished: boolean;
  sortRank: number;
};

type CityApiRow = Record<string, any>;

const emptyForm: CityForm = {
  id: "",
  city: "",
  slug: "",
  country: "",
  region: "",
  summary: "",
  description: "",
  imageUrl: "",
  imageAlt: "",
  imageCredit: "",
  imageSourceUrl: "",
  isPublished: false,
  sortRank: 999,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function readResponse(response: Response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { error: text || "Invalid server response." };
  }
}

export function AdminEditCityForm({ id }: Props) {
  const [form, setForm] = useState<CityForm>(emptyForm);
  const [status, setStatus] = useState("Loading...");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    async function loadCity() {
      setStatus("Loading...");

      const response = await fetch(`/api/admin/cities?id=${id}`);
      const data = await readResponse(response);

      if (!response.ok) {
        setStatus(data.error ?? "Failed to load city.");
        return;
      }

      const cityData = data.city as CityApiRow | null;

      if (!cityData) {
        setStatus("City not found.");
        return;
      }

      setForm({
        id: String(cityData.id ?? ""),
        city: String(cityData.city ?? ""),
        slug: String(cityData.slug ?? ""),
        country: String(cityData.country ?? ""),
        region: String(cityData.region ?? ""),
        summary: String(cityData.summary ?? ""),
        description: String(cityData.description ?? ""),
        imageUrl: String(cityData.image_url ?? ""),
        imageAlt: String(cityData.image_alt ?? ""),
        imageCredit: String(cityData.image_credit ?? ""),
        imageSourceUrl: String(cityData.image_source_url ?? ""),
        isPublished: Boolean(cityData.is_published),
        sortRank: Number(cityData.sort_rank ?? 999),
      });

      setStatus("");
    }

    loadCity();
  }, [id]);

  function update<K extends keyof CityForm>(key: K, value: CityForm[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "city" && !current.slug
        ? { slug: slugify(String(value)) }
        : {}),
    }));
  }

  async function saveCity() {
    setStatus("Saving...");

    const response = await fetch("/api/admin/cities", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await readResponse(response);

    if (!response.ok) {
      setStatus(data.error ?? "Failed to save city.");
      return;
    }

    setStatus("Saved.");
  }

  async function uploadCityImage() {
    if (!form.slug.trim()) {
      setStatus("Enter a city slug before uploading an image.");
      return;
    }

    if (!imageFile) {
      setStatus("Choose an image file before uploading.");
      return;
    }

    setIsUploadingImage(true);
    setStatus("Uploading image...");

    const uploadForm = new FormData();
    uploadForm.append("file", imageFile);
    uploadForm.append("kind", "city");
    uploadForm.append("citySlug", form.slug);

    const response = await fetch("/api/admin/uploads", {
      method: "POST",
      body: uploadForm,
    });

    const data = await readResponse(response);

    setIsUploadingImage(false);

    if (!response.ok || typeof data.publicUrl !== "string") {
      setStatus(data.error ?? "Failed to upload image.");
      return;
    }

    update("imageUrl", data.publicUrl);
    setStatus("Image uploaded. The Image URL field has been updated.");
  }

  if (status === "Loading...") {
    return <div style={emptyStyle}>Loading...</div>;
  }

  return (
    <div style={wrapStyle}>
      <section style={formStyle}>
        <label style={labelStyle}>
          City
          <input value={form.city} onChange={(event) => update("city", event.target.value)} style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Slug
          <input value={form.slug} onChange={(event) => update("slug", slugify(event.target.value))} style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Country
          <input value={form.country} onChange={(event) => update("country", event.target.value)} style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Region
          <input value={form.region} onChange={(event) => update("region", event.target.value)} style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Summary
          <textarea value={form.summary} onChange={(event) => update("summary", event.target.value)} rows={4} style={textareaStyle} />
        </label>

        <label style={labelStyle}>
          Description
          <textarea value={form.description} onChange={(event) => update("description", event.target.value)} rows={5} style={textareaStyle} />
        </label>

        <label style={labelStyle}>
          Image URL
          <input value={form.imageUrl} onChange={(event) => update("imageUrl", event.target.value)} style={inputStyle} />
        </label>

        <div style={uploadWrapStyle}>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
            style={inputStyle}
          />

          <button
            type="button"
            onClick={uploadCityImage}
            style={buttonStyle}
            disabled={isUploadingImage}
          >
            Upload image
          </button>
        </div>

        <label style={labelStyle}>
          Image alt
          <input value={form.imageAlt} onChange={(event) => update("imageAlt", event.target.value)} style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Image credit
          <input value={form.imageCredit} onChange={(event) => update("imageCredit", event.target.value)} style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Image source URL
          <input value={form.imageSourceUrl} onChange={(event) => update("imageSourceUrl", event.target.value)} style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Sort rank
          <input type="number" value={form.sortRank} onChange={(event) => update("sortRank", Number(event.target.value))} style={inputStyle} />
        </label>

        <label style={checkStyle}>
          <input type="checkbox" checked={form.isPublished} onChange={(event) => update("isPublished", event.target.checked)} />
          Published
        </label>

        <div style={buttonRowStyle}>
          <button type="button" onClick={saveCity} style={buttonStyle}>
            Save changes
          </button>

          <Link href="/admin/cities" style={secondaryButtonStyle}>
            Back
          </Link>
        </div>

        {status && <p style={statusStyle}>{status}</p>}
      </section>
    </div>
  );
}

const wrapStyle: CSSProperties = {
  display: "grid",
  gap: 18,
};

const formStyle: CSSProperties = {
  padding: 18,
  borderRadius: 24,
  background: "#ffffff",
  border: "1px solid rgba(23,32,42,.08)",
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: 7,
  marginBottom: 14,
  fontSize: 12,
  color: "#607080",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: ".08em",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 13px",
  borderRadius: 16,
  border: "1px solid rgba(23,32,42,.08)",
  background: "#f8faf7",
  color: "#17202a",
  fontSize: 14,
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  lineHeight: 1.55,
};

const checkStyle: CSSProperties = {
  display: "flex",
  gap: 9,
  alignItems: "center",
  marginBottom: 16,
  color: "#607080",
  fontSize: 13,
  fontWeight: 750,
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  gap: 9,
  flexWrap: "wrap",
};

const uploadWrapStyle: CSSProperties = {
  display: "grid",
  gap: 9,
  marginBottom: 14,
};

const buttonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: 999,
  border: 0,
  background: "#138a72",
  color: "#ffffff",
  fontSize: 13,
  fontWeight: 850,
  cursor: "pointer",
};

const secondaryButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: "#ffffff",
  color: "#607080",
  border: "1px solid rgba(23,32,42,.08)",
  textDecoration: "none",
};

const statusStyle: CSSProperties = {
  marginTop: 12,
  color: "#138a72",
  fontSize: 13,
  fontWeight: 850,
};

const emptyStyle: CSSProperties = {
  padding: 18,
  borderRadius: 22,
  background: "#fffdf8",
  color: "#607080",
};
