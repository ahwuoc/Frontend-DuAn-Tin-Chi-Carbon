"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiCarbonCredits } from "../../../../../fetch/fetch.carboncredits"; // Đảm bảo đường dẫn này chính xác

// Import các component từ Shadcn UI
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"; // Import Separator component
import { useToast } from "@/components/ui/use-toast"; // Sử dụng Toast để hiển thị thông báo

// Icon để xóa mục (bạn cần cài @radix-ui/react-icons hoặc một thư viện icon khác)
import { Cross2Icon } from "@radix-ui/react-icons";

// Định nghĩa cấu trúc cho các mảng mới (giữ nguyên)
interface Report {
    id: string;
    title: string;
    date: string;
    size: string;
    type: string;
}

interface Transaction {
    id: string;
    date: string;
    type: string;
    amount: string;
    value: string;
    status: string;
}

interface Certificate {
    id: string;
    title: string;
    date: string;
    size: string;
}

interface TimelineEvent {
    date: string;
    event: string;
}

// Cập nhật Interface CarbonCredit (giữ nguyên)
interface CarbonCredit {
    _id?: string;
    title: string;
    status: string;
    location: string;
    area: string;
    startDate: string;
    endDate: string;
    totalCredits: string;
    usedCredits: string;
    remainingCredits: string;
    projectManager: string;
    projectContact: string;
    projectPhone: string;
    verificationDate: string;
    nextVerificationDate: string;
    verificationBody: string;
    description: string;
    image: string;
    afterImage: string;
    communityBenefits: string[];
    biodiversityBenefits: string[];
    reports: Report[];
    transactions: Transaction[];
    certificates: Certificate[];
    timeline: TimelineEvent[];
}

