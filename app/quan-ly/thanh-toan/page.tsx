"use client";

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

import { Subscriptions } from "./components/subscriptions";
import { PaymentMethods } from "./components/payments";
import { Invoices } from "./components/invoices";
import { Overview } from "./components/overview";
export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  amount: string;
  status: "paid" | "pending" | "overdue" | "draft";
  items: { name: string; quantity: number; price: string }[];
}

export interface PaymentMethod {
  id: string;
  type: "credit_card" | "bank_transfer" | "paypal";
  name: string;
  last4?: string;
  expiryDate?: string;
  isDefault: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  status: "active" | "canceled" | "expired";
  startDate: string;
  endDate: string;
  amount: string;
  billingCycle: "monthly" | "quarterly" | "annually";
  autoRenew: boolean;
}

// Main BillingPage Component
export default function BillingPage() {
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const searchParams = useSearchParams();
  const product = searchParams.get("product");
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === "vi"
      ? date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
  };
  const getInvoiceStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {language === "vi" ? "Đã thanh toán" : "Paid"}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {language === "vi" ? "Đang chờ" : "Pending"}
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {language === "vi" ? "Quá hạn" : "Overdue"}
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center">
            {language === "vi" ? "Bản nháp" : "Draft"}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            {status}
          </Badge>
        );
    }
  };

  // Subscription status badge
  const getSubscriptionStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {language === "vi" ? "Đang hoạt động" : "Active"}
          </Badge>
        );
      case "canceled":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 flex items-center">
            {language === "vi" ? "Đã hủy" : "Canceled"}
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center">
            {language === "vi" ? "Hết hạn" : "Expired"}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            {status}
          </Badge>
        );
    }
  };

  // Payment method icon
  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "credit_card":
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case "bank_transfer":
        return <Building className="w-5 h-5 text-green-600" />;
      case "paypal":
        return <Wallet className="w-5 h-5 text-purple-600" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-600" />;
    }
  };

  // Billing cycle name
  const getBillingCycleName = (cycle: string) => {
    switch (cycle) {
      case "monthly":
        return language === "vi" ? "Hàng tháng" : "Monthly";
      case "quarterly":
        return language === "vi" ? "Hàng quý" : "Quarterly";
      case "annually":
        return language === "vi" ? "Hàng năm" : "Annually";
      default:
        return cycle;
    }
  };
  const handleSubmitBillingInfo = (e: React.FormEvent, billingInfo: any) => {
    e.preventDefault();
    alert(
      language === "vi"
        ? "Thông tin thanh toán đã được cập nhật!"
        : "Billing information updated!",
    );
  };

  // Handle submit payment method
  const handleSubmitPaymentMethod = (e: React.FormEvent, newMethod: any) => {
    e.preventDefault();
    console.log("Submitted payment method:", newMethod);

    alert(
      language === "vi"
        ? "Phương thức thanh toán đã được thêm!"
        : "Payment method added!",
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {language === "vi" ? "Thanh toán" : "Billing"}
          </h1>
          <p className="text-gray-500 mt-1">
            {language === "vi"
              ? "Quản lý hóa đơn, đăng ký và phương thức thanh toán"
              : "Manage invoices, subscriptions, and payment methods"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Receipt className="w-4 h-4 mr-2" />
            {language === "vi" ? "Xem tất cả hóa đơn" : "View All Invoices"}
          </Button>
          <Button >
            <Plus className="w-4 h-4 mr-2" />
            {language === "vi"
              ? "Thêm phương thức thanh toán"
              : "Add Payment Method"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {language === "vi" ? "Tổng chi tiêu" : "Total Spent"}
                </p>
                <h3 className="text-2xl font-bold mt-1">10.100.000 đ</h3>
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
                  {language === "vi"
                    ? "Đăng ký đang hoạt động"
                    : "Active Subscriptions"}
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {
                    subscriptions.filter((s: any) => s.status === "active")
                      .length
                  }
                </h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {language === "vi"
                    ? "Hóa đơn chưa thanh toán"
                    : "Unpaid Invoices"}
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {
                    invoices.filter(
                      (i: Invoice) =>
                        i.status === "pending" || i.status === "overdue",
                    ).length
                  }
                </h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {language === "vi"
                    ? "Phương thức thanh toán"
                    : "Payment Methods"}
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {paymentMethods.length}
                </h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">
            {language === "vi" ? "Tổng quan" : "Overview"}
          </TabsTrigger>
          <TabsTrigger value="invoices">
            {language === "vi" ? "Hóa đơn" : "Invoices"}
          </TabsTrigger>
          <TabsTrigger value="subscriptions">
            {language === "vi" ? "Đăng ký" : "Subscriptions"}
          </TabsTrigger>
          <TabsTrigger value="payment_methods">
            {language === "vi" ? "Phương thức thanh toán" : "Payment Methods"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Overview
            language={language}
            user={user}
            invoices={invoices}
            subscriptions={subscriptions}
            paymentMethods={paymentMethods}
            setActiveTab={setActiveTab}
            formatDate={formatDate}
            getInvoiceStatusBadge={getInvoiceStatusBadge}
            getSubscriptionStatusBadge={getSubscriptionStatusBadge}
            getPaymentMethodIcon={getPaymentMethodIcon}
            getBillingCycleName={getBillingCycleName}
            handleSubmitBillingInfo={handleSubmitBillingInfo}
          />
        </TabsContent>
        <TabsContent value="invoices">
          <Invoices
            language={language}
            invoices={invoices}
            formatDate={formatDate}
            getInvoiceStatusBadge={getInvoiceStatusBadge}
          />
        </TabsContent>
        <TabsContent value="subscriptions">
          <Subscriptions
            language={language}
            subscriptions={subscriptions}
            formatDate={formatDate}
            getSubscriptionStatusBadge={getSubscriptionStatusBadge}
            getBillingCycleName={getBillingCycleName}
            router={router}
          />
        </TabsContent>
        <TabsContent value="payment_methods">
          <PaymentMethods
            language={language}
            paymentMethods={paymentMethods}
            getPaymentMethodIcon={getPaymentMethodIcon}
            handleSubmitPaymentMethod={handleSubmitPaymentMethod}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
