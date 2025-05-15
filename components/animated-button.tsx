"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/context/language-context"

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  hoverText?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  asChild?: boolean
  href?: string
  isLoading?: boolean
  showArrow?: boolean
  textClassName?: string
  fixedWidth?: boolean
  clickText?: string
  buttonType?: "project" | "product" // Thêm prop để phân biệt loại nút
}

export default function AnimatedButton({
  children,
  className,
  variant = "default",
  size = "default",
  hoverText,
  onClick,
  asChild = false,
  href,
  isLoading,
  showArrow,
  textClassName,
  fixedWidth,
  clickText,
  buttonType = "project", // Mặc định là nút đăng ký dự án
  ...props
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const router = useRouter()
  const { language } = useLanguage()

  // Chuyển đ��i các key ngôn ngữ thành text tiếng Việt
  const translatedHoverText =
    hoverText === "explore_more"
      ? language === "vi"
        ? "KHÁM PHÁ THÊM!"
        : "EXPLORE MORE!"
      : hoverText === "start_now"
        ? language === "vi"
          ? "BẮT ĐẦU NGAY!"
          : "START NOW!"
        : hoverText

  // Default page link if no href is provided
  const linkHref = href || "/san-pham"

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e)
    setIsClicked(true)

    // Nếu không có href, chuyển hướng đến trang sản phẩm
    if (!href) {
      router.push("/san-pham")
    }
  }

  const buttonContent = (
    <>
      <span className={`transition-transform duration-300 ${isHovered ? "transform -translate-y-full opacity-0" : ""}`}>
        {children}
      </span>
      {translatedHoverText && (
        <span
          className={`absolute left-0 right-0 transition-transform duration-300 ${
            isHovered ? "" : "transform translate-y-full opacity-0"
          }`}
        >
          {translatedHoverText}
        </span>
      )}
    </>
  )

  // If asChild is true, just return the button without Link
  if (asChild) {
    return (
      <Button
        variant={variant}
        size={size}
        className={cn(
          "relative overflow-hidden transition-all duration-300 w-full",
          fixedWidth && "min-w-[250px] w-[250px] justify-center",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="opacity-0">{children}</span>
            <span className="absolute inset-0 flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
          </>
        ) : translatedHoverText ? (
          buttonContent
        ) : (
          <>
            <span className={cn("relative z-10", textClassName)}>{children}</span>
            {showArrow && (
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            )}
          </>
        )}
      </Button>
    )
  }

  // Nếu không phải asChild, trả về button với Link
  return (
    <Link href={linkHref} className={cn("block", fixedWidth ? "w-[250px]" : "w-full")}>
      <Button
        variant={variant}
        size={size}
        className={cn(
          "relative overflow-hidden transition-all duration-300 w-full",
          fixedWidth && "min-w-[250px] w-[250px] justify-center",
          className,
        )}
        disabled={isLoading}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="opacity-0">{children}</span>
            <span className="absolute inset-0 flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
          </>
        ) : translatedHoverText ? (
          buttonContent
        ) : (
          <>
            <span className={cn("relative z-10", textClassName)}>{children}</span>
            {showArrow && (
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            )}
          </>
        )}
      </Button>
    </Link>
  )
}
