import type { Metadata } from "next";
import type { Product } from "@/data/products";
import { site } from "@/data/site";

export function absoluteUrl(path = "") {
  const base = site.siteUrl.replace(/\/$/, "");
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

const organizationId = absoluteUrl("/#organization");
const websiteId = absoluteUrl("/#website");

export function pageOpenGraph({
  title,
  description,
  path,
  image = "/images/og-yamada-mochi.webp",
  imageAlt = "山田もち店の高山もちギフトボックス"
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
}): Metadata["openGraph"] {
  return {
    title,
    description,
    url: absoluteUrl(path),
    siteName: site.name,
    images: [{ url: image, alt: imageAlt }],
    locale: "ja_JP",
    type: "website"
  };
}

export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": organizationId,
        name: site.name,
        alternateName: site.enName,
        description: site.description,
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
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: site.name,
        alternateName: site.enName,
        description: site.description,
        url: site.siteUrl,
        inLanguage: "ja",
        publisher: { "@id": organizationId }
      }
    ]
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

function numericPrice(price: string) {
  return price.replace(/[^0-9]/g, "");
}

export function productSchema(product: Product) {
  return {
    "@type": "Product",
    name: `${product.name} 高山もち`,
    image: absoluteUrl(product.image),
    description: product.seo.description,
    brand: {
      "@type": "Brand",
      name: site.name
    },
    offers: {
      "@type": "Offer",
      price: numericPrice(product.price),
      priceCurrency: "JPY",
      availability: "https://schema.org/InStock"
    }
  };
}

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    ...productSchema(product)
  };
}

export function productListJsonLd(products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "山田もち店 商品一覧",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: productSchema(product)
    }))
  };
}

export function faqPageJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a
      }
    }))
  };
}
