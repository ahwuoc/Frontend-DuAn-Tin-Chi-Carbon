"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
// Giả định apiProducts có hàm getById và updateFeatures
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
import { Textarea } from "@/components/ui/textarea";

import {
    Link as LinkIcon, // Dùng cho Icon URL
    PlusCircle,
    Heading, // Dùng cho Tiêu đề
    Trash2,
    Settings, // Icon chính cho Features
    Edit, // Dùng cho Mô tả
    Image, // Dùng cho Icon URL
    UploadCloud, // Giữ lại đề phòng bạn muốn thêm upload icon sau này
} from "lucide-react";

// Interface cho Feature (đã có)
interface FeatureItem {
    _id?: string; // ID của feature, có thể không có khi tạo mới
    id?: string; // Có thể có ID riêng (như "f1") hoặc dùng _id
    title: string;
    description: string;
    icon: string; // URL của icon
}

// Cloudinary config (giữ lại nhưng không dùng trong form hiện tại)
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const uploadPreset = "my_unsigned_preset";


export default function CarbonCreditDetailsPage() {
    const { id } = useParams();

    // State cho Features (đã có)
    const [features, setFeatures] = useState<FeatureItem[]>([]);
    const [newFeatureTitle, setNewFeatureTitle] = useState("");
    const [newFeatureDescription, setNewFeatureDescription] = useState("");
    const [newFeatureIcon, setNewFeatureIcon] = useState("");
    const [isAddingFeature, setIsAddingFeature] = useState(false);
    const [deletingFeatureId, setDeletingFeatureId] = useState<string | null>(null);
    // State cho upload icon (giữ lại nhưng không dùng trong form hiện tại)
    const [isUploadingFeatureIcon, setIsUploadingFeatureIcon] = useState(false);
    const [uploadedFeatureIconName, setUploadedFeatureIconName] = useState<string | null>(null);


    // State chung
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);


    // Function để fetch dữ liệu (chỉ features)
    const fetchData = async () => {
        if (!id) {
            setError("Không có ID Carbon Credit.");
            setLoading(false);
            return;
        }
        try {
            // Giả định apiProducts.getById trả về { payload: { features: [...] } }
            const product = await apiProducts.getById(id as string);

            // Xử lý Features
            if (product?.payload?.features && Array.isArray(product.payload.features)) {
                // Không cần sort features trừ khi có yêu cầu cụ thể về thứ tự
                setFeatures(product.payload.features);
            } else {
                console.warn("Features data not found or not an array in API response:", product?.payload?.features);
                setFeatures([]);
            }

            setError(null);
        } catch (err) {
            console.error("Lỗi fetch dữ liệu:", err);
            setError("Không thể tải dữ liệu dự án.");
            setFeatures([]); // Clear features on error
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData(); // Gọi hàm fetch dữ liệu chung
    }, [id]);


    // Hàm xử lý thêm Feature mới (đã có)
    const handleAddFeature = async (e: FormEvent) => {
        e.preventDefault();

        if (!newFeatureTitle || !newFeatureDescription || !newFeatureIcon) {
            setError("Vui lòng nhập đầy đủ Tiêu đề, Mô tả và Icon URL cho Feature.");
            return;
        }

        setIsAddingFeature(true); // Bắt đầu thêm feature

        const newFeature: Omit<FeatureItem, '_id'> = { // Không có _id khi tạo mới
            title: newFeatureTitle,
            description: newFeatureDescription,
            icon: newFeatureIcon,
            // Có thể thêm logic tạo id như "f1", "f2" nếu cần, hoặc để backend tạo
        };

        // Cập nhật lạc quan (optimistic update)
        const updatedFeaturesOptimistic = [...features, newFeature]; // Không cần sort features
        setFeatures(updatedFeaturesOptimistic); // Cập nhật UI ngay lập tức

        // Clear form
        setNewFeatureTitle("");
        setNewFeatureDescription("");
        setNewFeatureIcon("");
        setError(null); // Clear previous error

        try {
            // Gọi API để cập nhật danh sách features
            // Giả định apiProducts có hàm updateFeatures nhận project id và object chứa features
            const apiResponse = await apiProducts.updateFeatures(id as string, { features: updatedFeaturesOptimistic });

            // Giả định API trả về toàn bộ danh sách features sau khi cập nhật, bao gồm cả _id mới
            if (apiResponse?.payload?.features && Array.isArray(apiResponse.payload.features)) {
                // Cập nhật state với dữ liệu từ API (bao gồm cả _id mới)
                setFeatures(apiResponse.payload.features);
            } else {
                console.error("API response for update (add feature) is invalid:", apiResponse?.payload);
                setError("Thêm Feature thành công nhưng dữ liệu trả về không hợp lệ. Vui lòng tải lại trang.");
                // Nếu API trả về lỗi hoặc dữ liệu không hợp lệ, có thể hoàn nguyên state
                // fetchData(); // Hoặc fetch lại toàn bộ để đồng bộ
            }


            console.log("Feature đã được cập nhật thành công trên API (thêm).");


        } catch (err) {
            console.error("Lỗi cập nhật Feature API (thêm):", err);
            setError("Không thể thêm Feature lên máy chủ. Vui lòng tải lại trang và thử lại.");
            // Nếu có lỗi API, hoàn nguyên state
            // setFeatures(originalFeatures); // Cần lưu originalFeatures
            // Hoặc fetch lại toàn bộ dữ liệu để đồng bộ
            fetchData();
        } finally {
            setIsAddingFeature(false); // Kết thúc thêm feature
        }
    };

    // Hàm xử lý xóa Feature (đã có)
    const handleDeleteFeature = async (featureId: string) => {
        if (!id || !featureId) {
            setError("Thiếu thông tin ID để xóa Feature.");
            return;
        }

        setDeletingFeatureId(featureId); // Đặt state để disable nút xóa

        // Lưu lại danh sách gốc để hoàn nguyên nếu lỗi
        const originalFeatures = features;
        // Cập nhật lạc quan
        const updatedFeaturesOptimistic = features.filter(feature => feature._id !== featureId); // Lọc bỏ feature cần xóa
        setFeatures(updatedFeaturesOptimistic); // Cập nhật UI ngay lập tức


        try {
            // Gọi API để cập nhật danh sách features (sau khi xóa)
            // Giả định updateFeatures cần toàn bộ danh sách features sau khi xóa
            const apiResponse = await apiProducts.updateFeatures(id as string, { features: updatedFeaturesOptimistic });

            if (apiResponse?.payload?.features && Array.isArray(apiResponse.payload.features)) {
                // Cập nhật state với dữ liệu từ API (đảm bảo đã xóa đúng item)
                setFeatures(apiResponse.payload.features);
            } else {
                console.error("API response for update (delete feature) is invalid:", apiResponse?.payload);
                setError("Xóa Feature thành công nhưng dữ liệu trả về không hợp lệ. Vui lòng tải lại trang.");
                // Nếu API trả về lỗi hoặc dữ liệu không hợp lệ, có thể hoàn nguyên state
                // setFeatures(originalFeatures);
            }


            console.log(`Feature ${featureId} đã được xóa và features cập nhật trên API.`);

        } catch (err) {
            console.error("Lỗi cập nhật Feature API (xóa):", err);
            setError("Không thể xóa Feature trên máy chủ. Vui lòng tải lại trang và thử lại.");
            // Nếu có lỗi API, hoàn nguyên state
            setFeatures(originalFeatures);
        } finally {
            setDeletingFeatureId(null); // Kết thúc xóa
        }
    };


    if (loading) return <p className="text-center mt-10">Đang tải dữ liệu dự án...</p>;
    // Hiển thị lỗi chỉ khi không có features nào được tải ban đầu
    if (error && features.length === 0 && !loading) return <p className="text-center text-red-500 mt-10">{error}</p>;


    return (
        <div className="container mx-auto py-6 px-4">
            <h1 className="text-2xl font-bold mb-6 flex items-center">
                <Settings className="mr-2 h-6 w-6" /> {/* Icon cho trang chi tiết */}
                Chi tiết dự án #{id}
            </h1>
            {/* Hiển thị lỗi nếu có, kể cả khi đã có dữ liệu được tải */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Sử dụng grid cho layout 2 cột */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cột 1: Hiển thị danh sách Features hiện có */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Settings className="mr-2 h-5 w-5" /> Các tính năng hiện có</CardTitle>
                        {features.length === 0 && !loading && !error && (
                            <CardDescription>Chưa có tính năng nào được thêm cho dự án này.</CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {features.length > 0 ? (
                            features.map((feature, index) => (
                                <div key={feature._id || index} className="border p-4 rounded-md shadow-sm hover:shadow transition flex items-start space-x-3">
                                    {/* Hiển thị icon nếu có URL hợp lệ */}
                                    {feature.icon ? (
                                        <img src={feature.icon} alt={feature.title} className="h-6 w-6 object-contain flex-shrink-0 mt-1" onError={(e) => (e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmRDb2wiIHN0cm9rZS1saW5lam9pbj0icm91bmRKYXAiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXNldHRpbmdzIj48cGF0aCBkPSJNMTIgMjBhdDggOCAwIDAgMCAwLTE2IDEwIDEwIDAgMCAxIDQgMi41IDEuNSA0IDIuNSA0LjVBIDMuNSAzLjUgMCAwIDAgMTkgMTYuNWEzLjUgMy41IDAgMCAwIDItMi41IDcgNyAwIDAgMCAxLS41IDQgMi41SDQhIi8+PHBhdGggZD0iTTIgMTJoMjAiLz48Y2lyY2xlIGN4PSIxMiIgeXk9IjEyIiByPSIyIi8+PHBhdGggZD0iTTQgNCBsMi41IDIuNSIvPjxwYXRoIGQ9Ik0yMCAyMCBsLTIuNSAtMi41Ii8+PHBhdGggZD0iTTQgMjAgbDIuNSAtMi41Ii8+PHBhdGggZD0iTTIwIDQgbC0yLjUgMi41Ii8+PC9zdmc+')} /> // Thêm onError để hiển thị icon mặc định nếu ảnh lỗi
                                    ) : (
                                        <Settings className="h-6 w-6 flex-shrink-0 text-gray-600 mt-1" /> // Icon mặc định nếu không có icon URL
                                    )}
                                    <div className="flex-1 space-y-1">
                                        <p className="text-base font-semibold">{feature.title}</p>
                                        <p className="text-sm text-gray-700 flex items-center gap-1">
                                            <Edit className="h-4 w-4 text-gray-500" />
                                            {feature.description}
                                        </p>
                                        {feature.icon && (
                                            <p className="text-sm text-gray-700 flex items-center gap-1 truncate">
                                                <Image className="h-4 w-4 text-gray-500" />
                                                Icon URL: {" "}
                                                <a
                                                    href={feature.icon}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline truncate"
                                                >
                                                    {feature.icon.split("/").pop()} {/* Chỉ hiển thị tên file hoặc phần cuối URL */}
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                    {feature._id && ( // Chỉ cho phép xóa nếu có _id (đã lưu trên DB)
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDeleteFeature(feature._id!)}
                                            disabled={deletingFeatureId === feature._id}
                                            className="flex-shrink-0"
                                        >
                                            {deletingFeatureId === feature._id ? (
                                                <Trash2 className="h-4 w-4 animate-pulse" /> // Hiển thị icon loading khi đang xóa
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                            <span className="sr-only">Xóa feature {feature.title}</span>
                                        </Button>
                                    )}
                                </div>
                            ))
                        ) : (
                            !loading && !error && null // Hiển thị "Chưa có tính năng" nếu không có dữ liệu
                        )}
                    </CardContent>
                </Card>

                {/* Cột 2: Form thêm Feature mới */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><PlusCircle className="mr-2 h-5 w-5" /> Thêm tính năng mới</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddFeature} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="newFeatureTitle">Tiêu đề tính năng</Label>
                                <div className="relative flex items-center">
                                    <Heading className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="newFeatureTitle"
                                        type="text"
                                        value={newFeatureTitle}
                                        onChange={(e) => setNewFeatureTitle(e.target.value)}
                                        placeholder="Ví dụ: Chứng nhận quốc tế"
                                        disabled={isAddingFeature}
                                        className="pl-8"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newFeatureDescription">Mô tả tính năng</Label>
                                <div className="relative flex items-center">
                                    <Edit className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Textarea
                                        id="newFeatureDescription"
                                        value={newFeatureDescription}
                                        onChange={(e) => setNewFeatureDescription(e.target.value)}
                                        placeholder="Ví dụ: Đạt chuẩn VCS & CCB toàn cầu"
                                        disabled={isAddingFeature}
                                        className="pl-8"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newFeatureIcon">Icon URL</Label>
                                <div className="relative flex items-center">
                                    <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="newFeatureIcon"
                                        type="url" // Sử dụng type="url" để có validation cơ bản
                                        value={newFeatureIcon}
                                        onChange={(e) => setNewFeatureIcon(e.target.value)}
                                        placeholder="URL của icon (ví dụ: https://.../icon.png)"
                                        disabled={isAddingFeature}
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                            {/* Có thể thêm input type="file" và handler upload icon tại đây nếu cần */}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isAddingFeature || !newFeatureTitle || !newFeatureDescription || !newFeatureIcon}
                            >
                                {isAddingFeature ? (
                                    <> <PlusCircle className="mr-2 h-4 w-4 animate-pulse" /> Đang thêm... </>
                                ) : (
                                    <> <PlusCircle className="mr-2 h-4 w-4" /> Thêm tính năng </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

            </div>

        </div>
    );
}