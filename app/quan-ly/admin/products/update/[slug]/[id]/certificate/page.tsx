"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiProducts } from "../../../../../../../fetch/fetch.products";

// Import các component từ shadcn/ui
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Import Table components từ shadcn/ui
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Import icon từ lucide-react (hoặc thư viện icon bạn đang dùng)
import { Trash2 } from 'lucide-react';


interface Certificate {
    id: string;
    title: string;
    date: string;
    url: string;
}

// Lấy tên cloud từ biến môi trường
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
// Tên upload preset không có chữ ký (unsigned)
const uploadPreset = "my_unsigned_preset"; // Thay thế bằng tên preset của bạn

export default function CarbonCreditCertificatesPage() {
    const { id } = useParams();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [newDate, setNewDate] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // State loading tải danh sách

    // States mới cho chức năng upload
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);


    useEffect(() => {
        const fetchCertificates = async () => {
            setIsLoading(true);
            try {
                const productId = Array.isArray(id) ? id[0] : id;
                if (!productId) {
                    setError("Không tìm thấy ID sản phẩm.");
                    setIsLoading(false);
                    return;
                }
                const product = await apiProducts.getById(productId);
                setCertificates(product.data.certificates || []);
                setError(null);
            } catch (err) {
                console.error("Error fetching certificates:", err);
                setError("Không thể tải danh sách chứng chỉ. Vui lòng thử lại sau.");
            } finally {
                setIsLoading(false);
            }
        };
        if (id) {
            fetchCertificates();
        }
    }, [id]);

    // Hàm xử lý upload tệp lên Cloudinary
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!cloudName) {
            setUploadError("Cloudinary cloud name is not configured. Please check environment variables.");
            return;
        }
        if (!uploadPreset) {
            setUploadError("Cloudinary upload preset is not configured.");
            return;
        }

        setUploading(true);
        setUploadError(null);
        setUploadedFileUrl(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const isImage = file.type.startsWith("image/");
        const resourceType = isImage ? "image" : "raw";

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();

            if (res.ok && data.secure_url) {
                setUploadedFileUrl(data.secure_url);
                setNewUrl(data.secure_url); // Cập nhật input URL
                setUploadError(null);
                console.log("File uploaded successfully:", data.secure_url);
            } else {
                const errorMsg = data.error?.message || "Upload failed";
                console.error("Cloudinary upload failed:", errorMsg);
                setUploadError(`Tải tệp lên thất bại: ${errorMsg}`);
                setUploadedFileUrl(null);
                setNewUrl("");
            }
        } catch (err) {
            console.error("Upload failed:", err);
            setUploadError("Tải tệp lên thất bại. Vui lòng thử lại.");
            setUploadedFileUrl(null);
            setNewUrl("");
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input file
        }
    };
    const handleDeleteCertificate = async (certificateId: string) => {
        const productId = Array.isArray(id) ? id[0] : id;
        if (!productId) {
            setError("Không tìm thấy ID sản phẩm để xóa chứng chỉ.");
            return;
        }
        const previousCertificates = certificates; // Lưu lại trạng thái trước đó để rollback nếu lỗi
        const updatedCertificates = certificates.filter(cert => cert.id !== certificateId);
        setCertificates(updatedCertificates);
        if (error && !error.includes("xóa chứng chỉ")) {
            setError(null);
        }


        try {
            // Gọi API để cập nhật sản phẩm (xóa chứng chỉ)
            await apiProducts.updatecertificates(productId, { certificates: updatedCertificates });
            // Nếu API thành công, state đã được cập nhật
            console.log(`Certificate ${certificateId} deleted successfully from API.`);

        } catch (err) {
            console.error(`Error deleting certificate ${certificateId}:`, err);
            // Rollback UI nếu API lỗi
            setCertificates(previousCertificates);
            setError("Không thể xóa chứng chỉ. Vui lòng thử lại.");
        }
    };


    const handleAddCertificate = async () => {
        if (!newTitle.trim() || !newDate || !newUrl.trim()) {
            setError("Vui lòng nhập đầy đủ thông tin chứng chỉ (Tiêu đề, Ngày, Link).");
            return;
        }

        try {
            new URL(newUrl.trim());
        } catch (_) {
            setError("Link chứng chỉ không phải là URL hợp lệ.");
            return;
        }

        const newCert: Certificate = {
            id: Date.now().toString(), // tạo id tạm thời bằng timestamp
            title: newTitle.trim(),
            date: newDate,
            url: newUrl.trim(),
        };

        const updatedCertificates = [...certificates, newCert];
        const productId = Array.isArray(id) ? id[0] : id;
        if (!productId) {
            setError("Không tìm thấy ID sản phẩm để cập nhật.");
            return;
        }

        try {
            await apiProducts.updatecertificates(productId, { certificates: updatedCertificates });
            setCertificates(updatedCertificates);
            setNewTitle("");
            setNewDate("");
            setNewUrl("");
            setUploadedFileUrl(null);
            setError(null);
        } catch (err) {
            console.error("Error updating certificates:", err);
            setError("Không thể thêm chứng chỉ. Vui lòng kiểm tra lại hoặc thử lại sau.");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8 border-b-2 border-purple-600 pb-4">
                🎖️ Chứng chỉ dự án <span className="text-purple-700">{Array.isArray(id) ? id[0] : id}</span>
            </h1>

            {isLoading ? (
                <div className="text-center text-gray-600 text-lg">Đang tải chứng chỉ...</div>
            ) : error && certificates.length === 0 ? (
                <p className="text-red-600 text-center mb-6 text-lg font-medium">{error}</p>
            ) : (
                <>
                    {/* Phần Danh sách Chứng chỉ */}
                    <Card className="mb-10">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-gray-800">Danh sách chứng chỉ hiện tại</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {certificates.length === 0 ? (
                                <p className="text-gray-600 italic text-lg">Chưa có chứng chỉ nào cho dự án này.</p>
                            ) : (
                                <div className="overflow-x-auto"> {/* Wrapper cho table để responsive */}
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="min-w-[150px]">Tiêu đề</TableHead> {/* Thêm min-width */}
                                                <TableHead className="min-w-[100px]">Ngày</TableHead> {/* Thêm min-width */}
                                                <TableHead className="min-w-[200px]">Link</TableHead> {/* Thêm min-width */}
                                                <TableHead className="text-right">Hành động</TableHead> {/* Căn phải */}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {certificates.map((cert) => (
                                                <TableRow key={cert.id}>
                                                    <TableCell className="font-medium">{cert.title}</TableCell>
                                                    <TableCell>{cert.date}</TableCell>
                                                    <TableCell>
                                                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline break-all"> {/* Sử dụng break-all */}
                                                            {cert.url}
                                                        </a>
                                                    </TableCell>
                                                    <TableCell className="text-right"> {/* Căn phải */}
                                                        <Button
                                                            variant="destructive" // Variant màu đỏ cho xóa
                                                            size="icon" // Kích thước nhỏ, chỉ chứa icon
                                                            onClick={() => handleDeleteCertificate(cert.id)}
                                                            // Disable khi đang tải danh sách hoặc upload
                                                            disabled={isLoading || uploading}
                                                        >
                                                            <Trash2 className="h-4 w-4" /> {/* Icon thùng rác */}
                                                            <span className="sr-only">Xóa chứng chỉ {cert.title}</span> {/* Label cho screen reader */}
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Phần Thêm Chứng chỉ mới */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-gray-800">Thêm chứng chỉ mới</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Hiển thị lỗi của form (thêm chứng chỉ), không hiển thị lỗi tải danh sách */}
                            {error && !isLoading && !error.includes("tải danh sách") && <p className="text-red-600 text-sm mb-4 font-medium">{error}</p>}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

                                {/* Input Tiêu đề */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">Tiêu đề</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        placeholder="Nhập tiêu đề chứng chỉ"
                                    />
                                </div>
                                {/* Input Ngày */}
                                <div className="space-y-2">
                                    <Label htmlFor="date">Ngày cấp</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                    />
                                </div>

                                {/* Phần Upload File */}
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <Label htmlFor="certificate-file-upload">Tải lên tệp chứng chỉ (PDF, hình ảnh)</Label>
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <Input
                                            id="certificate-file-upload"
                                            type="file"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            accept=".pdf, image/*"
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => document.getElementById('certificate-file-upload')?.click()}
                                            disabled={uploading}
                                            variant="outline"
                                            className="min-w-[150px]"
                                        >
                                            {uploading ? 'Đang tải lên...' : 'Chọn tệp'}
                                        </Button>

                                        {uploading && (
                                            <span className="text-gray-500 text-sm italic">Đang xử lý tệp...</span>
                                        )}
                                        {uploadError && (
                                            <p className="text-red-600 text-sm font-medium">{uploadError}</p>
                                        )}
                                        {uploadedFileUrl && !uploading && !uploadError && (
                                            <span className="text-green-600 text-sm font-medium">Tải lên thành công!</span>
                                        )}
                                    </div>
                                </div>

                                {/* Input Link (sẽ được điền tự động từ upload hoặc nhập tay) */}
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <Label htmlFor="url">Link chứng chỉ (URL)</Label>
                                    <Input
                                        id="url"
                                        type="url"
                                        value={newUrl}
                                        onChange={(e) => {
                                            setNewUrl(e.target.value);
                                            if (uploadedFileUrl) setUploadedFileUrl(null);
                                        }}
                                        placeholder="Link chứng chỉ (URL) hoặc tự động điền sau khi tải lên"
                                        disabled={uploading} // Disable khi đang upload
                                    />
                                    {uploadedFileUrl && !uploading && !uploadError && (
                                        <p className="text-sm text-gray-600 break-words mt-1">
                                            <span className="font-medium">Link đã tải lên:</span> <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-blue-800">{uploadedFileUrl}</a>
                                        </p>
                                    )}
                                </div>

                            </div>

                            <Button
                                onClick={handleAddCertificate}
                                disabled={isLoading || uploading} // Disable khi đang tải danh sách HOẶC đang upload
                                className="w-full md:w-auto bg-purple-600 hover:bg-purple-700"
                            >
                                ➕ Thêm chứng chỉ
                            </Button>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}