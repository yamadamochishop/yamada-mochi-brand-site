import { site } from "@/data/site";

export function absoluteUrl(path = "") {
  const base = site.siteUrl.replace(/\/$/, "");
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    url: site.siteUrl,
    telephone: site.tel,
    address: {
      "@type": "PostalAddress",
      addressRegion: "岐阜県",
      addressLocality: "高山市",
      streetAddress: "千島町1145番地",
      addressCountry: "JP"
    },
    foundingDate: "1975",
    sameAs: [site.baseUrl, site.pokeMarcheUrl, site.tabechokuUrl]
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}
