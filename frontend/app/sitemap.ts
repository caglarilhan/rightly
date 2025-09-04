import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://rightly.com";
  return [
    "",
    "/features",
    "/pricing",
    "/docs",
    "/privacy",
    "/security",
    "/support",
    "/terms"
  ].map(p => ({
    url: base + p,
    lastModified: new Date(),
    changeFrequency: p ? "weekly" : "daily",
    priority: p ? 0.7 : 1
  }));
}
