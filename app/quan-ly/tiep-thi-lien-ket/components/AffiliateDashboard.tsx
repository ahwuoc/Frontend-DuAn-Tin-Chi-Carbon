"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AffiliateOverview from "./AffiliateOverview";
import AffiliateMarketingMaterials from "./AffiliateMarketingMaterials";
import AffiliatePayouts from "./AffiliatePayouts";
import AffiliateTransactions from "./AffiliateTransactions";
import { useToast } from "@/hooks/use-toast";

interface AffiliateDashboardProps {
  affiliateData: any;
}

export default function AffiliateDashboard({
  affiliateData,
}: AffiliateDashboardProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

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
        <h1 className="text-3xl font-bold text-gray-900">
          Quản lý tiếp thị liên kết
        </h1>
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

        <TabsContent value="overview">
          <AffiliateOverview
            affiliateData={affiliateData}
            copyToClipboard={copyToClipboard}
            setActiveTab={setActiveTab}
          />
        </TabsContent>
        <TabsContent value="transactions">
          <AffiliateTransactions transactions={affiliateData.transactions} />
        </TabsContent>
        <TabsContent value="payouts">
          <AffiliatePayouts
            payouts={affiliateData?.payouts ?? []}
            pendingEarnings={affiliateData?.stats?.pendingEarnings ?? 0}
          />
        </TabsContent>
        <TabsContent value="marketing">
          <AffiliateMarketingMaterials
            materials={affiliateData.marketingMaterials}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
