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
    CardDescription, // Có thể dùng CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // Dùng Label với Input
import { Separator } from "@/components/ui/separator"; // Để phân tách các phần

// Import các icon từ lucide-react
import {
    CalendarDays, // Cho tiêu đề trang và ngày timeline
    CircleDot, // Cho điểm sự kiện trên timeline
    PlusCircle, // Cho nút thêm
    Trash2, // Cho nút xóa
    Calendar, // Cho ngày input
    ClipboardEdit, // Cho mô tả input
} from "lucide-react";
import Link from "next/link"; // Giữ lại Link của Next.js nếu cần

interface TimelineEvent {
    _id?: string; // API thường trả về ID cho mỗi mục
    date: string;
    event: string; // Đổi tên desc thành event cho nhất quán với JSON bạn cung cấp trước đó
}

// Hàm helper để định dạng ngày tháng (tái sử dụng)
const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid Date";
        // Bạn có thể chọn định dạng hiển thị, ví dụ "DD/MM/YYYY" hoặc "YYYY-MM-DD"
        return date.toLocaleDateString("vi-VN");
    } catch (e) {
        console.error("Error formatting date:", e);
        return "Invalid Date";
    }
};

export default function CarbonCreditTimelinePage() {
    const { id } = useParams();
    // Sử dụng kiểu TimelineEvent[] với _id
    const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
    const [newDate, setNewDate] = useState("");
    const [newEvent, setNewEvent] = useState(""); // Đổi tên newDesc thành newEvent
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); // Thêm trạng thái loading
    const [isAdding, setIsAdding] = useState(false); // Trạng thái khi đang thêm/gọi API
    const [deletingId, setDeletingId] = useState<string | null>(null); // Theo dõi item đang xóa

    useEffect(() => {
        const fetchTimeline = async () => {
            if (!id) {
                setError("Không có ID Carbon Credit.");
                setLoading(false);
                return;
            }
            try {
                // Giả định apiProducts.getById trả về object { data: { timeline: [...] } }
                const product = await apiProducts.getById(id as string); // Cast id sang string
                if (product?.data?.timeline) {
                    // Sắp xếp timeline theo ngày nếu cần thiết (ví dụ: ngày tăng dần)
                    const sortedTimeline = product.data.timeline.sort((a: TimelineEvent, b: TimelineEvent) => new Date(a.date).getTime() - new Date(b.date).getTime());
                    setTimeline(sortedTimeline);
                } else {
                    setTimeline([]); // Đảm bảo timeline là mảng rỗng
                    console.warn("Timeline data not found in API response.");
                }
            } catch (err) {
                console.error("Lỗi fetch timeline:", err);
                setError("Không thể tải timeline.");
            } finally {
                setLoading(false);
            }
        };
        fetchTimeline();
    }, [id]);

    const handleAddEvent = async (e: FormEvent) => {
        e.preventDefault(); // Ngăn chặn reload trang

        if (!newDate || !newEvent) {
            setError("Vui lòng nhập đầy đủ ngày và mô tả sự kiện.");
            return;
        }

        setIsAdding(true); // Bắt đầu thêm

        const newTimelineEvent: Omit<TimelineEvent, '_id'> = { // Tạo object sự kiện mới (không có _id ban đầu)
            date: newDate,
            event: newEvent,
        };

        // Tạm thời thêm vào state để hiển thị ngay (API sẽ trả về ID thực tế)
        const updatedTimelineOptimistic = [...timeline, newTimelineEvent];
        // Có thể thêm ID tạm thời nếu cần key duy nhất ngay lập tức trước khi có ID thật từ API
        // const tempId = `temp-${Date.now()}`;
        // const updatedTimelineOptimistic = [...timeline, { ...newTimelineEvent, _id: tempId }];

        // setTimeline(updatedTimelineOptimistic); // Cập nhật UI trước

        setNewDate(""); // Clear form ngay lập tức
        setNewEvent("");
        setError(null); // Xóa lỗi cũ

        try {
            // Giả định API mong muốn toàn bộ mảng timeline đã cập nhật
            const apiResponse = await apiProducts.updatetimeline(id as string, { timeline: updatedTimelineOptimistic });

            // Nếu API trả về dữ liệu timeline đã được cập nhật (có ID thật), sử dụng nó:
            if (apiResponse?.data?.timeline) {
                const sortedTimeline = apiResponse.data.timeline.sort((a: TimelineEvent, b: TimelineEvent) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setTimeline(sortedTimeline); // Cập nhật lại state với dữ liệu từ API
            } else {
                // Nếu API không trả về dữ liệu cập nhật, có thể cần fetch lại hoặc xử lý khác
                setError("Đã thêm sự kiện, nhưng không thể xác nhận từ máy chủ. Vui lòng tải lại trang.");
                // Hoặc chỉ giữ lại optimistic update nếu API chắc chắn thành công
                setTimeline(updatedTimelineOptimistic.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())); // Giữ lại và sắp xếp optimistic update
            }

            console.log("Timeline đã được cập nhật thành công trên API (thêm sự kiện).");


        } catch (err) {
            console.error("Lỗi cập nhật timeline API (thêm):", err);
            setError("Không thể cập nhật timeline trên máy chủ. Vui lòng tải lại trang và thử lại.");
            // Rollback state nếu optimistic update đã được thực hiện và API lỗi
            // setTimeline(timeline); // Quay lại trạng thái trước khi thêm tạm thời
        } finally {
            setIsAdding(false); // Kết thúc thêm
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (!id || !eventId) {
            setError("Thiếu thông tin ID để xóa.");
            return;
        }

        setDeletingId(eventId); // Bắt đầu xóa, theo dõi item đang xóa

        // Lọc bỏ sự kiện khỏi state local
        const updatedTimelineOptimistic = timeline.filter(event => event._id !== eventId);
        setTimeline(updatedTimelineOptimistic); // Cập nhật UI trước

        try {
            // Giả định API mong muốn toàn bộ mảng timeline sau khi xóa
            const apiResponse = await apiProducts.updatetimeline(id as string, { timeline: updatedTimelineOptimistic });

            // Nếu API trả về dữ liệu timeline đã được cập nhật, sử dụng nó:
            if (apiResponse?.data?.timeline) {
                const sortedTimeline = apiResponse.data.timeline.sort((a: TimelineEvent, b: TimelineEvent) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setTimeline(sortedTimeline); // Cập nhật lại state với dữ liệu từ API
            } else {
                // Nếu API không trả về dữ liệu cập nhật, có thể cần fetch lại hoặc xử lý khác
                setError("Đã xóa sự kiện, nhưng không thể xác nhận từ máy chủ. Vui lòng tải lại trang.");
                // Hoặc chỉ giữ lại optimistic update nếu API chắc chắn thành công
                setTimeline(updatedTimelineOptimistic.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())); // Giữ lại và sắp xếp optimistic update
            }

            console.log(`Sự kiện ${eventId} đã được xóa và timeline cập nhật trên API.`);


        } catch (err) {
            console.error("Lỗi cập nhật timeline API (xóa):", err);
            setError("Không thể xóa sự kiện trên máy chủ. Vui lòng tải lại trang và thử lại.");
            // Rollback state (phải tìm lại item đã xóa để thêm lại vào đúng vị trí nếu cần) - khá phức tạp
            // Đơn giản nhất là yêu cầu người dùng tải lại trang hoặc fetch lại toàn bộ timeline
            fetchTimeline(); // Thử fetch lại toàn bộ timeline để đồng bộ hóa state
        } finally {
            setDeletingId(null); // Kết thúc xóa
        }
    };


    if (loading) return <p className="text-center mt-10">Đang tải dòng thời gian...</p>;
    // Hiển thị lỗi nếu có, ngay cả khi có timeline được tải
    if (error && timeline.length === 0) return <p className="text-center text-red-500 mt-10">{error}</p>;


    return (
        <div className="max-w-3xl mx-auto py-6 px-4"> {/* Sử dụng py-6 px-4 */}

            <h1 className="text-2xl font-bold mb-6 flex items-center">
                <CalendarDays className="mr-2 h-6 w-6" /> {/* Icon tiêu đề trang */}
                Dòng thời gian dự án #{id}
            </h1>

            {/* Card Danh sách Timeline */}
            <Card className="mb-6"> {/* Thêm khoảng cách dưới card */}
                <CardHeader>
                    <CardTitle>Các sự kiện</CardTitle>
                    {timeline.length === 0 && !loading && !error && ( // Thông báo khi không có sự kiện
                        <CardDescription>Chưa có sự kiện nào trên dòng thời gian.</CardDescription>
                    )}
                </CardHeader>
                <CardContent className="space-y-6"> {/* Tăng khoảng cách giữa các sự kiện */}
                    {timeline.length > 0 ? (
                        <ol className="relative border-s border-gray-200 dark:border-gray-700 ml-4"> {/* Tạo đường kẻ dọc cho timeline */}
                            {timeline.map((event, index) => (
                                // Sử dụng key an toàn hơn (_id)
                                <li key={event._id || index} className="mb-10 ms-6"> {/* ms-6 để tạo khoảng trống cho icon */}
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                        <CircleDot className="w-3 h-3 text-blue-800 dark:text-blue-300" /> {/* Icon điểm sự kiện */}
                                    </span>
                                    <div className="flex items-center justify-between gap-4"> {/* Flex để căn chỉnh nội dung và nút xóa */}
                                        <div>
                                            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                                {event.event} {/* Hiển thị mô tả sự kiện */}
                                            </h3>
                                            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                                                <CalendarDays className="inline-block h-4 w-4 mr-1" /> {/* Icon ngày */}
                                                {formatDate(event.date)} {/* Định dạng ngày */}
                                            </time>
                                        </div>
                                        {/* Nút Xóa */}
                                        {event._id && ( // Chỉ hiện nút xóa nếu có ID
                                            <Button
                                                variant="destructive" // Màu đỏ
                                                size="icon" // Kích thước icon
                                                onClick={() => handleDeleteEvent(event._id!)} // Gọi hàm xóa với ID (dùng ! vì đã kiểm tra event._id tồn tại)
                                                disabled={deletingId === event._id} // Disable khi đang xóa item này
                                                className="flex-shrink-0" // Ngăn nút bị co lại
                                            >
                                                {deletingId === event._id ? (
                                                    // Icon loading khi đang xóa item này (cần cài thư viện icon loading)
                                                    // Ví dụ: <Loader2 className="h-4 w-4 animate-spin" />
                                                    <Trash2 className="h-4 w-4" /> // Giữ nguyên icon xóa tạm thời
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                                <span className="sr-only">Xóa sự kiện</span> {/* Text cho screen reader */}
                                            </Button>
                                        )}

                                    </div>

                                    {/* Có thể thêm mô tả chi tiết hơn nếu có trong data */}
                                    {/* <p className="text-base font-normal text-gray-500 dark:text-gray-400">Mô tả chi tiết nếu có.</p> */}

                                </li>
                            ))}
                        </ol>
                    ) : (
                        !loading && !error && null // CardDescription ở trên đã xử lý thông báo rỗng
                    )}
                </CardContent>
            </Card>

            {/* Hiển thị lỗi nếu có, ngay cả khi có timeline được tải */}
            {error && timeline.length > 0 && <p className="text-red-500 mb-4">{error}</p>}


            {/* Card Thêm sự kiện mới */}
            <Card>
                <CardHeader>
                    <CardTitle>Thêm sự kiện mới</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddEvent} className="space-y-4"> {/* Sử dụng form và space-y */}
                        {/* Input Ngày */}
                        <div className="space-y-2">
                            <Label htmlFor="newDate">Ngày sự kiện</Label>
                            <Input
                                id="newDate"
                                type="date"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                            />
                        </div>

                        {/* Input Mô tả */}
                        <div className="space-y-2">
                            <Label htmlFor="newEvent">Mô tả sự kiện</Label>
                            <Input
                                id="newEvent"
                                type="text" // Hoặc type="textarea" nếu mô tả dài
                                value={newEvent}
                                onChange={(e) => setNewEvent(e.target.value)}
                                placeholder="Mô tả chi tiết về sự kiện"
                            />
                        </div>

                        {/* Nút Thêm */}
                        <Button type="submit" className="w-full" disabled={isAdding}> {/* Disable khi đang thêm */}
                            {isAdding ? (
                                // Icon loading khi đang thêm (cần cài thư viện icon loading)
                                // Ví dụ: <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang thêm...
                                <> <PlusCircle className="mr-2 h-4 w-4" /> Đang thêm... </> // Giữ nguyên icon và đổi text tạm thời
                            ) : (
                                <> <PlusCircle className="mr-2 h-4 w-4" /> Thêm sự kiện </>
                            )}

                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}