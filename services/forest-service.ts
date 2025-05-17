import { defaultContributors } from "@/lib/forest-data";
import type { Contributor, TreeData } from "@/lib/types";
import { apiDonation } from "../app/fetch/fetch.donation";
interface ProcessedContributorData {
  name: string;
  trees: number;
}

export async function getContributors(): Promise<ProcessedContributorData[]> {
  try {
    // Bước 1: Cố gắng tải và xử lý dữ liệu thật từ API
    const response = await apiDonation.getInfor();

    // Kiểm tra phản hồi API và cấu trúc dữ liệu cơ bản
    if (
      !response ||
      !response.data ||
      !Array.isArray(response.data.donations)
    ) {
      console.error(
        "Phản hồi hoặc cấu trúc dữ liệu không hợp lệ từ apiDonation.getInfor:",
        response
      );
      // Ném một lỗi để nhảy vào khối catch (và kích hoạt fallback)
      throw new Error(
        "Cấu trúc dữ liệu nhận được từ API đóng góp không hợp lệ"
      );
    }

    const donations = response.data.donations;

    // Xử lý dữ liệu động: Tổng hợp từ các giao dịch thành { name, totalTrees }
    // Sử dụng Map để nhóm, key có thể là email (ưu tiên) hoặc tên để đảm bảo duy nhất
    const dynamicAggregatedMap = new Map<
      string,
      { name: string; totalTrees: number }
    >();

    donations.forEach((donation: any) => {
      // Sử dụng 'any' nếu bạn không định nghĩa interface BackendDonation
      // Chọn key duy nhất: ưu tiên email, nếu không có email dùng tên. Chuẩn hóa về chữ thường.
      const key =
        donation.email && donation.email.trim() !== ""
          ? donation.email.trim().toLowerCase()
          : donation.name && donation.name.trim() !== ""
          ? donation.name.trim().toLowerCase()
          : ""; // Đảm bảo key không rỗng

      if (!key) {
        console.warn(
          "Bỏ qua giao dịch không xác định người đóng góp (key rỗng):",
          donation
        );
        return;
      }

      if (!dynamicAggregatedMap.has(key)) {
        dynamicAggregatedMap.set(key, {
          name:
            donation.name && donation.name.trim() !== ""
              ? donation.name.trim()
              : "Anonymous", // Dùng tên, mặc định 'Anonymous'
          totalTrees: 0, // Khởi tạo tổng số cây
        });
      }

      // Cộng dồn số lượng (quantity) vào tổng số cây của người đóng góp này
      const contributor = dynamicAggregatedMap.get(key)!; // Lấy object người đóng góp
      // Đảm bảo quantity là số, mặc định 0 nếu không hợp lệ
      contributor.totalTrees +=
        typeof donation.quantity === "number"
          ? donation.quantity
          : parseInt(donation.quantity, 10) || 0;
    });

    const processedDynamicContributors: any[] = Array.from(
      dynamicAggregatedMap.values()
    );

    const mergedContributorsMap = new Map<string, ProcessedContributorData>();

    // Thêm tất cả dữ liệu động đã xử lý vào Map trước
    processedDynamicContributors.forEach((contributor) => {
      // Sử dụng tên (chữ thường) làm key cho Map gộp
      mergedContributorsMap.set(contributor.name.toLowerCase(), contributor);
    });

    defaultContributors.forEach((staticContributor) => {
      const key = staticContributor.name.toLowerCase(); // Key cho dữ liệu tĩnh

      if (mergedContributorsMap.has(key)) {
        mergedContributorsMap.get(key)!.trees += staticContributor.trees;
      } else {
        mergedContributorsMap.set(key, {
          name: staticContributor.name,
          trees: staticContributor.trees,
        });
      }
    });

    const finalMergedContributors: ProcessedContributorData[] = Array.from(
      mergedContributorsMap.values()
    );

    finalMergedContributors.sort((a, b) => b.trees - a.trees);

    console.log(
      "Dữ liệu đóng góp (động + tĩnh) đã gộp:",
      finalMergedContributors
    );

    return finalMergedContributors;
  } catch (error) {
    console.error(
      "Lỗi khi tải hoặc xử lý dữ liệu đóng góp từ API. Trả về dữ liệu tĩnh dự phòng:",
      error
    );
    return defaultContributors;
  }
}
// Trong tương lai, khi tích hợp database
export async function addContributor(
  name: string,
  trees: number
): Promise<Contributor> {
  // Giả lập API call
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
  // Giả lập API call
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
  // Giả lập API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Tạo dữ liệu mẫu
      const trees: TreeData[] = [];
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * 120 - 60;
        const z = Math.random() * 120 - 60;
        const contributorIndex = i % defaultContributors.length;

        trees.push({
          id: `tree-${i}`,
          type: Math.floor(Math.random() * 5),
          position: { x, y: 0, z },
          scale: 0.8 + Math.random() * 0.5,
          contributorId: `contributor-${contributorIndex}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      resolve(trees);
    }, 500);
  });
}

export async function addTree(
  type: number,
  position: { x: number; y: number; z: number },
  contributorId: string
): Promise<TreeData> {
  // Giả lập API call
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
