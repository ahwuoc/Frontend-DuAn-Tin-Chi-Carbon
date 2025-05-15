"use client";

import { useState, useEffect } from "react";
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
// ProductDrawer import removed
import { apiProducts, IProduct } from "@/app/fetch/fetch.products";
import { useToast } from "@/hooks/use-toast"; // For delete confirmation

export default function AdminProductsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiProducts.getAll();
      if (response && response?.data) {
        setProducts(response.data);
      } else {
        throw new Error("Không lấy được danh sách sản phẩm");
      }
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu sản phẩm:", err);
      setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); // Removed router dependency, fetchProducts can be called after CUD operations via router.refresh() or state update from child pages if needed.
  // For simplicity, a full fetch is done on mount. If a product is created/updated/deleted on another page,
  // navigating back here should ideally re-fetch or update the list.
  // Next.js 13+ app router often handles cache invalidation better, but explicit refresh might be needed.

  const handleAddNewProduct = () => {
    router.push("/quan-ly/admin/products/create");
  };

  const handleEditProduct = (productId: string) => {
    router.push(`/quan-ly/admin/products/update/${productId}`);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này không? Hành động này không thể hoàn tác!")) {
      return;
    }
    try {
      const res = await apiProducts.delete(productId);
      if (res.status === 200 || res.status === 204) { // 204 for no content on delete
        toast({
          title: "Xong!",
          description: "Xóa sản phẩm thành công! 🗑️",
        });
        // Refetch products or filter out locally
        setProducts((prevProducts) => prevProducts.filter(p => p._id !== productId));
      } else {
        throw new Error(res.data?.error || "Xóa sản phẩm thất bại");
      }
    } catch (err: any) {
      console.error("Delete API error:", err.response?.data || err.message);
      toast({
        title: "Lỗi nè!",
        description: err.response?.data?.error || err.message || "Không xóa được sản phẩm! 😓",
        variant: "destructive",
      });
    }
  };


  const formatDate = (dateString?: Date | string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return "N/A";
    return price.toLocaleString("vi-VN") + " VNĐ";
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
        <Button onClick={() => fetchProducts()} className="mt-4"> {/* Changed to fetchProducts */}
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
                <CardTitle>Danh sách sản phẩm</CardTitle>
                <CardDescription>
                  Quản lý thông tin sản phẩm trên hệ thống
                </CardDescription>
              </div>
              <Button onClick={handleAddNewProduct}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm sản phẩm
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Chưa có sản phẩm nào. Thêm ngay!
                </p>
                <Button className="mt-4" onClick={handleAddNewProduct}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm sản phẩm
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Cấp độ</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell className="font-medium">
                          {product.name || "N/A"}
                        </TableCell>
                        <TableCell>{formatPrice(product.price)}</TableCell>
                        <TableCell>
                          {product.type === "carbon_credits"
                            ? "Carbon Credits"
                            : product.type === "carbon_accounting"
                              ? "Carbon Accounting"
                              : product.type === "international_certificates"
                                ? "Chứng chỉ quốc tế"
                                : product.type || "N/A"}
                        </TableCell>
                        <TableCell>{product.subscriptionTier || "N/A"}</TableCell>
                        <TableCell>{formatDate(product.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(product._id!)} // Assuming _id is always present
                            >
                              <Pencil className="w-4 h-4 mr-1" />
                              Sửa
                            </Button>
                            <Button
                              variant="destructive" // Changed variant for delete
                              size="sm"
                              onClick={() => handleDeleteProduct(product._id!)} // Assuming _id is always present
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
      {/* ProductDrawer removed */}
    </div>
  );
}