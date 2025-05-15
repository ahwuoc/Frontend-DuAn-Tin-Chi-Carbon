// src/app/quan-ly/admin/projects/edit/[id]/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react"; // Thêm useCallback
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload as UploadIcon, X, FileText, MapPin } from "lucide-react"; // Thêm icons
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { apiProjectCarbon } from "@/app/fetch/fetch.project-carbon";
// Import interfaces từ file types riêng biệt
import { IProjectCarbon, IProjectCarbonDetails } from "@/types/project-carbon";
import { useToast } from "@/hooks/use-toast";

// Lấy tên cloud từ biến môi trường
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const uploadPreset = "my_unsigned_preset"; // Sử dụng cùng preset với trang Create

// Định nghĩa kiểu dữ liệu cho state form (loại bỏ các trường tự tạo bởi backend)
type ProjectFormData = Omit<IProjectCarbon, '_id' | 'createdAt' | 'updatedAt'>;

export default function AdminProjectCarbonEditPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;
    const { toast } = useToast();

    // Ref cho input file
    const landDocumentsInputRef = useRef<HTMLInputElement>(null);
    const kmlFileInputRef = useRef<HTMLInputElement>(null);

    // State cho dữ liệu form
    const [formData, setFormData] = useState<ProjectFormData | null>(null);

    // State để quản lý file đã chọn (mới) và file hiện có (URL)
    const [existingLandDocumentUrls, setExistingLandDocumentUrls] = useState<string[]>([]);
    const [newLandDocumentsFiles, setNewLandDocumentsFiles] = useState<File[]>([]);
    const [removedLandDocumentUrls, setRemovedLandDocumentUrls] = useState<string[]>([]); // Theo dõi URL file cũ bị xóa

    const [existingKmlFileUrl, setExistingKmlFileUrl] = useState<string | null>(null);
    const [newKmlFileFile, setNewKmlFileFile] = useState<File | null>(null);
    const [removedKmlFileUrl, setRemovedKmlFileUrl] = useState<string | null>(null); // Theo dõi URL file KML cũ bị xóa

    // State cho trạng thái tải dữ liệu ban đầu và submit form
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    // Effect để fetch dữ liệu project khi component mount hoặc id thay đổi
    useEffect(() => {
        const fetchProjectData = async () => {
            if (!projectId) {
                setError("Không tìm thấy ID dự án.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const response = await apiProjectCarbon.getById(projectId);
                // Điều chỉnh tùy cấu trúc response. Giả định data nằm trong response.data
                const projectData = response?.data?.data || response?.data;

                if (projectData) {
                    setFormData({
                        ...projectData,
                        details: {
                            ...projectData.details,
                            // Chuyển string ngày tháng từ API thành Date object
                            riceStartDate: projectData.details?.riceStartDate ? new Date(projectData.details.riceStartDate) : null,
                            riceEndDate: projectData.details?.riceEndDate ? new Date(projectData.details.riceEndDate) : null,
                        },
                        // userId không cần thiết cho form sửa trừ khi cho phép sửa
                        userId: projectData.userId || "", // Có thể giữ lại nếu cần hiển thị
                        // Loại bỏ _id, createdAt, updatedAt
                        _id: undefined as any,
                        createdAt: undefined as any,
                        updatedAt: undefined as any,
                    } as ProjectFormData); // Ép kiểu về ProjectFormData

                    // Set state cho các file hiện có
                    setExistingLandDocumentUrls(projectData.landDocuments || []);
                    setExistingKmlFileUrl(projectData.kmlFile || null);

                } else {
                    // Xử lý trường hợp không tìm thấy projectData hoặc response không hợp lệ
                    setError("Không lấy được thông tin dự án.");
                    setFormData(null); // Đảm bảo formData là null
                }
            } catch (err: any) {
                console.error(`Lỗi khi lấy dữ liệu dự án ${projectId}:`, err);
                setError("Không thể tải thông tin dự án. Vui lòng thử lại.");
                setFormData(null); // Đảm bảo formData là null
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [projectId]); // Fetch lại khi projectId thay đổi

    // --- Các hàm xử lý input, select, date tương tự trang Create ---
    // Cần đảm bảo các hàm này xử lý state `formData` có thể là `null`

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: value } : null);
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: '' });
        }
    };

    // Cần đảm bảo các hàm này xử lý state `formData` có thể là `null`
    const handleSelectChange = (name: keyof ProjectFormData, value: string) => {
        setFormData(prev => prev ? { ...prev, [name]: value as any } : null);
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: '' });
        }
        // Reset details khi đổi loại dự án (trong trang sửa, việc này có thể phức tạp hơn
        // vì có thể muốn giữ lại dữ liệu details nếu đổi đi rồi đổi lại.
        // Để đơn giản, ta vẫn reset như trang Create)
        if (name === 'projectType') {
            setFormData(prev => prev ? ({
                ...prev,
                details: {
                    forestLocation: "", forestArea: "", treeSpecies: "", plantingAge: "", averageHeight: "", averageCircumference: "", previousDeforestation: "",
                    riceLocation: "", riceArea: "", riceTerrain: "", riceClimate: "", riceSoilType: "", riceStartDate: null, riceEndDate: null,
                    biocharRawMaterial: "", biocharCarbonContent: "", biocharLandArea: "", biocharApplicationMethod: "",
                }
            }) : null);
            const newErrors = { ...formErrors };
            Object.keys(newErrors).forEach(key => {
                if (key.startsWith('details.')) {
                    delete newErrors[key];
                }
            });
            setFormErrors(newErrors);
        }
    };

    // Cần đảm bảo các hàm này xử lý state `formData` có thể là `null`
    const handleDetailInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? ({
            ...prev,
            details: {
                ...prev.details,
                [name]: value
            }
        }) : null);
        if (formErrors[`details.${name}`]) {
            setFormErrors({ ...formErrors, [`details.${name}`]: '' });
        }
    };

    // Cần đảm bảo các hàm này xử lý state `formData` có thể là `null`
    const handleDetailSelectChange = (name: keyof IProjectCarbonDetails, value: string) => {
        setFormData(prev => prev ? ({
            ...prev,
            details: {
                ...prev.details,
                [name]: value
            }
        }) : null);
        if (formErrors[`details.${name}`]) {
            setFormErrors({ ...formErrors, [`details.${name}`]: '' });
        }
    };

    // Cần đảm bảo các hàm này xử lý state `formData` có thể là `null`
    const handleDetailDateChange = (name: keyof IProjectCarbonDetails, date: Date | undefined) => {
        setFormData(prev => prev ? ({
            ...prev,
            details: {
                ...prev.details,
                [name]: date || null
            }
        }) : null);
        if (formErrors[`details.${name}`]) {
            setFormErrors({ ...formErrors, [`details.${name}`]: '' });
        }
    };

    // --- Xử lý file upload cho trang Sửa ---

    // Xử lý khi chọn file giấy tờ đất đai mới
    const handleNewLandDocumentsFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // Thêm file mới chọn vào danh sách file mới
            setNewLandDocumentsFiles(prev => [...prev, ...Array.from(e.target.files)]);
            // Xóa lỗi validate file nếu có
            if (formErrors.landDocuments) {
                setFormErrors({ ...formErrors, landDocuments: '' });
            }
        }
    };

    // Xử lý khi chọn file KML/KMZ mới
    const handleNewKmlFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            // Chỉ giữ lại file mới nhất nếu chọn lại
            setNewKmlFileFile(e.target.files[0]);
            // Xóa lỗi validate file nếu có
            if (formErrors.kmlFile) {
                setFormErrors({ ...formErrors, kmlFile: '' });
            }
            // Nếu có file KML cũ, đánh dấu nó sẽ bị xóa
            if (existingKmlFileUrl) {
                setRemovedKmlFileUrl(existingKmlFileUrl);
            }

        } else {
            // Nếu bỏ chọn (ấn cancel), xóa file mới
            setNewKmlFileFile(null);
            if (formErrors.kmlFile) {
                setFormErrors({ ...formErrors, kmlFile: '' });
            }
            // Nếu có file KML cũ đã bị đánh dấu xóa, hủy đánh dấu
            if (removedKmlFileUrl === existingKmlFileUrl) {
                setRemovedKmlFileUrl(null);
            }
        }
        // Reset input file value
        if (kmlFileInputRef.current) {
            kmlFileInputRef.current.value = '';
        }
    };

    // Xóa một file giấy tờ đất đai MỚI đã chọn
    const removeNewLandDocumentFile = (index: number) => {
        setNewLandDocumentsFiles(prev => prev.filter((_, i) => i !== index));
        // Reset input file value để có thể chọn lại cùng file nếu cần
        if (landDocumentsInputRef.current) {
            landDocumentsInputRef.current.value = '';
        }
        // Kiểm tra lại validate file nếu cần
    };

    // Xóa file KML/KMZ MỚI đã chọn
    const removeNewKmlFileFile = () => {
        setNewKmlFileFile(null);
        // Reset input file value
        if (kmlFileInputRef.current) {
            kmlFileInputRef.current.value = '';
        }
        // Nếu có file KML cũ đã bị đánh dấu xóa do chọn file mới, hủy đánh dấu
        if (removedKmlFileUrl === existingKmlFileUrl) {
            setRemovedKmlFileUrl(null);
        }
        // Kiểm tra lại validate file nếu cần
    };

    // Đánh dấu một file giấy tờ đất đai HIỆN CÓ sẽ bị xóa
    const markRemoveExistingLandDocument = (url: string) => {
        setRemovedLandDocumentUrls(prev => [...prev, url]);
        // Kiểm tra lại validate file nếu cần
    };

    // Hủy bỏ đánh dấu xóa một file giấy tờ đất đai HIỆN CÓ
    const unmarkRemoveExistingLandDocument = (url: string) => {
        setRemovedLandDocumentUrls(prev => prev.filter(item => item !== url));
        // Kiểm tra lại validate file nếu cần
    };


    // Đánh dấu file KML/KMZ HIỆN CÓ sẽ bị xóa
    const markRemoveExistingKmlFile = () => {
        if (existingKmlFileUrl) {
            setRemovedKmlFileUrl(existingKmlFileUrl);
        }
        // Xóa file mới nếu đang có
        setNewKmlFileFile(null);
        if (kmlFileInputRef.current) {
            kmlFileInputRef.current.value = '';
        }
        // Kiểm tra lại validate file nếu cần
    };

    // Hủy bỏ đánh dấu xóa file KML/KMZ HIỆN CÓ
    const unmarkRemoveExistingKmlFile = () => {
        setRemovedKmlFileUrl(null);
        // Kiểm tra lại validate file nếu cần
    };

    // --- Hàm kiểm tra validate (cập nhật cho file) ---
    const validateForm = () => {
        if (!formData) return false;
        const errors: { [key: string]: string } = {};
        if (!formData.name?.trim()) errors.name = "Tên dự án không được để trống.";
        if (!formData.phone?.trim()) errors.phone = "Số điện thoại không được để trống.";
        if (!formData.email?.trim()) {
            errors.email = "Email không được để trống.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Email không hợp lệ.";
        }
        if (!formData.projectType) errors.projectType = "Loại dự án không được để trống.";

        // Kiểm tra validate cho details dựa trên projectType (giống trang Create)
        if (formData.projectType === 'forest') {
            if (!formData.details?.forestLocation?.trim()) errors['details.forestLocation'] = "Địa điểm rừng không được để trống.";
            if (!formData.details?.forestArea?.trim()) errors['details.forestArea'] = "Diện tích rừng không được để trống.";
        } else if (formData.projectType === 'rice') {
            if (!formData.details?.riceLocation?.trim()) errors['details.riceLocation'] = "Địa điểm lúa không được để trống.";
            if (!formData.details?.riceArea?.trim()) errors['details.riceArea'] = "Diện tích lúa không được để trống.";
        } else if (formData.projectType === 'biochar') {
            if (!formData.details?.biocharRawMaterial?.trim()) errors['details.biocharRawMaterial'] = "Nguyên liệu biochar không được để trống.";
            if (!formData.details?.biocharLandArea?.trim()) errors['details.biocharLandArea'] = "Diện tích đất áp dụng không được để trống.";
        }


        // Validate cho file giấy tờ đất đai (kiểm tra số lượng file CŨ không bị xóa + file MỚI)
        const finalLandDocumentsCount = existingLandDocumentUrls.filter(url => !removedLandDocumentUrls.includes(url)).length + newLandDocumentsFiles.length;
        if (finalLandDocumentsCount === 0) {
            // Giả định là bắt buộc cần ít nhất 1 giấy tờ đất đai
            errors.landDocuments = "Vui lòng tải lên ít nhất một giấy tờ đất đai.";
        }

        // Validate cho file KML/KMZ (nếu bắt buộc)
        // const finalKmlFileCount = (existingKmlFileUrl && removedKmlFileUrl !== existingKmlFileUrl ? 1 : 0) + (newKmlFileFile ? 1 : 0);
        // if (finalKmlFileCount === 0) { errors.kmlFile = "Vui lòng tải lên file KML/KMZ."; }


        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // --- Xử lý submit form (cho sửa) ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData || !projectId) return;

        if (!validateForm()) {
            toast({
                title: "Lỗi validate",
                description: "Vui lòng kiểm tra lại các trường bị lỗi.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        setFormErrors({}); // Xóa lỗi cũ

        try {
            // --- Bước 1: Upload file MỚI lên Cloudinary ---
            const newLandDocumentUrls: string[] = [];
            if (!cloudName) {
                throw new Error("Biến môi trường NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME chưa được thiết lập.");
            }
            if (!uploadPreset) {
                console.warn("Cảnh báo: uploadPreset chưa được thiết lập.");
            }

            // Upload giấy tờ đất đai mới
            for (const file of newLandDocumentsFiles) {
                const data = new FormData();
                data.append('file', file);
                data.append('upload_preset', uploadPreset);

                const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
                    method: 'POST',
                    body: data
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    console.error(`Cloudinary upload error for ${file.name}:`, errorData);
                    throw new Error(`Tải file ${file.name} lên Cloudinary thất bại: ${errorData.error?.message || res.statusText}`);
                }
                const fileData = await res.json();
                newLandDocumentUrls.push(fileData.secure_url);
            }

            // Upload file KML/KMZ mới (nếu có file mới được chọn)
            let newKmlFileUrl: string | null = null;
            if (newKmlFileFile) {
                const data = new FormData();
                data.append('file', newKmlFileFile);
                data.append('upload_preset', uploadPreset);

                const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
                    method: 'POST',
                    body: data
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    console.error(`Cloudinary upload error for ${newKmlFileFile.name}:`, errorData);
                    throw new Error(`Tải file KML ${newKmlFileFile.name} lên Cloudinary thất bại: ${errorData.error?.message || res.statusText}`);
                }
                const fileData = await res.json();
                newKmlFileUrl = fileData.secure_url;
            }


            // --- Bước 2: Chuẩn bị dữ liệu gửi lên API backend ---

            // Tạo danh sách URL giấy tờ đất đai cuối cùng (file cũ còn lại + file mới)
            const finalLandDocumentUrls = existingLandDocumentUrls.filter(url => !removedLandDocumentUrls.includes(url))
                .concat(newLandDocumentUrls);

            // Xác định URL file KML/KMZ cuối cùng
            let finalKmlFileUrl: string | null = null;
            if (newKmlFileUrl) {
                // Nếu có file mới được upload, sử dụng URL file mới
                finalKmlFileUrl = newKmlFileUrl;
            } else if (existingKmlFileUrl && removedKmlFileUrl !== existingKmlFileUrl) {
                // Nếu không có file mới được upload VÀ file cũ KHÔNG bị đánh dấu xóa, giữ lại URL file cũ
                finalKmlFileUrl = existingKmlFileUrl;
            }
            // Nếu không rơi vào 2 trường hợp trên (có file mới VÀ file cũ bị xóa, hoặc không có file nào),
            // finalKmlFileUrl sẽ là null (khởi tạo ban đầu)


            const projectDataToSend = {
                ...formData, // Dữ liệu form đã chỉnh sửa (trừ file URLs)
                details: {
                    ...formData.details,
                    // Chuyển Date objects thành string
                    riceStartDate: formData.details.riceStartDate instanceof Date ? formData.details.riceStartDate.toISOString() : (formData.details.riceStartDate || null), // Giữ nguyên null hoặc string nếu API trả về string
                    riceEndDate: formData.details.riceEndDate instanceof Date ? formData.details.riceEndDate.toISOString() : (formData.details.riceEndDate || null), // Giữ nguyên null hoặc string nếu API trả về string
                    // Đảm bảo các trường optional khác trong details không bị undefined
                    forestLocation: formData.details?.forestLocation || "",
                    forestArea: formData.details?.forestArea || "",
                    treeSpecies: formData.details?.treeSpecies || "",
                    plantingAge: formData.details?.plantingAge || "",
                    averageHeight: formData.details?.averageHeight || "",
                    averageCircumference: formData.details?.averageCircumference || "",
                    previousDeforestation: formData.details?.previousDeforestation || "",

                    riceLocation: formData.details?.riceLocation || "",
                    riceArea: formData.details?.riceArea || "",
                    riceTerrain: formData.details?.riceTerrain || "",
                    riceClimate: formData.details?.riceClimate || "",
                    riceSoilType: formData.details?.riceSoilType || "",

                    biocharRawMaterial: formData.details?.biocharRawMaterial || "",
                    biocharCarbonContent: formData.details?.biocharCarbonContent || "",
                    biocharLandArea: formData.details?.biocharLandArea || "",
                    biocharApplicationMethod: formData.details?.biocharApplicationMethod || "",
                },
                // Gán các URL file cuối cùng
                landDocuments: finalLandDocumentUrls,
                kmlFile: finalKmlFileUrl,
                // userId không gửi lên khi sửa trừ khi backend yêu cầu
                userId: undefined as any, // Bỏ userId hoặc giữ lại tùy backend
                // Đảm bảo các trường optional khác ở cấp cao nhất không bị undefined
                organization: formData.organization || "",
                address: formData.address || "",
                additionalInfo: formData.additionalInfo || "",
            };

            console.log(`Submitting updated data for project ${projectId}:`, projectDataToSend); // Log data trước khi gửi API backend

            // Gọi API để cập nhật dự án
            await apiProjectCarbon.update(projectId, projectDataToSend);

            toast({
                title: "Thành công",
                description: "Cập nhật dự án Carbon thành công! ✨",
            });

            // Chuyển hướng về trang danh sách sau khi cập nhật thành công
            router.push("/quan-ly/admin/projects");
        } catch (err: any) {
            console.error(`Lỗi khi cập nhật dự án Carbon ${projectId}:`, err);
            const errorMessage = err.message || err.response?.data?.message || "Có lỗi xảy ra khi cập nhật dự án. Vui lòng thử lại.";
            toast({
                title: "Lỗi",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Hàm render các trường chi tiết
    const renderDetailsFields = () => {
        // Cần kiểm tra formData và formData.details tồn tại trước khi truy cập
        if (!formData || !formData.details) return null;

        // Sử dụng div grid để bố cục các trường chi tiết
        const detailFields = (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Các trường được render ở đây */}
                {/* Thêm md:col-span-2 cho các trường muốn chiếm 2 cột */}
            </div>
        );


        switch (formData.projectType) {
            case "forest":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="forestLocation">Địa điểm rừng <span className="text-red-500">*</span></Label>
                            <Input id="forestLocation" name="forestLocation" value={formData.details?.forestLocation || ""} onChange={handleDetailInputChange} required className={formErrors['details.forestLocation'] ? 'border-red-500' : ''} />
                            {formErrors['details.forestLocation'] && <p className="text-red-500 text-sm">{formErrors['details.forestLocation']}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="forestArea">Diện tích rừng (ha) <span className="text-red-500">*</span></Label>
                            <Input id="forestArea" name="forestArea" value={formData.details?.forestArea || ""} onChange={handleDetailInputChange} required type="number" className={formErrors['details.forestArea'] ? 'border-red-500' : ''} />
                            {formErrors['details.forestArea'] && <p className="text-red-500 text-sm">{formErrors['details.forestArea']}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="treeSpecies">Loài cây</Label>
                            <Input id="treeSpecies" name="treeSpecies" value={formData.details?.treeSpecies || ""} onChange={handleDetailInputChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="plantingAge">Tuổi cây (năm)</Label>
                            <Input id="plantingAge" name="plantingAge" value={formData.details?.plantingAge || ""} onChange={handleDetailInputChange} type="number" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="averageHeight">Chiều cao trung bình (m)</Label>
                            <Input id="averageHeight" name="averageHeight" value={formData.details?.averageHeight || ""} onChange={handleDetailInputChange} type="number" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="averageCircumference">Chu vi trung bình (cm)</Label>
                            <Input id="averageCircumference" name="averageCircumference" value={formData.details?.averageCircumference || ""} onChange={handleDetailInputChange} type="number" />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="previousDeforestation">Có phá rừng trước đây không?</Label>
                            <Select
                                name="previousDeforestation"
                                value={formData.details?.previousDeforestation || ""}
                                onValueChange={(value) => handleDetailSelectChange('previousDeforestation', value)}
                            >
                                <SelectTrigger className={formErrors['details.previousDeforestation'] ? 'border-red-500' : ''}>
                                    {/* Placeholder cho trạng thái chưa chọn */}
                                    <SelectValue placeholder="Chọn" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* LOẠI BỎ <SelectItem value="">Chọn</SelectItem> */}
                                    <SelectItem value="no">Không</SelectItem>
                                    <SelectItem value="yes">Có</SelectItem>
                                    <SelectItem value="unknown">Không rõ</SelectItem>
                                </SelectContent>
                            </Select>
                            {formErrors['details.previousDeforestation'] && <p className="text-red-500 text-sm mt-1">{formErrors['details.previousDeforestation']}</p>}
                        </div>
                    </div>
                );
            case "rice":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="riceLocation">Địa điểm lúa <span className="text-red-500">*</span></Label>
                            <Input id="riceLocation" name="riceLocation" value={formData.details?.riceLocation || ""} onChange={handleDetailInputChange} required className={formErrors['details.riceLocation'] ? 'border-red-500' : ''} />
                            {formErrors['details.riceLocation'] && <p className="text-red-500 text-sm">{formErrors['details.riceLocation']}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="riceArea">Diện tích lúa (ha) <span className="text-red-500">*</span></Label>
                            <Input id="riceArea" name="riceArea" value={formData.details?.riceArea || ""} onChange={handleDetailInputChange} required type="number" className={formErrors['details.riceArea'] ? 'border-red-500' : ''} />
                            {formErrors['details.riceArea'] && <p className="text-red-500 text-sm">{formErrors['details.riceArea']}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="riceTerrain">Địa hình</Label>
                            <Input id="riceTerrain" name="riceTerrain" value={formData.details?.riceTerrain || ""} onChange={handleDetailInputChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="riceClimate">Khí hậu</Label>
                            <Input id="riceClimate" name="riceClimate" value={formData.details?.riceClimate || ""} onChange={handleDetailInputChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="riceSoilType">Loại đất</Label>
                            <Input id="riceSoilType" name="riceSoilType" value={formData.details?.riceSoilType || ""} onChange={handleDetailInputChange} />
                        </div>
                        {/* Trường chọn ngày bắt đầu */}
                        <div className="grid gap-2">
                            <Label htmlFor="riceStartDate">Ngày bắt đầu</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !formData.details?.riceStartDate && "text-muted-foreground",
                                            formErrors['details.riceStartDate'] && 'border-red-500' // Highlight lỗi
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.details?.riceStartDate ? format(new Date(formData.details.riceStartDate), "dd/MM/yyyy", { locale: vi }) : <span>Chọn ngày</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={formData.details?.riceStartDate ? new Date(formData.details.riceStartDate) : undefined}
                                        onSelect={(date) => handleDetailDateChange('riceStartDate', date)}
                                        initialFocus
                                        locale={vi} // Sử dụng locale tiếng Việt
                                    />
                                </PopoverContent>
                            </Popover>
                            {formErrors['details.riceStartDate'] && <p className="text-red-500 text-sm mt-1">{formErrors['details.riceStartDate']}</p>}
                        </div>
                        {/* Trường chọn ngày kết thúc */}
                        <div className="grid gap-2">
                            <Label htmlFor="riceEndDate">Ngày kết thúc</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !formData.details?.riceEndDate && "text-muted-foreground",
                                            formErrors['details.riceEndDate'] && 'border-red-500' // Highlight lỗi
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.details?.riceEndDate ? format(new Date(formData.details.riceEndDate), "dd/MM/yyyy", { locale: vi }) : <span>Chọn ngày</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={formData.details?.riceEndDate ? new Date(formData.details.riceEndDate) : undefined}
                                        onSelect={(date) => handleDetailDateChange('riceEndDate', date)}
                                        initialFocus
                                        locale={vi} // Sử dụng locale tiếng Việt
                                    />
                                </PopoverContent>
                            </Popover>
                            {formErrors['details.riceEndDate'] && <p className="text-red-500 text-sm mt-1">{formErrors['details.riceEndDate']}</p>}
                        </div>
                    </div>
                );
            case "biochar":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="biocharRawMaterial">Nguyên liệu Biochar <span className="text-red-500">*</span></Label>
                            <Input id="biocharRawMaterial" name="biocharRawMaterial" value={formData.details?.biocharRawMaterial || ""} onChange={handleDetailInputChange} required className={formErrors['details.biocharRawMaterial'] ? 'border-red-500' : ''} />
                            {formErrors['details.biocharRawMaterial'] && <p className="text-red-500 text-sm">{formErrors['details.biocharRawMaterial']}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="biocharCarbonContent">Hàm lượng Carbon (%)</Label>
                            <Input id="biocharCarbonContent" name="biocharCarbonContent" value={formData.details?.biocharCarbonContent || ""} onChange={handleDetailInputChange} type="number" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="biocharLandArea">Diện tích đất áp dụng (ha) <span className="text-red-500">*</span></Label>
                            <Input id="biocharLandArea" name="biocharLandArea" value={formData.details?.biocharLandArea || ""} onChange={handleDetailInputChange} required type="number" className={formErrors['details.biocharLandArea'] ? 'border-red-500' : ''} />
                            {formErrors['details.biocharLandArea'] && <p className="text-red-500 text-sm">{formErrors['details.biocharLandArea']}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="biocharApplicationMethod">Phương pháp áp dụng</Label>
                            <Input id="biocharApplicationMethod" name="biocharApplicationMethod" value={formData.details?.biocharApplicationMethod || ""} onChange={handleDetailInputChange} />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };


    // Hiển thị khi đang tải dữ liệu
    if (loading) {
        return (
            <div className="container mx-auto py-10 px-4 text-center">
                <p>Đang tải thông tin dự án...</p>
            </div>
        );
    }

    // Hiển thị khi có lỗi tải dữ liệu
    if (error) {
        return (
            <div className="container mx-auto py-10 px-4 text-center">
                <p className="text-red-500">{error}</p>
                {/* Nút quay lại hoặc thử lại có thể thêm vào đây */}
                <Button onClick={() => router.push("/quan-ly/admin/projects")} className="mt-4">
                    Quay lại danh sách
                </Button>
            </div>
        );
    }

    // Hiển thị form khi dữ liệu đã được tải
    if (!formData) {
        // Trường hợp không có lỗi nhưng cũng không có formData (ví dụ: ID không tồn tại)
        return (
            <div className="container mx-auto py-10 px-4 text-center">
                <p className="text-red-500">Không tìm thấy dự án với ID: {projectId}.</p>
                <Button onClick={() => router.push("/quan-ly/admin/projects")} className="mt-4">
                    Quay lại danh sách
                </Button>
            </div>
        );
    }


    return (
        <div className="flex min-h-screen w-full justify-center py-8 px-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Sửa dự án Carbon</CardTitle>
                    <CardDescription>Cập nhật thông tin chi tiết cho dự án Carbon.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Form chính */}
                    <form onSubmit={handleSubmit} className="grid gap-6">
                        {/* Thông tin chung */}
                        <fieldset className="grid gap-4 border p-4 rounded-md">
                            <legend className="text-lg font-semibold px-2">Thông tin chung</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Sử dụng grid 2 cột */}
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Tên dự án <span className="text-red-500">*</span></Label>
                                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required className={formErrors.name ? 'border-red-500' : ''} />
                                    {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="organization">Tổ chức</Label>
                                    <Input id="organization" name="organization" value={formData.organization || ""} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Số điện thoại <span className="text-red-500">*</span></Label>
                                    <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required className={formErrors.phone ? 'border-red-500' : ''} />
                                    {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className={formErrors.email ? 'border-red-500' : ''} />
                                    {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">Địa chỉ</Label>
                                <Textarea id="address" name="address" value={formData.address || ""} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="projectType">Loại dự án <span className="text-red-500">*</span></Label>
                                {/* Có thể disable select project type sau khi tạo nếu không cho phép sửa */}
                                <Select
                                    name="projectType"
                                    value={formData.projectType}
                                    onValueChange={(value: "forest" | "rice" | "biochar") => handleSelectChange('projectType', value)}
                                    required
                                // disabled={true} // Uncomment dòng này nếu không cho phép sửa loại dự án
                                >
                                    <SelectTrigger className={formErrors.projectType ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Chọn loại dự án" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="forest">Lâm nghiệp</SelectItem>
                                        <SelectItem value="rice">Lúa</SelectItem>
                                        <SelectItem value="biochar">Biochar</SelectItem>
                                    </SelectContent>
                                </Select>
                                {formErrors.projectType && <p className="text-red-500 text-sm">{formErrors.projectType}</p>}
                            </div>
                        </fieldset>

                        {/* Thông tin chi tiết theo loại dự án */}
                        <fieldset className="grid gap-4 border p-4 rounded-md">
                            <legend className="text-lg font-semibold px-2">Thông tin chi tiết ({formData.projectType === 'forest' ? 'Lâm nghiệp' : formData.projectType === 'rice' ? 'Lúa' : formData.projectType === 'biochar' ? 'Biochar' : ''})</legend>
                            {renderDetailsFields()} {/* Gọi hàm render fields */}
                        </fieldset>


                        {/* Tài liệu */}
                        <fieldset className="grid gap-4 border p-4 rounded-md">
                            <legend className="text-lg font-semibold px-2">Tài liệu</legend>

                            {/* Upload Giấy tờ đất đai */}
                            <div className="grid gap-2">
                                <Label htmlFor="landDocumentsFiles">Giấy tờ đất đai <span className="text-red-500">*</span></Label>

                                {/* Hiển thị danh sách file HIỆN CÓ */}
                                {existingLandDocumentUrls.length > 0 && (
                                    <div className="mt-2">
                                        <p className="font-medium text-sm mb-1">Giấy tờ hiện tại ({existingLandDocumentUrls.length} files):</p>
                                        <ul className="grid gap-1 text-sm text-gray-700">
                                            {existingLandDocumentUrls.map((url, index) => (
                                                // Chỉ hiển thị nếu URL này chưa bị đánh dấu xóa
                                                !removedLandDocumentUrls.includes(url) && (
                                                    <li key={url} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                                                        <span className="flex items-center truncate">
                                                            <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                                                            <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">{url.split('/').pop()}</a> {/* Hiển thị tên file từ URL */}
                                                        </span>
                                                        <button type="button" onClick={() => markRemoveExistingLandDocument(url)} className="p-1 flex-shrink-0 ml-2" title="Xóa file này"><X className="h-4 w-4 text-gray-500 hover:text-red-500" /></button>
                                                    </li>
                                                )
                                            ))}
                                            {/* Hiển thị các file cũ đã bị đánh dấu xóa (tùy chọn, để người dùng có thể phục hồi) */}
                                            {/*
                                             removedLandDocumentUrls.map(url => (
                                                 <li key={url} className="flex items-center justify-between bg-red-100 text-red-700 p-2 rounded-md line-through">
                                                      <span className="flex items-center truncate">
                                                          <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                                                           <span className="truncate">{url.split('/').pop()} (Đã xóa)</span>
                                                      </span>
                                                      <button type="button" onClick={() => unmarkRemoveExistingLandDocument(url)} className="p-1 flex-shrink-0 ml-2" title="Hủy xóa"><RefreshCw className="h-4 w-4 text-red-700 hover:text-red-900" /></button>
                                                 </li>
                                             ))
                                             */}
                                        </ul>
                                    </div>
                                )}

                                {/* Khu vực Kéo & thả / Chọn file MỚI */}
                                <div
                                    className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${formErrors.landDocuments ? 'border-red-500' : ''}`}
                                    onClick={() => landDocumentsInputRef.current?.click()}
                                >
                                    <input
                                        id="landDocumentsFiles"
                                        type="file"
                                        ref={landDocumentsInputRef}
                                        multiple // Cho phép chọn nhiều file mới
                                        onChange={handleNewLandDocumentsFileChange}
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        className="hidden"
                                    />
                                    <UploadIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                    <p className="text-gray-600">Kéo & thả file MỚI hoặc nhấn vào đây để thêm</p>
                                    <p className="text-gray-500 text-sm">(PDF, DOC, DOCX, JPG, PNG)</p>
                                </div>
                                {formErrors.landDocuments && <p className="text-red-500 text-sm">{formErrors.landDocuments}</p>}

                                {/* Hiển thị danh sách file MỚI đã chọn */}
                                {newLandDocumentsFiles.length > 0 && (
                                    <div className="mt-2">
                                        <p className="font-medium text-sm mb-1">Đã chọn file MỚI ({newLandDocumentsFiles.length} files):</p>
                                        <ul className="grid gap-1 text-sm text-gray-700">
                                            {newLandDocumentsFiles.map((file, index) => (
                                                <li key={file.name + index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md"> {/* Sử dụng tên file + index làm key tạm */}
                                                    <span className="flex items-center"><FileText className="h-4 w-4 mr-2" /> {file.name}</span>
                                                    <button type="button" onClick={() => removeNewLandDocumentFile(index)} className="p-1"><X className="h-4 w-4 text-gray-500 hover:text-red-500" /></button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Upload File KML/KMZ */}
                            <div className="grid gap-2">
                                <Label htmlFor="kmlFileFile">File KML/KMZ</Label>

                                {/* Hiển thị file KML HIỆN CÓ (nếu chưa bị đánh dấu xóa và chưa có file mới) */}
                                {existingKmlFileUrl && !removedKmlFileUrl && !newKmlFileFile && (
                                    <div className="mt-2">
                                        <p className="font-medium text-sm mb-1">File KML hiện tại:</p>
                                        <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md text-sm text-gray-700">
                                            <span className="flex items-center truncate">
                                                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                                <a href={existingKmlFileUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">{existingKmlFileUrl.split('/').pop()}</a> {/* Hiển thị tên file */}
                                            </span>
                                            <button type="button" onClick={markRemoveExistingKmlFile} className="p-1 flex-shrink-0 ml-2" title="Xóa file này"><X className="h-4 w-4 text-gray-500 hover:text-red-500" /></button>
                                        </div>
                                    </div>
                                )}

                                {/* Hiển thị file KML cũ đã bị đánh dấu xóa (tùy chọn) */}
                                {/*
                                 {existingKmlFileUrl && removedKmlFileUrl === existingKmlFileUrl && !newKmlFileFile && (
                                      <div className="mt-2">
                                           <p className="font-medium text-sm mb-1">File KML hiện tại:</p>
                                            <div className="flex items-center justify-between bg-red-100 text-red-700 p-2 rounded-md line-through">
                                                 <span className="flex items-center truncate">
                                                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                                       <span className="truncate">{existingKmlFileUrl.split('/').pop()} (Đã xóa)</span>
                                                 </span>
                                                 <button type="button" onClick={unmarkRemoveExistingKmlFile} className="p-1 flex-shrink-0 ml-2" title="Hủy xóa"><RefreshCw className="h-4 w-4 text-red-700 hover:text-red-900" /></button>
                                            </div>
                                       </div>
                                  )}
                                */}


                                {/* Khu vực Kéo & thả / Chọn file KML/KMZ MỚI */}
                                <div
                                    className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${formErrors.kmlFile ? 'border-red-500' : ''}`}
                                    onClick={() => kmlFileInputRef.current?.click()}
                                >
                                    <input
                                        id="kmlFileFile"
                                        type="file"
                                        ref={kmlFileInputRef}
                                        onChange={handleNewKmlFileChange} // Xử lý chọn file mới
                                        accept=".kml,.kmz"
                                        className="hidden"
                                    />
                                    <MapPin className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                    <p className="text-gray-600">Kéo & thả file KML/KMZ MỚI hoặc nhấn vào đây để thêm</p>
                                    <p className="text-gray-500 text-sm">(KML, KMZ)</p>
                                </div>
                                {formErrors.kmlFile && <p className="text-red-500 text-sm">{formErrors.kmlFile}</p>}

                                {/* Hiển thị file KML MỚI đã chọn */}
                                {newKmlFileFile && (
                                    <div className="mt-2">
                                        <p className="font-medium text-sm mb-1">File KML đã chọn:</p>
                                        <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md text-sm text-gray-700">
                                            <span className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> {newKmlFileFile.name}</span>
                                            <button type="button" onClick={removeNewKmlFileFile} className="p-1"><X className="h-4 w-4 text-gray-500 hover:text-red-500" /></button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Thông tin bổ sung */}
                            <div className="grid gap-2 md:col-span-2"> {/* Có thể cho chiếm 2 cột */}
                                <Label htmlFor="additionalInfo">Thông tin bổ sung</Label>
                                <Textarea id="additionalInfo" name="additionalInfo" value={formData.additionalInfo || ""} onChange={handleInputChange} />
                            </div>
                        </fieldset>


                        {/* Nút submit và cancel */}
                        <div className="flex justify-end gap-4 mt-6"> {/* Thêm margin top */}
                            <Button variant="outline" type="button" onClick={() => router.push("/quan-ly/admin/projects")} disabled={isSubmitting}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Đang cập nhật..." : "Cập nhật dự án"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}