"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import { apiProducts } from "../../../../../../../fetch/fetch.products";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import {
    FileText,
    CalendarDays,
    Link as LinkIcon,
    PlusCircle,
    Heading,
    Calendar,
    Trash2,
    UploadCloud,
} from "lucide-react";
import Link from "next/link";
import { formatDateUtil } from "../../../../../../../utils/common";

interface ReportItem {
    _id?: string;
    title: string;
    date: string;
    url: string;
}

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const uploadPreset = "my_unsigned_preset";
export default function CarbonCreditReportsPage() {
    const { id } = useParams();
    const [reports, setReports] = useState<ReportItem[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [newDate, setNewDate] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);


    // Function to fetch reports (can be called again after error)
    const fetchReports = async () => {
        if (!id) {
            setError("Không có ID Carbon Credit.");
            setLoading(false);
            return;
        }
        try {
            const product = await apiProducts.getById(id as string);
            if (product?.payload?.reports && Array.isArray(product.payload.reports)) { // Thêm kiểm tra Array.isArray
                const sortedReports = product.payload.reports.sort((a: ReportItem, b: ReportItem) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setReports(sortedReports);
            } else {
                console.warn("Reports data not found or not an array in API response:", product?.payload?.reports);
                setReports([]);
            }
            setError(null);
        } catch (err) {
            console.error("Lỗi fetch báo cáo:", err);
            setError("Không thể tải danh sách báo cáo.");
            setReports([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchReports();
    }, [id]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setUploadedFileName(null);
            setNewUrl("");
            return;
        }

        setUploadedFileName(file.name);
        setIsUploading(true);
        setNewUrl("");
        setError(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(`Upload failed: ${errorData.error?.message || res.statusText}`);
            }

            const data = await res.json();
            setNewUrl(data.secure_url);
            console.log("File uploaded successfully:", data.secure_url);

        } catch (err: any) {
            console.error("Error uploading file:", err);
            setError(`Lỗi khi upload file: ${err.message}`);
            setNewUrl("");
            setUploadedFileName(null);
        } finally {
            setIsUploading(false);
        }
    };


    const handleAddReport = async (e: FormEvent) => {
        e.preventDefault();

        if (!newTitle || !newDate || !newUrl) {
            if (isUploading) {
                setError("Đang upload file, vui lòng đợi.");
            } else if (!newUrl) {
                setError("Vui lòng upload file báo cáo.");
            } else {
                setError("Vui lòng nhập đầy đủ Tiêu đề và Ngày.");
            }
            return;
        }

        setIsAdding(true);

        const newReport: Omit<ReportItem, '_id'> = {
            title: newTitle,
            date: newDate,
            url: newUrl,
        };

        const updatedReportsOptimistic = [...reports, newReport].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setNewTitle("");
        setNewDate("");
        setNewUrl("");
        setUploadedFileName(null);
        setError(null);


        try {
            const apiResponse = await apiProducts.updateReport(id as string, { reports: updatedReportsOptimistic });

            if (apiResponse?.payload?.reports && Array.isArray(apiResponse.payload.reports)) {
                const sortedReports = apiResponse.payload.reports.sort((a: ReportItem, b: ReportItem) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setReports(sortedReports);
            } else {
                console.error("API response for update (add) is invalid:", apiResponse?.payload);
                setError("Cập nhật thành công nhưng dữ liệu trả về không hợp lệ. Vui lòng tải lại trang.");
                setReports(updatedReportsOptimistic);
            }

            console.log("Báo cáo đã được cập nhật thành công trên API (thêm).");


        } catch (err) {
            console.error("Lỗi cập nhật báo cáo API (thêm):", err);
            setError("Không thể cập nhật báo cáo lên máy chủ. Vui lòng tải lại trang và thử lại.");
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteReport = async (reportId: string) => {
        if (!id || !reportId) {
            setError("Thiếu thông tin ID để xóa báo cáo.");
            return;
        }

        const originalReports = reports;
        setDeletingId(reportId);

        const updatedReportsOptimistic = reports.filter(report => report._id !== reportId);
        setReports(updatedReportsOptimistic);


        try {
            const apiResponse = await apiProducts.updateReport(id as string, { reports: updatedReportsOptimistic });

            if (apiResponse?.payload?.reports && Array.isArray(apiResponse.payload.reports)) {
                const sortedReports = apiResponse.payload.reports.sort((a: ReportItem, b: ReportItem) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setReports(sortedReports);
            } else {
                console.error("API response for update (delete) is invalid:", apiResponse?.payload);
                setError("Xóa báo cáo thành công nhưng dữ liệu trả về không hợp lệ. Vui lòng tải lại trang.");
                setReports(updatedReportsOptimistic);
            }

            console.log(`Báo cáo ${reportId} đã được xóa và reports cập nhật trên API.`);

        } catch (err) {
            console.error("Lỗi cập nhật báo cáo API (xóa):", err);
            setError("Không thể xóa báo cáo trên máy chủ. Vui lòng tải lại trang và thử lại.");
            setReports(originalReports);
        } finally {
            setDeletingId(null);
        }
    };


    if (loading) return <p className="text-center mt-10">Đang tải báo cáo...</p>;
    if (error && reports.length === 0) return <p className="text-center text-red-500 mt-10">{error}</p>;


    return (
        <div className="container mx-auto py-6 px-4">
            <h1 className="text-2xl font-bold mb-6 flex items-center">
                <FileText className="mr-2 h-6 w-6" />
                Danh sách báo cáo dự án #{id}
            </h1>
            {error && reports.length > 0 && <p className="text-red-500 mb-4">{error}</p>}
            <div className="md:flex gap-6">
                <Card className="md:w-1/2">
                    <CardHeader>
                        <CardTitle>Các báo cáo hiện có</CardTitle>
                        {reports.length === 0 && !loading && !error && (
                            <CardDescription>Chưa có báo cáo nào được thêm cho dự án này.</CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {reports.length > 0 ? (
                            reports.map((report, index) => (
                                <div key={report._id || index} className="border p-4 rounded-md shadow-sm hover:shadow transition flex items-start space-x-3">
                                    <FileText className="h-5 w-5 flex-shrink-0 text-blue-600 mt-1" />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-base font-semibold">{report.title}</p>
                                        <p className="text-sm text-gray-700 flex items-center gap-1">
                                            <CalendarDays className="h-4 w-4 text-gray-500" />
                                            Ngày: {formatDateUtil(report.date)}
                                        </p>
                                        <p className="text-sm text-gray-700 flex items-center gap-1 truncate">
                                            <LinkIcon className="h-4 w-4 text-gray-500" />
                                            File: {" "}
                                            <a
                                                href={report.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline truncate"
                                            >
                                                {report.url.split("/").pop()}
                                            </a>
                                        </p>
                                    </div>
                                    {report._id && (
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDeleteReport(report._id!)}
                                            disabled={deletingId === report._id}
                                            className="flex-shrink-0"
                                        >
                                            {deletingId === report._id ? (
                                                <Trash2 className="h-4 w-4" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                            <span className="sr-only">Xóa báo cáo {report.title}</span>
                                        </Button>
                                    )}
                                </div>
                            ))
                        ) : (
                            !loading && !error && null
                        )}
                    </CardContent>
                </Card>

                <Card className="md:w[60%]">
                    <CardHeader>
                        <CardTitle>Thêm báo cáo mới</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddReport} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="newTitle">Tiêu đề báo cáo</Label>
                                <Input
                                    id="newTitle"
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="Tiêu đề báo cáo"
                                    disabled={isAdding || isUploading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newDate">Ngày báo cáo</Label>
                                <Input
                                    id="newDate"
                                    type="date"
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                    disabled={isAdding || isUploading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reportFile">File báo cáo (PDF, DOCX...)</Label>
                                <Input
                                    id="reportFile"
                                    type="file"
                                    onChange={handleFileUpload}
                                    disabled={isAdding || isUploading}
                                    accept=".pdf,.doc,.docx,.txt"
                                />
                                {isUploading && (
                                    <p className="text-sm text-blue-600 flex items-center">
                                        <UploadCloud className="mr-2 h-4 w-4" /> Đang upload "{uploadedFileName}"...
                                    </p>
                                )}
                                {!isUploading && uploadedFileName && newUrl && (
                                    <p className="text-sm text-green-600 flex items-center">
                                        <LinkIcon className="mr-2 h-4 w-4" /> Đã upload: "{uploadedFileName}"
                                    </p>
                                )}
                                {!isUploading && uploadedFileName && !newUrl && error && (
                                    <p className="text-sm text-red-500 flex items-center">
                                        <UploadCloud className="mr-2 h-4 w-4" /> Upload thất bại cho "{uploadedFileName}". Vui lòng thử lại.
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isAdding || isUploading || !newTitle || !newDate || !newUrl}
                            >
                                {isAdding ? (
                                    <> <PlusCircle className="mr-2 h-4 w-4" /> Đang thêm... </>
                                ) : isUploading ? (
                                    <> <UploadCloud className="mr-2 h-4 w-4 animate-pulse" /> Đang upload... </>
                                ) : (
                                    <> <PlusCircle className="mr-2 h-4 w-4" /> Thêm báo cáo </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

            </div>

        </div>
    );
}