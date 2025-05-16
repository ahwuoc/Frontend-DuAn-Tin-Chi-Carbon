"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";
import { User, Save, Edit } from "lucide-react"; // Đã thêm biểu tượng Edit
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import apiAuth from "@/app/fetch/fetch.auth";
import { TUser } from "@/app/fetch/fetch.auth";

export default function SettingsPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  // Thêm trạng thái isEditing để theo dõi chế độ chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);

  // Initial state from localStorage or default values
  const [formData, setFormData] = useState<TUser>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser
      ? JSON.parse(storedUser)
      : {
        name: "",
        email: "",
        avatar: "",
        phone: "",
        address: "",
      };
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      localStorage.setItem("user", JSON.stringify(updatedData)); // Persist to localStorage
      return updatedData;
    });
  };

  const handleSaveProfile = async () => {
    try {
      const res = await apiAuth.update(formData);
      if (res && res.success) {
        toast({
          title: language === "vi" ? "Đã lưu thông tin" : "Profile saved",
          description:
            language === "vi"
              ? "Thông tin cá nhân của bạn đã được cập nhật thành công."
              : "Your profile information has been updated successfully.",
        });
        setIsEditing(false); // Sau khi lưu, tắt chế độ chỉnh sửa
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: language === "vi" ? "Lỗi khi lưu" : "Save failed",
        description:
          language === "vi"
            ? "Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại."
            : "Something went wrong while updating. Please try again.",
      });
    }
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev); // Chuyển đổi giữa chế độ xem và chế độ chỉnh sửa
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {language === "vi" ? "Cài đặt" : "Settings"}
          </h1>
          <p className="text-gray-500 mt-1">
            {language === "vi"
              ? "Quản lý tài khoản và tùy chỉnh trải nghiệm của bạn"
              : "Manage your account and customize your experience"}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full flex flex-col md:flex-row gap-6"
        >
          <div className="md:w-64 space-y-2">
            <TabsList className="flex flex-col h-auto bg-white border rounded-md p-1 space-y-1">
              <TabsTrigger value="profile" className="justify-start">
                <User className="w-4 h-4 mr-2" />
                {language === "vi" ? "Hồ sơ" : "Profile"}
              </TabsTrigger>
            </TabsList>

            <Card>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="avatar">
                    {language === "vi" ? "Avatar" : "Avatar"}
                  </Label>
                  <div className="w-full ">
                    <img
                      src={
                        formData.avatar ||
                        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                      }
                      alt="Avatar"
                      className="w-16 mx-auto h-16 rounded-full object-cover"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            <TabsContent value="profile" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === "vi"
                      ? "Thông tin cá nhân"
                      : "Personal Information"}
                  </CardTitle>
                  <CardDescription>
                    {language === "vi"
                      ? "Cập nhật thông tin cá nhân và liên hệ của bạn"
                      : "Update your personal and contact information"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          {language === "vi" ? "Họ tên" : "Full Name"}
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder={
                            language === "vi"
                              ? "Nhập họ tên của bạn"
                              : "Enter your full name"
                          }
                          disabled={!isEditing} // Disable input when not in editing mode
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={
                            language === "vi"
                              ? "Nhập email của bạn"
                              : "Enter your email"
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          {language === "vi" ? "Số điện thoại" : "Phone"}
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder={
                            language === "vi"
                              ? "Nhập số điện thoại của bạn"
                              : "Enter your phone number"
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">
                          {language === "vi" ? "Địa chỉ" : "Address"}
                        </Label>
                        <Textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder={
                            language === "vi"
                              ? "Nhập địa chỉ của bạn"
                              : "Enter your address"
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avatar">
                        {language === "vi" ? "Avatar" : "Avatar"}
                      </Label>
                      <Input
                        id="avatar"
                        name="avatar"
                        value={formData.avatar}
                        onChange={handleInputChange}
                        placeholder={
                          language === "vi"
                            ? "Nhập đường dẫn avatar của bạn"
                            : "Enter your avatar URL"
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleEditToggle}>
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing
                      ? language === "vi"
                        ? "Hủy chỉnh sửa"
                        : "Cancel Edit"
                      : language === "vi"
                        ? "Chỉnh sửa"
                        : "Edit"}
                  </Button>
                  {isEditing && (
                    <Button onClick={handleSaveProfile}>
                      <Save className="w-4 h-4 mr-2" />
                      {language === "vi" ? "Lưu thay đổi" : "Save changes"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
