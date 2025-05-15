// AdminNewsPage.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { apiNews, INews } from "@/app/fetch/fetch.news";
import { useToast } from "@/hooks/use-toast";

export default function AdminNewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<INews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiNews.getAll();
      if (response?.data) {
        setNews(response.data.data);
      } else {
        throw new Error("Không lấy được danh sách tin tức");
      }
    } catch (err: any) {
      console.error("Lỗi khi lấy dữ liệu tin tức:", err);
      setError("Không thể tải danh sách tin tức. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleAddNews = () => {
    router.push("/quan-ly/admin/news/create");
  };

  const handleEditNews = (id: string) => {
    router.push(`/quan-ly/admin/news/edit/${id}`);
  };

  const handleDeleteNews = async (id: string) => {
    try {
      await apiNews.delete(id);
      setNews((prev) => prev.filter((n) => n._id !== id));
      toast({
        title: "Thành công",
        description: "Xóa tin tức thành công! 🗑️",
      });
    } catch (err: any) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa tin tức! 😵",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: Date | string) => {
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
        <Button onClick={fetchNews} className="mt-4">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 p-4 md:p-8">
        <Card className="w-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Danh sách tin tức</CardTitle>
                <CardDescription>
                  Quản lý thông tin tin tức trên hệ thống
                </CardDescription>
              </div>
              <Button onClick={handleAddNews}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm tin tức
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {news.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Chưa có tin tức nào. Thêm ngay!</p>
                <Button className="mt-4" onClick={handleAddNews}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm tin tức
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hình ảnh</TableHead>
                      <TableHead>Tiêu đề</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {news.map((newsItem) => (
                      <TableRow
                        key={newsItem._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell>
                          {newsItem.image ? (
                            <img
                              src={newsItem.image}
                              alt={newsItem.title}
                              width={50}
                              height={50}
                              className="object-cover"
                            />
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell
                          className="font-medium max-w-xs truncate"
                          title={newsItem.title}
                        >
                          {newsItem.title || "N/A"}
                        </TableCell>
                        <TableCell>{newsItem.category || "N/A"}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${newsItem.status === "draft"
                              ? "bg-yellow-100 text-yellow-800"
                              : newsItem.status === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {newsItem.status === "draft"
                              ? "Bản nháp"
                              : newsItem.status === "published"
                                ? "Đã xuất bản"
                                : newsItem.status === "archived"
                                  ? "Đã lưu trữ"
                                  : "Không xác định"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {newsItem.createdAt
                            ? formatDate(newsItem.createdAt)
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              onClick={() => handleEditNews(newsItem._id)}
                              title="Sửa tin tức"
                            >
                              <Pencil className="w-4 h-4 mr-1" />
                              Sửa
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-red-50 hover:text-red-600 transition-colors"
                              onClick={() => handleDeleteNews(newsItem._id)}
                              title="Xóa tin tức"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Xóa
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}