export default function EditCarbonCreditPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id ?? "";
    const { toast } = useToast(); // Khởi tạo toast

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [carbonCredit, setCarbonCredit] = useState<CarbonCredit>({
        title: "",
        status: "",
        location: "",
        area: "",
        startDate: "",
        endDate: "",
        totalCredits: "",
        usedCredits: "",
        remainingCredits: "",
        projectManager: "",
        projectContact: "",
        projectPhone: "",
        verificationDate: "",
        nextVerificationDate: "",
        verificationBody: "",
        description: "",
        image: "",
        afterImage: "",
        communityBenefits: [],
        biodiversityBenefits: [],
        reports: [],
        transactions: [],
        certificates: [],
        timeline: [],
    });

    const [newCommunityBenefit, setNewCommunityBenefit] = useState("");
    const [newBiodiversityBenefit, setNewBiodiversityBenefit] = useState("");
    const [newTimelineEvent, setNewTimelineEvent] = useState<Omit<TimelineEvent, 'id'>>({ date: "", event: "" });
    useEffect(() => {
        if (!id) return;

        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const idStr = Array.isArray(id) ? id[0] : id; // fix id kiểu string | string[]
                const response = await apiCarbonCredits.getById(idStr);

                if (response?.payload) {
                    const data = response.payload;
                    setCarbonCredit({
                        ...data,
                        image: data.image || "",
                        afterImage: data.afterImage || "",
                        communityBenefits: data.communityBenefits || [],
                        biodiversityBenefits: data.biodiversityBenefits || [],
                        reports: data.reports || [],
                        transactions: data.transactions || [],
                        certificates: data.certificates || [],
                        timeline: data.timeline || [],
                    });

                } else {
                    setError("Không tìm thấy dữ liệu");
                    toast({
                        title: "Lỗi",
                        description: "Không tìm thấy dữ liệu Carbon Credit.",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                setError("Lỗi khi tải dữ liệu");
                toast({
                    title: "Lỗi",
                    description: "Không thể tải dữ liệu Carbon Credit.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);


    const handleInputChange = (field: keyof CarbonCredit, value: any) => {
        setCarbonCredit(prev => ({ ...prev, [field]: value }));
    };

    const handleAddCommunityBenefit = () => {
        if (newCommunityBenefit.trim() !== "") {
            setCarbonCredit(prev => ({
                ...prev,
                communityBenefits: [...prev.communityBenefits, newCommunityBenefit.trim()],
            }));
            setNewCommunityBenefit("");
        }
    };

    const handleRemoveCommunityBenefit = (index: number) => {
        setCarbonCredit(prev => ({
            ...prev,
            communityBenefits: prev.communityBenefits.filter((_, i) => i !== index),
        }));
    };

    const handleAddBiodiversityBenefit = () => {
        if (newBiodiversityBenefit.trim() !== "") {
            setCarbonCredit(prev => ({
                ...prev,
                biodiversityBenefits: [...prev.biodiversityBenefits, newBiodiversityBenefit.trim()],
            }));
            setNewBiodiversityBenefit("");
        }
    };

    const handleRemoveBiodiversityBenefit = (index: number) => {
        setCarbonCredit(prev => ({
            ...prev,
            biodiversityBenefits: prev.biodiversityBenefits.filter((_, i) => i !== index),
        }));
    };

    const handleAddTimelineEvent = () => {
        if (newTimelineEvent.date.trim() !== "" && newTimelineEvent.event.trim() !== "") {
            const eventToAdd = {
                ...newTimelineEvent
            };
            setCarbonCredit(prev => ({
                ...prev,
                timeline: [...prev.timeline, eventToAdd],
            }));
            setNewTimelineEvent({ date: "", event: "" });
        }
    };

    const handleRemoveTimelineEvent = (index: number) => {
        setCarbonCredit(prev => ({
            ...prev,
            timeline: prev.timeline.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const dataToSubmit = {
            ...carbonCredit,
        };

        try {
            if (!id) {
                toast({
                    title: "Lỗi",
                    description: "ID không hợp lệ.",
                    variant: "destructive",
                });
                return;
            }

            const idStr = typeof id === "string" ? id : id.length > 0 ? id[0] : "";

            if (!idStr) {
                toast({
                    title: "Lỗi",
                    description: "ID không hợp lệ.",
                    variant: "destructive",
                });
                return;
            }

            try {
                await apiCarbonCredits.updateById(idStr, dataToSubmit);
                toast({
                    title: "Thành công",
                    description: "Carbon Credit đã được cập nhật.",
                });
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Cập nhật thất bại.",
                    variant: "destructive",
                });
            }

            router.push("/quan-ly/admin/carboncredits");
        } catch (submitError) {
            console.error("Lỗi khi cập nhật:", submitError);
            toast({
                title: "Lỗi",
                description: "Cập nhật Carbon Credit thất bại. Vui lòng thử lại.",
                variant: "destructive",
            });
        }
    };

    // Loading state component
    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            {/* Bạn có thể sử dụng Shadcn Spinner nếu có, hoặc icon loading */}
            Đang tải dữ liệu...
        </div>
    );
    // Error state component
    if (error) return (
        <div className="flex justify-center items-center min-h-screen">
            <Card>
                <CardHeader>
                    <CardTitle className="text-red-600">Lỗi</CardTitle>
                </CardHeader>
                <CardContent>
                    {error}
                </CardContent>
            </Card>
        </div>
    );


    return (
        <div className="p-5 max-w-3xl mx-auto"> {/* Tăng max-width để form rộng rãi hơn */}
            <h1 className="text-3xl font-bold mb-6 text-center">Sửa Carbon Credit</h1> {/* Tăng kích thước tiêu đề */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Điều chỉnh gap lớn hơn, áp dụng grid trực tiếp cho form */}

                {/* Trường Tiêu đề (Toàn bộ chiều rộng) */}
                <div className="col-span-full">
                    <Label htmlFor="title">Tiêu đề</Label>
                    <Input
                        id="title"
                        placeholder="Tiêu đề"
                        value={carbonCredit.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        required
                    />
                </div>

                {/* Các cặp trường 2 cột */}
                <div>
                    <Label htmlFor="status">Trạng thái</Label>
                    <Input
                        id="status"
                        placeholder="Trạng thái"
                        value={carbonCredit.status}
                        onChange={(e) => handleInputChange("status", e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="location">Vị trí</Label>
                    <Input
                        id="location"
                        placeholder="Vị trí"
                        value={carbonCredit.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="area">Diện tích</Label>
                    <Input
                        id="area"
                        placeholder="Diện tích"
                        value={carbonCredit.area}
                        onChange={(e) => handleInputChange("area", e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="startDate">Thời gian bắt đầu</Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={carbonCredit.startDate}
                        onChange={(e) => handleInputChange("startDate", e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="endDate">Thời gian kết thúc</Label>
                    <Input
                        id="endDate"
                        type="date"
                        value={carbonCredit.endDate}
                        onChange={(e) => handleInputChange("endDate", e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="totalCredits">Tổng Credits</Label>
                    <Input
                        id="totalCredits"
                        placeholder="Tổng Credits"
                        value={carbonCredit.totalCredits}
                        onChange={(e) => handleInputChange("totalCredits", e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="usedCredits">Đã dùng Credits</Label>
                    <Input
                        id="usedCredits"
                        placeholder="Đã dùng Credits"
                        value={carbonCredit.usedCredits}
                        onChange={(e) => handleInputChange("usedCredits", e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="remainingCredits">Credits còn lại</Label>
                    <Input
                        id="remainingCredits"
                        placeholder="Credits còn lại"
                        value={carbonCredit.remainingCredits}
                        onChange={(e) => handleInputChange("remainingCredits", e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="projectManager">Quản lý dự án</Label>
                    <Input
                        id="projectManager"
                        placeholder="Quản lý dự án"
                        value={carbonCredit.projectManager}
                        onChange={(e) => handleInputChange("projectManager", e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="projectContact">Email quản lý</Label>
                    <Input
                        id="projectContact"
                        placeholder="Email quản lý"
                        value={carbonCredit.projectContact}
                        onChange={(e) => handleInputChange("projectContact", e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="projectPhone">Số điện thoại quản lý</Label>
                    <Input
                        id="projectPhone"
                        placeholder="Số điện thoại quản lý"
                        value={carbonCredit.projectPhone}
                        onChange={(e) => handleInputChange("projectPhone", e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="verificationDate">Ngày xác nhận</Label>
                    <Input
                        id="verificationDate"
                        type="date"
                        value={carbonCredit.verificationDate}
                        onChange={(e) => handleInputChange("verificationDate", e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="nextVerificationDate">Ngày xác nhận tiếp theo</Label>
                    <Input
                        id="nextVerificationDate"
                        type="date"
                        value={carbonCredit.nextVerificationDate}
                        onChange={(e) => handleInputChange("nextVerificationDate", e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="verificationBody">Đơn vị xác nhận</Label>
                    <Input
                        id="verificationBody"
                        placeholder="Đơn vị xác nhận"
                        value={carbonCredit.verificationBody}
                        onChange={(e) => handleInputChange("verificationBody", e.target.value)}
                        required
                    />
                </div>

                {/* Trường ảnh (Giữ 2 cột trong nhóm) */}
                <div>
                    <Label htmlFor="image">URL ảnh trước</Label>
                    <Input
                        id="image"
                        placeholder="URL ảnh trước"
                        value={carbonCredit.image}
                        onChange={(e) => handleInputChange("image", e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="afterImage">URL ảnh sau</Label>
                    <Input
                        id="afterImage"
                        placeholder="URL ảnh sau"
                        value={carbonCredit.afterImage}
                        onChange={(e) => handleInputChange("afterImage", e.target.value)}
                    />
                </div>

                {/* Trường Mô tả (Toàn bộ chiều rộng) */}
                <div className="col-span-full">
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                        id="description"
                        placeholder="Mô tả chi tiết về dự án Carbon Credit..." // Cập nhật placeholder
                        rows={5} // Tăng số dòng mặc định
                        value={carbonCredit.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        required
                    />
                </div>

                {/* Separator để phân tách các phần */}
                <div className="col-span-full">
                    <Separator />
                </div>


                {/* Các phần Card (Toàn bộ chiều rộng) */}
                {/* Lợi ích cộng đồng */}
                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Lợi ích cộng đồng</CardTitle> {/* Nhỏ hơn h1 chính */}
                    </CardHeader>
                    <CardContent className="grid gap-4"> {/* Tăng gap trong Card */}
                        <div className="flex flex-wrap gap-2">
                            {carbonCredit.communityBenefits.map((benefit, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center px-3 py-1 rounded-full"> {/* Tinh chỉnh Badge */}
                                    {benefit}
                                    <Cross2Icon
                                        className="ml-2 h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground" // Tinh chỉnh icon
                                        onClick={() => handleRemoveCommunityBenefit(index)}
                                    />
                                </Badge>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Thêm lợi ích mới, ví dụ: Tạo việc làm..." // Cập nhật placeholder
                                value={newCommunityBenefit}
                                onChange={(e) => setNewCommunityBenefit(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddCommunityBenefit();
                                    }
                                }}
                            />
                            <Button type="button" onClick={handleAddCommunityBenefit}>
                                Thêm
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Lợi ích đa dạng sinh học */}
                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Lợi ích đa dạng sinh học</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex flex-wrap gap-2">
                            {carbonCredit.biodiversityBenefits.map((benefit, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center px-3 py-1 rounded-full">
                                    {benefit}
                                    <Cross2Icon
                                        className="ml-2 h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground"
                                        onClick={() => handleRemoveBiodiversityBenefit(index)}
                                    />
                                </Badge>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Thêm lợi ích mới, ví dụ: Bảo vệ loài quý hiếm..."
                                value={newBiodiversityBenefit}
                                onChange={(e) => setNewBiodiversityBenefit(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddBiodiversityBenefit();
                                    }
                                }}
                            />
                            <Button type="button" onClick={handleAddBiodiversityBenefit}>
                                Thêm
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Mốc thời gian */}
                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Mốc thời gian (Timeline)</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-3"> {/* Tăng gap giữa các mục timeline */}
                            {carbonCredit.timeline.map((event, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-secondary/10"> {/* Tinh chỉnh border, padding, bg */}
                                    <div className="text-sm"> {/* Nhỏ chữ lại */}
                                        <strong className="font-medium">{event.date}:</strong> {event.event} {/* Tinh chỉnh font-weight */}
                                    </div>
                                    <Cross2Icon
                                        className="h-4 w-4 cursor-pointer text-red-500 hover:text-red-700"
                                        onClick={() => handleRemoveTimelineEvent(index)}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end mt-2"> {/* Sử dụng grid 3 cột cho input thêm, tăng gap, thêm margin top */}
                            <div className="col-span-1">
                                <Label htmlFor="newTimelineDate" className="sr-only">Ngày</Label> {/* Thêm sr-only vì label đã rõ ràng qua placeholder */}
                                <Input
                                    id="newTimelineDate"
                                    type="date"
                                    placeholder="Ngày" // Thêm placeholder
                                    value={newTimelineEvent.date}
                                    onChange={(e) => setNewTimelineEvent(prev => ({ ...prev, date: e.target.value }))}
                                />
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor="newTimelineEvent" className="sr-only">Sự kiện</Label> {/* Thêm sr-only */}
                                <div className="flex gap-2">
                                    <Input
                                        id="newTimelineEvent"
                                        placeholder="Sự kiện, ví dụ: Khởi công dự án"
                                        value={newTimelineEvent.event}
                                        onChange={(e) => setNewTimelineEvent(prev => ({ ...prev, event: e.target.value }))}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddTimelineEvent();
                                            }
                                        }}
                                    />
                                    <Button type="button" onClick={handleAddTimelineEvent}>
                                        Thêm
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Hiển thị các mảng phức tạp khác (chỉ đọc) */}
                {/* Separator */}
                <div className="col-span-full">
                    <Separator />
                </div>

                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Báo cáo (Reports)</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3"> {/* Tăng gap trong Card */}
                        {carbonCredit.reports.length > 0 ? (
                            <ul className="grid gap-2"> {/* Sử dụng grid cho list items */}
                                {carbonCredit.reports.map((report, index) => (
                                    <li key={index} className="p-3 border rounded-md bg-muted/20 text-sm"> {/* Tinh chỉnh styling */}
                                        <strong className="font-medium">{report.title}</strong><br />
                                        Ngày: {report.date} | Kích thước: {report.size} | Loại: {report.type}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic">Chưa có báo cáo nào được liên kết với dự án này.</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Giao dịch (Transactions)</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                        {carbonCredit.transactions.length > 0 ? (
                            <ul className="grid gap-2">
                                {carbonCredit.transactions.map((tx, index) => (
                                    <li key={index} className="p-3 border rounded-md bg-muted/20 text-sm">
                                        <strong className="font-medium">{tx.type}:</strong> {tx.amount} - {tx.value}<br />
                                        Ngày: {tx.date} | Trạng thái: {tx.status}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic">Chưa có giao dịch nào được ghi nhận cho dự án này.</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Chứng chỉ (Certificates)</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                        {carbonCredit.certificates.length > 0 ? (
                            <ul className="grid gap-2">
                                {carbonCredit.certificates.map((cert, index) => (
                                    <li key={index} className="p-3 border rounded-md bg-muted/20 text-sm">
                                        <strong className="font-medium">{cert.title}</strong><br />
                                        Ngày: {cert.date} | Kích thước: {cert.size}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic">Chưa có chứng chỉ nào được cấp cho dự án này.</p>
                        )}
                    </CardContent>
                </Card>


                {/* Nút Submit (Toàn bộ chiều rộng) */}
                <Button type="submit" className="w-full col-span-full mt-4"> {/* Thêm margin top */}
                    Cập nhật
                </Button>
            </form>
        </div>
    );
}