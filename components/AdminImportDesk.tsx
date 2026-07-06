"use client";

import { useState, type CSSProperties } from "react";
import type { EntityReport, ImportStatus, PacketReport } from "@/lib/content-packet-validate";

async function readResponse(response: Response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { error: text || "サーバー応答を読み取れませんでした。" };
  }
}

const STATUS_LABEL: Record<ImportStatus, string> = {
  new: "新規",
  update: "更新",
  invalid: "無効",
};

const STATUS_TONE: Record<ImportStatus, CSSProperties> = {
  new: { background: "#e5f7f2", color: "#138a72", border: "1px solid rgba(19,138,114,.2)" },
  update: { background: "#eaf1ff", color: "#2f5fb0", border: "1px solid rgba(47,95,176,.2)" },
  invalid: { background: "#fdeceb", color: "#9a3d2f", border: "1px solid rgba(154,61,47,.2)" },
};

const KIND_LABEL: Record<EntityReport["kind"], string> = {
  country: "国 (Country / Volume)",
  city: "都市 (City / Chapter)",
  spot: "スポット (Spot / Page)",
  journal: "Journal 記事",
};

function EntityCard({ entity }: { entity: EntityReport }) {
  return (
    <div style={cardStyle}>
      <div style={cardHeaderStyle}>
        <span style={{ ...statusBadgeStyle, ...STATUS_TONE[entity.status] }}>
          {STATUS_LABEL[entity.status]}
        </span>
        <strong style={cardTitleStyle}>{entity.label}</strong>
        {entity.slug ? <span style={slugStyle}>/{entity.slug}</span> : null}
      </div>

      {entity.publicUrlPreview ? (
        <div style={urlPreviewStyle}>
          公開URL（取り込み後の想定）: <code>{entity.publicUrlPreview}</code>
        </div>
      ) : null}

      {entity.recommendedStatus ? (
        <div style={recommendationStyle}>
          AIの推奨: <strong>{entity.recommendedStatus === "publish" ? "公開" : "下書き"}</strong>
          {" "}— 参考情報のみ。このバージョンではデータベースへの書き込みは行われません。
        </div>
      ) : null}

      {entity.errors.length > 0 ? (
        <ul style={{ ...listStyle, ...errorListStyle }}>
          {entity.errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      ) : null}

      {entity.uncertainMarkers.length > 0 ? (
        <div style={warningBlockStyle}>
          <div style={warningTitleStyle}>不確実な記述（[UNCERTAIN]）</div>
          <ul style={listStyle}>
            {entity.uncertainMarkers.map((marker, index) => (
              <li key={`${marker}-${index}`}>{marker}</li>
            ))}
          </ul>
          <p style={warningNoteStyle}>
            この項目が残っている間は「公開」を推奨できません。内容を確認・修正してください。
          </p>
        </div>
      ) : null}

      {entity.warnings.length > 0 ? (
        <ul style={{ ...listStyle, ...cautionListStyle }}>
          {entity.warnings.map((message, index) => (
            <li key={`${message}-${index}`}>{message}</li>
          ))}
        </ul>
      ) : null}

      {entity.missingFields.length > 0 ? (
        <div>
          <div style={checklistTitleStyle}>不足チェックリスト</div>
          <ul style={{ ...listStyle, ...checklistStyle }}>
            {entity.missingFields.map((message, index) => (
              <li key={`${message}-${index}`}>☐ {message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {entity.diffs.length > 0 ? (
        <div>
          <div style={checklistTitleStyle}>変更内容（既存 → パケット）</div>
          <table style={diffTableStyle}>
            <tbody>
              {entity.diffs.map((diff) => (
                <tr key={diff.field}>
                  <td style={diffFieldCellStyle}>{diff.field}</td>
                  <td style={diffValueCellStyle}>{diff.before}</td>
                  <td style={diffArrowCellStyle}>→</td>
                  <td style={diffValueCellStyle}>{diff.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

function EntitySection({ kind, entities }: { kind: EntityReport["kind"]; entities: EntityReport[] }) {
  if (entities.length === 0) return null;

  return (
    <section style={sectionStyle}>
      <h2 style={sectionTitleStyle}>{KIND_LABEL[kind]}</h2>
      <div style={sectionListStyle}>
        {entities.map((entity) => (
          <EntityCard key={`${entity.kind}-${entity.index}-${entity.slug}`} entity={entity} />
        ))}
      </div>
    </section>
  );
}

export function AdminImportDesk() {
  const [rawText, setRawText] = useState("");
  const [status, setStatus] = useState("");
  const [statusIsError, setStatusIsError] = useState(false);
  const [report, setReport] = useState<PacketReport | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    setRawText(text);
    setStatus(`ファイル "${file.name}" を読み込みました。「検証する」を押してください。`);
    setStatusIsError(false);
  }

  async function handleValidate() {
    setIsValidating(true);
    setStatus("検証中...");
    setStatusIsError(false);
    setReport(null);

    try {
      const response = await fetch("/api/admin/import/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        setStatus(data.error ?? "検証に失敗しました。");
        setStatusIsError(true);
        return;
      }

      setReport(data.report as PacketReport);
      setStatus("検証が完了しました。下のプレビューを確認してください。");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "検証中にエラーが発生しました。");
      setStatusIsError(true);
    } finally {
      setIsValidating(false);
    }
  }

  return (
    <div style={rootStyle}>
      <div style={noticeBannerStyle}>
        プレビュー専用 / データベースへの書き込みはありません。
        <br />
        このバージョンは AI が作成した Content Packet を検証・プレビューするだけです。実際の取り込み（Supabaseへの反映）は今後の別バージョンで有効化されます。
      </div>

      <section style={inputSectionStyle}>
        <label style={fieldLabelStyle} htmlFor="packet-textarea">
          Content Packet（JSON）を貼り付け
        </label>
        <textarea
          id="packet-textarea"
          value={rawText}
          onChange={(event) => setRawText(event.target.value)}
          placeholder='{ "packetVersion": "1.0", "countries": [...], "cities": [...], "spots": [...] }'
          rows={14}
          style={textareaStyle}
        />

        <div style={inputRowStyle}>
          <label style={fileLabelStyle}>
            .json ファイルをアップロード
            <input type="file" accept="application/json,.json" onChange={handleFileUpload} style={fileInputStyle} />
          </label>

          <button
            type="button"
            onClick={handleValidate}
            disabled={isValidating || !rawText.trim()}
            style={validateButtonStyle}
          >
            {isValidating ? "検証中..." : "検証する"}
          </button>
        </div>

        {status ? (
          <p style={statusIsError ? statusErrorStyle : statusOkStyle}>{status}</p>
        ) : null}
      </section>

      {report ? (
        <section style={reportRootStyle}>
          <div style={summaryBarStyle}>
            <span>合計 {report.summary.totalEntities} 件</span>
            <span style={summaryPillStyle("new")}>新規 {report.summary.newCount}</span>
            <span style={summaryPillStyle("update")}>更新 {report.summary.updateCount}</span>
            <span style={summaryPillStyle("invalid")}>無効 {report.summary.invalidCount}</span>
            <span style={summaryPillStyle("caution")}>要確認（不確実） {report.summary.uncertainCount}</span>
          </div>

          {report.ownerNote ? <p style={ownerNoteStyle}>メモ: {report.ownerNote}</p> : null}

          <EntitySection kind="country" entities={report.countries} />
          <EntitySection kind="city" entities={report.cities} />
          <EntitySection kind="spot" entities={report.spots} />
          <EntitySection kind="journal" entities={report.journalArticles} />
        </section>
      ) : null}
    </div>
  );
}

const rootStyle: CSSProperties = { display: "grid", gap: 20 };

const noticeBannerStyle: CSSProperties = {
  padding: "14px 16px",
  borderRadius: 16,
  background: "#fff4df",
  border: "1px solid rgba(154, 91, 18, 0.24)",
  color: "#7a4f10",
  fontSize: 13,
  fontWeight: 700,
  lineHeight: 1.6,
};

const inputSectionStyle: CSSProperties = {
  display: "grid",
  gap: 10,
  padding: 18,
  borderRadius: 20,
  background: "#ffffff",
  border: "1px solid rgba(23,32,42,.08)",
};

const fieldLabelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 850,
  color: "#607080",
  textTransform: "uppercase",
  letterSpacing: ".08em",
};

const textareaStyle: CSSProperties = {
  width: "100%",
  padding: 12,
  borderRadius: 14,
  border: "1px solid rgba(23,32,42,.1)",
  background: "#f8faf7",
  color: "#17202a",
  fontFamily: "monospace",
  fontSize: 12.5,
  lineHeight: 1.6,
  resize: "vertical",
};

const inputRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 12,
};

const fileLabelStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 13,
  color: "#607080",
  fontWeight: 750,
};

const fileInputStyle: CSSProperties = { fontSize: 13 };

const validateButtonStyle: CSSProperties = {
  padding: "10px 16px",
  borderRadius: 999,
  border: 0,
  background: "#138a72",
  color: "#ffffff",
  fontSize: 13,
  fontWeight: 850,
  cursor: "pointer",
};

const statusOkStyle: CSSProperties = { margin: 0, color: "#138a72", fontSize: 13, fontWeight: 750 };
const statusErrorStyle: CSSProperties = { margin: 0, color: "#9a3d2f", fontSize: 13, fontWeight: 750 };

const reportRootStyle: CSSProperties = { display: "grid", gap: 20 };

const summaryBarStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  alignItems: "center",
  fontSize: 13,
  fontWeight: 750,
  color: "#17202a",
};

function summaryPillStyle(tone: ImportStatus | "caution"): CSSProperties {
  const palette: CSSProperties =
    tone === "caution"
      ? { background: "#fff4df", color: "#7a4f10", border: "1px solid rgba(154,91,18,.2)" }
      : STATUS_TONE[tone as ImportStatus];

  return {
    padding: "5px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 850,
    ...palette,
  };
}

const ownerNoteStyle: CSSProperties = { margin: 0, color: "#607080", fontSize: 13, fontStyle: "italic" };

const sectionStyle: CSSProperties = { display: "grid", gap: 12 };

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 15,
  fontWeight: 850,
  color: "#17202a",
};

const sectionListStyle: CSSProperties = { display: "grid", gap: 12 };

const cardStyle: CSSProperties = {
  display: "grid",
  gap: 10,
  padding: 16,
  borderRadius: 18,
  background: "#ffffff",
  border: "1px solid rgba(23,32,42,.08)",
};

const cardHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

const statusBadgeStyle: CSSProperties = {
  padding: "4px 9px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 850,
};

const cardTitleStyle: CSSProperties = { fontSize: 15 };

const slugStyle: CSSProperties = { color: "#9aa3ab", fontSize: 12, fontFamily: "monospace" };

const urlPreviewStyle: CSSProperties = { fontSize: 12.5, color: "#607080" };

const recommendationStyle: CSSProperties = {
  fontSize: 12.5,
  color: "#7a4f10",
  background: "#fff8ec",
  padding: "6px 10px",
  borderRadius: 10,
  width: "fit-content",
};

const listStyle: CSSProperties = { margin: 0, paddingLeft: 18, display: "grid", gap: 4, fontSize: 12.5 };

const errorListStyle: CSSProperties = { color: "#9a3d2f" };

const cautionListStyle: CSSProperties = { color: "#7a4f10" };

const checklistStyle: CSSProperties = { color: "#607080", listStyle: "none", paddingLeft: 0 };

const checklistTitleStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 850,
  color: "#9a6a2f",
  textTransform: "uppercase",
  letterSpacing: ".06em",
  marginBottom: 4,
};

const warningBlockStyle: CSSProperties = {
  padding: 10,
  borderRadius: 12,
  background: "#fdeceb",
  border: "1px solid rgba(154,61,47,.18)",
  display: "grid",
  gap: 6,
};

const warningTitleStyle: CSSProperties = { fontSize: 11, fontWeight: 850, color: "#9a3d2f", textTransform: "uppercase" };

const warningNoteStyle: CSSProperties = { margin: 0, fontSize: 12, color: "#9a3d2f" };

const diffTableStyle: CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 12.5 };

const diffFieldCellStyle: CSSProperties = { padding: "4px 8px 4px 0", color: "#9a6a2f", fontWeight: 750, whiteSpace: "nowrap" };

const diffValueCellStyle: CSSProperties = { padding: "4px 8px", color: "#17202a" };

const diffArrowCellStyle: CSSProperties = { padding: "4px 4px", color: "#9aa3ab" };
