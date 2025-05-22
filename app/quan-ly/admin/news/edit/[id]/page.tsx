"use client";
import statuses from "../../mockup_data/statuses";
import categories from "../../mockup_data/categories";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Save,
  XCircle,
  UploadCloud,
  Tags,
  ListFilter,
  FileArchive,
} from "lucide-react";
import { uploadToCloudinary } from "../../../../../utils/common";
import { Field } from "../../components/Field_Component";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapMenuBar from "../../components/TiptapMenuBar";

// Component TiptapMenuBar (giả định đã có, nếu chưa, tôi sẽ cung cấp mẫu)
const TiptapMenuBar = ({ editor, isUploadingImage, handleImageInsert }) => {
  if (!editor) return null;
  return (
    <div className="flex gap-2 p-2 border-b bg-gray-50">
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "bg-gray-200" : ""}
        variant="outline"
        size="sm"
      >
        Bold
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "bg-gray-200" : ""}
        variant="outline"
        size="sm"
      >
        Italic
      </Button>
      <Button
        type="button"
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) await handleImageInsert(file);
          };
          input.click();
        }}
        disabled={isUploadingImage}
        variant="outline"
        size="sm"
      >
        {isUploadingImage ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <UploadCloud className="mr-2 h-4 w-4" />
        )}
        Chèn ảnh
      </Button>
    </div>
  );
};

export default function NewsFormPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const newsId = params.id as string;
  const [formData, setFormData] = useState<Partial<INews>>({
    title: "",
    content: "",
    category: "",
    status: "draft",
    image: "",
    tags: [],
  });
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Xử lý chèn ảnh vào editor
  const handleImageInsert = async (file: File) => {
    if (!file) {
      toast({ title: "Chưa chọn tệp", description: "Vui lòng chọn ảnh.", variant: "default" });
      return;
    }
    setIsUploadingImage(true);
    try {
      const uploadedUrl = await uploadToCloudinary(file);
      if (editor) {
        editor.chain().focus().setImage({ src: uploadedUrl }).run();
      }
      toast({ title: "Thành công", description: "Đã chèn ảnh vào nội dung!" });
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

  // Xử lý sự kiện paste để phát hiện và tải ảnh lên Cloudinary
  const handlePaste = async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        event.preventDefault();
        const file = item.getAsFile();
        if (file) {
          await handleImageInsert(file);
        }
      }
    }
  };

  // Khởi tạo TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.extend({
        renderHTML({ HTMLAttributes }) {
          return ['div', { class: 'image-center-wrapper' }, ['img', HTMLAttributes]];
        },
      }),
      Placeholder.configure({
        placeholder: "Soạn nội dung bài viết hoặc dán văn bản và hình ảnh...",
      }),
    ],
    content: "<p></p>", // Nội dung khởi tạo mặc định
    editable: true, // Đảm bảo editor có thể chỉnh sửa
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[200px] p-4 outline-none border-t-0",
      },
      handlePaste: (view, event) => {
        handlePaste(event);
        return false; // Ngăn paste mặc định để xử lý ảnh
      },
    },
  });

  // Tải dữ liệu tin tức khi có newsId
  useEffect(() => {
    if (!newsId || !editor) return;

    setIsFetching(true);
    const fetchNews = async () => {
      try {
        const response = await apiNews.getById(newsId);
        const newsData = response?.payload?.data;
        if (newsData && newsData._id) {
          setFormData({
            title: newsData.title,
            content: newsData.content || "<p></p>",
            userId: newsData.userId,
            category: newsData.category,
            status: newsData.status,
            image: newsData.image,
            tags: newsData.tags || [],
          });
          // Cập nhật nội dung editor
          editor.commands.setContent(newsData.content || "<p></p>", false);
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
  }, [newsId, editor, toast, router]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof Partial<INews>, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const tagsArray = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tags: tagsArray }));
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
      setImagePreview(formData.image || null);
    }
  };

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

  if (isFetching || !editor) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        {isFetching ? " Đang tải dữ liệu tin tức..." : " Đang khởi tạo editor..."}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-semibold text-gray-800 flex items-center">
            <Newspaper className="mr-3 h-7 w-7 text-green-600" />
            Chỉnh sửa tin tức
          </CardTitle>
          <CardDescription>
            Cập nhật thông tin chi tiết cho tin tức. Bạn có thể gõ, dán văn bản và hình ảnh vào phần nội dung.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Field label="Tiêu đề" htmlFor="title" required icon={<Newspaper size={18} />}>
              <Input
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                placeholder="Nhập tiêu đề bài viết"
              />
            </Field>
            <Field label="Nội dung" htmlFor="content" required icon={<FileArchive size={18} />}>
              <div className="border rounded-md overflow-hidden">
                <TiptapMenuBar editor={editor} isUploadingImage={isUploadingImage} handleImageInsert={handleImageInsert} />
                <EditorContent editor={editor} />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Bấm vào để nhập nội dung hoặc dán văn bản và hình ảnh. Hình ảnh dán sẽ tự động được tải lên Cloudinary.
              </p>
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
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Trạng thái" htmlFor="status" required icon={<FileArchive size={18} />}>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value as INews["status"])}
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
            <Field label="Cập nhật ảnh minh họa" icon={<UploadCloud size={18} />}>
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
              <p className="text-xs text-gray-500 mt-1">Các tags cách nhau bởi dấu phẩy (,)</p>
            </Field>
            <CardFooter className="flex justify-end gap-3 mt-8 p-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/quan-ly/admin/news")}
                disabled={loading || isFetching || isUploadingImage}
                size="lg"
              >
                <XCircle className="mr-2 h-5 w-5" /> Hủy
              </Button>
              <Button
                type="submit"
                disabled={loading || isFetching || isUploadingImage}
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