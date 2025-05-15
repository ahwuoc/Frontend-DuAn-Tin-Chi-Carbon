// Component: Invoices
// import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";
import {
  CreditCard,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Receipt,
  Plus,
  ChevronDown,
  ExternalLink,
  ArrowUpRight,
  Wallet,
  Building,
  User,
  Settings,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Invoice } from "../page";
export const Invoices = ({
  language,
  invoices,
  formatDate,
  getInvoiceStatusBadge,
}: any) => {
  const handlePayInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/pay-invoice/${invoiceId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });
      if (response.ok) {
        alert(
          language === "vi" ? "Hóa đơn đã được thanh toán!" : "Invoice paid!",
        );
      } else {
        throw new Error("Failed to pay invoice");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(language === "vi" ? "Có lỗi xảy ra!" : "An error occurred!");
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === "vi" ? "Tất cả hóa đơn" : "All Invoices"}
        </CardTitle>
        <CardDescription>
          {language === "vi"
            ? "Lịch sử hóa đơn và thanh toán"
            : "Invoice and payment history"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                {language === "vi" ? "Số hóa đơn" : "Invoice Number"}
              </TableHead>
              <TableHead>{language === "vi" ? "Ngày" : "Date"}</TableHead>
              <TableHead>
                {language === "vi" ? "Ngày đến hạn" : "Due Date"}
              </TableHead>
              <TableHead>
                {language === "vi" ? "Mô tả" : "Description"}
              </TableHead>
              <TableHead>{language === "vi" ? "Số tiền" : "Amount"}</TableHead>
              <TableHead>
                {language === "vi" ? "Trạng thái" : "Status"}
              </TableHead>
              <TableHead className="text-right">
                {language === "vi" ? "Hành động" : "Actions"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice: Invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.number}</TableCell>
                <TableCell>{formatDate(invoice.date)}</TableCell>
                <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                <TableCell>
                  {invoice.items.map((item: any, index: number) => (
                    <div key={index} className="text-sm">
                      {item.name}
                    </div>
                  ))}
                </TableCell>
                <TableCell>{invoice.amount} đ</TableCell>
                <TableCell>{getInvoiceStatusBadge(invoice.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      {language === "vi" ? "Tải xuống" : "Download"}
                    </Button>
                    {invoice.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => handlePayInvoice(invoice.id)}
                      >
                        {language === "vi" ? "Thanh toán" : "Pay"}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
