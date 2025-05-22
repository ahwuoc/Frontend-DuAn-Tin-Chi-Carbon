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
import { FileText } from "lucide-react";
import { useLanguage } from "@/context/language-context"; // Import hook ngôn ngữ
import affiliatePayoutsTranslations from "./affiliate-payouts-language"; // Import tệp ngôn ngữ mới

interface AffiliatePayoutsProps {
  payouts: any[];
  pendingEarnings: string;
}

export default function AffiliatePayouts({
  payouts,
  pendingEarnings,
}: AffiliatePayoutsProps) {
  const { language } = useLanguage(); // Lấy ngôn ngữ hiện tại

  // Hàm trợ giúp để dịch trạng thái
  const getTranslatedStatus = (status: string) => {
    switch (status) {
      case "Đã thanh toán":
        return affiliatePayoutsTranslations.statusBadges.paid[language];
      case "Đang chờ xử lý": // Giả định có trạng thái này
        return affiliatePayoutsTranslations.statusBadges.pending[language];
      // Thêm các trường hợp khác nếu có
      default:
        return status; // Trả về trạng thái gốc nếu không tìm thấy bản dịch
    }
  };

  // Giả định ngày thanh toán tiếp theo là một chuỗi cố định hoặc lấy từ dữ liệu
  const nextPayoutDate = "15/06/2023"; // Bạn có thể thay thế bằng dữ liệu thực tế

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {affiliatePayoutsTranslations.cardTitle[language]}{" "}
          {/* Dịch tiêu đề card */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {affiliatePayoutsTranslations.tableHeaders.id[language]}
                  {/* Dịch tiêu đề cột */}
                </TableHead>
                <TableHead>
                  {affiliatePayoutsTranslations.tableHeaders.date[language]}
                  {/* Dịch tiêu đề cột */}
                </TableHead>
                <TableHead className="text-right">
                  {affiliatePayoutsTranslations.tableHeaders.amount[language]}
                  {/* Dịch tiêu đề cột */}
                </TableHead>
                <TableHead>
                  {affiliatePayoutsTranslations.tableHeaders.method[language]}
                  {/* Dịch tiêu đề cột */}
                </TableHead>
                <TableHead>
                  {affiliatePayoutsTranslations.tableHeaders.status[language]}
                  {/* Dịch tiêu đề cột */}
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="font-medium">{payout.id}</TableCell>
                  <TableCell>{payout.date}</TableCell>
                  <TableCell className="text-right">
                    {payout.amount}{" "}
                    {affiliatePayoutsTranslations.currencyUnit[language]}
                    {/* Dịch đơn vị tiền tệ */}
                  </TableCell>
                  <TableCell>{payout.method}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payout.status === "Đã thanh toán"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800" // Bạn có thể thêm logic cho các trạng thái khác
                      }`}
                    >
                      {getTranslatedStatus(payout.status)}{" "}
                      {/* Sử dụng hàm để dịch trạng thái */}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4 mr-2" />{" "}
                      {affiliatePayoutsTranslations.receiptButton[language]}
                      {/* Dịch nút Biên lai */}
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
              <h3 className="font-medium">
                {affiliatePayoutsTranslations.nextPayout.title[language]}
                {/* Dịch tiêu đề */}
              </h3>
              <p className="text-sm text-gray-500">
                {affiliatePayoutsTranslations.nextPayout.expectedDate[
                  language
                ].replace("{{date}}", nextPayoutDate)}
                {/* Dịch và thay thế ngày */}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {
                  affiliatePayoutsTranslations.nextPayout.currentBalance[
                    language
                  ]
                }
                {/* Dịch số dư hiện tại */}
              </p>
              <p className="text-xl font-bold text-green-600">
                {pendingEarnings}{" "}
                {affiliatePayoutsTranslations.currencyUnit[language]}
                {/* Dịch đơn vị tiền tệ */}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
