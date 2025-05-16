"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button"; // Giả sử bạn sử dụng Button từ shadcn/ui

export default function ForbiddenPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-600 dark:text-red-500">
                    403
                </h1>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-4">
                    Truy cập Bị Cấm
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Bạn không có quyền truy cập vào trang này.
                </p>
                <div className="mt-6">
                    {/* Nút hoặc liên kết để quay về trang an toàn */}
                    <Link href="/" passHref>
                        {/* Sử dụng Link component của Next.js và Button của shadcn/ui */}
                        <Button>
                            Quay về Trang chủ
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}