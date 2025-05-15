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

interface AffiliateMarketingMaterialsProps {
  materials: any[];
}

export default function AffiliateMarketingMaterials({
  materials,
}: AffiliateMarketingMaterialsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Công cụ tiếp thị</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Kích thước</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials !== undefined &&
                materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">
                      {material.name}
                    </TableCell>
                    <TableCell>{material.type}</TableCell>
                    <TableCell>{material.size}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(material.downloadUrl, "_blank")
                        }
                      >
                        <Download className="h-4 w-4 mr-2" /> Tải xuống
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
              <CardTitle className="text-base">Tài liệu tiếp thị</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Tải xuống bộ tài liệu tiếp thị đầy đủ cho các sản phẩm của chúng
                tôi.
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
                  <FileText className="h-4 w-4 mr-2" /> Tài liệu Carbon Toàn Thư
                  4.0
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
                  <FileText className="h-4 w-4 mr-2" /> Truy cập AI CarbonSeek
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hướng dẫn tiếp thị</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Xem video hướng dẫn về cách tiếp thị hiệu quả các sản phẩm của
                chúng tôi.
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
                  <Video className="h-4 w-4 mr-2" /> Video hướng dẫn CarbonSeek
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
                  <Video className="h-4 w-4 mr-2" /> Video hướng dẫn Carbon Toàn
                  Thư
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
