import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#7a1830",
          borderRadius: 40,
        }}
      >
        <div style={{ display: "flex", fontSize: 108 }}>🎲</div>
      </div>
    ),
    { width: 192, height: 192 }
  );
}
