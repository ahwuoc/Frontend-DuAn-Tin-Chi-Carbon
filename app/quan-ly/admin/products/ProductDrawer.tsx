"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { apiProducts, IProduct } from "@/app/fetch/fetch.products";
import { Trash2, Plus } from "lucide-react";
import { useState } from "react";

interface ProductDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
  selectedProduct: IProduct | null;
  setSelectedProduct: React.Dispatch<React.SetStateAction<IProduct | null>>;
  formData: Partial<IProduct>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<IProduct>>>;
}

export default function ProductDrawer({
  isOpen,
  setIsOpen,
  setProducts,
  selectedProduct,
  setSelectedProduct,
  formData,
  setFormData,
}: ProductDrawerProps) {
  const { toast } = useToast();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name?.trim())
      newErrors.name = "Tên sản phẩm là bắt buộc nha!";
    if (!formData.type) newErrors.type = "Chọn loại sản phẩm đi nào!";
    if (!formData.description?.trim()) newErrors.description = "Mô tả đâu rồi?";
    if (!formData.status) newErrors.status = "Trạng thái sản phẩm đâu?";
    if (!formData.billingCycle)
      newErrors.billingCycle = "Chu kỳ thanh toán đâu?";
    if (!formData.accountManager?.name)
      newErrors.accountManagerName = "Tên người quản lý là bắt buộc!";
    if (!formData.accountManager?.email)
      newErrors.accountManagerEmail = "Email người quản lý đâu?";
    if (!formData.accountManager?.phone)
      newErrors.accountManagerPhone =
        "Số điện thoại người quản lý là bắt buộc!";
    if (formData.price && formData.price < 0)
      newErrors.price = "Giá không được âm!";
    if (formData.carbonAmount && formData.carbonAmount < 0)
      newErrors.carbonAmount = "Lượng carbon không được âm!";
    if (formData.features?.length) {
      formData.features.forEach((feature, index) => {
        if (!feature.title?.trim())
          newErrors[`featureTitle${index}`] =
            `Tên feature ${index + 1} là bắt buộc!`;
        if (!feature.description?.trim())
          newErrors[`featureDescription${index}`] =
            `Mô tả feature ${index + 1} là bắt buộc!`;
        if (!feature.icon?.trim())
          newErrors[`featureIcon${index}`] =
            `Icon feature ${index + 1} là bắt buộc!`;
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Lỗi rồi bro!",
        description: "Kiểm tra lại các trường thông tin đi nè!",
        variant: "destructive",
      });
      return;
    }

    try {
      if (selectedProduct?._id) {
        console.log("Updating product:", { id: selectedProduct._id, formData });
        const res = await apiProducts.update(selectedProduct._id, formData);
        console.log("Update API response:", res);
        if (res.status === 200) {
          setProducts((prev) =>
            prev.map((p) =>
              p._id === selectedProduct._id ? res.data.product : p,
            ),
          );
          toast({
            title: "Nice job!",
            description: "Sửa sản phẩm thành công! 🎉",
          });
          setIsOpen(false);
          setFormData({
            name: "",
            type: "carbon_credits",
            description: "",
            status: "pending",
            billingCycle: "monthly",
            accountManager: { name: "", email: "", phone: "" },
            features: [],
          });
          setSelectedProduct(null);
          setErrors({});
        } else {
          throw new Error("Sửa sản phẩm thất bại");
        }
      } else {
        console.log("Creating product:", formData);
        const res = await apiProducts.create(formData);
        if (res && res.data) {
          setProducts((prev) => [...prev, res.data.product]);
          toast({
            title: "Chất quá!",
            description: "Thêm sản phẩm mới thành công! 🚀",
          });
          setIsOpen(false);
          setFormData({
            name: "",
            type: "carbon_credits",
            description: "",
            status: "pending",
            billingCycle: "monthly",
            accountManager: { name: "", email: "", phone: "" },
            features: [],
          });
          setSelectedProduct(null);
          setErrors({});
        } else {
          throw new Error("Thêm sản phẩm thất bại");
        }
      }
    } catch (err: any) {
      console.error("API error:", err.response?.data || err.message);
      toast({
        title: "Oops, có lỗi rồi!",
        description:
          err.response?.data?.error ||
          "Không lưu được sản phẩm, chỉnh lại nha! 😅",
        variant: "destructive",
      });
    }
  };
  const handleDelete = async () => {
    if (!selectedProduct?._id) return;
    if (
      !confirm(
        "Bạn có chắc muốn xóa sản phẩm này không? Hành động này không thể hoàn tác!",
      )
    )
      return;
    try {
      console.log("Deleting product:", selectedProduct._id);
      const res = await apiProducts.delete(selectedProduct._id);
      console.log("Delete API response:", res);
      if (res.status === 200) {
        setProducts((prev) =>
          prev.filter((p) => p._id !== selectedProduct._id),
        );
        setIsOpen(false);
        setSelectedProduct(null);
        toast({
          title: "Xong!",
          description: "Xóa sản phẩm thành công! 🗑️",
        });
      } else {
        throw new Error("Xóa sản phẩm thất bại");
      }
    } catch (err: any) {
      console.error("Delete API error:", err.response?.data || err.message);
      toast({
        title: "Lỗi nè!",
        description: err.response?.data?.error || "Không xóa được sản phẩm! 😓",
        variant: "destructive",
      });
    }
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [
        ...(formData.features || []),
        { id: uuidv4(), title: "", description: "", icon: "" },
      ],
    });
  };

  const updateFeature = (
    index: number,
    field: keyof IProduct["features"][0],
    value: string,
  ) => {
    const updatedFeatures = [...(formData.features || [])];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    setFormData({ ...formData, features: updatedFeatures });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: (formData.features || []).filter((_, i) => i !== index),
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent
        side="right"
        className="w-full sm:w-[600px] h-full flex flex-col"
      >
        <DrawerHeader className="border-b pb-4">
          <DrawerTitle className="text-xl">
            {selectedProduct?._id ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
          </DrawerTitle>
          <DrawerDescription>
            {selectedProduct?._id
              ? "Cập nhật thông tin sản phẩm nè."
              : "Nhập thông tin để tạo sản phẩm mới nha."}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="name" className="font-medium">
              Tên sản phẩm
            </Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full"
              placeholder="Nhập tên sản phẩm"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="type" className="font-medium">
              Loại sản phẩm
            </Label>
            <select
              id="type"
              value={formData.type || "carbon_credits"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as IProduct["type"],
                })
              }
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary"
            >
              <option value="carbon_credits">Carbon Credits</option>
              <option value="carbon_accounting">Carbon Accounting</option>
              <option value="international_certificates">
                Chứng chỉ quốc tế
              </option>
            </select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="description" className="font-medium">
              Mô tả
            </Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full"
              placeholder="Nhập mô tả sản phẩm"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="status" className="font-medium">
              Trạng thái
            </Label>
            <select
              id="status"
              value={formData.status || "pending"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as IProduct["status"],
                })
              }
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </select>
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="price" className="font-medium">
              Giá (VND)
            </Label>
            <Input
              id="price"
              type="number"
              value={formData.price ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              className="w-full"
              placeholder="Nhập giá sản phẩm"
              min="0"
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="billingCycle" className="font-medium">
              Chu kỳ thanh toán
            </Label>
            <select
              id="billingCycle"
              value={formData.billingCycle || "monthly"}
              onChange={(e) =>
                setFormData({ ...formData, billingCycle: e.target.value })
              }
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary"
            >
              <option value="monthly">Hàng tháng</option>
              <option value="annually">Hàng năm</option>
              <option value="trial">Dùng thử</option>
              <option value="custom">Tùy chỉnh</option>
            </select>
            {errors.billingCycle && (
              <p className="text-sm text-destructive">{errors.billingCycle}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="carbonAmount" className="font-medium">
              Lượng Carbon (tấn)
            </Label>
            <Input
              id="carbonAmount"
              type="number"
              value={formData.carbonAmount ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  carbonAmount: Number(e.target.value),
                })
              }
              className="w-full"
              placeholder="Nhập lượng carbon"
              min="0"
            />
            {errors.carbonAmount && (
              <p className="text-sm text-destructive">{errors.carbonAmount}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Label className="font-medium">Người quản lý tài khoản</Label>
            <Input
              id="accountManagerName"
              value={formData.accountManager?.name || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  accountManager: {
                    ...formData.accountManager,
                    name: e.target.value,
                  } as IProduct["accountManager"],
                })
              }
              className="w-full"
              placeholder="Tên người quản lý"
            />
            {errors.accountManagerName && (
              <p className="text-sm text-destructive">
                {errors.accountManagerName}
              </p>
            )}
            <Input
              id="accountManagerEmail"
              type="email"
              value={formData.accountManager?.email || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  accountManager: {
                    ...formData.accountManager,
                    email: e.target.value,
                  } as IProduct["accountManager"],
                })
              }
              className="w-full"
              placeholder="Email người quản lý"
            />
            {errors.accountManagerEmail && (
              <p className="text-sm text-destructive">
                {errors.accountManagerEmail}
              </p>
            )}
            <Input
              id="accountManagerPhone"
              value={formData.accountManager?.phone || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  accountManager: {
                    ...formData.accountManager,
                    phone: e.target.value,
                  } as IProduct["accountManager"],
                })
              }
              className="w-full"
              placeholder="Số điện thoại người quản lý"
            />
            {errors.accountManagerPhone && (
              <p className="text-sm text-destructive">
                {errors.accountManagerPhone}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Label className="font-medium">Tính năng</Label>
            {(formData.features || []).map((feature, index) => (
              <div key={feature.id} className="border p-4 rounded-md space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Tính năng {index + 1}</h4>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFeature(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Tên tính năng"
                  value={feature.title}
                  onChange={(e) =>
                    updateFeature(index, "title", e.target.value)
                  }
                />
                {errors[`featureTitle${index}`] && (
                  <p className="text-sm text-destructive">
                    {errors[`featureTitle${index}`]}
                  </p>
                )}
                <Textarea
                  placeholder="Mô tả tính năng"
                  value={feature.description}
                  onChange={(e) =>
                    updateFeature(index, "description", e.target.value)
                  }
                  rows={3}
                />
                {errors[`featureDescription${index}`] && (
                  <p className="text-sm text-destructive">
                    {errors[`featureDescription${index}`]}
                  </p>
                )}
                <Input
                  placeholder="Icon (e.g., fa-star)"
                  value={feature.icon}
                  onChange={(e) => updateFeature(index, "icon", e.target.value)}
                />
                {errors[`featureIcon${index}`] && (
                  <p className="text-sm text-destructive">
                    {errors[`featureIcon${index}`]}
                  </p>
                )}
              </div>
            ))}
            <Button variant="outline" onClick={addFeature} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Thêm tính năng
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="projectLocation" className="font-medium">
              Vị trí dự án
            </Label>
            <Input
              id="projectLocation"
              value={formData.projectLocation || ""}
              onChange={(e) =>
                setFormData({ ...formData, projectLocation: e.target.value })
              }
              className="w-full"
              placeholder="Nhập vị trí dự án (tùy chọn)"
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="verificationStandard" className="font-medium">
              Tiêu chuẩn xác minh
            </Label>
            <Input
              id="verificationStandard"
              value={formData.verificationStandard || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  verificationStandard: e.target.value,
                })
              }
              className="w-full"
              placeholder="Nhập tiêu chuẩn xác minh (tùy chọn)"
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="subscriptionTier" className="font-medium">
              Cấp độ
            </Label>
            <select
              id="subscriptionTier"
              value={formData.subscriptionTier || "basic"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subscriptionTier: e.target
                    .value as IProduct["subscriptionTier"],
                })
              }
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary"
            >
              <option value="basic">Basic</option>
              <option value="professional">Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="area" className="font-medium">
              Diện tích (m²)
            </Label>
            <Input
              id="area"
              type="number"
              value={formData.area ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, area: Number(e.target.value) })
              }
              className="w-full"
              placeholder="Nhập diện tích (tùy chọn)"
              min="0"
            />
          </div>
        </div>
        <DrawerFooter className="border-t pt-4 px-6 flex flex-col sm:flex-row sm:justify-between gap-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-auto"
            >
              Hủy
            </Button>
            <Button onClick={handleSubmit} className="w-full sm:w-auto">
              {selectedProduct?._id ? "Lưu" : "Thêm"}
            </Button>
          </div>
          {selectedProduct?._id && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Xóa
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
