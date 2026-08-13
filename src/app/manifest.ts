import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Level5 Lease & Play",
    short_name: "Lease & Play",
    description: "Huur bordspellen eenvoudig online — betaal vooraf, speel zo lang je wilt, krijg het verschil terug.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5eee2",
    theme_color: "#7a1830",
    lang: "nl",
    icons: [
      {
        src: "/icons/192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
