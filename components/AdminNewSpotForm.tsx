"use client";

import { useEffect, useState, type CSSProperties } from "react";

type CityOption = {
  id: string;
  slug: string;
  city: string;
  country: string;
  is_published: boolean;
};

type SpotForm = {
  cityId: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imageCredit: string;
  imageSourceUrl: string;
  affiliateHotelUrl: string;
  affiliateTourUrl: string;
  isPublished: boolean;
};

const initialForm: SpotForm = {
  cityId: "",
  name: "",
  slug: "",
  summary: "",
  description: "",
  imageUrl: "",
  imageAlt: "",
  imageCredit: "",
  imageSourceUrl: "",
  affiliateHotelUrl: "",
  affiliateTourUrl: "",
  isPublished: false,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminNewSpotForm() {
  const [cities, setCities] = useState<CityOption[]>([]);
  const [form, setForm] = useState<SpotForm>(initialForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [status, setStatus] = useState("Loading cities...");
  const selectedCity = cities.find((city) => city.id === form.cityId);
  const selectedCitySlug = selectedCity?.slug ?? "";

  useEffect(() => {
    async function loadCities() {
      const response = await fetch("/api/admin/cities");
      const data = await response.json();

      if (!response.ok) {
        setStatus(data.error ?? "Failed to load cities.");
        return;
      }

      const nextCities = data.cities ?? [];
      setCities(nextCities);

      setForm((current) => ({
        ...current,
        cityId: current.cityId || nextCities[0]?.id || "",
      }));

      setStatus("");
    }

    loadCities();
  }, []);

  function updateCity(cityId: string) {
    setForm((current) => ({
      ...current,
      cityId,
    }));
  }

  function update<K extends keyof SpotForm>(key: K, value: SpotForm[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "name" && !current.slug
        ? { slug: slugify(String(value)) }
        : {}),
    }));
  }

  async function createInSupabase() {
    setStatus("Creating in Supabase...");

    const response = await fetch("/api/admin/spots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error ?? "Failed to create spot.");
      return;
    }

    setStatus("Created in Supabase.");
  }

  async function uploadSpotImage() {
    if (!selectedCitySlug) {
      setStatus("Choose a city before uploading an image.");
      return;
    }

    if (!form.slug.trim()) {
      setStatus("Enter a spot slug before uploading an image.");
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
    uploadForm.append("kind", "spot");
    uploadForm.append("citySlug", selectedCitySlug);
    uploadForm.append("spotSlug", form.slug);

    try {
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: uploadForm,
      });

      const data = await response.json();

      if (!response.ok || typeof data.publicUrl !== "string") {
        setStatus(data.error ?? "Failed to upload image.");
        return;
      }

      update("imageUrl", data.publicUrl);
      setStatus("Image uploaded. The Image URL field has been updated.");
    } catch {
      setStatus("Failed to upload image.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  return (
    <div style={wrapStyle}>
      <section style={formStyle}>
        {cities.length === 0 && !status ? (
          <div style={emptyStyle}>
            No cities found. Create a city first.
          </div>
        ) : null}

        <label style={labelStyle}>
          City
          <select
            value={form.cityId}
            onChange={(event) => updateCity(event.target.value)}
            style={inputStyle}
          >
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.city}, {city.country}
                {city.is_published ? "" : " — Draft"}
              </option>
            ))}
          </select>
        </label>

        <label style={labelStyle}>
          Spot name
          <input
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="Trevi Fountain"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Slug
          <input
            value={form.slug}
            onChange={(event) => update("slug", slugify(event.target.value))}
            placeholder="trevi-fountain"
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
            onClick={uploadSpotImage}
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
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Image credit
          <input
            value={form.imageCredit}
            onChange={(event) => update("imageCredit", event.target.value)}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Image source URL
          <input
            value={form.imageSourceUrl}
            onChange={(event) => update("imageSourceUrl", event.target.value)}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Hotel affiliate URL
          <input
            value={form.affiliateHotelUrl}
            onChange={(event) => update("affiliateHotelUrl", event.target.value)}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Tour affiliate URL
          <input
            value={form.affiliateTourUrl}
            onChange={(event) => update("affiliateTourUrl", event.target.value)}
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

        <button
          type="button"
          onClick={createInSupabase}
          style={buttonStyle}
          disabled={cities.length === 0}
        >
          Create in Supabase
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
          <div style={badgeStyle}>{selectedCitySlug || "city"}</div>

          <div style={panelStyle}>
            <div style={metaStyle}>{form.isPublished ? "Published" : "Draft"}</div>
            <h2 style={cardTitleStyle}>{form.name || "New spot"}</h2>
            <p style={cardTextStyle}>
              {form.summary || "Spot summary will appear here."}
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

const emptyStyle: CSSProperties = {
  marginBottom: 14,
  padding: 14,
  borderRadius: 18,
  background: "#fffdf8",
  border: "1px solid rgba(168,116,50,.14)",
  color: "#607080",
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


