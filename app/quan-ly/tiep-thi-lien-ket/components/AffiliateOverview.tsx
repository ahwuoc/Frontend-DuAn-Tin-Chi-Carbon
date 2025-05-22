"use client";

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
import { useLanguage } from "@/context/language-context";
// Import tệp ngôn ngữ riêng cho AffiliateOverview
import affiliateOverviewTranslations from "./affiliate-overview-language";
import affiliateDashboardTranslations from "./affiliate-dashboard-language"; // Vẫn cần cho `toast`

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
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {affiliateOverviewTranslations.totalCommission[language]}
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {affiliateData?.stats?.earnings ?? 0}{" "}
                  {affiliateOverviewTranslations.currencyUnit[language]}
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
                  {affiliateOverviewTranslations.pendingCommission[language]}
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {affiliateData?.stats?.pendingEarnings ?? 0}{" "}
                  {affiliateOverviewTranslations.currencyUnit[language]}
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
                  {affiliateOverviewTranslations.clicks[language]}
                </p>
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
                <p className="text-sm font-medium text-gray-500">
                  {affiliateOverviewTranslations.conversions[language]}
                </p>
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
            <CardTitle>
              {affiliateOverviewTranslations.yourReferralLinks[language]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  {affiliateOverviewTranslations.referralLink[language]}
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
                        affiliateOverviewTranslations.referralLink[language],
                      )
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  {affiliateOverviewTranslations.referralCode[language]}
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
                        affiliateOverviewTranslations.referralCode[language],
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
                      "_blank",
                    )
                  }
                >
                  <Share2 className="h-4 w-4 mr-2" />{" "}
                  {affiliateOverviewTranslations.shareLink[language]}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {affiliateOverviewTranslations.recentTransactions[language]}
            </CardTitle>
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
                          {transaction.commission}{" "}
                          {affiliateOverviewTranslations.currencyUnit[language]}
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
                {affiliateOverviewTranslations.viewAllTransactions[language]}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
