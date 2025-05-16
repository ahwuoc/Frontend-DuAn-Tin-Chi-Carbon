import type { MetadataRoute } from "next";
import { getAllNewsSlugServer } from "@/services/news-server";

function isValidSlug(slug: string): boolean {
  // Kiểm tra slug chỉ chứa chữ, số, dấu -, _
  // Ví dụ: "tin-moi-2025" OK, "tin moi!!!" FAIL
  return /^[a-z0-9-_]+$/i.test(slug);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const newsArticles = await getAllNewsSlugServer();
  // Đảm bảo baseUrl luôn là chuỗi đầy đủ và không kết thúc bằng "/"
  // (trừ trường hợp root "/", nhưng ở đây ta có domain)
  // Có thể lấy từ biến môi trường để linh hoạt giữa các môi trường (dev, staging, prod)
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://tinchicarbonvietnam.vn";

  console.log("Sitemap Base URL:", baseUrl); // Dòng này hữu ích để debug

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    "", // Đại diện cho trang chủ /
    "/gioi-thieu",
    "/san-pham",
    "/san-pham/carbon-toan-thu",
    "/san-pham/du-an-tin-chi-carbon",
    "/san-pham/khoa-hoc-chung-chi-quoc-te",
    "/tin-tuc",
    "/gop-mam-xanh",
    "/chuong-trinh-tiep-thi-lien-ket",
    "/dang-ky-tu-van",
    "/faq",
  ].map((route) => ({
    url: route === "" ? baseUrl : `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as "weekly", // Thêm type assertion
    priority: route === "" ? 1 : 0.8,
  }));

  const newsRoutes: MetadataRoute.Sitemap = newsArticles
    .filter(
      (slug): slug is string => typeof slug === "string" && slug.trim() !== ""
    )
    .filter((slug) => {
      if (!isValidSlug(slug)) {
        console.warn("[Sitemap] Invalid slug skipped:", slug);
        return false;
      }
      return true;
    })
    .map((slug) => ({
      // Sử dụng nối chuỗi
      url: `${baseUrl}/tin-tuc/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as "monthly", // Thêm type assertion
      priority: 0.6,
    }));

  return [...routes, ...newsRoutes];
}
