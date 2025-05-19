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
import { formatDateUtil } from "../utils/common";
import { getUserFromLocalStorage } from "../utils/common"; // Giữ lại nếu cần cho user context
import apiAuth from "../fetch/fetch.auth"; // Giữ lại nếu bạn thực sự dùng apiAuth để fetch user info

// Định nghĩa lại các interface dựa trên dữ liệu API mới
interface IOrder {
  _id: string;
  productId: {
    _id: string;
    name: string;
    description?: string; // description nằm trong productId
  };
  status: "success" | "pending" | "expired" | "completed" | "rejected"; // Cập nhật status types
  createdAt: string;
  expiredAt?: string; // Đổi từ expiryDate sang expiredAt
}

interface IProject {
  _id: string;
  name: string;
  type: "forestry" | "rice" | "biochar" | "other"; // Cập nhật type từ API
  status:
    | "pending"
    | "active"
    | "completed"
    | "approved"
    | "in_progress"
    | "rejected";
  registrationDate: string;
  location?: string;
  area?: number;
  estimatedCredits?: number; // đổi từ carbonCreditsTotal thành estimatedCredits
  documents?: any[]; // Thêm documents để lấy activities từ project
  activities?: ProjectActivity[]; // Đảm bảo có activities trong Project
}

type ActivityStatus =
  | "pending"
  | "active"
  | "completed"
  | "approved"
  | "in_progress"
  | "success" // Thêm status 'success' cho activity
  | "rejected"
  | "expired"; // Thêm status 'expired' cho activity

// Để phù hợp với dữ liệu activity trong projects
interface ProjectActivity {
  _id: string;
  date: string;
  description: string;
  title?: string; // Có thể có title trong activity
}

