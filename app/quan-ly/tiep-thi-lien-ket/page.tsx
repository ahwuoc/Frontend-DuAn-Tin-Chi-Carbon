"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import AffiliateRegisterForm from "./components/AffiliateRegisterForm";
import AffiliateDashboard from "./components/AffiliateDashboard";
import { IAffiliate, apiAffiliates } from "@/app/fetch/fetch.affiliate";
import { useAuth } from "../../../context/auth-context";
export default function AffiliateManager() {
  const { toast } = useToast();
  const [affiliateData, setAffiliateData] = useState<IAffiliate | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth()
  useEffect(() => {
    const fetchAffiliateData = async () => {
      try {
        if (!user?.userId) {
          setLoading(false);
          return;
        }
        const response = await apiAffiliates.getByUserId(user.userId);
        if (response?.data) {
          setAffiliateData(response.data.affiliate);
        }
      } catch (error) {
        console.error("Failed to fetch affiliate:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliateData();
  }, [user]);

  if (loading) {
    return <div>Loading...Bạn vui lòng đợi 1 tý!</div>;
  }

  if (!affiliateData) {
    return <AffiliateRegisterForm />;
  }

  return <AffiliateDashboard affiliateData={affiliateData} />;
}
