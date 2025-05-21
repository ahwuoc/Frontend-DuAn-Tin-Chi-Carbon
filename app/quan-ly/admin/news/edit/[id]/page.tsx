"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadToCloudinary } from "../../../../../utils/common";

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
import { Field } from "../../components/Field_Component";
import {
  Loader2,
  Newspaper,
  Save,
  XCircle,
  UploadCloud,
  Tags,
  ListFilter,
  FileArchive,
} from "lucide-react";

// Import Tiptap và component MenuBar
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapMenuBar from "../../components/TiptapMenuBar";
import statuses from "../../mockup_data/statuses";
import categories from "../../mockup_data/categories";
export default function NewsFormPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const newsId = params.id as string;
  const [formData, setFormData] = useState<Partial<INews>>({
    title: "",
    content: "", // Nội dung sẽ là HTML từ Tiptap
    category: "",
    status: "draft",
    image: "", // Lưu URL ảnh
    tags: [], // Lưu mảng tags
  });

  const [loading, setLoading] = useState(false); // Loading khi submit form
  const [isFetching, setIsFetching] = useState(false); // Loading khi tải dữ liệu tin tức
  const [imageFile, setImageFile] = useState<File | null>(null); // Lưu tệp ảnh người dùng chọn
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Lưu URL/base64 của ảnh để hiển thị trước
  const [isUploadingImage, setIsUploadingImage] = useState(false); // Loading khi upload ảnh lên Cloudinary

  // Khởi tạo Tiptap Editor (Chỉ gọi 1 lần)
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Cấu hình StarterKit nếu cần
      }),
      Placeholder.configure({
        placeholder: "Soạn nội dung bài viết...",
      }),
      // Thêm các extension khác mà bạn muốn có nút trong menu (ví dụ: Link, Image, Table)
    ],
    // content: formData.content, // Nội dung khởi tạo ban đầu, sẽ set lại trong useEffect
    onUpdate: ({ editor }) => {
      // Lắng nghe sự kiện khi nội dung editor thay đổi
      const htmlContent = editor.getHTML(); // Lấy nội dung dưới dạng HTML
      setFormData((prev) => ({ ...prev, content: htmlContent })); // Cập nhật state formData
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none min-h-[200px] outline-none p-3", // Thêm padding và class cho styling nội dung
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    // Editor instance có thể mất 1 chút thời gian để khởi tạo
    if (!editor) {
      return; // Chờ editor sẵn sàng
    }

    if (!newsId) {
      toast({
        title: "Lỗi",
        description: "Thiếu ID tin tức.",
        variant: "destructive",
      });
      router.push("/quan-ly/admin/news");
      return;
    }

    setIsFetching(true);

    const fetchNews = async () => {
      try {
        const response = await apiNews.getById(newsId as string);
        const newsData = response?.payload?.data;
        if (newsData && newsData._id) {
          setFormData({
            title: newsData.title,
            content: newsData.content,
            userId: newsData.userId,
            category: newsData.category,
            status: newsData.status,
            image: newsData.image,
            tags: newsData.tags || [],
          });

          // Cập nhật nội dung cho Tiptap Editor sau khi fetch data
          // Đảm bảo newsData.content không null/undefined trước khi setContent
          if (newsData.content !== undefined && newsData.content !== null) {
            // Sử dụng setContent để cập nhật editor, false để không fire onUpdate ngay lập tức
            editor.commands.setContent(newsData.content, false);
          } else {
            // Nếu không có nội dung cũ, có thể set nội dung rỗng hoặc placeholder
            editor.commands.setContent("<p></p>", false);
          }

          if (newsData.image) {
            setImagePreview(newsData.image);
          }
        } else {
          toast({
            title: "Lỗi",
            description: "Không tìm thấy dữ liệu tin tức.",
            variant: "destructive",
          });
          router.push("/quan-ly/admin/news");
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        toast({
          title: "Lỗi",
          description: "Không thể tải chi tiết tin tức.",
          variant: "destructive",
        });
        router.push("/quan-ly/admin/news");
      } finally {
        setIsFetching(false);
      }
    };

    fetchNews();
  }, [newsId, toast, router, editor]);

  // Xử lý thay đổi ở các input text (trừ content, vì content do Tiptap quản lý)
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi ở Select (Danh mục, Trạng thái)
  const handleSelectChange = (name: keyof Partial<INews>, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi ở input Tags
  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Tách chuỗi bằng dấu phẩy, trim khoảng trắng, lọc bỏ chuỗi rỗng
    const tagsArray = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tags: tagsArray }));
  };

  // Xử lý khi người dùng chọn tệp ảnh mới
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

  // Xử lý upload ảnh lên Cloudinary
  const handleCloudinaryUpload = async () => {
    if (!imageFile) {
      toast({
        title: "Chưa chọn tệp",
        description: "Vui lòng chọn ảnh.",
        variant: "default",
      });
      return;
    }
    setIsUploadingImage(true);
    try {
      const uploadedUrl = await uploadToCloudinary(imageFile);
      setFormData((prev) => ({ ...prev, image: uploadedUrl }));
      setImagePreview(uploadedUrl);
      setImageFile(null);
      toast({ title: "Thành công", description: "Đã upload ảnh!" });
    } catch (err: any) {
      toast({
        title: "Upload lỗi",
        description: err.message || "Không thể tải ảnh lên Cloudinary.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Xử lý khi submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Kiểm tra nội dung editor có rỗng không (kiểm tra HTML có chỉ chứa <p></p> hoặc rỗng)
    const isContentEmpty =
      !formData.content ||
      formData.content.trim() === "" ||
      formData.content.trim() === "<p></p>";
    if (!formData.title || isContentEmpty || !formData.category || !newsId) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền Tiêu đề, Nội dung, Danh mục và ID tin tức.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const dataToSubmit: Partial<INews> = { ...formData };
      dataToSubmit.content = formData.content;

      await apiNews.update(newsId, dataToSubmit as INews);
      toast({ title: "Thành công", description: "Đã cập nhật tin tức!" });
      router.push("/quan-ly/admin/news");
    } catch (err: any) {
      console.error("Error submitting news:", err);
      toast({
        title: "Lỗi",
        description: err.message || "Không thể lưu tin tức!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị loading khi đang fetch dữ liệu tin tức lần đầu hoặc editor chưa sẵn sàng
  if (isFetching || !editor) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        {isFetching
          ? " Đang tải dữ liệu tin tức..."
          : " Đang khởi tạo editor..."}
      </div>
    );
  }

  // Render form chỉnh sửa
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-semibold text-gray-800 flex items-center">
            <Newspaper className="mr-3 h-7 w-7 text-green-600" />
            Chỉnh sửa tin tức
          </CardTitle>
          <CardDescription>
            Cập nhật thông tin chi tiết cho tin tức này.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Field
              label="Tiêu đề"
              htmlFor="title"
              required
              icon={<Newspaper size={18} />}
            >
              <Input
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                placeholder="Nhập tiêu đề bài viết"
              />
            </Field>

            {/* Thay thế Textarea bằng EditorContent và thêm MenuBar */}
            <Field
              label="Nội dung"
              htmlFor="content"
              required
              icon={<FileArchive size={18} />}
            >
              {/* Bọc MenuBar và EditorContent trong một div */}
              <div className="border rounded-md overflow-hidden">
                {/* Component thanh menu */}
                <TiptapMenuBar editor={editor} />
                {/* Editor Content Area */}
                <EditorContent editor={editor} />
              </div>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field
                label="Danh mục"
                htmlFor="category"
                required
                icon={<ListFilter size={18} />}
              >
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field
                label="Trạng thái"
                htmlFor="status"
                required
                icon={<FileArchive size={18} />}
              >
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleSelectChange("status", value as INews["status"])
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((stat) => (
                      <SelectItem key={stat.value} value={stat.value}>
                        {stat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label="Cập nhật ảnh" icon={<UploadCloud size={18} />}>
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 items-start">
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="max-w-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloudinaryUpload}
                  disabled={!imageFile || isUploadingImage || loading}
                >
                  {isUploadingImage ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UploadCloud className="mr-2 h-4 w-4" />
                  )}
                  {isUploadingImage ? "Đang tải..." : "Tải lên Cloudinary"}
                </Button>
              </div>
              {imagePreview && (
                <div className="mt-3 border rounded-lg p-2 inline-block bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="Xem trước"
                    className="h-36 w-auto object-contain rounded-md"
                  />
                </div>
              )}
            </Field>

            <Field label="Tags (Thẻ)" htmlFor="tags" icon={<Tags size={18} />}>
              <Input
                id="tags"
                name="tags"
                value={formData.tags?.join(", ") || ""}
                onChange={handleTagsChange}
                placeholder="carbon, esg, tin tức"
              />
              <p className="text-xs text-gray-500 mt-1">
                Các tags cách nhau bởi dấu phẩy (,)
              </p>
            </Field>

            <CardFooter className="flex justify-end gap-3 mt-8 p-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/quan-ly/admin/news")}
                disabled={loading || isFetching || isUploadingImage || !editor}
                size="lg"
              >
                <XCircle className="mr-2 h-5 w-5" /> Hủy
              </Button>
              <Button
                type="submit"
                disabled={loading || isFetching || isUploadingImage || !editor}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Save className="mr-2 h-5 w-5" />
                )}
                {loading ? "Đang xử lý..." : "Lưu thay đổi"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
