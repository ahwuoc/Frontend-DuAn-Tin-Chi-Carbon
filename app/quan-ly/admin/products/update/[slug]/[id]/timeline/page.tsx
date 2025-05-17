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

import {
    CalendarDays,
    CircleDot,
    PlusCircle,
    Trash2,
    Calendar,
    ClipboardEdit,
} from "lucide-react";
import Link from "next/link";

interface TimelineEvent {
    _id?: string;
    date: string;
    event: string;
}

const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleDateString("vi-VN");
    } catch (e) {
        console.error("Error formatting date:", e);
        return "Invalid Date";
    }
};

export default function CarbonCreditTimelinePage() {
    const { id } = useParams();
    const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
    const [newDate, setNewDate] = useState("");
    const [newEvent, setNewEvent] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchTimeline = async () => {
            if (!id) {
                setError("Không có ID Carbon Credit.");
                setLoading(false);
                return;
            }
            try {
                const product = await apiProducts.getById(id as string);
                if (product?.data?.timeline && Array.isArray(product.data.timeline)) {
                    const sortedTimeline = product.data.timeline.sort((a: TimelineEvent, b: TimelineEvent) => new Date(a.date).getTime() - new Date(b.date).getTime());
                    setTimeline(sortedTimeline);
                } else {
                    console.warn("Timeline data not found or not an array in API response:", product?.data?.timeline);
                    setTimeline([]);
                }
            } catch (err) {
                console.error("Lỗi fetch timeline:", err);
                setError("Không thể tải timeline.");
                setTimeline([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTimeline();
    }, [id]);

    const handleAddEvent = async (e: FormEvent) => {
        e.preventDefault();

        if (!newDate || !newEvent) {
            setError("Vui lòng nhập đầy đủ ngày và mô tả sự kiện.");
            return;
        }

        setIsAdding(true);

        const newTimelineEvent: Omit<TimelineEvent, '_id'> = {
            date: newDate,
            event: newEvent,
        };

        const updatedTimelineOptimistic = [...timeline, newTimelineEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setNewDate("");
        setNewEvent("");
        setError(null);

        try {
            const apiResponse = await apiProducts.updatetimeline(id as string, { timeline: updatedTimelineOptimistic });

            if (apiResponse?.data?.timeline && Array.isArray(apiResponse.data.timeline)) {
                const sortedTimeline = apiResponse.data.timeline.sort((a: TimelineEvent, b: TimelineEvent) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setTimeline(sortedTimeline);
            } else {
                console.error("API response for update (add) is invalid:", apiResponse?.data);
                setError("Cập nhật thành công nhưng dữ liệu trả về không hợp lệ. Vui lòng tải lại trang.");
                setTimeline(updatedTimelineOptimistic);
            }

            console.log("Timeline đã được cập nhật thành công trên API (thêm sự kiện).");

        } catch (err) {
            console.error("Lỗi cập nhật timeline API (thêm):", err);
            setError("Không thể cập nhật timeline trên máy chủ. Vui lòng tải lại trang và thử lại.");
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (!id || !eventId) {
            setError("Thiếu thông tin ID để xóa.");
            return;
        }

        const originalTimeline = timeline;
        setDeletingId(eventId);

        const updatedTimelineOptimistic = timeline.filter(event => event._id !== eventId);
        setTimeline(updatedTimelineOptimistic);


        try {
            const apiResponse = await apiProducts.updatetimeline(id as string, { timeline: updatedTimelineOptimistic });

            if (apiResponse?.data?.timeline && Array.isArray(apiResponse.data.timeline)) {
                const sortedTimeline = apiResponse.data.timeline.sort((a: TimelineEvent, b: TimelineEvent) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setTimeline(sortedTimeline);
            } else {
                console.error("API response for update (delete) is invalid:", apiResponse?.data);
                setError("Xóa sự kiện thành công nhưng dữ liệu trả về không hợp lệ. Vui lòng tải lại trang.");
                setTimeline(updatedTimelineOptimistic);
            }

            console.log(`Sự kiện ${eventId} đã được xóa và timeline cập nhật trên API.`);

        } catch (err) {
            console.error("Lỗi cập nhật timeline API (xóa):", err);
            setError("Không thể xóa sự kiện trên máy chủ. Vui lòng tải lại trang và thử lại.");
            setTimeline(originalTimeline);
        } finally {
            setDeletingId(null);
        }
    };


    if (loading) return <p className="text-center mt-10">Đang tải dòng thời gian...</p>;

    if (error && timeline.length === 0) return <p className="text-center text-red-500 mt-10">{error}</p>;


    return (
        <div className="max-w-3xl mx-auto py-6 px-4">

            <h1 className="text-2xl font-bold mb-6 flex items-center">
                <CalendarDays className="mr-2 h-6 w-6" />
                Dòng thời gian dự án #{id}
            </h1>
            {error && timeline.length > 0 && <p className="text-red-500 mb-4">{error}</p>}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Các sự kiện</CardTitle>
                        {timeline.length === 0 && !loading && !error && (
                            <CardDescription>Chưa có sự kiện nào trên dòng thời gian.</CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {timeline.length > 0 ? (
                            <ol className="relative border-s border-gray-200 dark:border-gray-700 ml-4">
                                {timeline.map((event, index) => (
                                    <li key={event._id || index} className="mb-10 ms-6">
                                        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                            <CircleDot className="w-3 h-3 text-blue-800 dark:text-blue-300" />
                                        </span>
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                                    {event.event}
                                                </h3>
                                                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                                                    <CalendarDays className="inline-block h-4 w-4 mr-1" />
                                                    {formatDate(event.date)}
                                                </time>
                                            </div>
                                            {event._id && (
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => handleDeleteEvent(event._id!)}
                                                    disabled={deletingId === event._id}
                                                    className="flex-shrink-0"
                                                >
                                                    {deletingId === event._id ? (
                                                        <Trash2 className="h-4 w-4" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                    <span className="sr-only">Xóa sự kiện</span>
                                                </Button>
                                            )}

                                        </div>

                                    </li>
                                ))}
                            </ol>
                        ) : (
                            !loading && !error && null
                        )}
                    </CardContent>
                </Card>

                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Thêm sự kiện mới</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddEvent} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="newDate">Ngày sự kiện</Label>
                                <Input
                                    id="newDate"
                                    type="date"
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newEvent">Mô tả sự kiện</Label>
                                <Input
                                    id="newEvent"
                                    type="text"
                                    value={newEvent}
                                    onChange={(e) => setNewEvent(e.target.value)}
                                    placeholder="Mô tả chi tiết về sự kiện"
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isAdding}>
                                {isAdding ? (
                                    <> <PlusCircle className="mr-2 h-4 w-4" /> Đang thêm... </>
                                ) : (
                                    <> <PlusCircle className="mr-2 h-4 w-4" /> Thêm sự kiện </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

            </div>

        </div>
    );
}