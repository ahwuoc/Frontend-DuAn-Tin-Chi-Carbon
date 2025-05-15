"use client";

import { useState, useEffect } from "react";
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
  FileSpreadsheet,
  Leaf,
  Sprout,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { apiProjects, IProject } from "../fetch/fetch.projects";
import { apiOrders, IOrder } from "../fetch/fetch.order";
import { TUser } from "../fetch/fetch.auth";

interface Activity {
  id: string;
  type:
  | "product_purchase"
  | "project_registration"
  | "document_upload"
  | "status_change";
  date: string;
  description: string;
  relatedId?: string;
  status?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [user, setUser] = useState<TUser | null>(null);
  const [userProjects, setUserProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };
  useEffect(() => {
    const fetchData = async () => {
      const userGetcookie = () => {
        const userCookie = getCookie("user");
        if (userCookie) {
          try {
            const user = JSON.parse(decodeURIComponent(userCookie));
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("user_id", JSON.stringify(user._id));
            return user;
          } catch (err) {
            console.error("❌ Failed to parse user cookie:", err);
          }
        } else {
          console.warn("⚠️ No user cookie found");
        }
      }
      userGetcookie()
      setLoading(true);
      setError(null);
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          throw new Error("Không tìm thấy thông tin người dùng.");
        }
        const userId =
          JSON.parse(localStorage.getItem("user_id") || '""') ?? "";
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
        const projectRes = await apiProjects.getMyProject(userId);
        if (projectRes?.data) {
          setUserProjects(projectRes.data.projects);
        }
        const orderRes = await apiOrders.getInfoOrderByUserId(userId);
        if (orderRes?.data) {
          setOrders(orderRes.data.orders);
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
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
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getProjectIcon = (type: string) => {
    switch (type) {
      case "forest":
        return <Leaf className="w-5 h-5 text-green-600" />;
      case "rice":
        return <Sprout className="w-5 h-5 text-green-600" />;
      case "biochar":
        return <Flame className="w-5 h-5 text-orange-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "product_purchase":
        return <ShoppingCart className="w-5 h-5 text-blue-600" />;
      case "project_registration":
        return <FileText className="w-5 h-5 text-green-600" />;
      case "document_upload":
        return <FileSpreadsheet className="w-5 h-5 text-purple-600" />;
      case "status_change":
        return <CheckCircle2 className="w-5 h-5 text-orange-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-4">
        <h1 className="text-3xl font-bold mb-6">Quản lý tài khoản</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Họ tên</p>
                <p className="font-medium">{user?.name || "N/A"}</p>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user?.email || "N/A"}</p>
                {user?.phone && (
                  <>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium">{user.phone}</p>
                  </>
                )}
                <p className="text-sm text-gray-500">Vai trò</p>
                <p className="font-medium">
                  {user?.role === "admin" ? "Quản trị viên" : "Người dùng"}
                </p>
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

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Sản phẩm của tôi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-3xl font-bold">{orders.length}</p>
                <p className="text-sm text-gray-500">Sản phẩm đã đăng ký</p>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Đang hoạt động</span>
                    <span className="font-medium">
                      {orders.filter((p) => p.status === "active").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-500">Đang xử lý</span>
                    <span className="font-medium">
                      {orders.filter((p) => p.status === "pending").length}
                    </span>
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

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Dự án của tôi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-3xl font-bold">{userProjects.length ?? 0}</p>
                <p className="text-sm text-gray-500">Dự án đã đăng ký</p>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Đã phê duyệt</span>
                    <span className="font-medium">
                      {Array.isArray(userProjects)
                        ? userProjects.filter((p) => p.status === "approved")
                          .length
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-500">Đang thực hiện</span>
                    <span className="font-medium">
                      {Array.isArray(userProjects)
                        ? userProjects.filter((p) => p.status === "in_progress")
                          .length
                        : 0}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
                <CardDescription>
                  Các hoạt động gần đây của bạn trên hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activities.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      Bạn chưa có hoạt động nào. Hãy đăng ký sản phẩm hoặc dự
                      án.
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
                    {activities.map((activity) => (
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
                            {formatDate(activity.date)}
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

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm của tôi</CardTitle>
                <CardDescription>
                  Danh sách các sản phẩm bạn đã đăng ký
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      Bạn chưa đăng ký sản phẩm nào
                    </p>
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
                    {orders.map((order: IOrder) => (
                      <div
                        key={order._id}
                        className="p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-lg">
                              {order.productId?.name || "N/A"}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              Đăng ký ngày: {formatDate(order.createdAt)}
                            </p>
                            {order.expiryDate && (
                              <p className="text-sm text-gray-500">
                                Hết hạn ngày: {formatDate(order.expiryDate)}
                              </p>
                            )}
                            <p className="text-sm text-gray-600 mt-2">
                              {order.productId?.description || "Không có mô tả"}
                            </p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Link href={`/quan-ly/san-pham/${order._id}`}>
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
                    {Array.isArray(userProjects) &&
                      userProjects.map((project) => (
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
                                  {formatDate(project.registrationDate)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Loại dự án:{" "}
                                  {project.type === "forest"
                                    ? "Lâm nghiệp"
                                    : project.type === "rice"
                                      ? "Lúa"
                                      : project.type === "biochar"
                                        ? "Biochar"
                                        : "Khác"}
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
    </div>
  );
}
