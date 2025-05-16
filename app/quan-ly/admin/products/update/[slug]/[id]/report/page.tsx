"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, FormEvent } from "react"; // Import FormEvent
import { apiProducts } from "../../../../../../../fetch/fetch.products"; // Đảm bảo đường dẫn này đúng

// Import các component từ shadcn/ui
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // Dùng Label với Input
import { Separator } from "@/components/ui/separator"; // Để phân tách các phần

// Import các icon từ lucide-react
import {
    FileText,
    CalendarDays,
    Link as LinkIcon,
    PlusCircle,
    Heading,
    Calendar,
    Trash2, // Icon xóa
    UploadCloud, // Icon upload
} from "lucide-react";
import Link from "next/link";

interface ReportItem {
    _id?: string; // API thường trả về ID
    title: string;
    date: string;
    url: string; // Đây sẽ là URL từ Cloudinary sau khi upload
}

// Lấy Cloudinary Cloud Name từ biến môi trường
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
// Đảm bảo preset upload không dấu (unsigned) đã được cấu hình trên Cloudinary cho loại tài nguyên "raw"
const uploadPreset = "my_unsigned_preset"; // Sử dụng preset của bạn

// Hàm helper để định dạng ngày tháng (tái sử dụng)
const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleDateString("vi-VN");
    } catch (e) {
        console.error("Error formatting date:", e);
        return "Invalid Date";
    }
};

