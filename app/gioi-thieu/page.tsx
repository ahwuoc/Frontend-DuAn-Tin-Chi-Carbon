import type { Metadata } from "next"
import AboutPageClient from "./AboutPageClient"

export const metadata: Metadata = {
  title: "Giới thiệu | Tín Chỉ Carbon Việt Nam",
  description:
    "Tìm hiểu về Tín Chỉ Carbon Việt Nam - đơn vị tiên phong trong lĩnh vực tín chỉ carbon và phát triển bền vững tại Việt Nam.",
  keywords: "giới thiệu, tín chỉ carbon, phát triển bền vững, carbon footprint, việt nam, giảm phát thải",
  openGraph: {
    title: "Giới thiệu | Tín Chỉ Carbon Việt Nam",
    description:
      "Tìm hiểu về Tín Chỉ Carbon Việt Nam - đơn vị tiên phong trong lĩnh vực tín chỉ carbon và phát triển bền vững tại Việt Nam.",
    images: ["/og-image.png"],
  },
}

const AboutPage = () => {
  return <AboutPageClient />
}

export default AboutPage
