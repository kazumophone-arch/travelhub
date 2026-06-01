"use client";

import { useState, type CSSProperties } from "react";

type CityForm = {
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

const initialForm: CityForm = {
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

export function AdminNewCityForm() {
  const [form, setForm] = useState<CityForm>(initialForm);
  const [status, setStatus] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  function update<K extends keyof CityForm>(key: K, value: CityForm[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "city" && !current.slug
        ? { slug: slugify(String(value)) }
        : {}),
    }));
  }

  async function createCity() {
    setStatus("Creating city...");

    const response = await fetch("/api/admin/cities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error ?? "Failed to create city.");
      return;
    }

    setStatus("City created in Supabase.");
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

    const data = await response.json();

    setIsUploadingImage(false);

    if (!response.ok || typeof data.publicUrl !== "string") {
      setStatus(data.error ?? "Failed to upload image.");
      return;
    }

    update("imageUrl", data.publicUrl);
    setStatus("Image uploaded. The Image URL field has been updated.");
  }

  return (
    <div style={wrapStyle}>
      <section style={formStyle}>
        <label style={labelStyle}>
          City
          <input
            value={form.city}
            onChange={(event) => update("city", event.target.value)}
            placeholder="Rome"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Slug
          <input
            value={form.slug}
            onChange={(event) => update("slug", slugify(event.target.value))}
            placeholder="rome-it"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Country
          <input
            value={form.country}
            onChange={(event) => update("country", event.target.value)}
            placeholder="Italy"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Region
          <input
            value={form.region}
            onChange={(event) => update("region", event.target.value)}
            placeholder="Europe"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Summary
          <textarea
            value={form.summary}
            onChange={(event) => update("summary", event.target.value)}
            rows={4}
            style={textareaStyle}
          />
        </label>

        <label style={labelStyle}>
          Description
          <textarea
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            rows={5}
            style={textareaStyle}
          />
        </label>

        <label style={labelStyle}>
          Image URL
          <input
            value={form.imageUrl}
            onChange={(event) => update("imageUrl", event.target.value)}
            placeholder="https://..."
            style={inputStyle}
          />
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
          <input
            value={form.imageAlt}
            onChange={(event) => update("imageAlt", event.target.value)}
            placeholder="Rome city view"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Image credit
          <input
            value={form.imageCredit}
            onChange={(event) => update("imageCredit", event.target.value)}
            placeholder="Unsplash / Pexels / Wikimedia"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Image source URL
          <input
            value={form.imageSourceUrl}
            onChange={(event) => update("imageSourceUrl", event.target.value)}
            placeholder="https://..."
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Sort rank
          <input
            type="number"
            value={form.sortRank}
            onChange={(event) => update("sortRank", Number(event.target.value))}
            style={inputStyle}
          />
        </label>

        <label style={checkStyle}>
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(event) => update("isPublished", event.target.checked)}
          />
          Published
        </label>

        <button type="button" onClick={createCity} style={buttonStyle}>
          Create city
        </button>

        {status && <p style={statusStyle}>{status}</p>}
      </section>

      <section style={previewStyle}>
        <div style={previewLabelStyle}>Preview</div>

        <div
          style={{
            ...cardStyle,
            backgroundImage: form.imageUrl
              ? `linear-gradient(180deg, rgba(10,18,24,.05), rgba(10,18,24,.76)), url("${form.imageUrl}")`
              : "linear-gradient(135deg, #dfeeea, #f7efe2)",
          }}
        >
          <div style={badgeStyle}>{form.country || "Country"}</div>

          <div style={panelStyle}>
            <div style={metaStyle}>{form.isPublished ? "Published" : "Draft"}</div>
            <h2 style={cardTitleStyle}>{form.city || "New city"}</h2>
            <p style={cardTextStyle}>
              {form.summary || "City summary will appear here."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

const wrapStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(min(100%, 360px), 0.75fr)",
  gap: 18,
  alignItems: "start",
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

const statusStyle: CSSProperties = {
  marginTop: 12,
  color: "#138a72",
  fontSize: 13,
  fontWeight: 850,
};

const previewStyle: CSSProperties = {
  display: "grid",
  gap: 10,
};

const previewLabelStyle: CSSProperties = {
  fontSize: 12,
  color: "#9a6a2f",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: ".12em",
};

const cardStyle: CSSProperties = {
  minHeight: 430,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  borderRadius: 26,
  overflow: "hidden",
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#ffffff",
};

const badgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(255,255,255,.84)",
  color: "#17202a",
  fontSize: 12,
  fontWeight: 850,
};

const panelStyle: CSSProperties = {
  margin: 12,
  padding: 16,
  borderRadius: 20,
  background: "rgba(12,22,30,.54)",
  border: "1px solid rgba(255,255,255,.24)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

const metaStyle: CSSProperties = {
  marginBottom: 7,
  fontSize: 12,
  color: "rgba(255,255,255,.76)",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: ".1em",
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 28,
  lineHeight: 1.04,
  letterSpacing: "-.045em",
};

const cardTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 13,
  lineHeight: 1.55,
  color: "rgba(255,255,255,.84)",
};
