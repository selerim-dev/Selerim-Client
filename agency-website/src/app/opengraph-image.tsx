import { ImageResponse } from "next/og";
export const alt =
  "Selerim — AI agents for your business. Secure. Confidential. Built for growth.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#ece9fb",
        color: "#16172a",
        padding: 70,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 30,
          justifyContent: "space-between",
        }}
      >
        <span>selerim studio</span>
        <span style={{ fontSize: 20 }}>HOUSTON, TX · FOUNDER-LED</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 86, letterSpacing: -4, lineHeight: 1.05 }}>
          AI agents for
        </span>
        <span style={{ fontSize: 86, letterSpacing: -4, lineHeight: 1.05 }}>
          your business.
        </span>
        <span style={{ fontSize: 32, marginTop: 28, color: "#5147a3" }}>
          Secure. Confidential. Built for growth.
        </span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 24,
          justifyContent: "space-between",
          borderTop: "1px solid #c7c2dd",
          paddingTop: 24,
        }}
      >
        <span>$2,500 opportunity audit · 14 days</span>
        <span>selerim.com ↗</span>
      </div>
    </div>,
    size,
  );
}