interface Activity {
  id: string; // Hoặc _id
  type:
    | "product_purchase"
    | "project_registration"
    | "document_upload"
    | "status_change"
    | string; // Thêm string để bao gồm các loại activity khác nếu có
  date: string;
  description: string;
  relatedId?: string;
  status?: ActivityStatus;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, setUser } = useAuth(); // Thêm setUser nếu muốn cập nhật user object
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "projects"
  >("overview");
  const [loading, setLoading] = useState(true);
  const [userOrders, setUserOrders] = useState<IOrder[]>([]); // State riêng cho orders
  const [userProjects, setUserProjects] = useState<IProject[]>([]); // State riêng cho projects
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]); // State riêng cho activities

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);
      if (!isAuthenticated || !user?.userId) {
        // Check user.userId thay vì chỉ user
        setLoading(false);
        return;
      }
      try {
        const userId = user.userId; // Lấy userId từ user context
        const response = await apiAuth.getInforManager(userId); // Giả sử API này trả về orders và projects

        if (response && response.payload) {
          // Đảm bảo có payload
          setUserOrders(response.payload.orders || []);
          setUserProjects(response.payload.projects || []); // Sửa lỗi response..payload.projects thành response.payload.projects

          const fetchedActivities: Activity[] = [];

          // Activities từ orders
          (response.payload.orders || []).forEach((order: IOrder) => {
            fetchedActivities.push({
              id: order._id, // Use order._id as activity id
              type: "product_purchase",
              date: order.createdAt,
              description: `Đã mua sản phẩm "${order.productId.name}"`,
              relatedId: order.productId._id,
              status: order.status,
            });
          });
          (response.payload.projects || []).forEach((project: IProject) => {
            fetchedActivities.push({
              id: project._id, // Use project._id as activity id
              type: "project_registration",
              date: project.registrationDate,
              description: `Đăng ký dự án "${project.name}"`,
              relatedId: project._id,
              status: project.status,
            });
            // Thêm các activity con từ mỗi project nếu có
            if (project.activities && project.activities.length > 0) {
              // Kiểm tra project.activities
              project.activities.forEach((projActivity: ProjectActivity) => {
                fetchedActivities.push({
                  id: projActivity._id,
                  type: "status_change", // Hoặc loại khác tùy thuộc vào nội dung
                  date: projActivity.date,
                  description: projActivity.description,
                  relatedId: project._id,
                  status: project.status, // Có thể dùng status của dự án cha
                });
              });
            }
          });

          // Sắp xếp hoạt động theo ngày mới nhất
          fetchedActivities.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );

          setRecentActivities(fetchedActivities);

          // Cập nhật lại user context nếu cần
          // Ví dụ nếu user context của bạn chỉ chứa thông tin cơ bản của user mà không phải orders/projects
          // thì bạn có thể set User products/projects ở đây:
          // setUser({ ...user, products: response.payload.orders, projects: response.payload.projects });
        }
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu người dùng:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [isAuthenticated, user?.userId]); // Dependency: isAuthenticated và user.userId

  type CombinedStatus = IOrder["status"] | IProject["status"] | ActivityStatus;

  const getStatusBadge = (status: CombinedStatus | string): JSX.Element => {
    switch (status) {
      case "active":
      case "success": // Thêm 'success' vào trạng thái tích cực
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
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Không xác định ({status})
          </span>
        );
    }
  };

  const typeLabelMap: Record<IProject["type"], string> = {
    forestry: "Lâm nghiệp",
    rice: "Lúa",
    biochar: "Biochar",
    other: "Khác",
  };

  const getProjectIcon = (type: IProject["type"]): JSX.Element => {
    switch (type) {
      case "forestry":
        return <Leaf className="w-5 h-5 text-green-600" />;
      case "rice":
        return <Sprout className="w-5 h-5 text-green-600" />;
      case "biochar":
        return <Flame className="w-5 h-5 text-orange-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  const getActivityIcon = (type: Activity["type"]): JSX.Element => {
    switch (type) {
      case "product_purchase":
        return <ShoppingCart className="w-5 h-5 text-blue-600" />;
      case "project_registration":
        return <FileText className="w-5 h-5 text-green-600" />;
      case "document_upload":
        return <FileText className="w-5 h-5 text-purple-600" />;
      case "status_change":
        return <CheckCircle2 className="w-5 h-5 text-orange-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

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

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Quản lý tài khoản</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Personal Information Card */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Họ tên</p>
              <p className="font-medium break-words">{user?.name ?? "N/A"}</p>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium break-words">{user?.email ?? "N/A"}</p>
              {user?.phone && (
                <>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="font-medium break-words">{user.phone}</p>
                </>
              )}
              <p className="text-sm text-gray-500">Vai trò</p>
              <p className="font-medium break-words">
                {user?.role === "admin" ? "Quản trị viên" : "Người dùng"}
              </p>
            </div>
          </CardContent>
          <CardFooter className="mt-auto">
            <Link href="/quan-ly/cai-dat" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Cập nhật thông tin
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* My Products Card */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sản phẩm của tôi</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-1">
              <p className="text-3xl font-bold">{userOrders.length}</p>
              <p className="text-sm text-gray-500">Sản phẩm đã đăng ký</p>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Đang hoạt động</span>
                  <span className="font-medium">
                    {userOrders.filter((p) => p.status === "active").length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-500">Đang xử lý</span>
                  <span className="font-medium">
                    {userOrders.filter((p) => p.status === "pending").length}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="mt-auto">
            <Link href="/quan-ly/san-pham" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Xem sản phẩm
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* My Projects Card */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Dự án của tôi</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-1">
              <p className="text-3xl font-bold">{userProjects.length}</p>
              <p className="text-sm text-gray-500">Dự án đã đăng ký</p>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Đã phê duyệt</span>
                  <span className="font-medium">
                    {userProjects.filter((p) => p.status === "approved").length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-500">Đang thực hiện</span>
                  <span className="font-medium">
                    {
                      userProjects.filter((p) => p.status === "in_progress")
                        .length
                    }
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setActiveTab("projects")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Xem dự án
            </Button>
          </CardFooter>
        </Card>
      </div>
      {/* Tabs System */}
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "overview" | "products" | "projects")
        }
        className="w-full"
      >
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
              <CardDescription>
                Các hoạt động gần đây của bạn trên hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Bạn chưa có hoạt động nào. Hãy đăng ký sản phẩm hoặc dự án.
                  </p>
                  <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => router.push("/san-pham")}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Xem sản phẩm
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push("/san-pham/du-an-tin-chi-carbon")
                      }
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Đăng ký dự án
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity: Activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start p-3 rounded-lg border border-gray-200"
                    >
                      {getActivityIcon(activity.type)}
                      <div className="flex-1 ml-3">
                        <div className="flex justify-between">
                          <h4 className="font-medium">
                            {activity.description}
                          </h4>
                          {activity.status && getStatusBadge(activity.status)}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDateUtil(activity.date)}
                        </p>
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
              <CardDescription>
                Danh sách các sản phẩm bạn đã đăng ký
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userOrders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Bạn chưa đăng ký sản phẩm nào</p>
                  <Button
                    className="mt-4"
                    onClick={() => router.push("/san-pham")}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Xem sản phẩm
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((order: IOrder) => (
                    <div
                      key={order._id}
                      className="p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-lg">
                            {order.productId.name}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Đăng ký ngày: {formatDateUtil(order.createdAt)}
                          </p>
                          {order.expiredAt && (
                            <p className="text-sm text-gray-500">
                              Hết hạn ngày: {formatDateUtil(order.expiredAt)}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mt-2">
                            {order.productId.description ?? "Không có mô tả"}
                          </p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link href={`/quan-ly/san-pham/${order.productId._id}`}>
                          <Button size="sm" variant="outline">
                            Xem chi tiết
                          </Button>
                        </Link>
                        {order.status === "active" && (
                          <Button size="sm">Truy cập sản phẩm</Button>
                        )}
                        {order.status === "pending" && (
                          <Button size="sm" variant="secondary">
                            Kiểm tra trạng thái
                          </Button>
                        )}
                        {order.status === "success" && (
                          <Button size="sm">Hoàn tất</Button>
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
                <Button
                  variant="outline"
                  onClick={() => router.push("/san-pham")}
                >
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
              <CardDescription>
                Danh sách các dự án tín chỉ carbon bạn đã đăng ký
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userProjects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Bạn chưa đăng ký dự án nào</p>
                  <Button
                    className="mt-4"
                    onClick={() =>
                      router.push("/san-pham/du-an-tin-chi-carbon")
                    }
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Đăng ký dự án
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userProjects.map((project: IProject) => (
                    <div
                      key={project._id}
                      className="p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex">
                          {getProjectIcon(project.type)}
                          <div className="ml-3">
                            <h4 className="font-medium text-lg">
                              {project.name}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              Đăng ký ngày:{" "}
                              {formatDateUtil(project.registrationDate)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Loại dự án: {typeLabelMap[project.type]}
                            </p>
                            {project.location && (
                              <p className="text-sm text-gray-500">
                                Địa điểm: {project.location}
                              </p>
                            )}
                            {project.area && (
                              <p className="text-sm text-gray-500">
                                Diện tích: {project.area} ha
                              </p>
                            )}
                            {project.estimatedCredits && (
                              <p className="text-sm text-gray-500">
                                Tín chỉ ước tính:{" "}
                                {project.estimatedCredits.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                        {getStatusBadge(project.status)}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link href={`/quan-ly/du-an/${project._id}`}>
                          <Button size="sm" variant="outline">
                            Xem chi tiết
                          </Button>
                        </Link>
                        {project.status === "in_progress" && (
                          <Button size="sm">Cập nhật dự án</Button>
                        )}
                        {project.status === "pending" && (
                          <Button size="sm" variant="secondary">
                            Kiểm tra trạng thái
                          </Button>
                        )}
                        {project.status === "approved" && (
                          <Button size="sm">Bắt đầu thực hiện</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                onClick={() => router.push("/san-pham/du-an-tin-chi-carbon")}
              >
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
