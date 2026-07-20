import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { site } from "@/data/site";

const staticPaths = [
  "",
  "/brand-story",
  "/third-generation",
  "/craft",
  "/products",
  "/gift",
  "/market",
  "/news",
  "/voices",
  "/faq",
  "/contact"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const productPaths = products.map((product) => `/products/${product.slug}`);

  return [...staticPaths, ...productPaths].map((path) => ({
    url: `${site.siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path.startsWith("/products") ? "monthly" : "weekly",
    priority: path === "" ? 1 : path.startsWith("/products") ? 0.8 : 0.7
  }));
}
