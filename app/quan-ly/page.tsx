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

// Chỉ cần import các kiểu dữ liệu IProject và IOrder để sử dụng trong component
import { IProject } from "../fetch/fetch.projects";
import { IOrder } from "../fetch/fetch.order";

// Không cần import apiProjects, apiOrders, TUser, Activity, useSearchParams ở đây nữa
// import { apiProjects, IProject } from "../fetch/fetch.projects";
// import { apiOrders, IOrder } from "../fetch/fetch.order";
// import { TUser } from "../fetch/fetch.auth";
// import { useSearchParams } from "next/navigation";

// Định nghĩa kiểu dữ liệu cho Hoạt động (Activities) nếu bạn vẫn quản lý cục bộ
// Nếu Activities cũng được thêm vào AuthContext, bạn có thể xóa định nghĩa này
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


// Sử dụng useAuth để lấy thông tin user và dữ liệu từ context
import { useAuth } from "../../context/auth-context";


export default function DashboardPage() {
  const router = useRouter(); // Hook để điều hướng
  const [activeTab, setActiveTab] = useState("overview"); // State quản lý tab đang hoạt động

  // Lấy user, isAuthenticated, và dữ liệu sản phẩm/dự án trực tiếp từ AuthContext
  // User object từ context giờ đây đã bao gồm projects và products (orders)
  const { user, isAuthenticated } = useAuth();

  // State cho danh sách hoạt động vẫn giữ cục bộ vì chưa được thêm vào AuthContext
  // Nếu bạn muốn quản lý Activities trong Context, cần sửa đổi AuthProvider
  const [activities, setActivities] = useState<Activity[]>([]);

  // State loading và error cục bộ có thể được đơn giản hóa
  // Chúng ta sẽ dựa vào sự tồn tại của user từ context để xác định trạng thái loading
  const [loading, setLoading] = useState(true);
  // Loại bỏ state error cục bộ vì lỗi fetch data chính được xử lý trong Context
  // const [error, setError] = useState<string | null>(null);

  // Loại bỏ useSearchParams và token logic ở đây, vì AuthProvider đã xử lý
  // const searchParams = useSearchParams();
  // const token = searchParams.get("token");
  // const { setUserFromToken, user } = useAuth(); // Gọi useAuth ở ngoài useEffect

  // Sử dụng useEffect để cập nhật trạng thái loading dựa trên trạng thái user từ context
  useEffect(() => {
    // Nếu user đã tồn tại, component đã tải xong dữ liệu cần thiết từ context
    if (user) {
      setLoading(false);
    } else {
      // Nếu user là null, có thể là đang tải hoặc chưa xác thực
      // Giữ loading true nếu isAuthenticated vẫn là true (context đang trong quá trình tải user)
      // Nếu isAuthenticated là false, user không đăng nhập -> không còn loading dữ liệu user
      setLoading(isAuthenticated);
      // Có thể thêm logic chuyển hướng nếu !isAuthenticated
      // if (!isAuthenticated && !loading) {
      //    router.push('/dang-nhap');
      // }
    }
  }, [user, isAuthenticated]); // Effect chạy lại khi user hoặc isAuthenticated thay đổi


  // Loại bỏ hoàn toàn useEffect fetch dữ liệu sản phẩm và dự án cục bộ
  /*
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      // ... logic fetch cũ đã bị loại bỏ
    };
    fetchData();
  }, [user?.userId, token]); // Loại bỏ token và user?.userId khỏi dependency nếu không còn fetch ở đây
  */

  // Lấy danh sách đơn hàng và dự án trực tiếp từ user object trong context
  // Sử dụng optional chaining (?.) và giá trị mặc định [] để an toàn
  const orders = user?.products || []; // user.products chứa danh sách đơn hàng từ AuthContext
  const userProjects = user?.projects || []; // user.projects chứa danh sách dự án từ AuthContext


  // Các hàm trợ giúp (getStatusBadge, getProjectIcon, getActivityIcon, formatDate)
  // vẫn giữ nguyên vì chúng chỉ dùng để định dạng dữ liệu để hiển thị.

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
            {status} {/* Hiển thị trạng thái mặc định nếu không khớp */}
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
        return <FileText className="w-5 h-5 text-blue-600" />; // Icon mặc định
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
        return <Clock className="w-5 h-5 text-gray-600" />; // Icon mặc định
    }
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A"; // Xử lý trường hợp ngày tháng không tồn tại
    const date = new Date(dateString);
    // Kiểm tra nếu ngày tháng không hợp lệ
    if (isNaN(date.getTime())) {
      return "Ngày không hợp lệ";
    }
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };


  // Hiển thị trạng thái loading dựa trên state cục bộ (kết nối với context)
  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        {/* Thông báo loading có thể chi tiết hơn nếu AuthProvider cung cấp trạng thái loading riêng cho data */}
        <p>Đang tải dữ liệu tài khoản...</p>
      </div>
    );
  }

  // Nếu không loading và user là null, có nghĩa là chưa đăng nhập
  if (!user) {
    // Có thể chuyển hướng đến trang đăng nhập hoặc hiển thị thông báo yêu cầu đăng nhập
    // Ví dụ: router.push('/dang-nhap');
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p className="text-red-500">Bạn cần đăng nhập để xem trang này.</p>
        <Button onClick={() => router.push('/dang-nhap')} className="mt-4">
          Đăng nhập
        </Button>
      </div>
    );
  }

  // Loại bỏ check error cục bộ vì lỗi fetch data chính được xử lý trong Context
  // if (error) { ... }


  // Render giao diện dashboard khi user và dữ liệu đã sẵn sàng
  return (
    <div className="flex min-h-screen">
      {/* Phần nội dung chính */}
      <div className="flex-1 p-4">
        <h1 className="text-3xl font-bold mb-6">Quản lý tài khoản</h1>

        {/* Các thẻ tóm tắt thông tin */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Thẻ Thông tin cá nhân */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Họ tên</p>
                {/* Access user info from context */}
                <p className="font-medium">{user?.name || "N/A"}</p>
                <p className="text-sm text-gray-500">Email</p>
                {/* Access user info from context */}
                <p className="font-medium">{user?.email || "N/A"}</p>
                {/* Access user info from context */}
                {user?.phone && (
                  <>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium">{user.phone}</p>
                  </>
                )}
                <p className="text-sm text-gray-500">Vai trò</p>
                {/* Access user info from context */}
                <p className="font-medium">
                  {user?.role === "admin" ? "Quản trị viên" : "Người dùng"}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              {/* Link đến trang cài đặt */}
              <Link href="/quan-ly/cai-dat" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Cập nhật thông tin
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Thẻ Sản phẩm của tôi */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Sản phẩm của tôi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {/* Use orders from context (user.products) */}
                <p className="text-3xl font-bold">{orders.length}</p>
                <p className="text-sm text-gray-500">Sản phẩm đã đăng ký</p>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Đang hoạt động</span>
                    {/* Use orders from context */}
                    <span className="font-medium">
                      {orders.filter((p) => p.status === "active").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-500">Đang xử lý</span>
                    {/* Use orders from context */}
                    <span className="font-medium">
                      {orders.filter((p) => p.status === "pending").length}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {/* Link đến trang quản lý sản phẩm */}
              <Link href="/quan-ly/san-pham" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Xem sản phẩm
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Thẻ Dự án của tôi */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Dự án của tôi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {/* Use userProjects from context (user.projects) */}
                <p className="text-3xl font-bold">{userProjects.length ?? 0}</p>
                <p className="text-sm text-gray-500">Dự án đã đăng ký</p>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Đã phê duyệt</span>
                    {/* Use userProjects from context */}
                    <span className="font-medium">
                      {Array.isArray(userProjects)
                        ? userProjects.filter((p) => p.status === "approved")
                          .length
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-500">Đang thực hiện</span>
                    {/* Use userProjects from context */}
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
              {/* Button chuyển tab sang "Dự án" */}
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

        {/* Hệ thống Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Danh sách các Tab */}
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

          {/* Nội dung của tab "Tổng quan" */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
                <CardDescription>
                  Các hoạt động gần đây của bạn trên hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Hiển thị thông báo nếu không có hoạt động (activities state is still local) */}
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
                  // Hiển thị danh sách hoạt động
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      // Assuming activity has an 'id' property
                      <div
                        key={activity.id || Math.random()} // Use a fallback key if id is missing
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
                            {formatDate(activity.date as unknown as Date)}
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

          {/* Nội dung của tab "Sản phẩm" */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm của tôi</CardTitle>
                <CardDescription>
                  Danh sách các sản phẩm bạn đã đăng ký
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Use orders from context */}
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
                  // Hiển thị danh sách đơn hàng từ context
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

          {/* Nội dung của tab "Dự án" */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dự án của tôi</CardTitle>
                <CardDescription>
                  Danh sách các dự án tín chỉ carbon bạn đã đăng ký
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Use userProjects from context */}
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
                  // Hiển thị danh sách dự án từ context
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