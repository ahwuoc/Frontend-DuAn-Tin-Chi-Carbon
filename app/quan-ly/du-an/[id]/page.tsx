"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/context/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  MapPin,
  Calendar,
  Clock,
  FileText,
  BarChart3,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { apiProjects, IProject } from "@/app/fetch/fetch.projects";
const StatusBadge: React.FC<{
  status: string;
  language: "vi" | "en";
}> = ({ status, language }) => {
  const badgeStyles = {
    active: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    completed: "bg-green-100 text-green-800 hover:bg-green-100",
  };
  const badgeLabels = {
    active: language === "vi" ? "Đang thực hiện" : "Active",
    pending: language === "vi" ? "Đang xử lý" : "Pending",
    completed: language === "vi" ? "Hoàn thành" : "Completed",
  };
  return (
    <Badge
      className={
        badgeStyles[status as keyof typeof badgeStyles] ||
        "bg-gray-100 text-gray-800 hover:bg-gray-100"
      }
    >
      <Clock className="w-3 h-3 mr-1" />
      {badgeLabels[status as keyof typeof badgeLabels] || status}
    </Badge>
  );
};

// Component con để hiển thị icon dự án
const ProjectIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "forestry":
      return <Leaf className="w-6 h-6 text-green-600" />;
    case "renewable":
      return <FileText className="w-6 h-6 text-blue-600" />;
    case "conservation":
      return <FileText className="w-6 h-6 text-yellow-600" />;
    case "waste":
      return <FileText className="w-6 h-6 text-purple-600" />;
    default:
      return <FileText className="w-6 h-6 text-blue-600" />;
  }
};

// Component chính
export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const formatDate = useCallback(
    (dateString: Date) => {
      const date = new Date(dateString);
      return language === "vi"
        ? date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
    },
    [language],
  );
  const fetchProject = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await apiProjects.getProject(id);
      if (response.status === 200) {
        setProject(response.data as IProject);
      } else {
        setProject(null);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      setProject(null);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string);
    }
  }, [params.id, router, fetchProject]);
  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  if (!project) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">
          {language === "vi" ? "Không tìm thấy dự án" : "Project Not Found"}
        </h2>
        <p className="text-gray-500 mb-6">
          {language === "vi"
            ? "Dự án bạn đang tìm kiếm không tồn tại hoặc bạn không có quyền truy cập."
            : "The project you are looking for does not exist or you do not have access."}
        </p>
        <Button onClick={() => router.push("/quan-ly")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === "vi" ? "Quay lại trang quản lý" : "Back to Dashboard"}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <Link
          href="/quan-ly"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {language === "vi" ? "Quay lại trang quản lý" : "Back to Dashboard"}
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center">
          <ProjectIcon type={project.type} />
          <div className="ml-3">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-gray-500">
              {language === "vi" ? "Đăng ký ngày: " : "Registered on: "}
              {formatDate(project.registrationDate)}
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <StatusBadge status={project.status} language={language} />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="overview">
            <BarChart3 className="w-4 h-4 mr-2" />
            {language === "vi" ? "Tổng quan" : "Overview"}
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="w-4 h-4 mr-2" />
            {language === "vi" ? "Tài liệu" : "Documents"}
          </TabsTrigger>
          <TabsTrigger value="activities">
            <Clock className="w-4 h-4 mr-2" />
            {language === "vi" ? "Hoạt động" : "Activities"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "vi" ? "Thông tin dự án" : "Project Information"}
              </CardTitle>
              <CardDescription>
                {language === "vi"
                  ? "Chi tiết về dự án tín chỉ carbon"
                  : "Details about the carbon credit project"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {language === "vi" ? "Loại dự án" : "Project Type"}
                  </h3>
                  <p className="font-medium">
                    {project.type === "forestry"
                      ? language === "vi"
                        ? "Lâm nghiệp"
                        : "Forestry"
                      : project.type}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {language === "vi" ? "Địa điểm" : "Location"}
                  </h3>
                  <p className="font-medium flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                    {project.location}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {language === "vi" ? "Diện tích" : "Area"}
                  </h3>
                  <p className="font-medium">{project.area} ha</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {language === "vi"
                      ? "Thời gian thực hiện"
                      : "Implementation Period"}
                  </h3>
                  <p className="font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    {formatDate(project.startDate)} -{" "}
                    {formatDate(project.endDate)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {language === "vi" ? "Tín chỉ carbon" : "Carbon Credits"}
                  </h3>
                  <p className="font-medium">
                    {project.carbonCreditsTotal.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {language === "vi" ? "Số người tham gia" : "Participants"}
                  </h3>
                  <p className="font-medium">{project.participants}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  {language === "vi" ? "Mô tả dự án" : "Project Description"}
                </h3>
                <p className="text-gray-700">{project.description}</p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button>
                {language === "vi"
                  ? "Cập nhật thông tin"
                  : "Update Information"}
              </Button>
              <Button variant="outline">
                {language === "vi" ? "Tải xuống báo cáo" : "Download Report"}
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "vi" ? "Tiến độ dự án" : "Project Progress"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        {language === "vi"
                          ? "Tiến độ tổng"
                          : "Overall Progress"}
                      </span>
                      <span className="text-sm font-medium">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "vi" ? "Tài liệu dự án" : "Project Documents"}
              </CardTitle>
              <CardDescription>
                {language === "vi"
                  ? "Các tài liệu đã tải lên liên quan đến dự án"
                  : "Uploaded documents related to the project"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {document?.documents &&
                  project.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-start p-3 rounded-lg border border-gray-200"
                    >
                      <FileText className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{doc.name}</h4>
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                            {doc.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {language === "vi"
                            ? "Tải lên ngày: "
                            : "Uploaded on: "}
                          {formatDate(doc.date)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                {language === "vi"
                  ? "Tải lên tài liệu mới"
                  : "Upload New Document"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "vi" ? "Lịch sử hoạt động" : "Activity History"}
              </CardTitle>
              <CardDescription>
                {language === "vi"
                  ? "Các hoạt động gần đây liên quan đến dự án"
                  : "Recent activities related to the project"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  {project.activities.map((activity, index) => (
                    <div key={index} className="ml-10 relative">
                      <div className="absolute -left-10 mt-1.5 w-5 h-5 rounded-full bg-green-100 border-2 border-green-600 flex items-center justify-center">
                        <Clock className="w-3 h-3 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(activity.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
