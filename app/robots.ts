import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(site.isIndexable ? { allow: "/" } : { disallow: "/" })
    },
    ...(site.isIndexable ? { sitemap: `${site.siteUrl}/sitemap.xml` } : {})
  };
}
