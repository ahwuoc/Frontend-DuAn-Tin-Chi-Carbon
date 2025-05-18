"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
// Giả định apiProducts có hàm getById và updateBenefits
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
import { Trash2, Settings, PlusCircle } from "lucide-react"; // Cập nhật imports icons

// Interface cho Benefit
interface IBenefits {
    _id?: string; // ID của benefit, có thể không có khi tạo mới
    title: string;
}


export default function CarbonCreditDetailsPage() {
    const { id } = useParams();

    // State cho Benefits
    const [benefits, setBenefits] = useState<IBenefits[]>([]);
    const [newBenefitTitle, setNewBenefitTitle] = useState("");
    const [isAddingBenefit, setIsAddingBenefit] = useState(false);
    // Sử dụng _id để theo dõi benefit đang xóa
    const [deletingBenefitId, setDeletingBenefitId] = useState<string | null>(null);


    // State chung
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);


    // Function để fetch dữ liệu (chỉ benefits)
    const fetchData = async () => {
        if (!id) {
            setError("Không có ID Carbon Credit.");
            setLoading(false);
            return;
        }
        try {
            // Giả định apiProducts.getById trả về { payload: { benefits: [...] } }
            const product = await apiProducts.getById(id as string);

            // Xử lý Benefits
            if (product?.payload?.benefits && Array.isArray(product.payload.benefits)) {
                setBenefits(product.payload.benefits);
            } else {
                console.warn("Benefits data not found or not an array in API response:", product?.payload?.benefits);
                setBenefits([]);
            }

            setError(null);
        } catch (err) {
            console.error("Lỗi fetch dữ liệu:", err);
            setError("Không thể tải dữ liệu lợi ích dự án.");
            setBenefits([]); // Clear benefits on error
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, [id]);


    // Hàm xử lý thêm Benefit mới
    const handleAddBenefit = async (e: FormEvent) => {
        e.preventDefault();

        if (!newBenefitTitle.trim()) { // Kiểm tra tiêu đề không rỗng hoặc chỉ chứa khoảng trắng
            setError("Vui lòng nhập Tiêu đề cho Lợi ích.");
            return;
        }

        setIsAddingBenefit(true);

        const newBenefit: Omit<IBenefits, '_id'> = { // Không có _id khi tạo mới
            title: newBenefitTitle.trim(), // Loại bỏ khoảng trắng thừa
        };

        // Cập nhật lạc quan (optimistic update)
        // Thêm benefit mới vào cuối danh sách tạm thời
        const updatedBenefitsOptimistic = [...benefits, newBenefit];
        setBenefits(updatedBenefitsOptimistic); // Cập nhật UI ngay lập tức

        // Clear form
        setNewBenefitTitle("");
        setError(null); // Clear previous error

        try {
            // Gọi API để cập nhật danh sách benefits
            // Giả định apiProducts có hàm updateBenefits nhận project id và object chứa benefits
            const apiResponse = await apiProducts.updateBenefits(id as string, { benefits: updatedBenefitsOptimistic });

            // Giả định API trả về toàn bộ danh sách benefits sau khi cập nhật, bao gồm cả _id mới
            if (apiResponse?.payload?.benefits && Array.isArray(apiResponse.payload.benefits)) {
                // Cập nhật state với dữ liệu từ API (bao gồm cả _id mới)
                setBenefits(apiResponse.payload.benefits);
            } else {
                console.error("API response for update (add benefit) is invalid:", apiResponse?.payload);
                setError("Thêm Lợi ích thành công nhưng dữ liệu trả về không hợp lệ. Vui lòng tải lại trang.");
                // Nếu API trả về lỗi hoặc dữ liệu không hợp lệ, nên fetch lại để đồng bộ
                fetchData();
            }

            console.log("Benefit đã được cập nhật thành công trên API (thêm).");

        } catch (err) {
            console.error("Lỗi cập nhật Benefit API (thêm):", err);
            setError("Không thể thêm Lợi ích lên máy chủ. Vui lòng tải lại trang và thử lại.");
            // Nếu có lỗi API, fetch lại toàn bộ dữ liệu để đồng bộ
            fetchData();
        } finally {
            setIsAddingBenefit(false);
        }
    };

    // Hàm xử lý xóa Benefit
    const handleDeleteBenefit = async (benefitId: string) => {
        if (!id || !benefitId) {
            setError("Thiếu thông tin ID để xóa Lợi ích.");
            return;
        }

        setDeletingBenefitId(benefitId);

        // Lưu lại danh sách gốc để hoàn nguyên nếu lỗi
        const originalBenefits = benefits;
        // Cập nhật lạc quan: Lọc bỏ benefit cần xóa theo _id
        const updatedBenefitsOptimistic = benefits.filter(benefit => benefit._id !== benefitId);
        setBenefits(updatedBenefitsOptimistic);

        try {
            // Gọi API để cập nhật danh sách benefits (sau khi xóa)
            // Giả định updateBenefits cần toàn bộ danh sách benefits sau khi xóa
            const apiResponse = await apiProducts.updateBenefits(id as string, { benefits: updatedBenefitsOptimistic });

            if (apiResponse?.payload?.benefits && Array.isArray(apiResponse.payload.benefits)) {
                // Cập nhật state với dữ liệu từ API (đảm bảo đã xóa đúng item)
                setBenefits(apiResponse.payload.benefits);
            } else {
                console.error("API response for update (delete benefit) is invalid:", apiResponse?.payload);
                setError("Xóa Lợi ích thành công nhưng dữ liệu trả về không hợp lệ. Vui lòng tải lại trang.");
                // Nếu API trả về lỗi hoặc dữ liệu không hợp lệ, hoàn nguyên state
                setBenefits(originalBenefits);
                fetchData(); // Hoặc fetch lại để đồng bộ
            }


            console.log(`Benefit ${benefitId} đã được xóa và benefits cập nhật trên API.`);

        } catch (err) {
            console.error("Lỗi cập nhật Benefit API (xóa):", err);
            setError("Không thể xóa Lợi ích trên máy chủ. Vui lòng tải lại trang và thử lại.");
            // Nếu có lỗi API, hoàn nguyên state
            setBenefits(originalBenefits);
        } finally {
            setDeletingBenefitId(null);
        }
    };


    if (loading) return <p className="text-center mt-10">Đang tải dữ liệu dự án...</p>;
    // Hiển thị lỗi chỉ khi không có benefits nào được tải ban đầu
    if (error && benefits.length === 0 && !loading) return <p className="text-center text-red-500 mt-10">{error}</p>;


    return (
        <div className="container mx-auto py-6 px-4">
            <h1 className="text-2xl font-bold mb-6 flex items-center">
                <Settings className="mr-2 h-6 w-6" />
                Chi tiết lợi ích dự án #{id}
            </h1>
            {/* Hiển thị lỗi nếu có, kể cả khi đã có dữ liệu được tải */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Sử dụng grid cho layout 2 cột */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cột 1: Hiển thị danh sách Benefits hiện có */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Settings className="mr-2 h-5 w-5" /> Các lợi ích hiện có</CardTitle>
                        {benefits.length === 0 && !loading && !error && (
                            <CardDescription>Chưa có lợi ích nào được thêm cho dự án này.</CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-3"> {/* Giảm khoảng cách giữa các item */}
                        {benefits.length > 0 ? (
                            benefits.map((benefit, index) => (
                                <div key={benefit._id || `new-${index}`} className="border p-3 rounded-md shadow-sm hover:shadow transition flex items-center justify-between space-x-3"> {/* Giảm padding */}
                                    <div className="flex-1 flex items-center space-x-2 min-w-0"> {/* Sử dụng flex items-center */}
                                        <PlusCircle className="h-5 w-5 flex-shrink-0 text-blue-500" /> {/* Icon đại diện cho Benefit */}
                                        <p className="text-base font-semibold truncate">{benefit.title}</p> {/* Truncate title nếu quá dài */}
                                    </div>
                                    {benefit._id && ( // Chỉ cho phép xóa nếu có _id (đã lưu trên DB)
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDeleteBenefit(benefit._id!)}
                                            disabled={deletingBenefitId === benefit._id}
                                            className="flex-shrink-0" // Ngăn nút bị co lại
                                        >
                                            {deletingBenefitId === benefit._id ? (
                                                <Trash2 className="h-4 w-4 animate-pulse" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                            <span className="sr-only">Xóa lợi ích "{benefit.title}"</span>
                                        </Button>
                                    )}
                                    {/* Hiển thị trạng thái đang thêm cho benefit lạc quan */}
                                    {!benefit._id && isAddingBenefit && index === benefits.length - 1 && (
                                        <span className="text-xs text-gray-500 italic">Đang thêm...</span>
                                    )}
                                </div>
                            ))
                        ) : (
                            !loading && !error && null
                        )}
                    </CardContent>
                </Card>

                {/* Cột 2: Form thêm Benefit mới */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><PlusCircle className="mr-2 h-5 w-5" /> Thêm lợi ích mới</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddBenefit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="newBenefitTitle">Tiêu đề lợi ích</Label>
                                <div className="relative flex items-center">
                                    {/* Icon trong input nếu muốn */}
                                    {/* <Heading className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /> */}
                                    <Input
                                        id="newBenefitTitle"
                                        type="text"
                                        value={newBenefitTitle}
                                        onChange={(e) => setNewBenefitTitle(e.target.value)}
                                        placeholder="Ví dụ: Giảm dấu chân carbon"
                                        disabled={isAddingBenefit}
                                    // className="pl-8" // Bỏ padding trái nếu không có icon
                                    />
                                </div>
                            </div>

                            {/* Không có input description và icon */}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isAddingBenefit || !newBenefitTitle.trim()}
                            >
                                {isAddingBenefit ? (
                                    <> <PlusCircle className="mr-2 h-4 w-4 animate-pulse" /> Đang thêm... </>
                                ) : (
                                    <> <PlusCircle className="mr-2 h-4 w-4" /> Thêm lợi ích </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

            </div>

        </div>
    );
}