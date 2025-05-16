"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  type: "carbon_credits" | "carbon_accounting" | "international_certificates";
  description: string;
  image?: string;
  purchaseDate: string;
  status: "active" | "pending" | "expired";
  viewMode?: "grid" | "list";
}
export default function ProductCard({
  id,
  type,
  name,
  description,
  image,
  purchaseDate,
  status,
}: ProductCardProps) {
  const { t, language } = useLanguage();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getManagementLink = (type: string, id: string) => {
    console.log("ditme type la gi", type);
    switch (type) {
      case "carbon_credits":
        return `/quan-ly/tin-chi-carbon/${id}`;
      case "carbon_accounting":
        return `/quan-ly/carbon-toan-thu/${id}`;
      case "international_certificates":
        return `/quan-ly/chung-chi-quoc-te/${id}`;
      default:
        return `/quan-ly`;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return t("active") || "Đang hoạt động";
      case "pending":
        return t("pending") || "Đang xử lý";
      case "expired":
        return t("expired") || "Đã hết hạn";
      default:
        return status;
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col h-full">
      <div className="relative h-40 sm:h-48 w-full">
        <Image
          src={image || "/placeholder.svg?height=200&width=400"}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <Badge className={`absolute top-3 right-3 ${getStatusColor(status)}`}>
          {getStatusText(status)}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">
          {type === "carbon_accounting" ? "Carbon Toàn Thư 4.0" : name}
        </CardTitle>
        <CardDescription className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
          {language === "vi" ? "Ngày mua" : "Purchased on"}: {purchaseDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Link href={getManagementLink(type, id)} className="w-full">
          <Button className="w-full bg-green-600 hover:bg-green-700">
            {language === "vi" ? "Quản lý" : "Manage"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
