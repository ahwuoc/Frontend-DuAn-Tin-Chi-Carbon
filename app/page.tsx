import type { Metadata } from "next"
import ClientPage from "./ClientPage"
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/schema"

export const metadata: Metadata = {
  title: "Tín Chỉ Carbon Việt Nam | Giải pháp phát triển bền vững",
  description:
    "Tín Chỉ Carbon Việt Nam cung cấp giải pháp toàn diện về tín chỉ carbon, từ tư vấn chuyên môn đến triển khai dự án, giúp doanh nghiệp phát triển bền vững và thân thiện với môi trường.",
  keywords:
    "tín chỉ carbon, phát triển bền vững, carbon footprint, việt nam, giảm phát thải, net zero, ESG, carbon credits, carbon offset, carbon toàn thư, chứng chỉ quốc tế",
  alternates: {
    languages: {
      "en-US": "/en",
      "vi-VN": "/",
    },
    canonical: "https://tinchicarbonvietnam.vn",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://tinchicarbonvietnam.vn",
    title: "Tín Chỉ Carbon Việt Nam | Giải pháp phát triển bền vững",
    description:
      "Tín Chỉ Carbon Việt Nam cung cấp giải pháp toàn diện về tín chỉ carbon, từ tư vấn chuyên môn đến triển khai dự án, giúp doanh nghiệp phát triển bền vững và thân thiện với môi trường.",
    siteName: "Tín Chỉ Carbon Việt Nam",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tín Chỉ Carbon Việt Nam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tín Chỉ Carbon Việt Nam | Giải pháp phát triển bền vững",
    description:
      "Tín Chỉ Carbon Việt Nam cung cấp giải pháp toàn diện về tín chỉ carbon, từ tư vấn chuyên môn đến triển khai dự án, giúp doanh nghiệp phát triển bền vững và thân thiện với môi trường.",
    images: ["/og-image.png"],
  },
}

export default function Home() {
  return (
    <>
      {/* Add structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateOrganizationSchema()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateWebsiteSchema()),
        }}
      />
      <ClientPage />
    </>
  )
}
