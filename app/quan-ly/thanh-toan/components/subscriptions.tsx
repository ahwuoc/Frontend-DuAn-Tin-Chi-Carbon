// Component: Subscriptions
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
import { Subscription } from "../page";
export const Subscriptions = ({
  language,
  subscriptions,
  formatDate,
  getSubscriptionStatusBadge,
  getBillingCycleName,
  router,
}: any) => (
  <Card>
    <CardHeader>
      <CardTitle>
        {language === "vi" ? "Đăng ký của bạn" : "Your Subscriptions"}
      </CardTitle>
      <CardDescription>
        {language === "vi"
          ? "Quản lý các đăng ký sản phẩm và dịch vụ"
          : "Manage your product and service subscriptions"}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        {subscriptions.map((subscription: Subscription) => (
          <div
            key={subscription.id}
            className="border rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{subscription.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {subscription.amount} đ /{" "}
                    {getBillingCycleName(subscription.billingCycle)}
                  </p>
                </div>
                {getSubscriptionStatusBadge(subscription.status)}
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">
                    {language === "vi" ? "Ngày bắt đầu" : "Start Date"}
                  </p>
                  <p className="font-medium">
                    {formatDate(subscription.startDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {language === "vi" ? "Ngày kết thúc" : "End Date"}
                  </p>
                  <p className="font-medium">
                    {formatDate(subscription.endDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {language === "vi" ? "Tự động gia hạn" : "Auto Renew"}
                  </p>
                  <p className="font-medium">
                    {subscription.autoRenew
                      ? language === "vi"
                        ? "Có"
                        : "Yes"
                      : language === "vi"
                        ? "Không"
                        : "No"}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>
                    {language === "vi" ? "Thời gian còn lại" : "Time remaining"}
                  </span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                {language === "vi" ? "Xem chi tiết" : "View Details"}
              </Button>
              {subscription.status === "active" && !subscription.autoRenew && (
                <Button size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  {language === "vi" ? "Gia hạn" : "Renew"}
                </Button>
              )}
              {subscription.status === "active" && subscription.autoRenew && (
                <Button variant="outline" size="sm">
                  {language === "vi"
                    ? "Hủy tự động gia hạn"
                    : "Cancel Auto Renew"}
                </Button>
              )}
              {subscription.status === "active" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  {language === "vi" ? "Hủy đăng ký" : "Cancel Subscription"}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
    <CardFooter>
      <Button className="w-full" onClick={() => router.push("/san-pham")}>
        <Plus className="w-4 h-4 mr-2" />
        {language === "vi"
          ? "Đăng ký thêm sản phẩm"
          : "Subscribe to More Products"}
      </Button>
    </CardFooter>
  </Card>
);
