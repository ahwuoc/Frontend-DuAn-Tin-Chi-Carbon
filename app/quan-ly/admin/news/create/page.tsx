"use client";
import statuses from "../mockup_data/statuses";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    PlusCircle,
    XCircle,
    UploadCloud,
    Tags,
    ListFilter,
    FileArchive,
} from "lucide-react";
import categories from "../mockup_data/categories";
import { getUserFromLocalStorage, uploadToCloudinary } from "../../../../utils/common";
import { Field } from "../components/Field_Component";
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "my_unsigned_preset";
export default function NewsFormPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [formData, setFormData] = useState<Partial<INews>>({
        title: "",
        content: "",
        userId: "",
        category: "",
        status: "draft",
        image: "",
        tags: [],
    });
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    useEffect(() => {
        const user = getUserFromLocalStorage();
        if (!user || !user.userId) {
            toast({ title: "Lỗi", description: "Không tìm thấy thông tin người dùng để tạo tin tức.", variant: "destructive" });
        } else {
            setFormData(prev => ({ ...prev, userId: user.userId }));
        }
    }, [toast]);
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
            setImagePreview(null);
            setFormData(prev => ({ ...prev, image: "" }));
        }
    };
    const handleCloudinaryUpload = async () => {
        if (!imageFile) {
            toast({ title: "Chưa chọn tệp", description: "Vui lòng chọn ảnh.", variant: "default" });
            return;
        }
        if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
            toast({ title: "Lỗi cấu hình", description: "Thiếu Cloudinary config.", variant: "destructive" });
            return;
        }
        setIsUploadingImage(true);
        try {
            const uploadedUrl = await uploadToCloudinary(imageFile, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET);
            setFormData(prev => ({ ...prev, image: uploadedUrl }));
            setImagePreview(uploadedUrl);
            setImageFile(null);
            toast({ title: "Thành công", description: "Đã upload ảnh!" });
        } catch (err: any) {
            toast({ title: "Upload lỗi", description: err.message || "Không thể tải ảnh lên Cloudinary.", variant: "destructive" });
        } finally {
            setIsUploadingImage(false);
        }
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.title || !formData.content || !formData.category || !formData.userId) {
            toast({
                title: "Thiếu thông tin",
                description: "Vui lòng điền đầy đủ Tiêu đề, Nội dung, chọn Danh mục và đảm bảo User ID được tải.",
                variant: "destructive",
            });
            return;
        }
        setLoading(true);
        const payload = {
            title: formData.title,
            content: formData.content,
            userId: formData.userId,
            category: formData.category,
            status: formData.status || 'draft',
            image: formData.image || "",
            tags: formData.tags || [],
        };
        try {
            const response = await apiNews.create(payload as Omit<INews, '_id' | 'createdAt' | 'updatedAt'>);
            if (response && ((response as any).data || (response as any).success)) {
                toast({ title: "Thành công", description: "Đã thêm tin tức mới!" });
                router.push("/quan-ly/admin/news");
            } else {
                toast({ title: "Có lỗi xảy ra", description: "Không nhận được phản hồi thành công từ server.", variant: "destructive" });
            }
        } catch (err: any) {
            toast({
                title: "Lỗi",
                description: err.message || "Không thể tạo tin tức!",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-3xl mx-auto shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl sm:text-3xl font-semibold text-gray-800 flex items-center">
                        <Newspaper className="mr-3 h-7 w-7 text-green-600" />
                        Soạn tin tức mới
                    </CardTitle>
                    <CardDescription>
                        Điền thông tin để tạo một bài viết mới.
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
                        <Field label="Tải ảnh minh họa" icon={<UploadCloud size={18} />}>
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
                            <Button type="button" variant="outline" onClick={() => router.push("/quan-ly/admin/news")} disabled={loading || isUploadingImage} size="lg">
                                <XCircle className="mr-2 h-5 w-5" /> Hủy
                            </Button>
                            <Button type="submit" disabled={loading || isUploadingImage} size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PlusCircle className="mr-2 h-5 w-5" />}
                                {loading ? "Đang xử lý..." : "Đăng tin"}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}