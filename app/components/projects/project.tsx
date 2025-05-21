// src/app/components/projects/project.ts (hoặc .tsx)

import { Badge } from "@/components/ui/badge"; // Đảm bảo import Badge

export type ProjectStatus =
  | "surveying"
  | "designing"
  | "verifying"
  | "implementing"
  | "credit_issuing"
  | "trading";

export const getStatusText = (status: ProjectStatus): string => {
  switch (status) {
    case "surveying":
      return "Đang khảo sát";
    case "designing":
      return "Đang thiết kế";
    case "verifying":
      return "Đang xác minh";
    case "implementing":
      return "Đang triển khai";
    case "credit_issuing":
      return "Đang cấp tín chỉ";
    case "trading":
      return "Đang giao dịch";
    default:
      return "Không xác định"; // Trường hợp mặc định cho an toàn
  }
};

export const getStatusBadge = (status: ProjectStatus | undefined) => {
  const styles: Record<ProjectStatus, string> = {
    surveying: "bg-yellow-100 text-yellow-800",
    designing: "bg-blue-100 text-blue-800",
    verifying: "bg-purple-100 text-purple-800",
    implementing: "bg-green-100 text-green-800",
    credit_issuing: "bg-indigo-100 text-indigo-800",
    trading: "bg-red-100 text-red-800",
  };

  // Nếu status là undefined, mặc định sử dụng 'surveying' để tránh lỗi
  const currentStatus = status || "surveying";

  return (
    <Badge className={styles[currentStatus]}>
      {getStatusText(currentStatus)}
    </Badge>
  );
};

export const getProjectTypeText = (type: string): string => {
  switch (type) {
    case "forest":
      return "Dự án Rừng";
    case "agriculture":
      return "Dự án Nông nghiệp";
    case "renewable_energy":
      return "Dự án Năng lượng tái tạo";
    case "waste_management":
      return "Dự án Quản lý chất thải";
    default:
      return type;
  }
};
