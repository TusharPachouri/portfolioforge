import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/u/", "/components", "/privacy", "/terms"],
        disallow: ["/dashboard/", "/admin/", "/api/", "/auth/"],
      },
    ],
    sitemap: "https://portfolioforge.dev/sitemap.xml",
  };
}
