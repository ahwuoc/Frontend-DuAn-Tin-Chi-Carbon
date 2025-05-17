import { defaultContributors } from "@/lib/forest-data";
import type { Contributor, TreeData } from "@/lib/types";
import { apiDonation } from "../app/fetch/fetch.donation";
interface ProcessedContributorData {
  name: string;
  trees: number;
}

// Hiện tại sử dụng dữ liệu tĩnh, sau này sẽ kết nối với database
export async function getContributors(): Promise<ProcessedContributorData[]> {
  try {
    // Gọi API để lấy dữ liệu
    const response = await apiDonation.getInfor();

    // Kiểm tra response và cấu trúc data cơ bản
    if (
      !response ||
      !response.data ||
      !Array.isArray(response.data.donations)
    ) {
      console.error(
        "Phản hồi hoặc cấu trúc dữ liệu không hợp lệ từ apiDonation.getInfor:",
        response
      );
      // Ném lỗi để component gọi có thể xử lý (ví dụ: hiển thị thông báo lỗi)
      throw new Error(
        "Cấu trúc dữ liệu nhận được từ API đóng góp không hợp lệ"
      );
    }

    const donations = response.data.donations;

    // Sử dụng Map để tổng hợp số lượng (quantity) theo tên người đóng góp (hoặc email để đảm bảo duy nhất hơn)
    // Key của Map có thể là email (ưu tiên) hoặc tên
    const aggregatedDataMap = new Map<
      string,
      { name: string; totalTrees: number }
    >();

    donations.forEach((donation: any) => {
      // Sử dụng any hoặc định nghĩa interface BackendDonation nếu cần
      // Lấy key duy nhất: ưu tiên email, nếu không có email thì dùng tên
      const key =
        donation.email && donation.email.trim() !== ""
          ? donation.email.trim().toLowerCase()
          : donation.name.trim().toLowerCase();

      // Bỏ qua các mục không có tên hoặc email
      if (!key || key === "") {
        console.warn(
          "Bỏ qua giao dịch không xác định người đóng góp:",
          donation
        );
        return;
      }

      // Nếu người đóng góp này chưa có trong Map, thêm vào với tổng số cây ban đầu là 0
      if (!aggregatedDataMap.has(key)) {
        aggregatedDataMap.set(key, {
          name:
            donation.name && donation.name.trim() !== ""
              ? donation.name.trim()
              : "Anonymous", // Lấy tên, mặc định 'Anonymous'
          totalTrees: 0,
        });
      }

      // Cộng dồn số lượng (quantity) của giao dịch hiện tại vào tổng số cây của người đóng góp
      const contributor = aggregatedDataMap.get(key)!; // Lấy object người đóng góp từ Map
      // Đảm bảo quantity là số, dùng parseInt nếu cần và mặc định 0 nếu không hợp lệ
      contributor.totalTrees +=
        typeof donation.quantity === "number"
          ? donation.quantity
          : parseInt(donation.quantity, 10) || 0;
    });

    // Chuyển dữ liệu đã tổng hợp từ Map thành mảng các object { name, trees }
    const processedContributors: ProcessedContributorData[] = Array.from(
      aggregatedDataMap.values()
    ).map((aggregatedData) => ({
      name: aggregatedData.name, // Lấy tên đã tổng hợp
      trees: aggregatedData.totalTrees, // Lấy tổng số cây đã tính
    }));

    // Tùy chọn: Sắp xếp kết quả nếu muốn (ví dụ: theo số cây giảm dần)
    // processedContributors.sort((a, b) => b.trees - a.trees);
 
    console.log(
      "Dữ liệu người đóng góp đã xử lý cho ForestElements:",
      processedContributors
    );

    return processedContributors; // Trả về mảng data dạng { name, trees }[]
  } catch (error) {
    console.error(
      "Lỗi trong hàm getContributors khi fetch hoặc xử lý data:",
      error
    );
    // Ném lỗi để component gọi (ForestExplorer) có thể bắt và hiển thị
    throw error;
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
