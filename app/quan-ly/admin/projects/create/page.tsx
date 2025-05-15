// src/app/quan-ly/admin/projects/create/page.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { CalendarIcon, Upload as UploadIcon, X, FileText, MapPin } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils"; // Cần utility classnames
import { apiProjectCarbon } from "@/app/fetch/fetch.project-carbon"; // Import service API
// Import interfaces từ file types riêng biệt
import { IProjectCarbon, IProjectCarbonDetails } from "@/types/project-carbon";
import { useToast } from "@/hooks/use-toast"; // Import hook toast

// Lấy tên cloud từ biến môi trường
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
// Lưu ý: Sử dụng unsigned upload preset ("my_unsigned_preset") như trong code của bạn.
// Đối với môi trường production, bạn nên sử dụng signed upload preset để bảo mật hơn.
const uploadPreset = "my_unsigned_preset"; // Thay bằng tên unsigned preset của bạn

// Định nghĩa kiểu dữ liệu cho state form (loại bỏ các trường tự tạo bởi backend)
type ProjectFormData = Omit<IProjectCarbon, '_id' | 'createdAt' | 'updatedAt'>;

export default function AdminProjectCarbonCreatePage() {
    const router = useRouter();
    const { toast } = useToast();

    // Ref cho input file để có thể kích hoạt click
    const landDocumentsInputRef = useRef<HTMLInputElement>(null);
    const kmlFileInputRef = useRef<HTMLInputElement>(null);

    // State cho dữ liệu form
    const [formData, setFormData] = useState<ProjectFormData>({
        name: "",
        organization: "",
        phone: "",
        email: "",
        address: "",
        projectType: "forest", // Mặc định loại dự án
        details: {
            forestLocation: "", forestArea: "", treeSpecies: "", plantingAge: "", averageHeight: "", averageCircumference: "", previousDeforestation: "",
            riceLocation: "", riceArea: "", riceTerrain: "", riceClimate: "", riceSoilType: "", riceStartDate: null, riceEndDate: null,
            biocharRawMaterial: "", biocharCarbonContent: "", biocharLandArea: "", biocharApplicationMethod: "",
        },
        additionalInfo: "",
        landDocuments: [], // URLs sẽ được điền sau khi upload
        kmlFile: null, // URL sẽ được điền sau khi upload
        userId: "", // Cần thay thế bằng userId thực tế của người tạo
    });

    // State để lưu trữ các File object được chọn trước khi upload
    const [landDocumentsFiles, setLandDocumentsFiles] = useState<File[]>([]);
    const [kmlFileFile, setKmlFileFile] = useState<File | null>(null);

    // State cho trạng thái gửi form và lỗi
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    // Xử lý thay đổi input chung
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Xóa lỗi khi người dùng bắt đầu nhập
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: '' });
        }
    };

    // Xử lý thay đổi select (ví dụ: projectType)
    const handleSelectChange = (name: keyof ProjectFormData, value: string) => {
        setFormData({ ...formData, [name]: value as any }); // Ép kiểu any vì value string có thể không khớp trực tiếp enum
        // Xóa lỗi khi người dùng chọn lại
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: '' });
        }
        // Reset details khi đổi loại dự án
        if (name === 'projectType') {
            setFormData(prev => ({
                ...prev,
                details: { // Reset tất cả các trường details về giá trị ban đầu
                    forestLocation: "", forestArea: "", treeSpecies: "", plantingAge: "", averageHeight: "", averageCircumference: "", previousDeforestation: "",
                    riceLocation: "", riceArea: "", riceTerrain: "", riceClimate: "", riceSoilType: "", riceStartDate: null, riceEndDate: null,
                    biocharRawMaterial: "", biocharCarbonContent: "", biocharLandArea: "", biocharApplicationMethod: "",
                }
            }));
            // Xóa lỗi validate của details khi đổi loại dự án
            const newErrors = { ...formErrors };
            Object.keys(newErrors).forEach(key => {
                if (key.startsWith('details.')) {
                    delete newErrors[key];
                }
            });
            setFormErrors(newErrors);
        }
    };

    // Xử lý thay đổi input trong details
    const handleDetailInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            details: {
                ...prev.details,
                [name]: value
            }
        }));
        if (formErrors[`details.${name}`]) {
            setFormErrors({ ...formErrors, [`details.${name}`]: '' });
        }
    };

    // Xử lý thay đổi select trong details
    const handleDetailSelectChange = (name: keyof IProjectCarbonDetails, value: string) => {
        setFormData(prev => ({
            ...prev,
            details: {
                ...prev.details,
                [name]: value
            }
        }));
        if (formErrors[`details.${name}`]) {
            setFormErrors({ ...formErrors, [`details.${name}`]: '' });
        }
    };

    // Xử lý thay đổi ngày tháng trong details
    const handleDetailDateChange = (name: keyof IProjectCarbonDetails, date: Date | undefined) => {
        setFormData(prev => ({
            ...prev,
            details: {
                ...prev.details,
                [name]: date || null // Lưu null nếu date là undefined
            }
        }));
        if (formErrors[`details.${name}`]) {
            setFormErrors({ ...formErrors, [`details.${name}`]: '' });
        }
    };

    // Xử lý khi chọn file giấy tờ đất đai
    const handleLandDocumentsFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // Gộp file mới chọn vào danh sách hiện có (nếu muốn cho phép chọn nhiều lần)
            // Hoặc chỉ giữ lại các file mới chọn: setLandDocumentsFiles(Array.from(e.target.files));
            setLandDocumentsFiles(prev => [...prev, ...Array.from(e.target.files)]);
            // Xóa lỗi validate file nếu có
            if (formErrors.landDocuments) {
                setFormErrors({ ...formErrors, landDocuments: '' });
            }
        }
    };

    // Xử lý khi chọn file KML/KMZ
    const handleKmlFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setKmlFileFile(e.target.files[0]);
            // Xóa lỗi validate file nếu có
            if (formErrors.kmlFile) {
                setFormErrors({ ...formErrors, kmlFile: '' });
            }
        } else {
            setKmlFileFile(null);
            if (formErrors.kmlFile) {
                setFormErrors({ ...formErrors, kmlFile: '' });
            }
        }
    };

    // Xóa một file giấy tờ đất đai đã chọn
    const removeLandDocumentFile = (index: number) => {
        setLandDocumentsFiles(prev => prev.filter((_, i) => i !== index));
        // Reset input file value để có thể chọn lại cùng file nếu cần
        if (landDocumentsInputRef.current) {
            landDocumentsInputRef.current.value = '';
        }
        // Kiểm tra lại validate file nếu cần (ví dụ: nếu số lượng file tối thiểu > 0)
    };

    // Xóa file KML/KMZ đã chọn
    const removeKmlFileFile = () => {
        setKmlFileFile(null);
        // Reset input file value
        if (kmlFileInputRef.current) {
            kmlFileInputRef.current.value = '';
        }
        // Kiểm tra lại validate file nếu cần
    };


    // Hàm kiểm tra validate
    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!formData.name.trim()) errors.name = "Tên dự án không được để trống.";
        if (!formData.phone.trim()) errors.phone = "Số điện thoại không được để trống.";
        if (!formData.email.trim()) {
            errors.email = "Email không được để trống.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Email không hợp lệ.";
        }
        if (!formData.projectType) errors.projectType = "Loại dự án không được để trống.";

        // Validate cho details dựa trên projectType
        if (formData.projectType === 'forest') {
            if (!formData.details.forestLocation?.trim()) errors['details.forestLocation'] = "Địa điểm rừng không được để trống.";
            if (!formData.details.forestArea?.trim()) errors['details.forestArea'] = "Diện tích rừng không được để trống.";
            // Có thể thêm validate cho kiểu dữ liệu (số dương cho area, age, height, circumference)
        } else if (formData.projectType === 'rice') {
            if (!formData.details.riceLocation?.trim()) errors['details.riceLocation'] = "Địa điểm lúa không được để trống.";
            if (!formData.details.riceArea?.trim()) errors['details.riceArea'] = "Diện tích lúa không được để trống.";
            // Có thể thêm validate cho kiểu dữ liệu
            // if (!formData.details.riceStartDate) errors['details.riceStartDate'] = "Ngày bắt đầu không được để trống.";
            // if (!formData.details.riceEndDate) errors['details.riceEndDate'] = "Ngày kết thúc không được để trống.";
        } else if (formData.projectType === 'biochar') {
            if (!formData.details.biocharRawMaterial?.trim()) errors['details.biocharRawMaterial'] = "Nguyên liệu biochar không được để trống.";
            if (!formData.details.biocharLandArea?.trim()) errors['details.biocharLandArea'] = "Diện tích đất áp dụng không được để trống.";
            // Có thể thêm validate cho kiểu dữ liệu
        }

        // Validate cho file giấy tờ đất đai (giả định là bắt buộc)
        if (landDocumentsFiles.length === 0) {
            errors.landDocuments = "Vui lòng tải lên ít nhất một giấy tờ đất đai.";
        }

        // Validate cho file KML/KMZ (tùy chọn, có thể thêm validate nếu bắt buộc)
        // if (!kmlFileFile) { errors.kmlFile = "Vui lòng tải lên file KML/KMZ."; }

        setFormErrors(errors);
        return Object.keys(errors).length === 0; // Trả về true nếu không có lỗi
    };


    // Xử lý submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Kiểm tra validate form
        if (!validateForm()) {
            toast({
                title: "Lỗi validate",
                description: "Vui lòng kiểm tra lại các trường bị lỗi.",
                variant: "destructive",
            });
            return; // Ngừng submit nếu validate thất bại
        }

        setIsSubmitting(true); // Bắt đầu trạng thái submit
        setFormErrors({}); // Xóa lỗi cũ

        try {
            // --- Bước 1: Upload files lên Cloudinary ---
            const landDocumentUrls: string[] = [];
            // Đảm bảo cloudName và uploadPreset đã được thiết lập
            if (!cloudName) {
                throw new Error("Biến môi trường NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME chưa được thiết lập.");
            }
            if (!uploadPreset) {
                console.warn("Cảnh báo: uploadPreset chưa được thiết lập. Sử dụng giá trị mặc định?");
                // Hoặc ném lỗi nếu uploadPreset là bắt buộc
                // throw new Error("Upload preset chưa được thiết lập.");
            }


            // Upload giấy tờ đất đai
            for (const file of landDocumentsFiles) {
                const data = new FormData();
                data.append('file', file);
                data.append('upload_preset', uploadPreset); // Sử dụng preset đã định nghĩa

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
                landDocumentUrls.push(fileData.secure_url); // Lưu URL an toàn
            }

            // Upload file KML/KMZ (nếu có)
            let kmlFileUrl: string | null = null;
            if (kmlFileFile) {
                const data = new FormData();
                data.append('file', kmlFileFile);
                data.append('upload_preset', uploadPreset); // Sử dụng preset đã định nghĩa

                const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
                    method: 'POST',
                    body: data
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    console.error(`Cloudinary upload error for ${kmlFileFile.name}:`, errorData);
                    throw new Error(`Tải file KML ${kmlFileFile.name} lên Cloudinary thất bại: ${errorData.error?.message || res.statusText}`);
                }
                const fileData = await res.json();
                kmlFileUrl = fileData.secure_url; // Lưu URL an toàn
            }

            // --- Bước 2: Gửi dữ liệu form và URLs đã upload lên API backend ---
            const projectDataToSend = {
                ...formData,
                details: {
                    ...formData.details,
                    // Chuyển Date objects thành string định dạng ISO 8601 nếu chúng tồn tại
                    riceStartDate: formData.details.riceStartDate instanceof Date ? formData.details.riceStartDate.toISOString() : null,
                    riceEndDate: formData.details.riceEndDate instanceof Date ? formData.details.riceEndDate.toISOString() : null,
                    // Đảm bảo các trường optional khác trong details không bị undefined nếu chưa nhập
                    forestLocation: formData.details.forestLocation || "",
                    forestArea: formData.details.forestArea || "",
                    treeSpecies: formData.details.treeSpecies || "",
                    plantingAge: formData.details.plantingAge || "",
                    averageHeight: formData.details.averageHeight || "",
                    averageCircumference: formData.details.averageCircumference || "",
                    previousDeforestation: formData.details.previousDeforestation || "",

                    riceLocation: formData.details.riceLocation || "",
                    riceArea: formData.details.riceArea || "",
                    riceTerrain: formData.details.riceTerrain || "",
                    riceClimate: formData.details.riceClimate || "",
                    riceSoilType: formData.details.riceSoilType || "",

                    biocharRawMaterial: formData.details.biocharRawMaterial || "",
                    biocharCarbonContent: formData.details.biocharCarbonContent || "",
                    biocharLandArea: formData.details.biocharLandArea || "",
                    biocharApplicationMethod: formData.details.biocharApplicationMethod || "",
                },
                landDocuments: landDocumentUrls, // Gán mảng URLs đã upload
                kmlFile: kmlFileUrl, // Gán URL KML đã upload
                // QUAN TRỌNG: Cần gán userId thực tế ở đây
                userId: "USER_ID_CUA_NGUOI_TAO", // <--- THAY THẾ BẰNG USER ID THỰC TẾ CỦA NGƯỜI DÙNG ĐANG ĐĂNG NHẬP
                // Đảm bảo các trường optional khác ở cấp cao nhất không bị undefined
                organization: formData.organization || "",
                address: formData.address || "",
                additionalInfo: formData.additionalInfo || "",
            };

            console.log("Submitting data to API:", projectDataToSend); // Log data trước khi gửi API backend

            // Gọi API để tạo mới dự án
            // Lưu ý: Tôi giữ lại tên create thay vì add như bạn đã đổi trong code của mình
            // Nếu backend API sử dụng tên 'add', vui lòng đổi lại `apiProjectCarbon.add(projectDataToSend);`
            await apiProjectCarbon.create(projectDataToSend);

            toast({
                title: "Thành công",
                description: "Thêm dự án Carbon thành công! 🎉",
            });

            // Chuyển hướng về trang danh sách sau khi thêm thành công
            router.push("/quan-ly/admin/projects");
        } catch (err: any) {
            console.error("Lỗi khi thêm dự án Carbon:", err);
            // Xử lý lỗi trả về từ API hoặc lỗi upload file
            const errorMessage = err.message || err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
            toast({
                title: "Lỗi",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false); // Kết thúc trạng thái submit
        }
    };

    // Hàm render các trường chi tiết dựa trên loại dự án
    const renderDetailsFields = () => {
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
                            <Input id="forestLocation" name="forestLocation" value={formData.details.forestLocation || ""} onChange={handleDetailInputChange} required />
                            {formErrors['details.forestLocation'] && <p className="text-red-500 text-sm">{formErrors['details.forestLocation']}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="forestArea">Diện tích rừng (ha) <span className="text-red-500">*</span></Label>
                            <Input id="forestArea" name="forestArea" value={formData.details.forestArea || ""} onChange={handleDetailInputChange} required type="number" /> {/* Thêm type="number" */}
                            {formErrors['details.forestArea'] && <p className="text-red-500 text-sm">{formErrors['details.forestArea']}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="treeSpecies">Loài cây</Label>
                            <Input id="treeSpecies" name="treeSpecies" value={formData.details.treeSpecies || ""} onChange={handleDetailInputChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="plantingAge">Tuổi cây (năm)</Label>
                            <Input id="plantingAge" name="plantingAge" value={formData.details.plantingAge || ""} onChange={handleDetailInputChange} type="number" /> {/* Thêm type="number" */}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="averageHeight">Chiều cao trung bình (m)</Label>
                            <Input id="averageHeight" name="averageHeight" value={formData.details.averageHeight || ""} onChange={handleDetailInputChange} type="number" /> {/* Thêm type="number" */}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="averageCircumference">Chu vi trung bình (cm)</Label>
                            <Input id="averageCircumference" name="averageCircumference" value={formData.details.averageCircumference || ""} onChange={handleDetailInputChange} type="number" /> {/* Thêm type="number" */}
                        </div>
                        <div className="grid gap-2 md:col-span-2"> {/* Sử dụng md:col-span-2 để chiếm 2 cột */}
                            <Label htmlFor="previousDeforestation">Có phá rừng trước đây không?</Label>
                            <Select
                                name="previousDeforestation"
                                value={formData.details.previousDeforestation || ""}
                                onValueChange={(value) => handleDetailSelectChange('previousDeforestation', value)}
                            >
                                <SelectTrigger>
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
                            <Input id="riceLocation" name="riceLocation" value={formData.details.riceLocation || ""} onChange={handleDetailInputChange} required />
                            {formErrors['details.riceLocation'] && <p className="text-red-500 text-sm">{formErrors['details.riceLocation']}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="riceArea">Diện tích lúa (ha) <span className="text-red-500">*</span></Label>
                            <Input id="riceArea" name="riceArea" value={formData.details.riceArea || ""} onChange={handleDetailInputChange} required type="number" /> {/* Thêm type="number" */}
                            {formErrors['details.riceArea'] && <p className="text-red-500 text-sm">{formErrors['details.riceArea']}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="riceTerrain">Địa hình</Label>
                            <Input id="riceTerrain" name="riceTerrain" value={formData.details.riceTerrain || ""} onChange={handleDetailInputChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="riceClimate">Khí hậu</Label>
                            <Input id="riceClimate" name="riceClimate" value={formData.details.riceClimate || ""} onChange={handleDetailInputChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="riceSoilType">Loại đất</Label>
                            <Input id="riceSoilType" name="riceSoilType" value={formData.details.riceSoilType || ""} onChange={handleDetailInputChange} />
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
                                            !formData.details.riceStartDate && "text-muted-foreground",
                                            formErrors['details.riceStartDate'] && 'border-red-500' // Highlight lỗi
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.details.riceStartDate ? format(new Date(formData.details.riceStartDate), "dd/MM/yyyy", { locale: vi }) : <span>Chọn ngày</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={formData.details.riceStartDate ? new Date(formData.details.riceStartDate) : undefined}
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
                                            !formData.details.riceEndDate && "text-muted-foreground",
                                            formErrors['details.riceEndDate'] && 'border-red-500' // Highlight lỗi
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.details.riceEndDate ? format(new Date(formData.details.riceEndDate), "dd/MM/yyyy", { locale: vi }) : <span>Chọn ngày</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={formData.details.riceEndDate ? new Date(formData.details.riceEndDate) : undefined}
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
                            <Input id="biocharRawMaterial" name="biocharRawMaterial" value={formData.details.biocharRawMaterial || ""} onChange={handleDetailInputChange} required />
                            {formErrors['details.biocharRawMaterial'] && <p className="text-red-500 text-sm">{formErrors['details.biocharRawMaterial']}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="biocharCarbonContent">Hàm lượng Carbon (%)</Label>
                            <Input id="biocharCarbonContent" name="biocharCarbonContent" value={formData.details.biocharCarbonContent || ""} onChange={handleDetailInputChange} type="number" /> {/* Thêm type="number" */}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="biocharLandArea">Diện tích đất áp dụng (ha) <span className="text-red-500">*</span></Label>
                            <Input id="biocharLandArea" name="biocharLandArea" value={formData.details.biocharLandArea || ""} onChange={handleDetailInputChange} required type="number" /> {/* Thêm type="number" */}
                            {formErrors['details.biocharLandArea'] && <p className="text-red-500 text-sm">{formErrors['details.biocharLandArea']}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="biocharApplicationMethod">Phương pháp áp dụng</Label>
                            <Input id="biocharApplicationMethod" name="biocharApplicationMethod" value={formData.details.biocharApplicationMethod || ""} onChange={handleDetailInputChange} />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };


    return (
        <div className="flex min-h-screen w-full justify-center py-8 px-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Thêm dự án Carbon mới</CardTitle>
                    <CardDescription>Điền thông tin chi tiết cho dự án Carbon mới.</CardDescription>
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
                                <Select
                                    name="projectType"
                                    value={formData.projectType}
                                    onValueChange={(value: "forest" | "rice" | "biochar") => handleSelectChange('projectType', value)}
                                    required
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
                                <div
                                    className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${formErrors.landDocuments ? 'border-red-500' : ''}`}
                                    onClick={() => landDocumentsInputRef.current?.click()}
                                >
                                    <input
                                        id="landDocumentsFiles"
                                        type="file"
                                        ref={landDocumentsInputRef}
                                        multiple // Cho phép chọn nhiều file
                                        onChange={handleLandDocumentsFileChange}
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" // Các định dạng file cho phép
                                        className="hidden" // Ẩn input mặc định
                                    />
                                    <UploadIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                    <p className="text-gray-600">Kéo & thả file hoặc nhấn vào đây</p>
                                    <p className="text-gray-500 text-sm">(PDF, DOC, DOCX, JPG, PNG)</p>
                                </div>
                                {formErrors.landDocuments && <p className="text-red-500 text-sm">{formErrors.landDocuments}</p>}

                                {/* Hiển thị danh sách file đã chọn */}
                                {landDocumentsFiles.length > 0 && (
                                    <div className="mt-2">
                                        <p className="font-medium text-sm mb-1">Đã chọn ({landDocumentsFiles.length} files):</p>
                                        <ul className="grid gap-1 text-sm text-gray-700">
                                            {landDocumentsFiles.map((file, index) => (
                                                <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                                                    <span className="flex items-center"><FileText className="h-4 w-4 mr-2" /> {file.name}</span>
                                                    <button type="button" onClick={() => removeLandDocumentFile(index)} className="p-1"><X className="h-4 w-4 text-gray-500 hover:text-red-500" /></button> {/* Thêm padding cho nút */}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Upload File KML/KMZ */}
                            <div className="grid gap-2">
                                <Label htmlFor="kmlFileFile">File KML/KMZ</Label>
                                <div
                                    className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${formErrors.kmlFile ? 'border-red-500' : ''}`} // Highlight lỗi
                                    onClick={() => kmlFileInputRef.current?.click()}
                                >
                                    <input
                                        id="kmlFileFile"
                                        type="file"
                                        ref={kmlFileInputRef}
                                        onChange={handleKmlFileChange}
                                        accept=".kml,.kmz" // Các định dạng file cho phép
                                        className="hidden" // Ẩn input mặc định
                                    />
                                    <MapPin className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                    <p className="text-gray-600">Kéo & thả file hoặc nhấn vào đây</p>
                                    <p className="text-gray-500 text-sm">(KML, KMZ)</p>
                                </div>
                                {formErrors.kmlFile && <p className="text-red-500 text-sm">{formErrors.kmlFile}</p>} {/* Hiển thị lỗi */}

                                {/* Hiển thị file đã chọn */}
                                {kmlFileFile && (
                                    <div className="mt-2">
                                        <p className="font-medium text-sm mb-1">Đã chọn:</p>
                                        <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md text-sm text-gray-700">
                                            <span className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> {kmlFileFile.name}</span>
                                            <button type="button" onClick={removeKmlFileFile} className="p-1"><X className="h-4 w-4 text-gray-500 hover:text-red-500" /></button> {/* Thêm padding cho nút */}
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
                                {isSubmitting ? "Đang thêm..." : "Thêm dự án"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}