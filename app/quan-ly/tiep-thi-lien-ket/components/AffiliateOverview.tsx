import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DollarSign,
  Users,
  MousePointer,
  TrendingUp,
  Copy,
  Share2,
} from "lucide-react";

interface AffiliateOverviewProps {
  affiliateData: any;
  copyToClipboard: (text: string, type: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function AffiliateOverview({
  affiliateData,
  copyToClipboard,
  setActiveTab,
}: AffiliateOverviewProps) {
  return (
    <div className="space-y-6">
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
                <p className="text-sm font-medium text-gray-500">Lượt nhấp</p>
                <h3 className="text-2xl font-bold mt-1">
                  {affiliateData?.stats?.clicks ?? 0}
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
                <p className="text-sm font-medium text-gray-500">Chuyển đổi</p>
                <h3 className="text-2xl font-bold mt-1">
                  {affiliateData?.stats?.conversions ?? 0} (
                  {affiliateData?.stats?.conversionRate ?? 0}%)
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
              {affiliateData.transaction !== undefined &&
                affiliateData.transactions
                  .slice(0, 3)
                  .map((transaction: any) => (
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
    </div>
  );
}
