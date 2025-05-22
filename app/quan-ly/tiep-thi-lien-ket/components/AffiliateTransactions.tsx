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
import { useLanguage } from "@/context/language-context"; // Import hook ngôn ngữ
import affiliateTransactionsTranslations from "./affiliate-transactions-language"; // Import tệp ngôn ngữ mới

interface AffiliateTransactionsProps {
  transactions: any[];
}

export default function AffiliateTransactions({
  transactions,
}: AffiliateTransactionsProps) {
  const { language } = useLanguage(); // Lấy ngôn ngữ hiện tại

  // Hàm trợ giúp để dịch trạng thái
  const getTranslatedStatus = (status: string) => {
    switch (status) {
      case "Đã thanh toán":
        return affiliateTransactionsTranslations.statusBadges.paid[language];
      case "Đang chờ xử lý":
        return affiliateTransactionsTranslations.statusBadges.pending[language];
      // Thêm các trường hợp khác nếu có
      default:
        return status; // Trả về trạng thái gốc nếu không tìm thấy bản dịch
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {affiliateTransactionsTranslations.cardTitle[language]}{" "}
          {/* Dịch tiêu đề card */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {affiliateTransactionsTranslations.tableHeaders.id[language]}
                  {/* Dịch tiêu đề cột */}
                </TableHead>
                <TableHead>
                  {
                    affiliateTransactionsTranslations.tableHeaders.date[
                      language
                    ]
                  }
                  {/* Dịch tiêu đề cột */}
                </TableHead>
                <TableHead>
                  {
                    affiliateTransactionsTranslations.tableHeaders.customer[
                      language
                    ]
                  }
                  {/* Dịch tiêu đề cột */}
                </TableHead>
                <TableHead>
                  {
                    affiliateTransactionsTranslations.tableHeaders.product[
                      language
                    ]
                  }
                  {/* Dịch tiêu đề cột */}
                </TableHead>
                <TableHead className="text-right">
                  {
                    affiliateTransactionsTranslations.tableHeaders.amount[
                      language
                    ]
                  }
                  {/* Dịch tiêu đề cột */}
                </TableHead>
                <TableHead className="text-right">
                  {
                    affiliateTransactionsTranslations.tableHeaders.commission[
                      language
                    ]
                  }
                  {/* Dịch tiêu đề cột */}
                </TableHead>
                <TableHead>
                  {
                    affiliateTransactionsTranslations.tableHeaders.status[
                      language
                    ]
                  }
                  {/* Dịch tiêu đề cột */}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions !== undefined &&
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.id}
                    </TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.customer}</TableCell>
                    <TableCell>{transaction.product}</TableCell>
                    <TableCell className="text-right">
                      {transaction.amount}{" "}
                      {affiliateTransactionsTranslations.currencyUnit[language]}
                      {/* Dịch đơn vị tiền tệ */}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {transaction.commission}{" "}
                      {affiliateTransactionsTranslations.currencyUnit[language]}
                      {/* Dịch đơn vị tiền tệ */}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === "Đã thanh toán"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {getTranslatedStatus(transaction.status)}{" "}
                        {/* Sử dụng hàm để dịch trạng thái */}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
