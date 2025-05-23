// app/gop-mam-xanh/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { apiDonation } from "../fetch/fetch.donation";
import { useLanguage } from "@/context/language-context";
import translations from "./language";

import HeroSection from "./components/HeroSection";
import CommunityForestSection from "./components/CommunityForestSection";
import ProjectDetailsSection from "./components/ProjectDetailsSection";
import ModelVisualizationSection from "./components/ModelVisualizationSection";
import PlantingGoalsSection from "./components/PlantingGoalsSection";
import PlantTreeActionSection from "./components/PlantTreeActionSection";
import FaqSection from "./components/FaqSection";

export default function GopMamXanhPage() {
  const [donorName, setDonorName] = useState<string>("");
  const [donorNote, setDonorNote] = useState<string>("");
  const [treeId, setTreeId] = useState<string>("");
  const [treeCount, setTreeCount] = useState<number>(1);
  const { language } = useLanguage();

  const [forestStats, setForestStats] = useState<{
    treeCount: number;
    contributorCount: number;
    co2Reduction: number;
    isLoading: boolean;
  }>({
    treeCount: 0,
    contributorCount: 0,
    co2Reduction: 0,
    isLoading: true,
  });

  const [transactionStatus, setTransactionStatus] = useState<
    "idle" | "paid" | "cancelled" | "error"
  >("idle");

  const plantTreeSectionRef = useRef<HTMLDivElement>(null);
  const [isPageReady, setIsPageReady] = useState(false);
  const isInitialScrollPerformed = useRef(false);

  const fetchForestStats = async () => {
    setForestStats((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await apiDonation.getInfor();
      if (response.status === 200 && response.payload) {
        setForestStats({
          treeCount: response.payload.totalQuantity ?? 0,
          contributorCount: response.payload.contributorCount ?? 0,
          co2Reduction: (response.payload.totalQuantity ?? 0) * 21,
          isLoading: false,
        });
      } else {
        throw new Error("Invalid response status");
      }
    } catch (error) {
      console.error("Failed to fetch donation data:", error);
      setForestStats((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const getOrderDetailsAndUpdateStatus = async (orderCode: string) => {
    try {
      const response =
        await apiDonation.getDonationByorderCodeAndUpdateStatus(orderCode);
      if (response && response.payload && response.payload.donation) {
        return response.payload.donation;
      } else {
        console.error("Failed to fetch donation details or invalid payload.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching and updating donation status:", error);
      return null;
    }
  };

  useEffect(() => {
    const initPageAndScroll = async () => {
      await fetchForestStats();

      const queryParams = new URLSearchParams(window.location.search);
      const statusParam = queryParams.get("status");
      const orderCodeParam = queryParams.get("orderCode");
      const hash = window.location.hash;

      let currentTransactionStatus: "idle" | "paid" | "cancelled" | "error" =
        "idle";
      let shouldScrollTarget = false;

      if (statusParam && orderCodeParam) {
        shouldScrollTarget = true;

        if (statusParam === "PAID") {
          const donationDetails =
            await getOrderDetailsAndUpdateStatus(orderCodeParam);
          if (donationDetails && donationDetails.status === "success") {
            setDonorName(donationDetails.name || "Người đóng góp");
            setTreeCount(donationDetails.quantity || 1);
            setDonorNote(donationDetails.note || "");
            setTreeId(
              donationDetails.orderCode ||
                `TC-${Math.floor(Math.random() * 10000)
                  .toString()
                  .padStart(4, "0")}`,
            );
            currentTransactionStatus = "paid";
          } else {
            currentTransactionStatus = "error";
            console.error(
              "Transaction details not found or not successful after PAID status.",
            );
          }
        } else if (statusParam === "CANCELLED") {
          currentTransactionStatus = "cancelled";
        } else {
          currentTransactionStatus = "error";
        }

        const newUrl = window.location.origin + window.location.pathname + hash;
        window.history.replaceState({}, document.title, newUrl);
      } else if (hash === "#plant-tree-section") {
        shouldScrollTarget = true;
      }

      setTransactionStatus(currentTransactionStatus);
      setIsPageReady(true);

      if (shouldScrollTarget) {
        isInitialScrollPerformed.current = true;
      }
    };

    initPageAndScroll();
  }, []);

  useEffect(() => {
    if (
      isPageReady &&
      isInitialScrollPerformed.current &&
      plantTreeSectionRef.current
    ) {
      setTimeout(() => {
        plantTreeSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        isInitialScrollPerformed.current = false;
      }, 50);
    }
  }, [isPageReady, plantTreeSectionRef.current]);

  const handleDonationComplete = (
    name: string,
    note?: string,
    quantity?: number,
  ) => {
    const newTreeId = `TC-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`;

    setDonorName(name || "");
    setDonorNote(note || "");
    setTreeId(newTreeId);
    setTreeCount(quantity || 1);

    setTransactionStatus("paid");
    fetchForestStats();
  };

  if (!isPageReady) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <p className="ml-4 text-gray-700">Đang tải nội dung...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <HeroSection />
      <CommunityForestSection
        treeCount={forestStats.treeCount}
        contributorCount={forestStats.contributorCount}
        co2Reduction={forestStats.co2Reduction}
        isLoading={forestStats.isLoading}
      />
      <ProjectDetailsSection />
      <ModelVisualizationSection />
      <PlantingGoalsSection
        treeCount={forestStats.treeCount}
        isLoading={forestStats.isLoading}
      />
      <PlantTreeActionSection
        sectionRef={plantTreeSectionRef}
        donorName={donorName}
        donorNote={donorNote}
        treeId={treeId}
        treeCount={treeCount}
        transactionStatus={transactionStatus}
        forestStatsIsLoading={forestStats.isLoading}
        onDonationComplete={handleDonationComplete}
        setTransactionStatus={setTransactionStatus}
      />
      <FaqSection />
    </main>
  );
}
