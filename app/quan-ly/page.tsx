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
import { useLanguage } from "@/context/language-context"; // Import useLanguage hook
import dashboardPageTranslations from "./language-quanly";

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
  const { language } = useLanguage(); // Lấy ngôn ngữ hiện tại
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
              description: `${dashboardPageTranslations.myProductsCard.title[language]}: "${order.productId.name}"`, // Dịch mô tả hoạt động
              relatedId: order.productId._id,
              status: order.status,
            });
          });
          (response.payload.projects || []).forEach((project: IProject) => {
            fetchedActivities.push({
              id: project._id, // Use project._id as activity id
              type: "project_registration",
              date: project.registrationDate,
              description: `${dashboardPageTranslations.myProjectsCard.title[language]}: "${project.name}"`, // Dịch mô tả hoạt động
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
  }, [isAuthenticated, user?.userId, language]); // Dependency: isAuthenticated, user.userId, và language

  type CombinedStatus = IOrder["status"] | IProject["status"] | ActivityStatus;

  const getStatusBadge = (status: CombinedStatus | string): JSX.Element => {
    const statusText =
      dashboardPageTranslations.statusBadges[
        status as keyof typeof dashboardPageTranslations.statusBadges
      ]?.[language] ||
      `${dashboardPageTranslations.statusBadges.unknown[language]} (${status})`;

    let bgColorClass: string;
    let textColorClass: string;
    let Icon: typeof CheckCircle2 | typeof Clock | typeof AlertCircle =
      CheckCircle2;

    switch (status) {
      case "active":
      case "success":
      case "completed":
        bgColorClass = "bg-green-100";
        textColorClass = "text-green-800";
        Icon = CheckCircle2;
        break;
      case "pending":
        bgColorClass = "bg-yellow-100";
        textColorClass = "text-yellow-800";
        Icon = Clock;
        break;
      case "expired":
      case "rejected":
        bgColorClass = "bg-red-100";
        textColorClass = "text-red-800";
        Icon = AlertCircle;
        break;
      case "approved":
        bgColorClass = "bg-blue-100";
        textColorClass = "text-blue-800";
        Icon = CheckCircle2;
        break;
      case "in_progress":
        bgColorClass = "bg-indigo-100";
        textColorClass = "text-indigo-800";
        Icon = Clock;
        break;
      default:
        bgColorClass = "bg-gray-100";
        textColorClass = "text-gray-800";
        Icon = AlertCircle; // Default icon for unknown status
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColorClass} ${textColorClass}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {statusText}
      </span>
    );
  };

  const typeLabelMap: Record<IProject["type"], string> = {
    forestry: dashboardPageTranslations.projectTypes.forestry[language],
    rice: dashboardPageTranslations.projectTypes.rice[language],
    biochar: dashboardPageTranslations.projectTypes.biochar[language],
    other: dashboardPageTranslations.projectTypes.other[language],
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
        <p>{dashboardPageTranslations.loadingMessage[language]}</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p className="text-red-500">
          {dashboardPageTranslations.loginRequired.message[language]}
        </p>
        <Button onClick={() => router.push("/dang-nhap")} className="mt-4">
          {dashboardPageTranslations.loginRequired.button[language]}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">
        {dashboardPageTranslations.pageTitle[language]}
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Personal Information Card */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {dashboardPageTranslations.personalInfoCard.title[language]}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                {
                  dashboardPageTranslations.personalInfoCard.labels.name[
                    language
                  ]
                }
              </p>
              <p className="font-medium break-words">{user?.name ?? "N/A"}</p>
              <p className="text-sm text-gray-500">
                {
                  dashboardPageTranslations.personalInfoCard.labels.email[
                    language
                  ]
                }
              </p>
              <p className="font-medium break-words">{user?.email ?? "N/A"}</p>
              {user?.phone && (
                <>
                  <p className="text-sm text-gray-500">
                    {
                      dashboardPageTranslations.personalInfoCard.labels.phone[
                        language
                      ]
                    }
                  </p>
                  <p className="font-medium break-words">{user.phone}</p>
                </>
              )}
              <p className="text-sm text-gray-500">
                {
                  dashboardPageTranslations.personalInfoCard.labels.role[
                    language
                  ]
                }
              </p>
              <p className="font-medium break-words">
                {user?.role === "admin"
                  ? dashboardPageTranslations.personalInfoCard.roles.admin[
                      language
                    ]
                  : dashboardPageTranslations.personalInfoCard.roles.user[
                      language
                    ]}
              </p>
            </div>
          </CardContent>
          <CardFooter className="mt-auto">
            <Link href="/quan-ly/cai-dat" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                {
                  dashboardPageTranslations.personalInfoCard.updateButton[
                    language
                  ]
                }
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* My Products Card */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {dashboardPageTranslations.myProductsCard.title[language]}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-1">
              <p className="text-3xl font-bold">{userOrders.length}</p>
              <p className="text-sm text-gray-500">
                {
                  dashboardPageTranslations.myProductsCard.registeredCount[
                    language
                  ]
                }
              </p>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    {
                      dashboardPageTranslations.myProductsCard.activeStatus[
                        language
                      ]
                    }
                  </span>
                  <span className="font-medium">
                    {userOrders.filter((p) => p.status === "active").length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-500">
                    {
                      dashboardPageTranslations.myProductsCard.pendingStatus[
                        language
                      ]
                    }
                  </span>
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
                {
                  dashboardPageTranslations.myProductsCard.viewProductsButton[
                    language
                  ]
                }
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* My Projects Card */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {dashboardPageTranslations.myProjectsCard.title[language]}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-1">
              <p className="text-3xl font-bold">{userProjects.length}</p>
              <p className="text-sm text-gray-500">
                {
                  dashboardPageTranslations.myProjectsCard.registeredCount[
                    language
                  ]
                }
              </p>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    {
                      dashboardPageTranslations.myProjectsCard.approvedStatus[
                        language
                      ]
                    }
                  </span>
                  <span className="font-medium">
                    {userProjects.filter((p) => p.status === "approved").length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-500">
                    {
                      dashboardPageTranslations.myProjectsCard.inProgressStatus[
                        language
                      ]
                    }
                  </span>
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
              {
                dashboardPageTranslations.myProjectsCard.viewProjectsButton[
                  language
                ]
              }
            </Button>
          </CardFooter>
        </Card>
      </div>
      {/* Tabs System */}
    </div>
  );
}