export default function CarbonCreditReportsPage() {
    const { id } = useParams();
    const [reports, setReports] = useState<ReportItem[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [newDate, setNewDate] = useState("");
    const [newUrl, setNewUrl] = useState(""); // Sẽ lưu URL sau khi upload
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false); // Trạng thái khi đang thêm/gọi API
    const [deletingId, setDeletingId] = useState<string | null>(null); // Theo dõi item đang xóa
    const [isUploading, setIsUploading] = useState(false); // Trạng thái khi đang upload
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null); // Tên file đã chọn/upload


    useEffect(() => {
        const fetchReports = async () => {
            if (!id) {
                setError("Không có ID Carbon Credit.");
                setLoading(false);
                return;
            }
            try {
                const product = await apiProducts.getById(id as string);
                if (product?.data?.reports) {
                    // Có thể sắp xếp báo cáo theo ngày nếu muốn
                    const sortedReports = product.data.reports.sort((a: ReportItem, b: ReportItem) => new Date(a.date).getTime() - new Date(b.date).getTime());
                    setReports(sortedReports);
                } else {
                    setReports([]);
                    console.warn("Reports data not found in API response.");
                }
            } catch (err) {
                console.error("Lỗi fetch báo cáo:", err);
                setError("Không thể tải danh sách báo cáo.");
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [id]);

    // Hàm xử lý upload file lên Cloudinary
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setUploadedFileName(null);
            setNewUrl(""); // Xóa URL nếu không chọn file
            return;
        }

        setUploadedFileName(file.name); // Hiển thị tên file
        setIsUploading(true); // Bắt đầu upload
        setNewUrl(""); // Xóa URL cũ trong khi upload file mới
        setError(null); // Xóa lỗi cũ

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        try {
            // Sử dụng endpoint /raw/upload cho các loại tệp (PDF, DOCX, v.v.)
            // resource_type 'raw' hoặc 'auto' tùy cấu hình preset
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(`Upload failed: ${errorData.error?.message || res.statusText}`);
            }

            const data = await res.json();
            setNewUrl(data.secure_url); // Lưu URL đã upload
            console.log("File uploaded successfully:", data.secure_url);

        } catch (err: any) {
            console.error("Error uploading file:", err);
            setError(`Lỗi khi upload file: ${err.message}`);
            setNewUrl(""); // Xóa URL nếu upload lỗi
            setUploadedFileName(null); // Xóa tên file
        } finally {
            setIsUploading(false); // Kết thúc upload
        }
    };


    const handleAddReport = async (e: FormEvent) => {
        e.preventDefault(); // Ngăn chặn reload trang mặc định của form

        // Kiểm tra thông tin cần thiết, bao gồm URL đã upload
        if (!newTitle || !newDate || !newUrl) {
            // Kiểm tra thêm trường hợp đang upload
            if (isUploading) {
                setError("Đang upload file, vui lòng đợi.");
            } else if (!newUrl) {
                setError("Vui lòng upload file báo cáo.");
            } else {
                setError("Vui lòng nhập đầy đủ Tiêu đề và Ngày.");
            }
            return;
        }

        setIsAdding(true); // Bắt đầu thêm

        const newReport: Omit<ReportItem, '_id'> = { // Tạo object báo cáo mới
            title: newTitle,
            date: newDate, // Giữ nguyên định dạng input hoặc format lại nếu cần
            url: newUrl, // Sử dụng URL đã upload
        };

        // Tạm thời thêm vào state để hiển thị ngay (Optimistic update)
        const updatedReportsOptimistic = [...reports, newReport];
        // Có thể thêm ID tạm thời nếu cần key duy nhất ngay lập tức trước khi có ID thật
        // const tempId = `temp-${Date.now()}`;
        // const updatedReportsOptimistic = [...reports, { ...newReport, _id: tempId }];
        // setReports(updatedReportsOptimistic.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())); // Cập nhật UI & sắp xếp

        // Clear form và trạng thái upload ngay lập tức
        setNewTitle("");
        setNewDate("");
        setNewUrl("");
        setUploadedFileName(null);
        setError(null); // Xóa lỗi cũ


        try {
            // Giả định API mong muốn toàn bộ mảng reports đã cập nhật
            const apiResponse = await apiProducts.updateReport(id as string, { reports: updatedReportsOptimistic });

            // Nếu API trả về dữ liệu reports đã cập nhật (có ID), bạn nên dùng nó:
            if (apiResponse?.data?.reports) {
                const sortedReports = apiResponse.data.reports.sort((a: ReportItem, b: ReportItem) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setReports(sortedReports); // Cập nhật lại state với dữ liệu từ API (bao gồm ID thật)
            } else {
                // Nếu API không trả về dữ liệu cập nhật, có thể cần fetch lại hoặc xử lý khác
                setError("Đã thêm báo cáo, nhưng không thể xác nhận từ máy chủ. Vui lòng tải lại trang.");
                // Hoặc chỉ giữ lại optimistic update nếu API chắc chắn thành công
                setReports(updatedReportsOptimistic.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())); // Giữ lại và sắp xếp optimistic update
            }

            console.log("Báo cáo đã được cập nhật thành công trên API (thêm).");


        } catch (err) {
            console.error("Lỗi cập nhật báo cáo API (thêm):", err);
            setError("Không thể cập nhật báo cáo lên máy chủ. Vui lòng tải lại trang và thử lại.");
            // Rollback state nếu optimistic update đã được thực hiện và API lỗi
            // setReports(reports); // Quay lại trạng thái trước khi thêm tạm thời
        } finally {
            setIsAdding(false); // Kết thúc thêm
        }
    };

    // Hàm xử lý xóa báo cáo
    const handleDeleteReport = async (reportId: string) => {
        if (!id || !reportId) {
            setError("Thiếu thông tin ID để xóa báo cáo.");
            return;
        }

        setDeletingId(reportId); // Bắt đầu xóa, theo dõi item đang xóa

        // Lọc bỏ báo cáo khỏi state local (Optimistic update)
        const updatedReportsOptimistic = reports.filter(report => report._id !== reportId);
        setReports(updatedReportsOptimistic); // Cập nhật UI trước

        try {
            // Giả định API mong muốn toàn bộ mảng reports sau khi xóa
            const apiResponse = await apiProducts.updateReport(id as string, { reports: updatedReportsOptimistic });

            // Nếu API trả về dữ liệu reports đã được cập nhật, sử dụng nó:
            if (apiResponse?.data?.reports) {
                const sortedReports = apiResponse.data.reports.sort((a: ReportItem, b: ReportItem) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setReports(sortedReports); // Cập nhật lại state với dữ liệu từ API
            } else {
                // Nếu API không trả về dữ liệu cập nhật
                setError("Đã xóa báo cáo, nhưng không thể xác nhận từ máy chủ. Vui lòng tải lại trang.");
                setReports(updatedReportsOptimistic.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())); // Giữ lại và sắp xếp optimistic update
            }

            console.log(`Báo cáo ${reportId} đã được xóa và reports cập nhật trên API.`);

        } catch (err) {
            console.error("Lỗi cập nhật báo cáo API (xóa):", err);
            setError("Không thể xóa báo cáo trên máy chủ. Vui lòng tải lại trang và thử lại.");
            // Rollback hoặc fetch lại toàn bộ báo cáo nếu lỗi
            fetchReports(); // Thử fetch lại toàn bộ báo cáo
        } finally {
            setDeletingId(null); // Kết thúc xóa
        }
    };


    // Function to fetch reports (can be called again after error)
    const fetchReports = async () => {
        if (!id) {
            setError("Không có ID Carbon Credit.");
            setLoading(false);
            return;
        }
        try {
            const product = await apiProducts.getById(id as string);
            if (product?.data?.reports) {
                const sortedReports = product.data.reports.sort((a: ReportItem, b: ReportItem) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setReports(sortedReports);
            } else {
                setReports([]);
            }
            setError(null); // Clear error on successful fetch
        } catch (err) {
            console.error("Lỗi fetch báo cáo:", err);
            setError("Không thể tải danh sách báo cáo.");
        } finally {
            setLoading(false);
        }
    };


    if (loading) return <p className="text-center mt-10">Đang tải báo cáo...</p>;
    // Hiển thị lỗi nếu có, ngay cả khi có báo cáo được tải
    if (error && reports.length === 0) return <p className="text-center text-red-500 mt-10">{error}</p>;


    return (
        <div className="max-w-3xl mx-auto py-6 px-4"> {/* Sử dụng py-6 px-4 */}

            <h1 className="text-2xl font-bold mb-6 flex items-center">
                <FileText className="mr-2 h-6 w-6" /> {/* Icon tiêu đề trang */}
                Danh sách báo cáo dự án #{id}
            </h1>

            {/* Card Danh sách báo cáo */}
            <Card className="mb-6"> {/* Thêm khoảng cách dưới card */}
                <CardHeader>
                    <CardTitle>Các báo cáo hiện có</CardTitle>
                    {reports.length === 0 && !loading && !error && ( // Hiển thị thông báo khi không có báo cáo
                        <CardDescription>Chưa có báo cáo nào được thêm cho dự án này.</CardDescription>
                    )}
                </CardHeader>
                <CardContent className="space-y-4"> {/* Khoảng cách giữa các mục báo cáo */}
                    {reports.length > 0 ? (
                        reports.map((report, index) => (
                            // Sử dụng key an toàn hơn (_id)
                            <div key={report._id || index} className="border p-4 rounded-md shadow-sm hover:shadow transition flex items-start space-x-3">
                                <FileText className="h-5 w-5 flex-shrink-0 text-blue-600 mt-1" /> {/* Icon cho mục báo cáo */}
                                <div className="flex-1 space-y-1"> {/* flex-1 để nội dung chiếm hết không gian còn lại */}
                                    <p className="text-base font-semibold">{report.title}</p>
                                    <p className="text-sm text-gray-700 flex items-center gap-1">
                                        <CalendarDays className="h-4 w-4 text-gray-500" />
                                        Ngày: {formatDate(report.date)} {/* Định dạng ngày */}
                                    </p>
                                    <p className="text-sm text-gray-700 flex items-center gap-1 truncate"> {/* truncate link dài */}
                                        <LinkIcon className="h-4 w-4 text-gray-500" />
                                        Link: {" "} {/* Thêm khoảng trắng */}
                                        <a
                                            href={report.url}
                                            target="_blank"
                                            rel="noopener noreferrer" // Thêm rel="noopener noreferrer" cho bảo mật
                                            className="text-blue-600 hover:underline truncate" // truncate link dài
                                        >
                                            {report.url}
                                        </a>
                                    </p>
                                </div>
                                {/* Nút Xóa Báo cáo */}
                                {report._id && ( // Chỉ hiện nút xóa nếu có ID
                                    <Button
                                        variant="destructive" // Màu đỏ
                                        size="icon" // Kích thước icon
                                        onClick={() => handleDeleteReport(report._id!)} // Gọi hàm xóa với ID
                                        disabled={deletingId === report._id} // Disable khi đang xóa item này
                                        className="flex-shrink-0"
                                    >
                                        {deletingId === report._id ? (
                                            // Icon loading khi đang xóa (cần cài icon loading nếu muốn)
                                            // <Loader2 className="h-4 w-4 animate-spin" />
                                            <Trash2 className="h-4 w-4" /> // Giữ nguyên icon xóa tạm thời
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                        <span className="sr-only">Xóa báo cáo {report.title}</span>
                                    </Button>
                                )}
                            </div>
                        ))
                    ) : (
                        // Không hiển thị gì nếu reports rỗng, CardDescription ở trên đã xử lý
                        !loading && !error && null
                    )}
                </CardContent>
            </Card>

            {/* Hiển thị lỗi nếu có, ngay cả khi có báo cáo được tải */}
            {error && reports.length > 0 && <p className="text-red-500 mb-4">{error}</p>}


            {/* Card Thêm báo cáo mới */}
            <Card>
                <CardHeader>
                    <CardTitle>Thêm báo cáo mới</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Sử dụng form để dễ dàng xử lý submit */}
                    <form onSubmit={handleAddReport} className="space-y-4">
                        {/* Input Tiêu đề */}
                        <div className="space-y-2">
                            <Label htmlFor="newTitle">Tiêu đề báo cáo</Label>
                            <Input
                                id="newTitle"
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="Tiêu đề báo cáo"
                                disabled={isAdding || isUploading} // Disable khi đang thêm/upload
                            />
                        </div>

                        {/* Input Ngày */}
                        <div className="space-y-2">
                            <Label htmlFor="newDate">Ngày báo cáo</Label>
                            <Input
                                id="newDate"
                                type="date" // Sử dụng type="date" cho input ngày
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                disabled={isAdding || isUploading} // Disable khi đang thêm/upload
                            />
                        </div>

                        {/* Input/Upload File Báo cáo */}
                        <div className="space-y-2">
                            <Label htmlFor="reportFile">File báo cáo (PDF, DOCX...)</Label>
                            <Input
                                id="reportFile"
                                type="file" // Input type file
                                onChange={handleFileUpload} // Gọi hàm upload khi file được chọn
                                disabled={isAdding || isUploading} // Disable khi đang thêm/upload
                                accept=".pdf,.doc,.docx,.txt" // Gợi ý loại file chấp nhận
                            />
                            {/* Hiển thị trạng thái upload hoặc tên file đã upload */}
                            {isUploading && (
                                <p className="text-sm text-blue-600 flex items-center">
                                    {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
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


                        {/* Nút Thêm */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isAdding || isUploading || !newTitle || !newDate || !newUrl} // Disable khi đang thêm, upload, hoặc thiếu thông tin
                        >
                            {isAdding ? (
                                <> <PlusCircle className="mr-2 h-4 w-4" /> Đang thêm... </>
                            ) : isUploading ? (
                                <> <UploadCloud className="mr-2 h-4 w-4 animate-pulse" /> Đang upload... </> // Hiển thị trạng thái upload trên nút chính (tùy chọn)
                            ) : (
                                <> <PlusCircle className="mr-2 h-4 w-4" /> Thêm báo cáo </>
                            )}

                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}