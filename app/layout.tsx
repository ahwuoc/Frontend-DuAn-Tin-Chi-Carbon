import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CookieConsent from "@/components/cookie-consent"
import { ThemeProvider } from "@/components/theme-provider"
import ScrollToTop from "@/components/scroll-to-top"
import { LanguageProvider } from "@/context/language-context"
import { Toaster } from "@/components/toaster"
// Thêm import AuthProvider
import { AuthProvider } from "@/context/auth-context"
// Add the import for ScrollRestoration
import ScrollRestoration from "@/components/scroll-restoration"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Tín Chỉ Carbon Việt Nam | Giải pháp phát triển bền vững",
    template: "%s | Tín Chỉ Carbon Việt Nam",
  },
  description:
    "Tín Chỉ Carbon Việt Nam cung cấp các giải pháp toàn diện về tín chỉ carbon, giúp doanh nghiệp phát triển bền vững và thân thiện với môi trường.",
  keywords: "tín chỉ carbon, phát triển bền vững, carbon footprint, việt nam, giảm phát thải, net zero",
  alternates: {
    languages: {
      "en-US": "/en",
      "vi-VN": "/",
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon.png", type: "image/png" }],
    shortcut: ["/favicon.png"],
    apple: [{ url: "/apple-icon.png" }, { url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://tinchicarbonvietnam.vn",
    title: "Tín Chỉ Carbon Việt Nam | Giải pháp phát triển bền vững",
    description:
      "Tín Chỉ Carbon Việt Nam cung cấp các giải pháp toàn diện về tín chỉ carbon, giúp doanh nghiệp phát triển bền vững và thân thiện với môi trường.",
    siteName: "Tín Chỉ Carbon Việt Nam",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 1200,
        alt: "Tín Chỉ Carbon Việt Nam Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tín Chỉ Carbon Việt Nam | Giải pháp phát triển bền vững",
    description:
      "Tín Chỉ Carbon Việt Nam cung cấp các giải pháp toàn diện về tín chỉ carbon, giúp doanh nghiệp phát triển bền vững và thân thiện với môi trường.",
    images: ["/og-image.png"],
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="https://i4rba5q0kc4herk0.public.blob.vercel-storage.com/%E1%BA%A2nh%20minh%20h%E1%BB%8Da/rice%20paddle%20vid%20-%20Copy-7cYaE7ujNNgtdFVHP39kYPZYMjOKmr.mp4"
          as="video"
          type="video/mp4"
        />
        <link
          rel="preconnect"
          href="https://i4rba5q0kc4herk0.public.blob.vercel-storage.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`scroll-smooth ${montserrat.className}`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light">
          <LanguageProvider>
            <AuthProvider>
              <ScrollRestoration />
              <Header />
              <main>{children}</main>
              <Footer />
              <CookieConsent />
              <ScrollToTop />
              <Toaster />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
