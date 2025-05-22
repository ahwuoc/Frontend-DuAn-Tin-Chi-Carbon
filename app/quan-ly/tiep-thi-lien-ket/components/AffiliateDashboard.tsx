"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context"; // Import hook ngôn ngữ

import AffiliateOverview from "./AffiliateOverview";
import AffiliateMarketingMaterials from "./AffiliateMarketingMaterials";
import AffiliatePayouts from "./AffiliatePayouts";
import AffiliateTransactions from "./AffiliateTransactions";

import affiliateDashboardTranslations from "./affiliate-dashboard-language";

interface AffiliateDashboardProps {
  affiliateData: any;
}

export default function AffiliateDashboard({
  affiliateData,
}: AffiliateDashboardProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const { language } = useLanguage(); // Lấy ngôn ngữ hiện tại từ context

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: affiliateDashboardTranslations.toast.copiedTitle[language], // Sử dụng chuỗi dịch thuật
      description: affiliateDashboardTranslations.toast.copiedDescription[
        language
      ].replace("{{type}}", type), // Sử dụng chuỗi dịch thuật và thay thế placeholder
    });
  };

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {affiliateDashboardTranslations.header.title[language]}{" "}
          {/* Sử dụng chuỗi dịch thuật */}
        </h1>
        <p className="text-gray-600 mt-2">
          {affiliateDashboardTranslations.header.description[language]}{" "}
          {/* Sử dụng chuỗi dịch thuật */}
        </p>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="overview">
            {affiliateDashboardTranslations.tabs.overview[language]}{" "}
            {/* Sử dụng chuỗi dịch thuật */}
          </TabsTrigger>
          <TabsTrigger value="transactions">
            {affiliateDashboardTranslations.tabs.transactions[language]}{" "}
            {/* Sử dụng chuỗi dịch thuật */}
          </TabsTrigger>
          <TabsTrigger value="payouts">
            {affiliateDashboardTranslations.tabs.payouts[language]}{" "}
            {/* Sử dụng chuỗi dịch thuật */}
          </TabsTrigger>
          <TabsTrigger value="marketing">
            {affiliateDashboardTranslations.tabs.marketing[language]}{" "}
            {/* Sử dụng chuỗi dịch thuật */}
          </TabsTrigger>
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
