"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileText, Video } from "lucide-react";
import { useLanguage } from "@/context/language-context"; // Import hook ngôn ngữ
import affiliateAffiliateMarketingTranslations from "./affiliateDashboardTranslations";

interface AffiliateMarketingMaterialsProps {
  materials: any[];
}

export default function AffiliateMarketingMaterials({
  materials,
}: AffiliateMarketingMaterialsProps) {
  const { language } = useLanguage(); // Lấy ngôn ngữ hiện tại

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {
            affiliateAffiliateMarketingTranslations.marketingMaterials
              .cardTitle[language]
          }{" "}
          {/* Dịch tiêu đề card */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {
                    affiliateAffiliateMarketingTranslations.marketingMaterials
                      .tableHeaders.name[language]
                  }
                  {/* Dịch tiêu đề cột */}
                </TableHead>
                <TableHead>
                  {
                    affiliateAffiliateMarketingTranslations.marketingMaterials
                      .tableHeaders.type[language]
                  }
                  {/* Dịch tiêu đề cột */}
                </TableHead>
                <TableHead>
                  {
                    affiliateAffiliateMarketingTranslations.marketingMaterials
                      .tableHeaders.size[language]
                  }
                  {/* Dịch tiêu đề cột */}
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials !== undefined &&
                materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">
                      {material.name} {/* Tên tài liệu vẫn lấy từ dữ liệu */}
                    </TableCell>
                    <TableCell>{material.type}</TableCell>{" "}
                    {/* Loại tài liệu vẫn lấy từ dữ liệu */}
                    <TableCell>{material.size}</TableCell>{" "}
                    {/* Kích thước vẫn lấy từ dữ liệu */}
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(material.downloadUrl, "_blank")
                        }
                      >
                        <Download className="h-4 w-4 mr-2" />{" "}
                        {
                          affiliateAffiliateMarketingTranslations
                            .marketingMaterials.downloadButton[language]
                        }{" "}
                        {/* Dịch nút Tải xuống */}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {
                  affiliateAffiliateMarketingTranslations.marketingMaterials
                    .documentsCard.title[language]
                }{" "}
                {/* Dịch tiêu đề card Tài liệu tiếp thị */}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {
                  affiliateAffiliateMarketingTranslations.marketingMaterials
                    .documentsCard.description[language]
                }{" "}
                {/* Dịch mô tả card */}
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() =>
                    window.open(
                      "https://drive.google.com/drive/folders/1edG48t5iUgRzi9mQKr8dFHtFLPHZR-gh",
                      "_blank",
                    )
                  }
                >
                  <FileText className="h-4 w-4 mr-2" />{" "}
                  {
                    affiliateAffiliateMarketingTranslations.marketingMaterials
                      .documentsCard.carbonAccountingDoc[language]
                  }{" "}
                  {/* Dịch tên tài liệu */}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() =>
                    window.open(
                      "https://carbonseek.tinchicarbonvietnam.vn/login",
                      "_blank",
                    )
                  }
                >
                  <FileText className="h-4 w-4 mr-2" />{" "}
                  {
                    affiliateAffiliateMarketingTranslations.marketingMaterials
                      .documentsCard.aiCarbonSeekAccess[language]
                  }{" "}
                  {/* Dịch tên tài liệu */}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {
                  affiliateAffiliateMarketingTranslations.marketingMaterials
                    .guidesCard.title[language]
                }{" "}
                {/* Dịch tiêu đề card Hướng dẫn tiếp thị */}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {
                  affiliateAffiliateMarketingTranslations.marketingMaterials
                    .guidesCard.description[language]
                }{" "}
                {/* Dịch mô tả card */}
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() =>
                    window.open(
                      "https://res.cloudinary.com/dyticflm3/video/upload/v1744624626/CarbonSeek_video_2_fast_wl4vd2.mp4",
                      "_blank",
                    )
                  }
                >
                  <Video className="h-4 w-4 mr-2" />{" "}
                  {
                    affiliateAffiliateMarketingTranslations.marketingMaterials
                      .guidesCard.carbonSeekVideo[language]
                  }{" "}
                  {/* Dịch tên video */}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() =>
                    window.open(
                      "https://res.cloudinary.com/dyticflm3/video/upload/v1744624649/Carbon_To%C3%A0n_Th%C6%B0_4.0_video_folder_jhhuon.mp4",
                      "_blank",
                    )
                  }
                >
                  <Video className="h-4 w-4 mr-2" />{" "}
                  {
                    affiliateAffiliateMarketingTranslations.marketingMaterials
                      .guidesCard.carbonAccountingVideo[language]
                  }{" "}
                  {/* Dịch tên video */}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
