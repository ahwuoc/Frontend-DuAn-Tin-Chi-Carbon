'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Chỉ cần useParams ở đây
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { apiNews } from '../../fetch/fetch.news'; // Điều chỉnh đường dẫn nếu cần

interface NewsItem {
    _id: string;
    title: string; // Sử dụng 'title'
    content: string; // Nội dung HTML từ Tiptap
    userId?: string;
    category?: string;
    status?: string;
    image?: string; // Sử dụng 'image'
    tags?: string[];
    createdAt: string; // Sử dụng 'createdAt' cho ngày
    updatedAt?: string;
    __v?: number;
    author?: string;
    excerpt_vi?: string; // Thêm lại excerpt nếu có
}

export default function NewsDetailPage() {
    const { id } = useParams() as { id: string };
    // Nếu chỉ chuyển hướng thì dùng router, ở đây chỉ cần params
    // const router = useRouter();

    const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
    const [isLoading, setIsLoading] = useState(true); // State để quản lý trạng thái loading
    // const { toast } = useToast(); // Nếu dùng toast

    useEffect(() => {
        if (!id) {
            setIsLoading(false); // Nếu không có ID thì dừng loading
            // Optional: Hiển thị lỗi hoặc redirect nếu không có ID
            // router.push('/tin-tuc');
            return;
        }

        async function fetchNews() {
            setIsLoading(true); // Bắt đầu loading
            try {
                // Giả định apiNews.getById trả về promise resolve với { status, data: { data: NewsItem } }
                const res = await apiNews.getById(id);
                if (res && res.payload && res.payload.data) { // Kiểm tra kỹ cấu trúc response
                    setNewsItem(res.payload.data);
                } else {
                    setNewsItem(null); // Set null nếu data không đúng cấu trúc hoặc không tìm thấy
                    // Optional: Hiển thị toast lỗi hoặc redirect
                    // toast({ title: "Lỗi", description: "Không tìm thấy tin tức.", variant: "destructive" });
                    // router.push('/tin-tuc');
                }

            } catch (err) {
                console.error("Error fetching news detail:", err);
                setNewsItem(null); // Set null nếu có lỗi fetch
                // Optional: Hiển thị toast lỗi hoặc redirect
                // toast({ title: "Lỗi", description: "Không thể tải chi tiết tin tức.", variant: "destructive" });
                // router.push('/tin-tuc');
            } finally {
                setIsLoading(false); // Kết thúc loading
            }
        }

        fetchNews();
    }, [id]); // Dependency array chỉ cần id

    // Format date helper (đã cải tiến để xử lý các trường hợp lỗi/null)
    const formatDate = (dateString?: string | null) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? dateString : format(date, 'dd/MM/yyyy');
        } catch {
            // Trả về giá trị gốc nếu format lỗi
            return dateString;
        }
    };

    // Hiển thị trạng thái loading
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)] text-xl text-gray-600 dark:text-gray-400">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Đang tải...
            </div>
        );
    }

    // Hiển thị khi không tìm thấy tin tức (sau khi fetch xong và newsItem là null)
    if (!newsItem && !isLoading) {
        // Optional: Bạn có thể render trang 404 tùy chỉnh ở đây thay vì text đơn giản
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)] text-xl text-red-600 dark:text-red-400">
                Không tìm thấy tin tức này.
            </div>
        );
    }


    // Render chi tiết tin tức
    return (
        <article className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Wrapper để giới hạn chiều rộng nội dung chính và căn giữa */}
            <div className="max-w-4xl mx-auto"> {/* Điều chỉnh max-w- tùy theo thiết kế mong muốn (ví dụ: max-w-screen-md, max-w-lg, max-w-xl, max-w-4xl...) */}

                <header className="mb-10"> {/* Tăng khoảng cách dưới header */}
                    {/* Tiêu đề chính */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 leading-tight mb-4"> {/* Kích thước tiêu đề, độ đậm, khoảng cách dòng */}
                        {newsItem.title}
                    </h1>
                    {/* Metadata: Ngày đăng, Tác giả */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500 dark:text-gray-400 text-sm"> {/* Sử dụng flex-wrap cho responsive, điều chỉnh gap */}
                        {newsItem.createdAt && (
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>{formatDate(newsItem.createdAt)}</span>
                            </div>
                        )}
                        {newsItem.author && (
                            <div className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                <span>{newsItem.author}</span>
                            </div>
                        )}
                    </div>
                </header>

                {/* Ảnh tiêu đề */}
                {newsItem.image && (
                    <div className="relative w-full h-60 md:h-80 lg:h-96 rounded-lg overflow-hidden mb-10 shadow-lg"> {/* Tăng khoảng cách dưới ảnh, thêm shadow */}
                        <Image
                            src={newsItem.image}
                            alt={newsItem.title || 'Article Image'}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px" // Thêm sizes cho Image
                        />
                    </div>
                )}

                {/* Nội dung bài viết */}
                {/* Class prose sẽ style nội dung HTML (p, h1-h6, ul, ol, blockquote, etc.) */}
                {/* Đảm bảo nội dung từ API đã được sanitize để tránh XSS */}
                <section
                    className="prose dark:prose-invert max-w-none mb-10" // mb-10 tạo khoảng cách với phần dưới
                >
                    {/* Thêm class cho div bao quanh dangerouslySetInnerHTML nếu muốn custom style thêm cho prose */}
                    <div>
                        <div dangerouslySetInnerHTML={{ __html: newsItem.content }} />
                    </div>
                </section>

                {/* Phần hiển thị tags */}
                {newsItem.tags && newsItem.tags.length > 0 && (
                    <div className="mt-8"> {/* mt-8 tạo khoảng cách với nội dung chính */}
                        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">Tags:</h3> {/* Điều chỉnh kích thước tiêu đề tags */}
                        <div className="flex flex-wrap gap-2"> {/* gap-2 giữa các tags */}
                            {newsItem.tags.map((tag, index) => (
                                <Link href={`/tin-tuc/tag/${encodeURIComponent(tag)}`} key={index}>
                                    <div className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm cursor-pointer transition-colors"> {/* Padding và màu sắc cho tags */}
                                        {tag}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Nút quay lại danh sách */}
                <div className="mt-12"> {/* mt-12 tạo khoảng cách lớn với phần trên */}
                    <Link href="/tin-tuc">
                        <Button variant="outline" className="text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
                        </Button>
                    </Link>
                </div>
            </div> {/* Kết thúc wrapper giới hạn chiều rộng */}
        </article>
    );
}