"use client"

import { useRef } from "react"
import Image from "next/image"
import { useLanguage } from "@/context/language-context"

interface PartnerLogo {
  url: string
  alt: string
  width: number
  height: number
  langSpecific?: boolean
  viOnly?: boolean
  enOnly?: boolean
  featured?: boolean
}

export default function PartnerLogoCarousel() {
  const { language } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)

  // Partner logos data with uniform sizes
  const partnerLogos: PartnerLogo[] = [
    {
      url: "https://res.cloudinary.com/dyticflm3/image/upload/v1744712569/CSU_ewws4e.png",
      alt: "Columbia Southern University",
      width: 400,
      height: 225,
      featured: true,
    },
    {
      url: "https://res.cloudinary.com/dyticflm3/image/upload/v1744707537/Logo_BIDV.svg_mjnruu.png",
      alt: "BIDV",
      width: 320,
      height: 180,
    },
    {
      url: "https://res.cloudinary.com/dyticflm3/image/upload/v1744707537/CARE_zvzckf.png",
      alt: "CARE",
      width: 320,
      height: 180,
    },
    {
      url: "https://res.cloudinary.com/dyticflm3/image/upload/v1744707535/JCI-Logo_d7e235.png",
      alt: "JCI",
      width: 320,
      height: 180,
    },
    {
      url: "https://res.cloudinary.com/dyticflm3/image/upload/v1744712565/SCE_Hanoi_nzat7c.png",
      alt: "SCE Hanoi",
      width: 320,
      height: 180,
    },
    {
      url: "https://res.cloudinary.com/dyticflm3/image/upload/v1744707532/CarbonTradeXchange_CTX_awa0ri.png",
      alt: "Carbon Trade Xchange",
      width: 320,
      height: 180,
    },
    {
      url: "https://res.cloudinary.com/dyticflm3/image/upload/v1744712563/H%C6%A1n_50_ch%E1%BB%A7_r%E1%BB%ABng_ccdwh7.png",
      alt: "Hơn 50 chủ rừng",
      width: 320,
      height: 180,
      viOnly: true,
    },
    {
      url: "https://res.cloudinary.com/dyticflm3/image/upload/v1744712563/Over_50_Forest_Owners_lzvwts.png",
      alt: "Over 50 Forest Owners",
      width: 320,
      height: 180,
      enOnly: true,
    },
    {
      url: "https://res.cloudinary.com/dyticflm3/image/upload/v1744712564/IID_q1ehkp.png",
      alt: "IID",
      width: 320,
      height: 180,
    },
    {
      url: "https://res.cloudinary.com/dyticflm3/image/upload/v1744707534/TigerSugar_uenxmh.png",
      alt: "Tiger Sugar",
      width: 320,
      height: 180,
    },
    {
      url: "https://res.cloudinary.com/dyticflm3/image/upload/v1744707536/FTU_logo_2020_jijgev.png",
      alt: "FTU",
      width: 320,
      height: 180,
    },
    {
      url: "https://res.cloudinary.com/dyticflm3/image/upload/v1744707535/Vietflycam_dtav1x.png",
      alt: "Vietflycam",
      width: 320,
      height: 180,
    },
    {
      url: "https://res.cloudinary.com/dyticflm3/image/upload/v1744712568/SiL_gepqwy.png",
      alt: "SiL",
      width: 400,
      height: 225,
      featured: true,
    },
    {
      url: "https://res.cloudinary.com/dyticflm3/image/upload/v1744712809/Maya_Logo_bi04pg.png",
      alt: "Maya",
      width: 320,
      height: 180,
    },
    {
      url: "https://res.cloudinary.com/dyticflm3/image/upload/v1744837334/H%E1%BB%87_th%E1%BB%91ng_gi%C3%A1o_d%E1%BB%A5c_VNC_Group_vfsuvf.png",
      alt: "VNC Group",
      width: 320,
      height: 180,
    },
    {
      url: "https://res.cloudinary.com/dyticflm3/image/upload/v1744707878/Gieo_m%E1%BA%A7m_xanh_to%C3%A0n_c%E1%BA%A7u_GMX_jned9a.png",
      alt: "Gieo mầm xanh toàn cầu",
      width: 320,
      height: 180,
    },
    {
      url: "https://res.cloudinary.com/dyticflm3/image/upload/v1744712808/%C6%AF%E1%BB%9Bc_m%C6%A1_tri%E1%BB%87u_c%C3%A2y_xanh_-_Green_Dream_qk2zj6.png",
      alt: "Ước mơ triệu cây xanh",
      width: 320,
      height: 180,
    },
    {
      url: "https://res.cloudinary.com/dyticflm3/image/upload/v1744707535/M%E1%BA%ADt_%C4%90%C6%B0%E1%BB%9Dng_Sao_La_gzpjqv.png",
      alt: "Mật Đường Sao La",
      width: 320,
      height: 180,
    },
    {
      url: "https://res.cloudinary.com/dyticflm3/image/upload/v1744707532/Forest_Foods_evdgeg.png",
      alt: "Forest Foods",
      width: 320,
      height: 180,
    },
    {
      url: "https://res.cloudinary.com/dyticflm3/image/upload/v1744712564/Bridge_for_billions_qg3wcv.png",
      alt: "Bridge for Billions",
      width: 320,
      height: 180,
    },
  ]

  // Filter logos based on language
  const filteredLogos = partnerLogos.filter((logo) => {
    if (logo.viOnly) return language === "vi"
    if (logo.enOnly) return language === "en"
    return true
  })

  // Duplicate logos to create seamless loop
  const allLogos = [...filteredLogos, ...filteredLogos]

  return (
    <div className="w-full overflow-hidden bg-white py-16 relative">
      {/* Gradient fade on left */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>

      <div className="marquee">
        <div className="marquee-content">
          {allLogos.map((logo, index) => (
            <div
              key={index}
              className={`flex-shrink-0 flex items-center justify-center bg-white rounded-lg p-6 mx-10 ${logo.featured ? "h-56" : "h-48"}`}
              style={{
                width: logo.featured ? 400 : 320,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"
              }}
            >
              <Image
                src={logo.url || "/placeholder.svg"}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="object-contain max-h-full max-w-full"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.currentTarget.src = "/abstract-geometric-logo.png"
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Gradient fade on right */}
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
    </div>
  )
}
