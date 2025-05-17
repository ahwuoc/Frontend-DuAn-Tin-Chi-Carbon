import { defaultContributors } from "@/lib/forest-data";
import type { Contributor, TreeData } from "@/lib/types";
import { apiDonation } from "../app/fetch/fetch.donation";
interface ProcessedContributorData {
  name: string;
  trees: number;
}
export async function getContributors(): Promise<ProcessedContributorData[]> {
  const mergeStatic = false;
  try {
    const response = await apiDonation.getInfor();
    if (
      !response ||
      !response.payload ||
      !Array.isArray(response.payload.donations)
    ) {
      throw new Error("Cấu trúc dữ liệu không hợp lệ từ API");
    }
    const donations = response.payload.donations;
    const dynamicAggregatedMap = new Map<
      string,
      { name: string; trees: number }
    >();

    donations.forEach((donation: any) => {
      const key =
        donation.email?.trim().toLowerCase() ||
        donation.name?.trim().toLowerCase() ||
        "";

      if (!key) {
        console.warn("⚠️ Bỏ qua giao dịch không xác định:", donation);
        return;
      }

      if (!dynamicAggregatedMap.has(key)) {
        dynamicAggregatedMap.set(key, {
          name: donation.name?.trim() || "Anonymous",
          trees: 0,
        });
      }

      const contributor = dynamicAggregatedMap.get(key)!;
      contributor.trees +=
        typeof donation.quantity === "number"
          ? donation.quantity
          : parseInt(donation.quantity, 10) || 0;
    });

    const mergedContributorsMap = new Map<string, ProcessedContributorData>();

    // Add dynamic data
    for (const contributor of dynamicAggregatedMap.values()) {
      mergedContributorsMap.set(contributor.name.toLowerCase(), contributor);
    }

    // Conditionally merge static data
    if (mergeStatic) {
      for (const staticContributor of defaultContributors) {
        const key = staticContributor.name.toLowerCase();
        if (mergedContributorsMap.has(key)) {
          mergedContributorsMap.get(key)!.trees += staticContributor.trees;
        } else {
          mergedContributorsMap.set(key, {
            name: staticContributor.name,
            trees: staticContributor.trees,
          });
        }
      }
    }

    const finalContributors = Array.from(mergedContributorsMap.values());
    finalContributors.sort((a, b) => b.trees - a.trees);

    console.log("✅ Danh sách đóng góp đã xử lý:", finalContributors);
    return finalContributors;
  } catch (error) {
    console.error("❌ Lỗi khi xử lý dữ liệu đóng góp:", error);
    return mergeStatic ? defaultContributors : [];
  }
}

export async function addContributor(
  name: string,
  trees: number
): Promise<Contributor> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newContributor = {
        id: `contributor-${Date.now()}`,
        name,
        trees,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      resolve(newContributor);
    }, 500);
  });
}

export async function updateContributor(
  id: string,
  data: Partial<Contributor>
): Promise<Contributor> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const contributor = defaultContributors.find((c) => c.id === id) || {
        id,
        name: "Unknown",
        trees: 0,
      };
      const updatedContributor = {
        ...contributor,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      resolve(updatedContributor);
    }, 500);
  });
}

export async function getTrees(): Promise<TreeData[]> {
  let numberOfTreesToGenerate = 20;
  let contributors: ProcessedContributorData[] = [];

  try {
    const response = await apiDonation.getInfor();

    if (
      response &&
      response.status === 200 &&
      response.payload &&
      typeof response.payload.totalQuantity === "number" &&
      response.payload.totalQuantity >= 0
    ) {
      numberOfTreesToGenerate = response.payload.totalQuantity;
      console.log(
        `Đang tạo ${numberOfTreesToGenerate} cây dựa trên totalQuantity từ API.`
      );
    } else {
      console.warn(
        "Could not get valid totalQuantity from API for getTrees. Falling back to generating 20 trees.",
        response
      );
    }
  } catch (error) {
    console.error("Error fetching donation info for getTrees:", error);
    console.warn(
      "Falling back to generating 20 trees and using default contributors due to API error."
    );
    numberOfTreesToGenerate = 20; // Fallback number of trees
  }
  try {
    contributors = await getContributors();
    if (contributors.length === 0 && numberOfTreesToGenerate > 0) {
      console.warn(
        "getContributors returned an empty list, but totalQuantity > 0. Trees will be assigned to a generic ID."
      );
    }
  } catch (error) {
    console.error("Error fetching contributors for getTrees:", error);
    console.warn(
      "Falling back to using an empty contributor list. Trees will be assigned to a generic ID."
    );
    contributors = [];
  }

  const trees: TreeData[] = [];
  for (let i = 0; i < numberOfTreesToGenerate; i++) {
    const x = Math.random() * 120 - 60;
    const z = Math.random() * 120 - 60;
    let assignedContributorId: string;
    if (contributors.length > 0) {
      const contributorIndex = i % contributors.length;
      assignedContributorId = `mock-contributor-${contributorIndex}`;
    } else {
      assignedContributorId = "anonymous-contributor";
    }

    trees.push({
      id: `tree-${i}`,
      type: Math.floor(Math.random() * 5),
      position: { x, y: 0, z },
      scale: 0.8 + Math.random() * 0.5,
      contributorId: assignedContributorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return trees;
}

export async function addTree(
  type: number,
  position: { x: number; y: number; z: number },
  contributorId: string
): Promise<TreeData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTree = {
        id: `tree-${Date.now()}`,
        type,
        position,
        scale: 0.8 + Math.random() * 0.5,
        contributorId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      resolve(newTree);
    }, 500);
  });
}
