"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import {
  Calendar,
  ArrowUpRight,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getProjectTypeText,
  getStatusText,
} from "@/app/components/projects/project";

import { apiProjects, IProject } from "@/app/fetch/fetch.projects";
import { useAuth } from "../../context/auth-context";
import { formatDateUtil } from "@/app/utils/common";

export default function ProjectsList() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [projects, setProjects] = useState<IProject[]>([]);
  const { user } = useAuth(); // Giả định user có userId để lọc dự án của người dùng hiện tại

  useEffect(() => {
    if (!user?.userId) {
      console.log("Không có userId, không thể fetch dự án.");
      return;
    }

    const getProjectMyUser = async () => {
      try {
        const response = await apiProjects.getMyProject(user.userId);
        if (response?.payload) {
          setProjects(response.payload);
        } else {
          setProjects([]); // Đặt rỗng nếu không có payload
          console.log("Không có dữ liệu dự án trong phản hồi API.");
        }
      } catch (err) {
        console.error("Lỗi fetch dự án:", err);
        setProjects([]); // Đặt rỗng nếu có lỗi
      }
    };
    getProjectMyUser();
  }, [user?.userId]); // Dependency array bao gồm user.userId

  const filteredProjects =
    Array.isArray(projects) &&
    projects.filter((project) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        (project.userId?.name?.toLowerCase()?.includes(search) ?? false) ||
        (project.organization?.toLowerCase()?.includes(search) ?? false) ||
        (project.additionalInfo?.toLowerCase()?.includes(search) ?? false) ||
        (project.description?.toLowerCase()?.includes(search) ?? false);

      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;
      const matchesType =
        typeFilter === "all" || project.projectType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

  return (
    <div className="space-y-6">
      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm dự án (người đăng ký, tổ chức, thông tin bổ sung)..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="pending">Chờ xác nhận</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Loại dự án" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              {/* Cập nhật các loại dự án theo yêu cầu của bạn */}
              <SelectItem value="rice">Lúa gạo</SelectItem>
              <SelectItem value="forest">Lâm nghiệp</SelectItem>
              <SelectItem value="biochar">Than sinh học</SelectItem>
              <SelectItem value="renewable">Năng lượng tái tạo</SelectItem>
              <SelectItem value="conservation">Bảo tồn</SelectItem>
              <SelectItem value="waste">Xử lý chất thải</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects list */}
      <div className="grid grid-cols-1 gap-6">
        {Array.isArray(filteredProjects) ? (
          filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Dự án {getProjectTypeText(project.projectType)} của{" "}
                    <span className="text-green-700">
                      {project.userId?.name ||
                        project.name ||
                        "Người đăng ký không rõ"}
                    </span>
                  </h3>
                  {/* Đảm bảo dữ liệu của bạn có trường 'status', nếu không, cung cấp một mặc định */}
                  {getStatusText(project.status)}
                </div>

                <p className="text-gray-600 mb-4">
                  **Tổ chức:** {project.organization}
                  <br />
                  **Thông tin bổ sung:** {project.additionalInfo}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Đăng ký: {formatDateUtil(project.createdAt)}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Filter className="h-4 w-4 mr-2" />
                    <span>Loại: {getProjectTypeText(project.projectType)}</span>
                  </div>
                  {project.carbonCredits && (
                    <div className="flex items-center text-gray-500">
                      <span className="font-medium text-green-600">
                        {project.carbonCredits.toLocaleString()} tấn CO₂
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                  <Link href={`/quan-ly/du-an/${project._id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      Xem chi tiết
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">
              Không tìm thấy dự án nào phù hợp với tiêu chí tìm kiếm.
            </p>
            <Button
              variant="link"
              className="mt-2 text-green-600"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setTypeFilter("all");
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
