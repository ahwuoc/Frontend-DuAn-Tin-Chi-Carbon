"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Copy,
  LogIn,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const paypalLinks = {
  "khoa-hoc-chung-chi-chuyen-gia":
    "https://www.paypal.com/ncp/payment/Q32WT8EFBBFYQ",
  "khoa-hoc-chung-chi-ca-nhan":
    "https://www.paypal.com/ncp/payment/YBG22HVWKAZX8",
  "carbon-toan-thu-nghien-cuu":
    "https://www.paypal.com/ncp/payment/D7XASGV7882RC",
  "carbon-toan-thu-chuyen-gia":
    "https://www.paypal.com/ncp/payment/AKA5GFEV6S72Q",
};

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  note: string;
}

interface Product {
  _id: string;
  name: string;
  title: string;
  description: string;
  price: number;
}

interface User {
  userId: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

import { useAuth } from "@/context/auth-context";
import { apiOrders } from "../fetch/fetch.order";
import { apiProducts } from "../fetch/fetch.products";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product") || "carbon-toan-thu-nghien-cuu";
  const { toast } = useToast();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    note: "",
  });

  const [product, setProduct] = useState<Product | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiProducts.getById(productId);
        if (response && response.payload) {
          setProduct(response.payload);
          setFormData((prev) => ({
            ...prev,
            note: `${prev.fullName} - ${prev.phone} - ${response.payload.name}`,
          }));
        } else {
          throw new Error("Không tìm thấy sản phẩm");
        }
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin sản phẩm. Vui lòng thử lại.",
          variant: "destructive",
        });
      }
    };
    fetchProduct();
  }, [productId, toast]);

  useEffect(() => {
    if (isAuthenticated && user && product) {
      const fullName = user.name || formData.fullName;
      const phone = user.phone || formData.phone;
      setFormData((prev) => ({
        ...prev,
        fullName,
        email: user.email || prev.email,
        phone,
        address: user.address || prev.address,
        note: `${fullName} - ${phone} - ${product.name}`,
      }));
    }
  }, [isAuthenticated, user, product]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ và tên";
    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "fullName" || name === "phone") {
        updated.note = `${updated.fullName} - ${updated.phone} - ${product?.name || ""}`;
      }
      return updated;
    });

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !validateForm()) return;

    setIsSubmitting(true);
    try {
      const orderResponse = await apiOrders.createOrder({
        userId: user?.userId,
        productId: product._id,
        buyerName: formData.fullName,
        email: formData.email,
        buyerPhone: formData.phone,
        buyerAddress: formData.address,
        amount: product.price,
        status: "pending",
        nameItem: product.name,
      });

      if (orderResponse.status === 201) {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        toast({
          title: "Thành công",
          description: "Đơn hàng của bạn đã được tạo thành công!",
        });
        const linkthanhtoan = orderResponse.payload.linkthanhtoan;
        if (linkthanhtoan) {
          router.push(linkthanhtoan);
        } else {
          toast({
            title: "Cảnh báo",
            description: "Không tìm thấy link thanh toán. Vui lòng liên hệ hỗ trợ.",
            variant: "destructive",
          });
        }
      } else {
        throw new Error("Không thể tạo đơn hàng");
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xử lý đơn hàng. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToLogin = () => {
    router.push("/login");
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPaypalLink = (productId: string): string => {
    return paypalLinks[productId as keyof typeof paypalLinks] || "#";
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Đã sao chép",
      description: `${text} đã được sao chép vào clipboard.`,
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto">
            <CardHeader className="text-center bg-green-50">
              <div className="mx-auto mb-4 bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">
                Đăng ký thành công!
              </CardTitle>
              <CardDescription>
                Cảm ơn bạn đã đăng ký sản phẩm của Tín Chỉ Carbon Việt Nam
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Thông tin đơn hàng
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>
                      <span className="font-medium">Sản phẩm:</span>{" "}
                      {product?.name}
                    </p>
                    <p>
                      <span className="font-medium">Giá tiền:</span>{" "}
                      {formatCurrency(product?.price ?? 0)}
                    </p>
                    <p>
                      <span className="font-medium">Họ tên:</span>{" "}
                      {formData.fullName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {formData.email}
                    </p>
                    <p>
                      <span className="font-medium">Số điện thoại:</span>{" "}
                      {formData.phone}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Hướng dẫn thanh toán
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="mb-2">
                      Vui lòng chuyển khoản theo thông tin dưới đây để hoàn tất
                      đơn hàng:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <p>
                          <span className="font-medium">Số tài khoản:</span>{" "}
                          686820248888
                        </p>
                        <p>
                          <span className="font-medium">Ngân hàng:</span> MB
                          Bank
                        </p>
                        <p>
                          <span className="font-medium">Tên tài khoản:</span>{" "}
                          CTY CP TM & ĐT TÍN CHỈ CARBON VN
                        </p>
                        <p>
                          <span className="font-medium">
                            Nội dung chuyển khoản:
                          </span>{" "}
                          {formData.note}
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative h-48 w-48 border border-gray-200 rounded-lg overflow-hidden">
                          <Image
                            src="https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/M%C3%A3%20QR%20chuy%E1%BB%83n%20kho%E1%BA%A3n-S2p7m4uIA5xpn7Kywu1pCYtHz7giui.jpg"
                            alt="Mã QR chuyển khoản"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <p className="text-sm text-center mt-2 text-gray-500">
                          Quét mã QR để thanh toán nhanh chóng
                        </p>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-yellow-700">
                        Sau khi thanh toán thành công, chúng tôi sẽ liên hệ với
                        bạn qua email hoặc số điện thoại để kích hoạt sản phẩm
                        trong vòng 24 giờ làm việc.
                      </p>
                    </div>
                  </div>
                </div>

                {showLoginPrompt && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
                    <h3 className="font-semibold flex items-center text-blue-800 mb-2">
                      <LogIn className="h-5 w-5 mr-2" />
                      Theo dõi đơn hàng của bạn
                    </h3>
                    <p className="text-sm text-blue-700 mb-3">
                      Chúng tôi đã tạo tài khoản cho bạn với email{" "}
                      {formData.email}. Đăng nhập để theo dõi đơn hàng và sử
                      dụng sản phẩm của bạn.
                    </p>
                    <Button
                      onClick={handleGoToLogin}
                      className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Đăng nhập ngay
                    </Button>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/" className="w-full sm:w-1/2">
                      <Button
                        variant="outline"
                        className="w-full transition-all duration-300 transform hover:scale-[1.02] hover:bg-gray-100"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại trang chủ
                      </Button>
                    </Link>
                    {isAuthenticated ? (
                      <Link href="/quan-ly" className="w-full sm:w-1/2">
                        <Button className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 transform hover:scale-[1.02]">
                          Quản lý tài khoản
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/san-pham" className="w-full sm:w-1/2">
                        <Button className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 transform hover:scale-[1.02]">
                          Xem thêm sản phẩm khác
                        </Button>
                      </Link>
                    )}
                  </div>
                  <a
                    href={getPaypalLink(productId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full inline-flex justify-center items-center px-6 py-2 rounded-md shadow-md text-base font-medium text-white bg-[#ebf5fa] hover:bg-[#d4e9f7] border border-[#0070ba] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0070ba] transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-center w-full py-1 px-2">
                      <div className="flex items-center justify-center space-x-4">
                        <Image
                          src="https://res.cloudinary.com/dyticflm3/image/upload/e_background_removal/c_crop,w_700,h_200,f_png/v1744654480/Paypal_poikml.png"
                          alt="PayPal"
                          width={100}
                          height={30}
                          className="object-contain"
                        />
                        <Image
                          src="https://res.cloudinary.com/dyticflm3/image/upload/v1744655235/Visa_mastercard_bzvqfd.png"
                          alt="Visa & Mastercard"
                          width={100}
                          height={30}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Thanh toán</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin đặt hàng</CardTitle>
                  <CardDescription>
                    Vui lòng điền đầy đủ thông tin để hoàn tất đơn hàng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        Họ và tên <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="Nhập họ và tên"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={errors.fullName ? "border-red-300" : ""}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-500">
                          {errors.fullName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Nhập địa chỉ email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? "border-red-300" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Số điện thoại <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="Nhập số điện thoại"
                        value={formData.phone}
                        onChange={handleChange}
                        className={errors.phone ? "border-red-300" : ""}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">
                        Địa chỉ <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="Nhập địa chỉ"
                        value={formData.address}
                        onChange={handleChange}
                        className={errors.address ? "border-red-300" : ""}
                      />
                      {errors.address && (
                        <p className="text-sm text-red-500">{errors.address}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="note">Ghi chú</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleCopy(formData.note)}
                        >
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Sao chép
                        </Button>
                      </div>
                      <Textarea
                        id="note"
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        rows={2}
                        className="font-medium"
                      />
                      <p className="text-xs text-gray-500">
                        Nội dung này sẽ được sử dụng làm nội dung chuyển khoản
                      </p>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 mt-4 transition-all duration-300 transform hover:scale-[1.02]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        "Hoàn tất đơn hàng"
                      )}
                    </Button>
                    {getPaypalLink(productId) !== "#" && (
                      <div className="mt-4">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300" />
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                              Hoặc
                            </span>
                          </div>
                        </div>
                        <a
                          href={getPaypalLink(productId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full mt-4 inline-flex justify-center items-center px-6 py-3 rounded-md shadow-md text-base font-medium text-white bg-[#ebf5fa] hover:bg-[#d4e9f7] border border-[#0070ba] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0070ba] transition-colors transition-all duration-300 transform hover:scale-[1.02]"
                        >
                          <div className="flex items-center justify-center w-full py-2 px-2">
                            <div className="flex items-center justify-center space-x-4">
                              <Image
                                src="https://res.cloudinary.com/dyticflm3/image/upload/e_background_removal/c_crop,w_700,h_200,f_png/v1744654480/Paypal_poikml.png"
                                alt="PayPal"
                                width={100}
                                height={30}
                                className="object-contain"
                              />
                              <Image
                                src="https://res.cloudinary.com/dyticflm3/image/upload/v1744655235/Visa_mastercard_bzvqfd.png"
                                alt="Visa & Mastercard"
                                width={100}
                                height={30}
                                className="object-contain"
                              />
                            </div>
                          </div>
                        </a>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Thông tin đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {product.description}
                      </p>
                      <p className="text-xl font-bold text-green-700">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">
                      Thông tin thanh toán
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Số tài khoản:</span>
                        <div className="flex items-center">
                          <span className="font-medium">686820248888</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-6 w-6 p-0"
                            onClick={() => handleCopy("686820248888")}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Ngân hàng:</span>
                        <span className="font-medium">MB Bank</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tên tài khoản:</span>
                        <div className="flex items-center">
                          <span className="font-medium text-right">
                            CTY CP TM & ĐT TÍN CHỈ CARBON VN
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-6 w-6 p-0"
                            onClick={() =>
                              handleCopy("CTY CP TM & ĐT TÍN CHỈ CARBON VN")
                            }
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">
                      Mã QR thanh toán
                    </h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 flex justify-center">
                      <div className="relative h-64 w-64">
                        <Image
                          src="https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/M%C3%A3%20QR%20chuy%E1%BB%83n%20kho%E1%BA%A3n-S2p7m4uIA5xpn7Kywu1pCYtHz7giui.jpg"
                          alt="Mã QR chuyển khoản"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-center mt-2 text-gray-500">
                      Quét mã QR để thanh toán nhanh chóng
                    </p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc pl-5">
                      <li>
                        Vui lòng điền đầy đủ thông tin trước khi thanh toán
                      </li>
                      <li>
                        Nội dung chuyển khoản: [Họ tên] - [Số điện thoại] - [Tên
                        sản phẩm]
                      </li>
                      <li>
                        Sau khi thanh toán, chúng tôi sẽ liên hệ với bạn trong
                        vòng 24 giờ làm việc
                      </li>
                      <li>
                        Nếu cần hỗ trợ, vui lòng liên hệ hotline:{" "}
                        <span className="font-medium">092.3370.804</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full transition-all duration-300 transform hover:scale-[1.02] hover:bg-gray-100"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Quay lại
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}