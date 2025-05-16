"use client"
import { useState } from "react";
import { useToast } from "../../../../../hooks/use-toast";
import { ProductFormData } from "./ProductForm";
// Next.js Page Component
export default function CreateProductPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleProductSubmit = async (data: ProductFormData) => {
        setIsSubmitting(true);
        console.log("Dữ liệu sản phẩm mới sẵn sàng để gửi API:", data);

        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("API phản hồi thành công:", result);

                toast({
                    title: "Thành công!",
                    description: "Sản phẩm mới đã được tạo thành công.",
                    variant: "default",
                });

                // TODO: Uncomment and adjust the redirect if needed
                // router.push('/quan-ly/admin/products');
            } else {
                const errorData = await response.json();
                console.error("Lỗi từ API:", response.status, errorData);

                toast({
                    title: "Lỗi!",
                    description: errorData.message || "Có lỗi xảy ra khi tạo sản phẩm. Vui lòng thử lại.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Lỗi trong quá trình gửi request:", error);
            toast({
                title: "Lỗi!",
                description: "Không thể kết nối đến server hoặc xử lý yêu cầu. Vui lòng kiểm tra kết nối mạng.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Tạo Sản phẩm Mới</h1>
            <ProductForm onSubmit={handleProductSubmit} isEditMode={false} isLoading={isSubmitting} />
        </div>
    );
}