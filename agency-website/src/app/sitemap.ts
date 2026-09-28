import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/services",
    "/pricing",
    "/case-studies",
    "/about",
    "/how-we-work",
    "/contact",
    "/terms",
    "/privacy",
  ].map((path) => ({
    url: `https://www.selerim.com${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
