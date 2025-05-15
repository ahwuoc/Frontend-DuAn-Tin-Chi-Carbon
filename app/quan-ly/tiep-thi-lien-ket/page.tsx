"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import HTTP from "@/app/common/http";
import AffiliateRegisterForm from "./components/AffiliateRegisterForm";
import AffiliateDashboard from "./components/AffiliateDashboard";
import { IAffiliate, apiAffiliates } from "@/app/fetch/fetch.affiliate";

export default function AffiliateManager() {
  const { toast } = useToast();
  const [affiliateData, setAffiliateData] = useState<IAffiliate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAffiliateData = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("user_id") || '""');
        if (!userId) {
          setLoading(false);
          return;
        }
        const response = await apiAffiliates.getByUserId(userId);
        if (response && response.data) {
          setAffiliateData(response.data.affiliates[0]);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchAffiliateData();
  }, [toast]);

  if (loading) {
    return <div>Loading...Bạn vui lòng đợi 1 tý!</div>;
  }

  if (!affiliateData) {
    return <AffiliateRegisterForm />;
  }

  return <AffiliateDashboard affiliateData={affiliateData} />;
}
