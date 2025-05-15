import type { Metadata } from "next"
import ProductsPageClient from "./ProductsPageClient"

export const metadata: Metadata = {
  title: "Sản phẩm | Tín Chỉ Carbon Việt Nam",
  description:
    "Khám phá các sản phẩm và dịch vụ của Tín Chỉ Carbon Việt Nam, từ Carbon Toàn Thư 4.0 đến các dự án tín chỉ carbon và khóa học chứng chỉ quốc tế.",
  keywords: "sản phẩm, tín chỉ carbon, carbon toàn thư, dự án tín chỉ carbon, khóa học chứng chỉ quốc tế",
  alternates: {
    languages: {
      "en-US": "/en/products",
      "vi-VN": "/san-pham",
    },
  },
}

export default function ProductsPage() {
  return <ProductsPageClient />
}
