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
import { User, Save, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import apiAuth from "@/app/fetch/fetch.auth";

// Import tệp ngôn ngữ riêng cho SettingsPage
import settingsPageTranslations from "./language";

export default function SettingsPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<any>(() => {
    return (
      user ?? {
        name: "",
        email: "",
        avatar: "",
        phone: "",
        address: "",
      }
    );
  });

  // Sử dụng useEffect để cập nhật formData khi user thay đổi (ví dụ: sau khi tải dữ liệu)
  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

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
          title: settingsPageTranslations.toast.saveSuccessTitle[language],
          description:
            settingsPageTranslations.toast.saveSuccessDescription[language],
        });
        setIsEditing(false); // Sau khi lưu, tắt chế độ chỉnh sửa
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: settingsPageTranslations.toast.saveErrorTitle[language],
        description:
          settingsPageTranslations.toast.saveErrorDescription[language],
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
            {settingsPageTranslations.header.title[language]}
          </h1>
          <p className="text-gray-500 mt-1">
            {settingsPageTranslations.header.description[language]}
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
                {settingsPageTranslations.tabs.profile[language]}
              </TabsTrigger>
            </TabsList>

            <Card>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="avatar">
                    {settingsPageTranslations.profileCard.avatarLabel[language]}
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
                    {
                      settingsPageTranslations.profileCard.personalInfoTitle[
                        language
                      ]
                    }
                  </CardTitle>
                  <CardDescription>
                    {
                      settingsPageTranslations.profileCard
                        .personalInfoDescription[language]
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          {
                            settingsPageTranslations.profileCard.fullNameLabel[
                              language
                            ]
                          }
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder={
                            settingsPageTranslations.profileCard
                              .fullNamePlaceholder[language]
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          {
                            settingsPageTranslations.profileCard.emailLabel[
                              language
                            ]
                          }
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={
                            settingsPageTranslations.profileCard
                              .emailPlaceholder[language]
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          {
                            settingsPageTranslations.profileCard.phoneLabel[
                              language
                            ]
                          }
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder={
                            settingsPageTranslations.profileCard
                              .phonePlaceholder[language]
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">
                          {
                            settingsPageTranslations.profileCard.addressLabel[
                              language
                            ]
                          }
                        </Label>
                        <Textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder={
                            settingsPageTranslations.profileCard
                              .addressPlaceholder[language]
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avatar">
                        {
                          settingsPageTranslations.profileCard.avatarLabel[
                            language
                          ]
                        }
                      </Label>
                      <Input
                        id="avatar"
                        name="avatar"
                        value={formData.avatar}
                        onChange={handleInputChange}
                        placeholder={
                          settingsPageTranslations.profileCard
                            .avatarPlaceholder[language]
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
                      ? settingsPageTranslations.profileCard.editButton.cancel[
                          language
                        ]
                      : settingsPageTranslations.profileCard.editButton.edit[
                          language
                        ]}
                  </Button>
                  {isEditing && (
                    <Button onClick={handleSaveProfile}>
                      <Save className="w-4 h-4 mr-2" />
                      {
                        settingsPageTranslations.profileCard.saveButton[
                          language
                        ]
                      }
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
