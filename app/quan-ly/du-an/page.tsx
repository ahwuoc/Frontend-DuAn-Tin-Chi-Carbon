import type { Metadata } from "next";
import ProjectsList from "@/components/dashboard/projects-list";

export const metadata: Metadata = {
  title: "Dự án của tôi | TinChiCarbon",
  description: "Quản lý các dự án carbon mà bạn đã đăng ký tham gia",
};

export default function ProjectsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dự án của tôi</h1>
        <p className="text-gray-600">
          Quản lý và theo dõi các dự án carbon mà bạn đã đăng ký tham gia
        </p>
      </div>
      <ProjectsList />
    </div>
  );
}
