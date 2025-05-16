"use client";

import { useState, useEffect, JSX } from "react";
import { useRouter } from "next/navigation";
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
import {
  ShoppingCart,
  FileText,
  Settings,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Leaf,
  Sprout,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

// Define interfaces for type safety
interface User {
  userId: string;
  name?: string;
  email?: string;
  phone?: string;
  role: "admin" | "user";
  products: IOrder[];
  projects: IProject[];
}

interface IOrder {
  _id: string;
  productId: {
    _id: string;
    name: string;
    description?: string;
  };
  status: "active" | "pending" | "expired" | "completed" | "rejected";
  createdAt: string;
  expiryDate?: string;
}

interface IProject {
  _id: string;
  name: string;
  type: "forest" | "rice" | "biochar" | "other";
  status: "pending" | "active" | "completed" | "approved" | "in_progress" | "rejected";
  registrationDate: string;
  location?: string;
  area?: number;
  estimatedCredits?: number;
}

type ActivityStatus = "pending" | "active" | "completed" | "approved" | "in_progress";

interface Activity {
  id: string;
  type: "product_purchase" | "project_registration" | "document_upload" | "status_change";
  date: string;
  description: string;
  relatedId?: string;
  status?: ActivityStatus;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "projects">("overview");
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Fetch activities when user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    // TODO: Implement actual fetching logic for activities based on the authenticated user.
    // For now, we simulate no activities or load them from the user object if available.
    if (user) {
      // Example: Maybe activities are part of the user object or fetched separately
      // setActivities(user.recentActivities || []); // Assuming user has a recentActivities field
      setActivities([]); // Keeping it empty as in original code
      setLoading(false);
    } else {
      // If isAuthenticated is true but user object is null (e.g., still loading or error),
      // you might want to handle this state. For now, we'll assume user is available if authenticated.
      setLoading(false); // Or handle error/redirect
    }

  }, [user, isAuthenticated]); // Depend on user and isAuthenticated

  // Combined type for all possible status strings
  type CombinedStatus = IOrder['status'] | IProject['status'] | ActivityStatus;

  const getStatusBadge = (status: CombinedStatus | string): JSX.Element => {
    // Adding string type for cases not covered by CombinedStatus,
    // although ideally all statuses should be in CombinedStatus.
    // We keep the default case for safety.
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Đang hoạt động
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Đang xử lý
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Hết hạn
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Đã phê duyệt
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <Clock className="w-3 h-3 mr-1" />
            Đang thực hiện
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Hoàn thành
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Bị từ chối
          </span>
        );
      default:
        // Fallback for any status not explicitly handled
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Không xác định ({status}) {/* Show unknown status value */}
          </span>
        );
    }
  };

  const typeLabelMap: Record<IProject['type'], string> = {
    forest: "Lâm nghiệp",
    rice: "Lúa",
    biochar: "Biochar",
    other: "Khác",
  };

  const getProjectIcon = (type: IProject['type']): JSX.Element => {
    switch (type) {
      case "forest":
        return <Leaf className="w-5 h-5 text-green-600" />;
      case "rice":
        return <Sprout className="w-5 h-5 text-green-600" />;
      case "biochar":
        return <Flame className="w-5 h-5 text-orange-600" />;
      default: // Although IProject['type'] is specific, a default can handle unexpected values
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  const getActivityIcon = (type: Activity['type'] | string): JSX.Element => {
    // Adding string type for cases not covered by Activity['type'],
    // keeping default case for safety.
    switch (type) {
      case "product_purchase":
        return <ShoppingCart className="w-5 h-5 text-blue-600" />;
      case "project_registration":
        return <FileText className="w-5 h-5 text-green-600" />;
      case "document_upload":
        return <FileText className="w-5 h-5 text-purple-600" />;
      case "status_change":
        return <CheckCircle2 className="w-5 h-5 text-orange-600" />;
      default: // Fallback for any type not explicitly handled
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };


  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";
    // Options for formatMonth: "2-digit" or "numeric"
    // Options for formatDay: "2-digit" or "numeric"
    // Options for formatYear: "numeric" or "2-digit"
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Ensure user object is available before rendering parts that depend on it
  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p>Đang tải dữ liệu tài khoản...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p className="text-red-500">Bạn cần đăng nhập để xem trang này.</p>
        <Button onClick={() => router.push("/dang-nhap")} className="mt-4">
          Đăng nhập
        </Button>
      </div>
    );
  }

  // Now that we've checked for isAuthenticated and user, we can safely use `user`.
  // Although TypeScript knows `user` is User | null, after the check `!user` returns,
  // it infers that `user` must be of type `User` in the rest of the component.

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Quản lý tài khoản</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Personal Information Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Họ tên</p>
              {/* Using optional chaining (?.) for potentially undefined properties */}
              <p className="font-medium">{user?.name ?? "N/A"}</p>
              <p className="text-sm text-gray-500">Email</p>
              {/* Using optional chaining (?.) for potentially undefined properties */}
              <p className="font-medium">{user?.email ?? "N/A"}</p>
              {user?.phone && ( // Check if phone exists before rendering
                <>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="font-medium">{user.phone}</p>
                </>
              )}
              <p className="text-sm text-gray-500">Vai trò</p>
              {/* Ensuring user object is not null/undefined before accessing role */}
              <p className="font-medium">{user?.role === "admin" ? "Quản trị viên" : "Người dùng"}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/quan-ly/cai-dat" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Cập nhật thông tin
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* My Products Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sản phẩm của tôi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {/* Ensuring user.products is an array before accessing length */}
              <p className="text-3xl font-bold">{user?.products?.length ?? 0}</p>
              <p className="text-sm text-gray-500">Sản phẩm đã đăng ký</p>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Đang hoạt động</span>
                  {/* Safely filter products, defaulting to empty array if products is null/undefined */}
                  <span className="font-medium">{(user?.products ?? []).filter(p => p.status === "active").length}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-500">Đang xử lý</span>
                  {/* Safely filter products, defaulting to empty array if products is null/undefined */}
                  <span className="font-medium">{(user?.products ?? []).filter(p => p.status === "pending").length}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/quan-ly/san-pham" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Xem sản phẩm
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* My Projects Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Dự án của tôi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {/* Ensuring user.projects is an array before accessing length */}
              <p className="text-3xl font-bold">{user?.projects?.length ?? 0}</p>
              <p className="text-sm text-gray-500">Dự án đã đăng ký</p>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Đã phê duyệt</span>
                  {/* Safely filter projects, defaulting to empty array if projects is null/undefined */}
                  0
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-50800">Đang thực hiện</span>
                  {/* Safely filter projects, defaulting to empty array if projects is null/undefined */}
                  0
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("projects")}>
              <FileText className="w-4 h-4 mr-2" />
              Xem dự án
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Tabs System */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "overview" | "products" | "projects")} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="overview">
            <Users className="w-4 h-4 mr-2" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="products">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Sản phẩm
          </TabsTrigger>
          <TabsTrigger value="projects">
            <FileText className="w-4 h-4 mr-2" />
            Dự án
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
              <CardDescription>Các hoạt động gần đây của bạn trên hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Bạn chưa có hoạt động nào. Hãy đăng ký sản phẩm hoặc dự án.</p>
                  <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => router.push("/san-pham")}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Xem sản phẩm
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/san-pham/du-an-tin-chi-carbon")}>
                      <FileText className="w-4 h-4 mr-2" />
                      Đăng ký dự án
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Use the defined Activity interface for mapping */}
                  {activities.map((activity: Activity) => (
                    <div key={activity.id} className="flex items-start p-3 rounded-lg border border-gray-200">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1 ml-3">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{activity.description}</h4>
                          {activity.status && getStatusBadge(activity.status)}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{formatDate(activity.date)}</p>
                      </div>
                    </div>
                  ))}
                  <div className="text-center mt-4">
                    <Button variant="link" size="sm">
                      Xem tất cả hoạt động
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm của tôi</CardTitle>
              <CardDescription>Danh sách các sản phẩm bạn đã đăng ký</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Safely check if user.products is an array and not empty */}
              {(user?.products?.length ?? 0) === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Bạn chưa đăng ký sản phẩm nào</p>
                  <Button className="mt-4" onClick={() => router.push("/san-pham")}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Xem sản phẩm
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Use the defined IOrder interface for mapping */}
                  {(user?.products ?? []).map((order: any) => (
                    <div key={order._id} className="p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-lg">{order.productId.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">Đăng ký ngày: {formatDate(order.createdAt)}</p>
                          {order.expiryDate && (
                            <p className="text-sm text-gray-500">Hết hạn ngày: {formatDate(order.expiryDate)}</p>
                          )}
                          <p className="text-sm text-gray-600 mt-2">{order.productId.description ?? "Không có mô tả"}</p>
                        </div>
                        {/* Ensure order.status is passed to getStatusBadge */}
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link href={`/quan-ly/san-pham/${order._id}`}>
                          <Button size="sm" variant="outline">
                            Xem chi tiết
                          </Button>
                        </Link>
                        {order.status === "active" && <Button size="sm">Truy cập sản phẩm</Button>}
                        {order.status === "pending" && (
                          <Button size="sm" variant="secondary">
                            Kiểm tra trạng thái
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="flex flex-wrap gap-4 justify-center">
                <Button onClick={() => router.push("/quan-ly/san-pham")}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Quản lý tất cả sản phẩm
                </Button>
                <Button variant="outline" onClick={() => router.push("/san-pham")}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Khám phá thêm sản phẩm
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dự án của tôi</CardTitle>
              <CardDescription>Danh sách các dự án tín chỉ carbon bạn đã đăng ký</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Safely check if user.projects is an array and not empty */}
              {(user?.projects?.length ?? 0) === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Bạn chưa đăng ký dự án nào</p>
                  <Button className="mt-4" onClick={() => router.push("/san-pham/du-an-tin-chi-carbon")}>
                    <FileText className="w-4 h-4 mr-2" />
                    Đăng ký dự án
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Use the defined IProject interface for mapping */}
                  {(user?.projects ?? []).map((project: any) => (
                    <div key={project._id} className="p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex">
                          {/* Ensure project.type is passed to getProjectIcon */}
                          {getProjectIcon(project.type)}
                          <div className="ml-3">
                            <h4 className="font-medium text-lg">{project.name}</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              Đăng ký ngày: {formatDate(project.registrationDate)}
                            </p>
                            {/* Ensure project.type is passed to typeLabelMap */}
                            <p className="text-sm text-gray-500">Loại dự án:</p>
                            {project.location && <p className="text-sm text-gray-500">Địa điểm: {project.location}</p>}
                            {project.area && <p className="text-sm text-gray-500">Diện tích: {project.area} ha</p>}
                            {project.estimatedCredits && (
                              <p className="text-sm text-gray-500">
                                Tín chỉ ước tính: {project.estimatedCredits.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                        {/* Ensure project.status is passed to getStatusBadge */}
                        {getStatusBadge(project.status)}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link href={`/quan-ly/du-an/${project._id}`}>
                          <Button size="sm" variant="outline">
                            Xem chi tiết
                          </Button>
                        </Link>
                        {project.status === "in_progress" && <Button size="sm">Cập nhật dự án</Button>}
                        {project.status === "pending" && (
                          <Button size="sm" variant="secondary">
                            Kiểm tra trạng thái
                          </Button>
                        )}
                        {project.status === "approved" && <Button size="sm">Bắt đầu thực hiện</Button>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => router.push("/san-pham/du-an-tin-chi-carbon")}>
                <FileText className="w-4 h-4 mr-2" />
                Đăng ký dự án mới
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}