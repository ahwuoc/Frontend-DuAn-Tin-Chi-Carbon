"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  DollarSign,
  Users,
  MousePointer,
  TrendingUp,
  Copy,
  Share2,
  Download,
  FileText,
  Video,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/auth-context";

export default function AffiliateDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Dữ liệu mẫu
  const affiliateData = {
    stats: {
      earnings: "2.450.000",
      pendingEarnings: "750.000",
      clicks: 1243,
      conversions: 28,
      conversionRate: "2.25",
    },
    referralLink: "https://tinchicarbonvietnam.vn/?ref=user123",
    referralCode: "USER123",
    transactions: [
      {
        id: "TX12345",
        date: "15/04/2023",
        customer: "Nguyễn Văn A",
        product: "Carbon Toàn Thư 4.0",
        amount: "560.000",
        commission: "168.000",
        status: "Đã thanh toán",
      },
      {
        id: "TX12346",
        date: "22/04/2023",
        customer: "Trần Thị B",
        product: "Khóa học chứng chỉ quốc tế",
        amount: "4.500.000",
        commission: "675.000",
        status: "Đã thanh toán",
      },
      {
        id: "TX12347",
        date: "05/05/2023",
        customer: "Lê Văn C",
        product: "Carbon Toàn Thư 4.0",
        amount: "560.000",
        commission: "168.000",
        status: "Đã thanh toán",
      },
      {
        id: "TX12348",
        date: "12/05/2023",
        customer: "Phạm Thị D",
        product: "Tư vấn doanh nghiệp",
        amount: "15.000.000",
        commission: "750.000",
        status: "Đang xử lý",
      },
      {
        id: "TX12349",
        date: "20/05/2023",
        customer: "Hoàng Văn E",
        product: "Carbon Toàn Thư 4.0",
        amount: "560.000",
        commission: "168.000",
        status: "Đang xử lý",
      },
    ],
    payouts: [
      {
        id: "PO12345",
        date: "15/04/2023",
        amount: "1.011.000",
        method: "Chuyển khoản ngân hàng",
        status: "Hoàn thành",
      },
      {
        id: "PO12346",
        date: "15/05/2023",
        amount: "1.439.000",
        method: "Chuyển khoản ngân hàng",
        status: "Hoàn thành",
      },
    ],
    marketingMaterials: [
      {
        id: 1,
        name: "Banner quảng cáo Carbon Toàn Thư 4.0",
        type: "Banner",
        size: "728x90",
        downloadUrl:
          "https://tinchicarbonvietnam.vn/marketing/banners/carbon-toan-thu-728x90.png",
      },
      {
        id: 2,
        name: "Banner quảng cáo Carbon Toàn Thư 4.0",
        type: "Banner",
        size: "300x250",
        downloadUrl:
          "https://tinchicarbonvietnam.vn/marketing/banners/carbon-toan-thu-300x250.png",
      },
      {
        id: 3,
        name: "Banner quảng cáo Khóa học chứng chỉ quốc tế",
        type: "Banner",
        size: "728x90",
        downloadUrl:
          "https://tinchicarbonvietnam.vn/marketing/banners/chung-chi-quoc-te-728x90.png",
      },
      {
        id: 4,
        name: "Banner quảng cáo Khóa học chứng chỉ quốc tế",
        type: "Banner",
        size: "300x250",
        downloadUrl:
          "https://tinchicarbonvietnam.vn/marketing/banners/chung-chi-quoc-te-300x250.png",
      },
      {
        id: 5,
        name: "Email mẫu - Giới thiệu Carbon Toàn Thư 4.0",
        type: "Email",
        size: "N/A",
        downloadUrl:
          "https://tinchicarbonvietnam.vn/marketing/emails/carbon-toan-thu-template.html",
      },
      {
        id: 6,
        name: "Email mẫu - Giới thiệu Khóa học chứng chỉ quốc tế",
        type: "Email",
        size: "N/A",
        downloadUrl:
          "https://tinchicarbonvietnam.vn/marketing/emails/chung-chi-quoc-te-template.html",
      },
      {
        id: 7,
        name: "Nội dung mạng xã hội - Carbon Toàn Thư 4.0",
        type: "Social Media",
        size: "N/A",
        downloadUrl:
          "https://tinchicarbonvietnam.vn/marketing/social/carbon-toan-thu-content.pdf",
      },
      {
        id: 8,
        name: "Nội dung mạng xã hội - Khóa học chứng chỉ quốc tế",
        type: "Social Media",
        size: "N/A",
        downloadUrl:
          "https://tinchicarbonvietnam.vn/marketing/social/chung-chi-quoc-te-content.pdf",
      },
    ],
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Đã sao chép!",
      description: `${type} đã được sao chép vào clipboard.`,
    });
  };

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">\</h1>
        <p className="text-gray-600 mt-2">
          Quản lý hoạt động tiếp thị liên kết, theo dõi hoa hồng và truy cập
          công cụ tiếp thị
        </p>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="transactions">Giao dịch</TabsTrigger>
          <TabsTrigger value="payouts">Thanh toán</TabsTrigger>
          <TabsTrigger value="marketing">Công cụ tiếp thị</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Tổng hoa hồng
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {affiliateData?.stats?.earnings ?? 0} đ
                    </h3>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Hoa hồng chờ xử lý
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {affiliateData?.stats?.pendingEarnings ?? 0} đ
                    </h3>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Lượt nhấp
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {affiliateData.stats.clicks}
                    </h3>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <MousePointer className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Chuyển đổi
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {affiliateData.stats.conversions} (
                      {affiliateData.stats.conversionRate}%)
                    </h3>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Liên kết giới thiệu của bạn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Liên kết giới thiệu
                    </p>
                    <div className="flex">
                      <Input
                        value={affiliateData.referralLink}
                        readOnly
                        className="rounded-r-none"
                      />
                      <Button
                        variant="outline"
                        className="rounded-l-none border-l-0"
                        onClick={() =>
                          copyToClipboard(
                            affiliateData.referralLink,
                            "Liên kết giới thiệu",
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Mã giới thiệu
                    </p>
                    <div className="flex">
                      <Input
                        value={affiliateData.referralCode}
                        readOnly
                        className="rounded-r-none"
                      />
                      <Button
                        variant="outline"
                        className="rounded-l-none border-l-0"
                        onClick={() =>
                          copyToClipboard(
                            affiliateData.referralCode,
                            "Mã giới thiệu",
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      className="w-full"
                      onClick={() =>
                        window.open(
                          "https://www.facebook.com/sharer/sharer.php?u=" +
                            encodeURIComponent(affiliateData.referralLink),
                        )
                      }
                    >
                      <Share2 className="h-4 w-4 mr-2" /> Chia sẻ liên kết
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Giao dịch gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {affiliateData.transactions.slice(0, 3).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between border-b pb-3"
                    >
                      <div>
                        <p className="font-medium">{transaction.product}</p>
                        <p className="text-sm text-gray-500">
                          {transaction.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">
                          {transaction.commission} đ
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setActiveTab("transactions")}
                  >
                    Xem tất cả giao dịch
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử giao dịch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead className="text-right">Giá trị</TableHead>
                      <TableHead className="text-right">Hoa hồng</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {affiliateData.transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {transaction.id}
                        </TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.customer}</TableCell>
                        <TableCell>{transaction.product}</TableCell>
                        <TableCell className="text-right">
                          {transaction.amount} đ
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {transaction.commission} đ
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.status === "Đã thanh toán"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Ngày</TableHead>
                      <TableHead className="text-right">Số tiền</TableHead>
                      <TableHead>Phương thức</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {affiliateData.payouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell className="font-medium">
                          {payout.id}
                        </TableCell>
                        <TableCell>{payout.date}</TableCell>
                        <TableCell className="text-right">
                          {payout.amount} đ
                        </TableCell>
                        <TableCell>{payout.method}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {payout.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4 mr-2" /> Biên lai
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Thanh toán tiếp theo</h3>
                    <p className="text-sm text-gray-500">Dự kiến: 15/06/2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Số dư hiện tại</p>
                    <p className="text-xl font-bold text-green-600">
                      {affiliateData?.stats?.pendingEarnings ?? 0} đ
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketing Materials Tab */}
        <TabsContent value="marketing">
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
                    {[
                      {
                        id: 1,
                        name: "Banner quảng cáo Carbon Toàn Thư 4.0",
                        type: "Banner",
                        size: "728x90",
                        downloadUrl:
                          "https://res.cloudinary.com/dyticflm3/image/upload/v1744635841/CarbonSeek_Banner_ous7jy.jpg",
                      },
                      {
                        id: 2,
                        name: "Banner quảng cáo Carbon Toàn Thư 4.0",
                        type: "Banner",
                        size: "300x250",
                        downloadUrl:
                          "https://res.cloudinary.com/dyticflm3/image/upload/v1744635841/CarbonSeek_Banner_ous7jy.jpg",
                      },
                      {
                        id: 3,
                        name: "Banner quảng cáo Khóa học chứng chỉ quốc tế",
                        type: "Banner",
                        size: "728x90",
                        downloadUrl:
                          "https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/CSU/Field%20of%20Knowledge%20fixed-5EKBWRBwl9HSxazRMrqpFSy1KttxmO.png",
                      },
                      {
                        id: 4,
                        name: "Banner quảng cáo Khóa học chứng chỉ quốc tế",
                        type: "Banner",
                        size: "300x250",
                        downloadUrl:
                          "https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/CSU/Field%20of%20Knowledge%20fixed-5EKBWRBwl9HSxazRMrqpFSy1KttxmO.png",
                      },
                      {
                        id: 5,
                        name: "Video giới thiệu Carbon Toàn Thư 4.0",
                        type: "Video",
                        size: "MP4",
                        downloadUrl:
                          "https://res.cloudinary.com/dyticflm3/video/upload/v1744624786/Video_b%C3%A1n_h%C3%A0ng_c%C3%B3_nh%E1%BA%A1c_lrohij.mp4",
                      },
                      {
                        id: 6,
                        name: "Video demo AI CarbonSeek",
                        type: "Video",
                        size: "MP4",
                        downloadUrl:
                          "https://res.cloudinary.com/dyticflm3/video/upload/v1744631174/CARBONSEEK_C%C3%B4ng_c%E1%BB%A5_h%E1%BB%97_tr%E1%BB%A3_nghi%C3%AAn_c%E1%BB%A9u_v%C3%A0_qu%E1%BA%A3n_l%C3%BD_to%C3%A0n_b%E1%BB%99_v%E1%BB%81_ESG_T%C3%ADn_ch%E1%BB%89_carbon_%C4%91%E1%BA%A7y_%C4%91%E1%BB%A7_th%C3%B4ng_tin_nh%E1%BA%A5t_tr%C3%AAn_th%E1%BB%8B_tr%C6%B0%E1%BB%9Dng_hi%E1%BB%87n_nay_cvbsck.mp4",
                      },
                      {
                        id: 7,
                        name: "Mục lục Carbon Toàn Thư 4.0",
                        type: "PDF",
                        size: "2.4 MB",
                        downloadUrl:
                          "https://drive.google.com/file/d/1Q5VsUIkjx_Gc5ss153Fr_HUp7bebEsN3/view?usp=sharing",
                      },
                      {
                        id: 8,
                        name: "Báo cáo mẫu ESG",
                        type: "PDF",
                        size: "3.8 MB",
                        downloadUrl:
                          "https://docs.google.com/document/d/1YhxvNui8_8x7Pp3m4kmRkjYKi8SlQ5Mva-lBHb4OZ8o/edit?usp=sharing",
                      },
                      {
                        id: 9,
                        name: "Hình ảnh thư viện tài liệu",
                        type: "Image",
                        size: "JPEG",
                        downloadUrl:
                          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Greenhouse%20Library%20Haven.jpg-V06rjIZMn48LhPqcTNKEYK9NMkbiRb.jpeg",
                      },
                      {
                        id: 10,
                        name: "Hình ảnh quảng cáo khóa học",
                        type: "Image",
                        size: "JPEG",
                        downloadUrl: "/images/certificate-sample.png",
                      },
                    ].map((material) => (
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
                    <CardTitle className="text-base">
                      Tài liệu tiếp thị
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Tải xuống bộ tài liệu tiếp thị đầy đủ cho các sản phẩm của
                      chúng tôi.
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
                        <FileText className="h-4 w-4 mr-2" /> Tài liệu Carbon
                        Toàn Thư 4.0
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
                        <FileText className="h-4 w-4 mr-2" /> Truy cập AI
                        CarbonSeek
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Hướng dẫn tiếp thị
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Xem video hướng dẫn về cách tiếp thị hiệu quả các sản phẩm
                      của chúng tôi.
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
                        <Video className="h-4 w-4 mr-2" /> Video hướng dẫn
                        CarbonSeek
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
                        <Video className="h-4 w-4 mr-2" /> Video hướng dẫn
                        Carbon Toàn Thư
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
