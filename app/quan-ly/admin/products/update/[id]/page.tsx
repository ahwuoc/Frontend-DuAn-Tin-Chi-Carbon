"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import ProductForm, { ProductFormData } from "./form";
import { IProduct } from "@/app/fetch/fetch.products";
import { apiProducts } from "@/app/fetch/fetch.products";

interface ProductPageProps {
    params: {
        id: string;
    };
}

export default function ProductUpdatePage({ params }: ProductPageProps) {
    const router = useRouter();
    const { toast } = useToast();
    const productId = params.id;

    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadProduct() {
            setLoading(true);
            setError(null);
            try {
                const fetchedProduct = await apiProducts.getById(productId);
                if (fetchedProduct && fetchedProduct.data) {
                    setProduct(fetchedProduct.data);
                } else {
                    setError("Sản phẩm không tồn tại.");
                }
            } catch (err) {
                console.error("Failed to fetch product:", err);
                setError("Không thể tải dữ liệu sản phẩm.");
                toast({
                    title: "Lỗi tải dữ liệu",
                    description: "Không thể tải dữ liệu sản phẩm.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        }

        if (productId) {
            loadProduct();
        }

    }, [productId, router, toast]);

    const handleUpdate = async (data: ProductFormData) => {
        setSubmitting(true);
        setError(null);
        try {
            const success = await apiProducts.update(productId, data);

            if (success) {
                toast({
                    title: "Thành công",
                    description: "Đã cập nhật sản phẩm.",
                });
                router.push("/quan-ly/admin/products");
            } else {
                setError("Không thể cập nhật sản phẩm. Vui lòng thử lại.");
                toast({
                    title: "Lỗi",
                    description: "Không thể cập nhật sản phẩm. Vui lòng thử lại.",
                    variant: "destructive",
                });
            }
        } catch (err) {
            console.error("Update error:", err);
            setError("Có lỗi xảy ra khi cập nhật sản phẩm.");
            toast({
                title: "Lỗi",
                description: "Có lỗi xảy ra khi cập nhật sản phẩm.",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            return;
        }

        setDeleting(true);
        setError(null);
        try {
            const success = await apiProducts.delete(productId);

            if (success) {
                toast({
                    title: "Thành công",
                    description: "Đã xóa sản phẩm.",
                });
                router.push("/quan-ly/admin/products");
            } else {
                setError("Không thể xóa sản phẩm. Vui lòng thử lại.");
                toast({
                    title: "Lỗi",
                    description: "Không thể xóa sản phẩm. Vui lòng thử lại.",
                    variant: "destructive",
                });
            }
        } catch (err) {
            console.error("Delete error:", err);
            setError("Có lỗi xảy ra khi xóa sản phẩm.");
            toast({
                title: "Lỗi",
                description: "Có lỗi xảy ra khi xóa sản phẩm.",
                variant: "destructive",
            });
        } finally {
            setDeleting(false);
        }
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                {/* Spinner component might be replaced by a custom or library one if available */}
                <p className="ml-2">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-8 text-center text-destructive">
                <h1 className="text-2xl font-bold mb-4">Lỗi</h1>
                <p>{error}</p>
                <button onClick={() => router.push("/quan-ly/admin/products")} className="mt-4 underline">
                    Quay lại danh sách sản phẩm
                </button>
            </div>
        );
    }

    if (!product && !loading && !error) {
        return (
            <div className="container mx-auto py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
                <button onClick={() => router.push("/quan-ly/admin/products")} className="mt-4 underline">
                    Quay lại danh sách sản phẩm
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Cập nhật sản phẩm</h1>
            <ProductForm
                initialData={product}
                onSubmit={handleUpdate}
                isEditMode={true}
                onDelete={handleDelete}
                isLoading={submitting || deleting}
            />
        </div>
    );
}