"use client";

import { useState, useEffect } from "react";
import { TropicalForest } from "@/components/forest/TropicalForest";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { apiDonation } from "@/app/fetch/fetch.donation";
import type { Contributor, DonationResponse } from "@/app/fetch/fetch.donation";
export default function ForestExplorer() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [totalStats, setTotalStats] = useState<{
    totalQuantity: number;
    totalTreeCount: number;
    contributorCount: number;
  }>({ totalQuantity: 0, totalTreeCount: 0, contributorCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await apiDonation.getInfor();
        if (response?.data?.donations) {
          // Map donations thành contributors
          const formattedContributors: Contributor[] =
            response.data.donations.map((donation) => ({
              _id: donation._id,
              name: donation.name,
              email: donation.email,
              phone: donation.phone,
              quantity: donation.quantity,
              note: donation.note,
              totalAmount: donation.totalAmount,
              createdAt: donation.createdAt,
            }));

          setContributors(formattedContributors);
          setTotalStats({
            totalQuantity: response.data.totalQuantity,
            totalTreeCount: response.data.totalTreeCount,
            contributorCount: response.data.contributorCount,
          });
        } else {
          throw new Error("No donations data found!");
        }
      } catch (error) {
        console.error("API went on vacation:", error);
        setError("Failed to load forest data. Try again later!");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return <TropicalForest contributors={contributors} totalStats={totalStats} />;
}
