"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiNews, INews } from "@/app/fetch/fetch.news";
import {
    Loader2,
    Newspaper,
    Save,
    PlusCircle,
    XCircle,
    UploadCloud,
    Image as ImageIcon,
    Tags,
    ListFilter,
    FileArchive,
} from "lucide-react";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "my_unsigned_preset";


interface FieldProps {
    label: string;
    children: React.ReactNode;
    htmlFor?: string;
    required?: boolean;
    icon?: React.ReactNode;
    className?: string;
}

function Field({ label, children, htmlFor, required, icon, className }: FieldProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            <Label htmlFor={htmlFor} className="flex items-center text-sm font-medium text-gray-700">
                {icon && <span className="mr-2 h-5 w-5 text-gray-500">{icon}</span>}
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {children}
        </div>
    );
}

export default function NewsFormPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();

    const newsId = params.id as string | undefined;

    const [formData, setFormData] = useState<Partial<INews>>({
        title: "",
        content: "",
        userId: undefined,
        category: "",
        status: "draft",
        image: "",
        tags: [],
    });
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    useEffect(() => {
        if (newsId) {
            setIsFetching(true);
            const fetchNews = async () => {
                try {
                    const response = await apiNews.getById(newsId);
                    if (response?.payload?.data) {
                        const newsData = response.payload.data;
                        setFormData({
                            ...newsData[0],                // lấy phần tử đầu
                            tags: newsData[0]?.tags || [], // lấy tags phần tử đầu hoặc []
                        });

                        if (newsData[0]?.image) {
                            setImagePreview(newsData[0].image);
                        }

                    } else {
                        toast({ title: "Lỗi", description: "Không tìm thấy dữ liệu tin tức.", variant: "destructive" });
                        router.push("/quan-ly/admin/news");
                    }
                } catch (err) {
                    toast({ title: "Lỗi", description: "Không thể tải chi tiết tin tức.", variant: "destructive" });
                } finally {
                    setIsFetching(false);
                }
            };
            fetchNews();
        } else {
            const storedUserId = localStorage.getItem("user_id");
            let parsedUserId: string | undefined = undefined;
            if (storedUserId) {
                try {
                    parsedUserId = JSON.parse(storedUserId);
                } catch {
                    parsedUserId = undefined;
                }
            }
            setFormData(prev => ({ ...prev, userId: parsedUserId }));
        }
    }, [newsId, toast, router]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: keyof Partial<INews>, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
        const tagsArray = e.target.value.split(",").map(tag => tag.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, tags: tagsArray }));
    };

    const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(formData.image || null);
        }
    };

    const handleCloudinaryUpload = async () => {
        if (!imageFile) {
            toast({ title: "Chưa chọn tệp", description: "Vui lòng chọn một tệp ảnh để tải lên.", variant: "default" });
            return;
        }
        if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
            toast({ title: "Lỗi cấu hình", description: "Cloudinary cloud name hoặc upload preset chưa được thiết lập.", variant: "destructive" });
            return;
        }

        setIsUploadingImage(true);
        const uploadFormData = new FormData();
        uploadFormData.append("file", imageFile);
        uploadFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: uploadFormData,
            });
            const data = await res.json();
            if (data.secure_url) {
                setFormData(prev => ({ ...prev, image: data.secure_url }));
                setImagePreview(data.secure_url);
                setImageFile(null);
                toast({ title: "Thành công", description: "Ảnh đã được tải lên Cloudinary!" });
            } else {
                throw new Error(data.error?.message || "Lỗi tải lên Cloudinary không xác định.");
            }
        } catch (error: any) {
            toast({ title: "Lỗi tải ảnh", description: error.message || "Không thể tải ảnh lên Cloudinary.", variant: "destructive" });
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.title || !formData.content || !formData.category) {
            toast({ title: "Thiếu thông tin", description: "Vui lòng điền Tiêu đề, Nội dung và Danh mục.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const dataToSubmit: Partial<INews> = { ...formData };
            if (!dataToSubmit.userId) {
                const storedUserId = localStorage.getItem("user_id");
                if (storedUserId) {
                    try {
                        dataToSubmit.userId = JSON.parse(storedUserId) || undefined;
                    } catch {
                        dataToSubmit.userId = undefined;
                    }
                }
            }

            if (!dataToSubmit.userId && !newsId) {
                toast({ title: "Thiếu thông tin User", description: "Không tìm thấy User ID để tạo tin tức.", variant: "destructive" });
                setLoading(false);
                return;
            }


            if (newsId) {
                await apiNews.update(newsId, dataToSubmit as INews);
                toast({ title: "Thành công", description: "Đã cập nhật tin tức!" });
            } else {
                await apiNews.create(dataToSubmit as Omit<INews, '_id' | 'createdAt' | 'updatedAt'>);
                toast({ title: "Thành công", description: "Đã thêm tin tức mới!" });
            }
            router.push("/quan-ly/admin/news");
        } catch (err: any) {
            toast({ title: "Lỗi", description: err.message || "Không thể lưu tin tức!", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        "Tín chỉ carbon", "ESG", "Phát triển bền vững", "Biến đổi khí hậu",
        "Năng lượng tái tạo", "Công nghệ xanh", "Thị trường", "Chính sách", "Sự kiện"
    ];
    const statuses: Array<{ value: INews['status'], label: string }> = [
        { value: "draft", label: "Bản nháp" },
        { value: "published", label: "Đã xuất bản" },
        { value: "archived", label: "Lưu trữ" },
    ];

    if (isFetching && newsId) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <Loader2 className="h-12 w-12 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-3xl mx-auto shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl sm:text-3xl font-semibold text-gray-800 flex items-center">
                        <Newspaper className="mr-3 h-7 w-7 text-green-600" />
                        {newsId ? "Chỉnh sửa tin tức" : "Soạn tin tức mới"}
                    </CardTitle>
                    <CardDescription>
                        {newsId ? "Cập nhật thông tin chi tiết cho tin tức." : "Điền thông tin để tạo một bài viết mới."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Field label="Tiêu đề" htmlFor="title" required icon={<Newspaper size={18} />}>
                            <Input id="title" name="title" value={formData.title || ""} onChange={handleInputChange} placeholder="Nhập tiêu đề bài viết" />
                        </Field>

                        <Field label="Nội dung" htmlFor="content" required icon={<FileArchive size={18} />}>
                            <Textarea id="content" name="content" value={formData.content || ""} onChange={handleInputChange} rows={10} placeholder="Soạn nội dung bài viết..." />
                        </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Field label="Danh mục" htmlFor="category" required icon={<ListFilter size={18} />}>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => handleSelectChange("category", value)}
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field label="Trạng thái" htmlFor="status" required icon={<FileArchive size={18} />}>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => handleSelectChange("status", value as INews['status'])}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((stat) => (
                                            <SelectItem key={stat.value} value={stat.value}>{stat.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>

                        <Field label="URL hình ảnh đại diện" htmlFor="image" icon={<ImageIcon size={18} />}>
                            <Input id="image" name="image" value={formData.image || ""} onChange={handleInputChange} placeholder="Dán URL hình ảnh hoặc tải lên bên dưới" />
                        </Field>

                        <Field label="Tải ảnh mới lên" icon={<UploadCloud size={18} />}>
                            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 items-start">
                                <Input id="imageFile" type="file" accept="image/*" onChange={handleImageFileChange} className="max-w-xs" />
                                <Button type="button" variant="outline" onClick={handleCloudinaryUpload} disabled={!imageFile || isUploadingImage || loading}>
                                    {isUploadingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                                    {isUploadingImage ? "Đang tải..." : "Tải lên Cloudinary"}
                                </Button>
                            </div>
                            {imagePreview && (
                                <div className="mt-3 border rounded-lg p-2 inline-block bg-gray-50">
                                    <img src={imagePreview} alt="Xem trước" className="h-36 w-auto object-contain rounded-md" />
                                </div>
                            )}
                        </Field>

                        <Field label="Tags (Thẻ)" htmlFor="tags" icon={<Tags size={18} />}>
                            <Input id="tags" name="tags" value={formData.tags?.join(", ") || ""} onChange={handleTagsChange} placeholder="carbon, esg, tin tức" />
                            <p className="text-xs text-gray-500 mt-1">Các tags cách nhau bởi dấu phẩy (,)</p>
                        </Field>

                        <CardFooter className="flex justify-end gap-3 mt-8 p-0">
                            <Button type="button" variant="outline" onClick={() => router.push("/quan-ly/admin/news")} disabled={loading || isFetching} size="lg">
                                <XCircle className="mr-2 h-5 w-5" /> Hủy
                            </Button>
                            <Button type="submit" disabled={loading || isFetching || isUploadingImage} size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (newsId ? <Save className="mr-2 h-5 w-5" /> : <PlusCircle className="mr-2 h-5 w-5" />)}
                                {loading ? "Đang xử lý..." : (newsId ? "Lưu thay đổi" : "Đăng tin")}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}