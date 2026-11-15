import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dinedesk.restaurant";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/terms", "/privacy", "/cookies", "/reserve"],
      disallow: [
        "/api/",
        "/admin",
        "/admin/*",
        "/kitchen",
        "/kitchen/*",
        "/kds",
        "/kds/*",
        "/staff",
        "/staff/*",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
