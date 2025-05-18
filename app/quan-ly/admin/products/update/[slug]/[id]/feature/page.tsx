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
import { Textarea } from "@/components/ui/textarea";

import {
    Link as LinkIcon,
    PlusCircle,
    Heading,
    Trash2,
    Settings,
    Edit,
    Image,
} from "lucide-react";

interface FeatureItem {
    _id?: string;
    id?: string;
    title: string;
    description: string;
    icon: string;
}


export default function CarbonCreditDetailsPage() {
    const { id } = useParams();

    const [features, setFeatures] = useState<FeatureItem[]>([]);
    const [newFeatureTitle, setNewFeatureTitle] = useState("");
    const [newFeatureDescription, setNewFeatureDescription] = useState("");
    const [newFeatureIcon, setNewFeatureIcon] = useState("");
    const [isAddingFeature, setIsAddingFeature] = useState(false);
    const [deletingFeatureId, setDeletingFeatureId] = useState<string | null>(null);


    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);


    const fetchData = async () => {
        if (!id) {
            setError("Không có ID Carbon Credit.");
            setLoading(false);
            return;
        }
        try {
            const product = await apiProducts.getById(id as string);

            if (product?.payload?.features && Array.isArray(product.payload.features)) {
                setFeatures(product.payload.features);
            } else {
                console.warn("Features data not found or not an array in API response:", product?.payload?.features);
                setFeatures([]);
            }

            setError(null);
        } catch (err) {
            console.error("Lỗi fetch dữ liệu:", err);
            setError("Không thể tải dữ liệu dự án.");
            setFeatures([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, [id]);


    const handleAddFeature = async (e: FormEvent) => {
        e.preventDefault();

        if (!newFeatureTitle || !newFeatureDescription) {
            setError("Vui lòng nhập đầy đủ Tiêu đề và Mô tả cho Feature.");
            return;
        }

        setIsAddingFeature(true);

        const newFeature: Omit<FeatureItem, '_id'> = {
            title: newFeatureTitle,
            description: newFeatureDescription,
            icon: newFeatureIcon,
        };

        const updatedFeaturesOptimistic = [...features, newFeature];
        setFeatures(updatedFeaturesOptimistic);

        setNewFeatureTitle("");
        setNewFeatureDescription("");
        setNewFeatureIcon("");
        setError(null);

        try {
            const apiResponse = await apiProducts.updateFeatures(id as string, { features: updatedFeaturesOptimistic });

            if (apiResponse?.payload?.features && Array.isArray(apiResponse.payload.features)) {
                setFeatures(apiResponse.payload.features);
            } else {
                console.error("API response for update (add feature) is invalid:", apiResponse?.payload);
                setError("Thêm Feature thành công nhưng dữ liệu trả về không hợp lệ. Vui lòng tải lại trang.");
            }


            console.log("Feature đã được cập nhật thành công trên API (thêm).");


        } catch (err) {
            console.error("Lỗi cập nhật Feature API (thêm):", err);
            setError("Không thể thêm Feature lên máy chủ. Vui lòng tải lại trang và thử lại.");
            fetchData();
        } finally {
            setIsAddingFeature(false);
        }
    };

    const handleDeleteFeature = async (featureId: string) => {
        if (!id || !featureId) {
            setError("Thiếu thông tin ID để xóa Feature.");
            return;
        }

        setDeletingFeatureId(featureId);

        const originalFeatures = features;
        const updatedFeaturesOptimistic = features.filter(feature => feature._id !== featureId);
        setFeatures(updatedFeaturesOptimistic);


        try {
            const apiResponse = await apiProducts.updateFeatures(id as string, { features: updatedFeaturesOptimistic });

            if (apiResponse?.payload?.features && Array.isArray(apiResponse.payload.features)) {
                setFeatures(apiResponse.payload.features);
            } else {
                console.error("API response for update (delete feature) is invalid:", apiResponse?.payload);
                setError("Xóa Feature thành công nhưng dữ liệu trả về không hợp lệ. Vui lòng tải lại trang.");
            }


            console.log(`Feature ${featureId} đã được xóa và features cập nhật trên API.`);

        } catch (err) {
            console.error("Lỗi cập nhật Feature API (xóa):", err);
            setError("Không thể xóa Feature trên máy chủ. Vui lòng tải lại trang và thử lại.");
            setFeatures(originalFeatures);
        } finally {
            setDeletingFeatureId(null);
        }
    };


    if (loading) return <p className="text-center mt-10">Đang tải dữ liệu dự án...</p>;
    if (error && features.length === 0 && !loading) return <p className="text-center text-red-500 mt-10">{error}</p>;


    return (
        <div className="container mx-auto py-6 px-4">
            <h1 className="text-2xl font-bold mb-6 flex items-center">
                <Settings className="mr-2 h-6 w-6" />
                Chi tiết tính năng dự án #{id}
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    {feature.icon ? (
                                        <img src={feature.icon} alt={feature.title} className="h-6 w-6 object-contain flex-shrink-0 mt-1" onError={(e) => (e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmRDb2wiIHN0cm9rZS1saW5lam9pbj0icm91bmRKYXAiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXNldHRpbmdzIj48cGF0aCBkPSJNMTIgMjBhdDggOCAwIDAgMCAwLTE2IDEwIDEwIDAgMCAxIDQgMi41IDEuNSA0IDIuNSA0LjVBIDMuNSAzLjUgMCAwIDAgMTkgMTYuNWEzLjUgMy41IDAgMCAwIDItMi41IDcgNyAwIDAgMCAxLS41IDQgMi41SDQhIi8+PHBhdGggZD0iTTIgMTJoMjAiLz48Y2lyY2xlIGN4PSIxMiIgeXk9IjEyIiByPSIyIi8+PHBhdGggZD0iTTQgNCBsMi41IDIuNSIvPjxwYXRoIGQ9Ik0yMCAyMCBsLTIuNSAtMi41Ii8+PHBhdGggZD0iTTQgMjAgbDIuNSAtMi41Ii8+PHBhdGggZD0iTTIwIDQgbGwtMi41IDIuNSIvPjwvc3ZnPg==')} />
                                    ) : (
                                        <Settings className="h-6 w-6 flex-shrink-0 text-gray-600 mt-1" />
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
                                                    {feature.icon.split("/").pop()}
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                    {feature._id && (
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDeleteFeature(feature._id!)}
                                            disabled={deletingFeatureId === feature._id}
                                            className="flex-shrink-0"
                                        >
                                            {deletingFeatureId === feature._id ? (
                                                <Trash2 className="h-4 w-4 animate-pulse" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                            <span className="sr-only">Xóa feature {feature.title}</span>
                                        </Button>
                                    )}
                                </div>
                            ))
                        ) : (
                            !loading && !error && null
                        )}
                    </CardContent>
                </Card>

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
                                <Label htmlFor="newFeatureIcon">Icon URL (Tùy chọn)</Label>
                                <div className="relative flex items-center">
                                    <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="newFeatureIcon"
                                        type="url"
                                        value={newFeatureIcon}
                                        onChange={(e) => setNewFeatureIcon(e.target.value)}
                                        placeholder="URL của icon (ví dụ: https://.../icon.png)"
                                        disabled={isAddingFeature}
                                        className="pl-8"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isAddingFeature || !newFeatureTitle || !newFeatureDescription}
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