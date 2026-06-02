"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  formatValidationErrors,
  slugify,
  validateSlug,
  validateSpotFields,
} from "@/lib/admin-validation";
import { getImageBackground } from "@/lib/url-fields";

type Props = {
  id: string;
};

type CityOption = {
  id: string;
  slug: string;
  city: string;
  country: string;
  is_published: boolean;
};

type SpotForm = {
  id: string;
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

type StatusKind = "info" | "success" | "error";

const emptyForm: SpotForm = {
  id: "",
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

async function readResponse(response: Response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { error: text || "Invalid server response." };
  }
}

export function AdminSupabaseEditSpotForm({ id }: Props) {
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [form, setForm] = useState<SpotForm>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [status, setStatus] = useState("Loading...");
  const [statusKind, setStatusKind] = useState<StatusKind>("info");
  const selectedCity = cityOptions.find((city) => city.id === form.cityId);
  const selectedCitySlug = selectedCity?.slug ?? "";

  function setStatusMessage(message: string, kind: StatusKind = "info") {
    setStatus(message);
    setStatusKind(kind);
  }

  useEffect(() => {
    async function loadSpot() {
      const [spotResponse, citiesResponse] = await Promise.all([
        fetch(`/api/admin/spots?id=${id}`),
        fetch("/api/admin/cities"),
      ]);

      const data = await readResponse(spotResponse);
      const citiesData = await readResponse(citiesResponse);
      const nextCities = (citiesData.cities ?? []) as CityOption[];

      if (citiesResponse.ok) {
        setCityOptions(nextCities);
      }

      const response = spotResponse;

      if (!response.ok) {
        setStatusMessage(data.error ?? "Failed to load spot.", "error");
        return;
      }

      const spot = data.spot;
      const cityId = String(spot.city_id ?? "");

      setForm({
        id: spot.id,
        cityId,
        name: spot.name ?? "",
        slug: spot.slug ?? "",
        summary: spot.summary ?? "",
        description: spot.description ?? "",
        imageUrl: spot.image_url ?? "",
        imageAlt: spot.image_alt ?? "",
        imageCredit: spot.image_credit ?? "",
        imageSourceUrl: spot.image_source_url ?? "",
        affiliateHotelUrl: spot.affiliate_hotel_url ?? "",
        affiliateTourUrl: spot.affiliate_tour_url ?? "",
        isPublished: Boolean(spot.is_published),
      });

      setStatusMessage(
        cityId
          ? ""
          : "This spot is missing city_id. Select a city to finish migration.",
        cityId ? "info" : "error"
      );
    }

    loadSpot();
  }, [id]);

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

  async function save() {
    const validationErrors = validateSpotFields(form);

    if (validationErrors.length > 0) {
      setStatusMessage(formatValidationErrors(validationErrors), "error");
      return;
    }

    setStatusMessage("Saving...");

    const response = await fetch("/api/admin/spots", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await readResponse(response);

    if (!response.ok) {
      setStatusMessage(data.error ?? "Failed to save spot.", "error");
      return;
    }

    setStatusMessage("Spot saved successfully.", "success");
  }

  async function uploadSpotImage() {
    if (!selectedCitySlug) {
      setStatusMessage("Choose a city before uploading an image.", "error");
      return;
    }

    const slugError = validateSlug(form.slug, "Spot slug");

    if (slugError) {
      setStatusMessage(slugError, "error");
      return;
    }

    if (!imageFile) {
      setStatusMessage("Choose an image file before uploading.", "error");
      return;
    }

    setIsUploadingImage(true);
    setStatusMessage("Uploading image...");

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

      const data = await readResponse(response);

      if (!response.ok || typeof data.publicUrl !== "string") {
        setStatusMessage(data.error ?? "Failed to upload image.", "error");
        return;
      }

      update("imageUrl", data.publicUrl);
      setStatusMessage(
        "Image uploaded. The Image URL field has been updated.",
        "success"
      );
    } catch {
      setStatusMessage("Failed to upload image.", "error");
    } finally {
      setIsUploadingImage(false);
    }
  }

  if (status === "Loading...") {
    return <div style={emptyStyle}>Loading...</div>;
  }

  return (
    <div style={wrapStyle}>
      <section style={formStyle}>
        <label style={labelStyle}>
          City
          <select
            value={form.cityId}
            onChange={(event) => updateCity(event.target.value)}
            style={inputStyle}
          >
            <option value="" disabled>
              Select a city
            </option>
            {cityOptions.map((city) => (
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
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Slug
          <input
            value={form.slug}
            onChange={(event) => update("slug", slugify(event.target.value))}
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
          Image URL (https)
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
          Image source URL (https)
          <input
            value={form.imageSourceUrl}
            onChange={(event) => update("imageSourceUrl", event.target.value)}
            placeholder="https://source.example/photo"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Hotel affiliate URL (https)
          <input
            value={form.affiliateHotelUrl}
            onChange={(event) => update("affiliateHotelUrl", event.target.value)}
            placeholder="https://..."
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Tour affiliate URL (https)
          <input
            value={form.affiliateTourUrl}
            onChange={(event) => update("affiliateTourUrl", event.target.value)}
            placeholder="https://..."
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

        <div style={buttonRowStyle}>
          <button type="button" onClick={save} style={buttonStyle}>
            Save changes
          </button>

          <Link href="/admin/spots" style={secondaryButtonStyle}>
            Back
          </Link>
        </div>

        {status && (
          <p style={statusKind === "error" ? errorStatusStyle : statusKind === "success" ? successStatusStyle : statusStyle}>
            {status}
          </p>
        )}
      </section>

      <section style={previewStyle}>
        <div style={previewLabelStyle}>Preview</div>

        <div
          style={{
            ...cardStyle,
            backgroundImage: getImageBackground(
              form.imageUrl,
              "linear-gradient(180deg, rgba(10,18,24,.05), rgba(10,18,24,.76))",
              "linear-gradient(135deg, #dfeeea, #f7efe2)"
            ),
          }}
        >
          <div style={badgeStyle}>{selectedCitySlug || "Missing city_id"}</div>

          <div style={panelStyle}>
            <div style={metaStyle}>{form.isPublished ? "Published" : "Draft"}</div>
            <h2 style={cardTitleStyle}>{form.name}</h2>
            <p style={cardTextStyle}>{form.summary}</p>
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

const successStatusStyle: CSSProperties = statusStyle;

const errorStatusStyle: CSSProperties = {
  ...statusStyle,
  color: "#9a3d2f",
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

const emptyStyle: CSSProperties = {
  padding: 18,
  borderRadius: 22,
  background: "#fffdf8",
  color: "#607080",
};





