import type { MetadataRoute } from "next";

const ROBOTS_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://tinchicarbonvietnam.vn",
  rules: {
    userAgent: "*",
    allow: [
      "/",
      "/gioi-thieu",
      "/san-pham",
      "/tin-tuc",
      "/gop-mam-xanh",
      "/chuong-trinh-tiep-thi-lien-ket",
      "/dang-ky-tu-van",
      "/faq",
    ],
    disallow: [
      "/admin/",
      "/api/",
      "/quan-ly/",
      "/auth-processing/",
      "/hoan-thanh/",
      "/huy-don/",
      "/thanh-toan/",
      "/dang-nhap/",
      "/dang-ky/",
      "/forbidden/",
      "/_next/",
      "/static/",
      "*.json",
      "*.xml",
    ],
  },
};

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = `${ROBOTS_CONFIG.baseUrl}/sitemap.xml`;
  
  console.log("[Robots] Generating robots.txt");
  console.log("[Robots] Sitemap URL:", sitemapUrl);

  return {
    rules: [
      {
        userAgent: ROBOTS_CONFIG.rules.userAgent,
        allow: ROBOTS_CONFIG.rules.allow,
        disallow: ROBOTS_CONFIG.rules.disallow,
      },
      // Thêm rule riêng cho Googlebot
      {
        userAgent: "Googlebot",
        allow: ROBOTS_CONFIG.rules.allow,
        disallow: [
          ...ROBOTS_CONFIG.rules.disallow,
          "/temp/",
          "/draft/",
        ],
      },
      // Thêm rule cho Bingbot
      {
        userAgent: "Bingbot",
        allow: ROBOTS_CONFIG.rules.allow,
        disallow: ROBOTS_CONFIG.rules.disallow,
      },
    ],
    sitemap: sitemapUrl,
    host: ROBOTS_CONFIG.baseUrl,
  };
}
