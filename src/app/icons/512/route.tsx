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
          borderRadius: 108,
        }}
      >
        <div style={{ display: "flex", fontSize: 288 }}>🎲</div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
