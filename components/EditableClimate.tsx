"use client";

import { useState, type CSSProperties } from "react";
import {
  DEMAND_META,
  emptyClimateMonths,
  type ClimateDemand,
  type ClimateMonth,
  type CityClimate,
} from "@/lib/climate";

type Props = {
  climate: CityClimate;
  onChange: (climate: CityClimate) => void;
};

const DEMAND_OPTIONS: ClimateDemand[] = ["low", "mid", "high", "peak"];

export function EditableClimate({ climate, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const months = climate.months.length > 0 ? climate.months : emptyClimateMonths();

  function updateMonth(index: number, patch: Partial<ClimateMonth>) {
    const nextMonths = months.map((month, i) => (i === index ? { ...month, ...patch } : month));
    onChange({ ...climate, months: nextMonths });
  }

  function updateText(key: "peak_season" | "value_season" | "weather_summary", value: string) {
    onChange({ ...climate, [key]: value });
  }

  return (
    <div style={wrapStyle}>
      <button type="button" onClick={() => setOpen((value) => !value)} style={toggleStyle}>
        🌡 気候・ベストシーズンを編集
      </button>

      {open ? (
        <div style={panelStyle}>
          <p style={hintStyle}>
            数値は「典型的な平年値」の目安です。実データに合わせて自由に編集してください。空欄の項目は公開ページに表示されません。
          </p>

          <label style={labelStyle}>
            繁忙期（混雑・高価格の時期）
            <input
              value={climate.peak_season}
              onChange={(event) => updateText("peak_season", event.target.value)}
              placeholder="例: Late March–April (cherry blossom), November (autumn leaves)"
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            お得な時期（安く静かに行ける時期）
            <input
              value={climate.value_season}
              onChange={(event) => updateText("value_season", event.target.value)}
              placeholder="例: January–February, June (rainy season)"
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            天気のひとことまとめ
            <input
              value={climate.weather_summary}
              onChange={(event) => updateText("weather_summary", event.target.value)}
              placeholder="例: Four distinct seasons; hot humid summers, crisp cold winters."
              style={inputStyle}
            />
          </label>

          <div style={tableHeaderStyle}>
            <span>月</span>
            <span>最高℃</span>
            <span>最低℃</span>
            <span>混雑・価格</span>
          </div>

          <div style={monthListStyle}>
            {months.map((month, index) => (
              <div key={month.month} style={monthRowStyle}>
                <span style={monthNameStyle}>{month.month}</span>
                <input
                  type="number"
                  value={month.high ?? ""}
                  onChange={(event) =>
                    updateMonth(index, {
                      high: event.target.value === "" ? null : Number(event.target.value),
                    })
                  }
                  style={numberInputStyle}
                />
                <input
                  type="number"
                  value={month.low ?? ""}
                  onChange={(event) =>
                    updateMonth(index, {
                      low: event.target.value === "" ? null : Number(event.target.value),
                    })
                  }
                  style={numberInputStyle}
                />
                <select
                  value={month.demand}
                  onChange={(event) =>
                    updateMonth(index, { demand: event.target.value as ClimateDemand })
                  }
                  style={selectStyle}
                >
                  {DEMAND_OPTIONS.map((demand) => (
                    <option key={demand} value={demand}>
                      {DEMAND_META[demand].short}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

const wrapStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  justifyItems: "start",
};

const toggleStyle: CSSProperties = {
  padding: "8px 12px",
  borderRadius: 999,
  border: "1px solid rgba(23,32,42,.16)",
  background: "#ffffff",
  color: "#138a72",
  fontSize: 12,
  fontWeight: 850,
  cursor: "pointer",
};

const panelStyle: CSSProperties = {
  width: "min(440px, 100%)",
  display: "grid",
  gap: 10,
  padding: 16,
  borderRadius: 16,
  background: "#ffffff",
  border: "1px solid rgba(23,32,42,.12)",
  boxShadow: "0 18px 40px rgba(13,43,82,.18)",
  color: "#17202a",
  textAlign: "left",
};

const hintStyle: CSSProperties = {
  margin: 0,
  fontSize: 11,
  lineHeight: 1.55,
  color: "#8d6139",
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: 6,
  fontSize: 11,
  fontWeight: 850,
  color: "#607080",
  letterSpacing: ".06em",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "9px 10px",
  borderRadius: 12,
  border: "1px solid rgba(23,32,42,.12)",
  background: "#f8faf7",
  color: "#17202a",
  fontSize: 13,
  boxSizing: "border-box",
};

const tableHeaderStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "44px 1fr 1fr 1.4fr",
  gap: 8,
  marginTop: 4,
  fontSize: 10,
  fontWeight: 850,
  color: "#9aa7b5",
  textTransform: "uppercase",
  letterSpacing: ".06em",
};

const monthListStyle: CSSProperties = {
  display: "grid",
  gap: 6,
  maxHeight: 280,
  overflowY: "auto",
};

const monthRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "44px 1fr 1fr 1.4fr",
  gap: 8,
  alignItems: "center",
};

const monthNameStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 850,
  color: "#34507A",
};

const numberInputStyle: CSSProperties = {
  width: "100%",
  padding: "7px 8px",
  borderRadius: 10,
  border: "1px solid rgba(23,32,42,.12)",
  background: "#f8faf7",
  color: "#17202a",
  fontSize: 13,
  boxSizing: "border-box",
};

const selectStyle: CSSProperties = {
  ...numberInputStyle,
};
