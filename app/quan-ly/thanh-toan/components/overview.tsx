import { useState, useEffect } from "react";
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
import {
  subscriptions,
  invoices,
  paymentMethods,
} from "@/app/mockup/bill.mockup";
import { Invoice, PaymentMethod, Subscription } from "../page";
export const Overview = ({
  language,
  user,
  invoices,
  subscriptions,
  paymentMethods,
  setActiveTab,
  formatDate,
  getInvoiceStatusBadge,
  getSubscriptionStatusBadge,
  getPaymentMethodIcon,
  getBillingCycleName,
  handleSubmitBillingInfo,
}: any) => {
  const [billingInfo, setBillingInfo] = useState({
    name: user?.name || "Nguyễn Văn A",
    email: user?.email || "example@gmail.com",
    phone: user?.phone || "+84 123 456 789",
    address:
      user?.address || "123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh, Việt Nam",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {language === "vi" ? "Hóa đơn gần đây" : "Recent Invoices"}
          </CardTitle>
          <CardDescription>
            {language === "vi"
              ? "Các hóa đơn gần đây nhất của bạn"
              : "Your most recent invoices"}
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
                  {language === "vi" ? "Số tiền" : "Amount"}
                </TableHead>
                <TableHead>
                  {language === "vi" ? "Trạng thái" : "Status"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.slice(0, 3).map((invoice: Invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    {invoice.number}
                  </TableCell>
                  <TableCell>{formatDate(invoice.date)}</TableCell>
                  <TableCell>{invoice.amount} đ</TableCell>
                  <TableCell>{getInvoiceStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      {language === "vi" ? "Xem" : "View"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setActiveTab("invoices")}
          >
            {language === "vi" ? "Xem tất cả hóa đơn" : "View All Invoices"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === "vi" ? "Thông tin thanh toán" : "Billing Information"}
          </CardTitle>
          <CardDescription>
            {language === "vi"
              ? "Thông tin dùng cho hóa đơn và thanh toán"
              : "Information used for invoices and payments"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleSubmitBillingInfo(e, billingInfo)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  {language === "vi"
                    ? "Thông tin liên hệ"
                    : "Contact Information"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">
                      {language === "vi" ? "Họ tên" : "Full Name"}
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={billingInfo.name}
                      onChange={handleInputChange}
                      placeholder={
                        language === "vi" ? "Nhập họ tên" : "Enter full name"
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={billingInfo.email}
                      onChange={handleInputChange}
                      placeholder={
                        language === "vi" ? "Nhập email" : "Enter email"
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">
                      {language === "vi" ? "Số điện thoại" : "Phone Number"}
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={billingInfo.phone}
                      onChange={handleInputChange}
                      placeholder={
                        language === "vi"
                          ? "Nhập số điện thoại"
                          : "Enter phone number"
                      }
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  {language === "vi" ? "Địa chỉ thanh toán" : "Billing Address"}
                </h3>
                <div>
                  <Label htmlFor="address">
                    {language === "vi" ? "Địa chỉ" : "Address"}
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={billingInfo.address}
                    onChange={handleInputChange}
                    placeholder={
                      language === "vi" ? "Nhập địa chỉ" : "Enter address"
                    }
                  />
                </div>
              </div>
            </div>
            <Button type="submit" className="mt-6 w-full">
              <Settings className="w-4 h-4 mr-2" />
              {language === "vi"
                ? "Cập nhật thông tin thanh toán"
                : "Update Billing Information"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
