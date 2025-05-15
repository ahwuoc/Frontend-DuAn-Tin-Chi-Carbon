/**
 * Tạo Schema.org cho tổ chức
 * @returns Schema.org Organization
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tín Chỉ Carbon Việt Nam",
    url: "https://tinchicarbonvietnam.vn",
    logo: "https://tinchicarbonvietnam.vn/logo.png",
    sameAs: [
      "https://facebook.com/tinchicarbonvietnam",
      "https://twitter.com/tinchicarbonvn",
      "https://linkedin.com/company/tinchicarbonvietnam",
    ],
    description:
      "Tín Chỉ Carbon Việt Nam cung cấp giải pháp toàn diện về tín chỉ carbon, từ tư vấn chuyên môn đến triển khai dự án, giúp doanh nghiệp phát triển bền vững và thân thiện với môi trường.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "VN",
      addressLocality: "Hà Nội",
      addressRegion: "Hà Nội",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+84-xxx-xxx-xxx",
      contactType: "customer service",
      availableLanguage: ["Vietnamese", "English"],
    },
  }
}

/**
 * Tạo Schema.org cho website
 * @returns Schema.org WebSite
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Tín Chỉ Carbon Việt Nam",
    url: "https://tinchicarbonvietnam.vn",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://tinchicarbonvietnam.vn/tim-kiem?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }
}

/**
 * Tạo Schema.org cho bài viết tin tức
 * @param article Thông tin bài viết
 * @returns Schema.org NewsArticle
 */
export function generateNewsArticleSchema(article: {
  title: string
  description: string
  url: string
  imageUrl: string
  datePublished: string
  dateModified: string
  authorName: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    image: article.imageUrl,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      "@type": "Person",
      name: article.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Tín Chỉ Carbon Việt Nam",
      logo: {
        "@type": "ImageObject",
        url: "https://tinchicarbonvietnam.vn/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
  }
}

/**
 * Tạo Schema.org cho sản phẩm
 * @param product Thông tin sản phẩm
 * @returns Schema.org Product
 */
export function generateProductSchema(product: {
  name: string
  description: string
  url: string
  imageUrl: string
  price?: number
  priceCurrency?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    url: product.url,
    ...(product.price && product.priceCurrency
      ? {
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: product.priceCurrency,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  }
}

/**
 * Tạo Schema.org cho FAQ
 * @param faqs Danh sách câu hỏi và trả lời
 * @returns Schema.org FAQPage
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}
