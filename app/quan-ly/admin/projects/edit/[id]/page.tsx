"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiProjects, FormData, IActivity, IProject } from "../../../../../fetch/fetch.projects";
import { MapPin, Calendar, Users, FileText, Activity, Save, Trash2, X, PlusCircle, MinusCircle, Package, DollarSign, TrendingUp } from "lucide-react";

export default function AdminProjectCarbonEditPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
    const { toast } = useToast();

    const [formData, setFormData] = useState<FormData | null>(null);
    const [projectData, setProjectData] = useState<IProject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newDocumentUrl, setNewDocumentUrl] = useState("");
    const [newActivity, setNewActivity] = useState<Partial<IActivity>>({
        title: "",
        date: "",
        description: "",
    });

    const fetchProject = useCallback(async () => {
        if (!projectId || typeof projectId !== "string") {
            setError("ID dự án không hợp lệ.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await apiProjects.getProject(projectId);
            if (response.data) {
                const project: IProject = response.data;
                setProjectData(project);
                const formattedData: FormData = {
                    name: project.name || "",
                    description: project.description || "",
                    coordinates: project.coordinates || "",
                    registrationDate: project.registrationDate ? new Date(project.registrationDate).toISOString().split("T")[0] : "",
                    startDate: project.startDate ? new Date(project.startDate).toISOString().split("T")[0] : "",
                    endDate: project.endDate ? new Date(project.endDate).toISOString().split("T")[0] : "",
                    carbonCredits: project.carbonCredits || 0,
                    carbonCreditsTotal: project.carbonCreditsTotal || 0,
                    carbonCreditsClaimed: project.carbonCreditsClaimed || 0,
                    area: project.area || 0,
                    location: project.location || "",
                    type: project.type || "",
                    status: project.status || "pending",
                    participants: project.participants ? project.participants.join(", ") : "",
                    progress: project.progress ?? 0,
                    documents: project.documents || [],
                    activities: project.activities || [],
                };
                setFormData(formattedData);
            } else {
                setError("Không tìm thấy dự án.");
            }
        } catch (err: any) {
            setError(err.message || "Không thể tải dự án.");
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        if (projectId) fetchProject();
    }, [fetchProject, projectId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            if (!prev) return null;
            if (["carbonCredits", "carbonCreditsTotal", "carbonCreditsClaimed", "area", "progress"].includes(name)) {
                const numValue = Number(value);
                return { ...prev, [name]: isNaN(numValue) ? 0 : numValue };
            }
            if (["registrationDate", "startDate", "endDate"].includes(name)) {
                return { ...prev, [name]: value };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => (prev ? { ...prev, status: value as "pending" | "active" | "completed" | "archived" } : null));
    };

    const handleAddDocument = () => {
        if (newDocumentUrl.trim() && formData) {
            setFormData(prev => prev ? { ...prev, documents: [...prev.documents, newDocumentUrl.trim()] } : null);
            setNewDocumentUrl("");
        } else {
            toast({
                title: "Cảnh báo",
                description: "Vui lòng nhập URL/tên tài liệu.",
                variant: "default",
            });
        }
    };

    const handleRemoveDocument = (indexToRemove: number) => {
        if (formData) {
            setFormData(prev => prev ? { ...prev, documents: prev.documents.filter((_, index) => index !== indexToRemove) } : null);
        }
    };

    const handleNewActivityInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewActivity(prev => ({ ...prev, [name]: value }));
    };

    const handleAddActivity = () => {
        if (newActivity.title.trim() && newActivity.date.trim() && newActivity.description.trim() && formData) {
            const validDate = new Date(newActivity.date);
            if (isNaN(validDate.getTime())) {
                toast({
                    title: "Lỗi",
                    description: "Ngày hoạt động không hợp lệ.",
                    variant: "destructive",
                });
                return;
            }
            const activityToAdd: IActivity = {
                title: newActivity.title.trim(),
                date: validDate.toISOString(),
                description: newActivity.description.trim(),
            };
            setFormData(prev => prev ? { ...prev, activities: [...prev.activities, activityToAdd] } : null);
            setNewActivity({ title: "", date: "", description: "" });
        } else {
            toast({
                title: "Cảnh báo",
                description: "Vui lòng điền đầy đủ thông tin cho hoạt động mới.",
                variant: "default",
            });
        }
    };

    const handleRemoveActivity = (indexToRemove: number) => {
        if (formData) {
            setFormData(prev => prev ? { ...prev, activities: prev.activities.filter((_, index) => index !== indexToRemove) } : null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectId || typeof projectId !== "string" || !formData) {
            toast({
                title: "Lỗi",
                description: "ID dự án không hợp lệ hoặc dữ liệu không đầy đủ.",
                variant: "destructive",
            });
            return;
        }
        try {
            const projectDataToSend: Partial<IProject> = {
                ...formData,
                registrationDate: formData.registrationDate ? new Date(formData.registrationDate).toISOString() : undefined,
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
                coordinates: formData.coordinates
                    ? (() => {
                        const [lat, lng] = formData.coordinates.split(",").map(Number);
                        if (isNaN(lat) || isNaN(lng)) {
                            toast({
                                title: "Lỗi",
                                description: "Định dạng tọa độ không hợp lệ (Ví dụ: 10.123,106.456).",
                                variant: "destructive",
                            });
                            return undefined;
                        }
                        return { lat, lng };
                    })()
                    : undefined,
                participants: formData.participants
                    ? formData.participants.split(",").map(p => p.trim()).filter(p => p !== "")
                    : [],
                progress: formData.progress !== undefined ? Math.min(Math.max(formData.progress, 0), 100) : undefined,
                documents: formData.documents,
                activities: formData.activities.map(activity => ({
                    title: activity.title,
                    date: activity.date,
                    description: activity.description,
                })),
                userId: projectData?.userId,
            };

            if (projectDataToSend.coordinates === undefined && formData.coordinates?.trim() !== "") {
                return;
            }

            Object.keys(projectDataToSend).forEach(key => {
                if (projectDataToSend[key as keyof Partial<IProject>] === undefined && !['documents', 'activities'].includes(key) && key !== 'coordinates') {
                    delete projectDataToSend[key as keyof Partial<IProject>];
                }
                if (key === 'coordinates' && projectDataToSend.coordinates === undefined) {
                    delete projectDataToSend[key];
                }
            });

            await apiProjects.update(projectId, projectDataToSend);
            toast({
                title: "Thành công",
                description: "Cập nhật dự án thành công!",
            });
            router.push("/quan-ly/admin/projects");
        } catch (err: any) {
            toast({
                title: "Lỗi",
                description: err.message || "Không thể cập nhật dự án.",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async () => {
        if (!projectId || typeof projectId !== "string") {
            toast({
                title: "Lỗi",
                description: "ID dự án không hợp lệ.",
                variant: "destructive",
            });
            return;
        }
        if (!confirm("Bạn có chắc chắn muốn xóa dự án này không?")) return;
        try {
            await apiProjects.delete(projectId);
            toast({
                title: "Thành công",
                description: "Xóa dự án thành công!",
            });
            router.push("/quan-ly/admin/projects");
        } catch (err: any) {
            toast({
                title: "Lỗi",
                description: err.message || "Không thể xóa dự án.",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return <div className="container mx-auto py-10 px-4 text-center">Đang tải thông tin dự án...</div>;
    }

    if (error || !formData) {
        return (
            <div className="container mx-auto py-10 px-4 text-center">
                <p className="text-red-500">{error || "Không tìm thấy dự án."}</p>
                <Button onClick={() => router.push("/quan-ly/admin/projects")} className="mt-4">
                    Quay lại danh sách
                </Button>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full justify-center py-8 px-4">
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle>Sửa dự án Carbon</CardTitle>
                    <CardDescription>Cập nhật thông tin chi tiết cho dự án Carbon.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <Package className="mr-2 h-5 w-5" />
                                <CardTitle className="text-lg">Thông tin chung</CardTitle>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="col-span-2">
                                    <Label htmlFor="name" className="flex items-center mb-1">
                                        <FileText className="mr-2 h-4 w-4" /> Tên dự án
                                    </Label>
                                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Nhập tên dự án" />
                                </div>
                                <div className="col-span-2">
                                    <Label htmlFor="description" className="flex items-center mb-1">
                                        <FileText className="mr-2 h-4 w-4" /> Mô tả
                                    </Label>
                                    <Textarea id="description" name="description" value={formData.description || ""} onChange={handleInputChange} placeholder="Nhập mô tả dự án" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mt-6">
                            <div className="flex items-center">
                                <MapPin className="mr-2 h-5 w-5" />
                                <CardTitle className="text-lg">Vị trí và Loại</CardTitle>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="coordinates" className="flex items-center mb-1">
                                        <MapPin className="mr-2 h-4 w-4" /> Tọa độ (lat,lng)
                                    </Label>
                                    <Input id="coordinates" name="coordinates" value={formData.coordinates || ""} onChange={handleInputChange} placeholder="Ví dụ: 22.3456,104.1234" />
                                </div>
                                <div>
                                    <Label htmlFor="location" className="flex items-center mb-1">
                                        <MapPin className="mr-2 h-4 w-4" /> Địa điểm
                                    </Label>
                                    <Input id="location" name="location" value={formData.location || ""} onChange={handleInputChange} placeholder="Ví dụ: Lào Cai, Vietnam" />
                                </div>
                                <div>
                                    <Label htmlFor="type" className="flex items-center mb-1">
                                        <FileText className="mr-2 h-4 w-4" /> Loại dự án
                                    </Label>
                                    <Input id="type" name="type" value={formData.type || ""} onChange={handleInputChange} placeholder="Ví dụ: forestry" />
                                </div>
                                <div>
                                    <Label htmlFor="area" className="flex items-center mb-1">
                                        <FileText className="mr-2 h-4 w-4" /> Diện tích
                                    </Label>
                                    <Input id="area" name="area" type="number" value={formData.area || 0} onChange={handleInputChange} placeholder="Nhập diện tích (m²/ha)" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mt-6">
                            <div className="flex items-center">
                                <TrendingUp className="mr-2 h-5 w-5" />
                                <CardTitle className="text-lg">Trạng thái và Tiến độ</CardTitle>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="status" className="flex items-center mb-1">
                                        <FileText className="mr-2 h-4 w-4" /> Trạng thái
                                    </Label>
                                    <Select value={formData.status} onValueChange={handleSelectChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Chờ duyệt</SelectItem>
                                            <SelectItem value="active">Hoạt động</SelectItem>
                                            <SelectItem value="completed">Hoàn thành</SelectItem>
                                            <SelectItem value="archived">Lưu trữ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="progress" className="flex items-center mb-1">
                                        <FileText className="mr-2 h-4 w-4" /> Tiến độ (%)
                                    </Label>
                                    <Input id="progress" name="progress" type="number" min="0" max="100" value={formData.progress || 0} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mt-6">
                            <div className="flex items-center">
                                <Calendar className="mr-2 h-5 w-5" />
                                <CardTitle className="text-lg">Ngày tháng</CardTitle>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="registrationDate" className="flex items-center mb-1">
                                        <Calendar className="mr-2 h-4 w-4" /> Ngày đăng ký
                                    </Label>
                                    <Input id="registrationDate" name="registrationDate" type="date" value={formData.registrationDate} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label htmlFor="startDate" className="flex items-center mb-1">
                                        <Calendar className="mr-2 h-4 w-4" /> Ngày bắt đầu
                                    </Label>
                                    <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <Label htmlFor="endDate" className="flex items-center mb-1">
                                        <Calendar className="mr-2 h-4 w-4" /> Ngày kết thúc
                                    </Label>
                                    <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mt-6">
                            <div className="flex items-center">
                                <DollarSign className="mr-2 h-5 w-5" />
                                <CardTitle className="text-lg">Tín chỉ Carbon</CardTitle>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <Label htmlFor="carbonCredits" className="flex items-center mb-1">
                                        <FileText className="mr-2 h-4 w-4" /> Tín chỉ
                                    </Label>
                                    <Input id="carbonCredits" name="carbonCredits" type="number" value={formData.carbonCredits || 0} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label htmlFor="carbonCreditsTotal" className="flex items-center mb-1">
                                        <FileText className="mr-2 h-4 w-4" /> Tổng
                                    </Label>
                                    <Input id="carbonCreditsTotal" name="carbonCreditsTotal" type="number" value={formData.carbonCreditsTotal || 0} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label htmlFor="carbonCreditsClaimed" className="flex items-center mb-1">
                                        <FileText className="mr-2 h-4 w-4" /> Đã nhận
                                    </Label>
                                    <Input id="carbonCreditsClaimed" name="carbonCreditsClaimed" type="number" value={formData.carbonCreditsClaimed || 0} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mt-6">
                            <div className="flex items-center">
                                <Users className="mr-2 h-5 w-5" />
                                <CardTitle className="text-lg">Người tham gia</CardTitle>
                            </div>
                            <div className="grid grid-cols-1">
                                <div>
                                    <Label htmlFor="participants" className="flex items-center mb-1">
                                        <Users className="mr-2 h-4 w-4" /> Danh sách (phân cách bằng dấu phẩy)
                                    </Label>
                                    <Input id="participants" name="participants" value={formData.participants || ""} onChange={handleInputChange} placeholder="Ví dụ: user1, user2, user3" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 border p-4 rounded-md space-y-3">
                            <div className="flex items-center">
                                <FileText className="mr-2 h-5 w-5" />
                                <CardTitle className="text-lg">Quản lý Tài liệu</CardTitle>
                            </div>
                            <div>
                                <Label htmlFor="newDocumentUrl" className="mb-1">Thêm tài liệu mới</Label>
                                <div className="flex space-x-2">
                                    <Input
                                        id="newDocumentUrl"
                                        value={newDocumentUrl}
                                        onChange={(e) => setNewDocumentUrl(e.target.value)}
                                        placeholder="Nhập URL hoặc tên tài liệu mới"
                                    />
                                    <Button type="button" onClick={handleAddDocument} size="sm">
                                        <PlusCircle className="mr-2 h-4 w-4" /> Thêm
                                    </Button>
                                </div>
                            </div>
                            {formData?.documents && formData.documents.length > 0 && (
                                <div className="space-y-2">
                                    <Label>Danh sách Tài liệu</Label>
                                    <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-gray-700">
                                        {formData.documents.map((doc, index) => (
                                            <li key={index} className="flex justify-between items-center">
                                                <span>{doc}</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveDocument(index)}
                                                    className="text-red-500 hover:text-red-700 p-1 h-auto"
                                                >
                                                    <MinusCircle className="h-4 w-4" />
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 border p-4 rounded-md space-y-4">
                            <div className="flex items-center">
                                <Activity className="mr-2 h-5 w-5" />
                                <CardTitle className="text-lg">Quản lý Hoạt động</CardTitle>
                            </div>
                            <div className="space-y-3 p-4 border rounded-md bg-gray-50">
                                <CardTitle className="text-base mb-2">Thêm hoạt động mới</CardTitle>
                                <div>
                                    <Label htmlFor="newActivityTitle" className="mb-1">Tiêu đề</Label>
                                    <Input
                                        id="newActivityTitle"
                                        name="title"
                                        value={newActivity.title}
                                        onChange={handleNewActivityInputChange}
                                        placeholder="Nhập tiêu đề hoạt động"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="newActivityDate" className="mb-1">Ngày</Label>
                                    <Input
                                        id="newActivityDate"
                                        name="date"
                                        type="date"
                                        value={newActivity.date}
                                        onChange={handleNewActivityInputChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="newActivityDescription" className="mb-1">Mô tả</Label>
                                    <Textarea
                                        id="newActivityDescription"
                                        name="description"
                                        value={newActivity.description}
                                        onChange={handleNewActivityInputChange}
                                        placeholder="Nhập mô tả hoạt động"
                                    />
                                </div>
                                <Button type="button" onClick={handleAddActivity} size="sm">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Thêm hoạt động
                                </Button>
                            </div>
                            {formData?.activities && formData.activities.length > 0 && (
                                <div className="space-y-3 mt-4">
                                    <Label>Danh sách Hoạt động</Label>
                                    {formData.activities.map((activity, index) => (
                                        <Card key={index} className="p-3 flex justify-between items-start">
                                            <div className="flex-1 mr-4">
                                                <CardTitle className="text-base">{activity.title}</CardTitle>
                                                <CardDescription>Ngày: {activity.date ? new Date(activity.date).toLocaleDateString() : 'Không rõ ngày'}</CardDescription>
                                                <p className="text-sm text-gray-700 mt-1">{activity.description}</p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveActivity(index)}
                                                className="text-red-500 hover:text-red-700 p-1 h-auto"
                                            >
                                                <MinusCircle className="h-4 w-4" />
                                            </Button>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-4 mt-8">
                            <Button type="button" variant="outline" onClick={() => router.push("/quan-ly/admin/projects")} className="flex items-center">
                                <X className="mr-2 h-4 w-4" /> Hủy
                            </Button>
                            <Button type="button" variant="destructive" onClick={handleDelete} className="flex items-center">
                                <Trash2 className="mr-2 h-4 w-4" /> Xóa dự án
                            </Button>
                            <Button type="submit" className="flex items-center">
                                <Save className="mr-2 h-4 w-4" /> Cập nhật dự án
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}