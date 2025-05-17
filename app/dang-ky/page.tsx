"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { useToast } from "@/hooks/use-toast";
import ParticlesBackground from "@/components/particles-background";
import { Eye, EyeOff } from "lucide-react";
import apiAuth from "../fetch/fetch.auth";
export default function RegisterPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    isLoading: false,
    showPassword: false,
    showConfirmPassword: false,
  });
  const updateState = (key: string, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateState("isLoading", true);
    try {
      const userData = {
        name: formState.name,
        last_name: "",
        phone: formState.phone,
        email: formState.email,
        password: formState.password,
        status: 1,
        join: new Date().toISOString(), // Thời gian hiện tại
        userType: 2, // Giá trị mặc định
      };
      const response = await apiAuth.register(userData);
      if (response && response.success) {
        toast({
          title: language === "vi" ? "Đăng ký thành công" : "Registration successful",
          description: `${language === "vi" ? "Chào mừng" : "Welcome"} ${userData.name}!`,
          variant: "success",
        });
        router.push("/dang-nhap");
      } else {
        throw new Error("Registration failed");
      }
    } catch (error: any) {
      toast({
        title: language === "vi" ? "Đăng ký thất bại" : "Registration failed",
        description:
          language === "vi"
            ? error.message || "Có lỗi xảy ra, thử lại nhé!"
            : error.message || "Something went wrong, try again!",
        variant: "destructive",
      });
    } finally {
      updateState("isLoading", false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-black overflow-hidden font-montserrat">
      <ParticlesBackground
        particleColor="rgba(255, 255, 255, 0.5)"
        particleCount={400}
        particleSize={2}
        interactive={true}
        sensitivity={1.5}
      />

      <div className="relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative h-28 w-96">
              <Image
                src={
                  language === "vi"
                    ? "https://res.cloudinary.com/dyticflm3/image/upload/v1744623295/My%20Brand/Logo_c%C3%B3_t%C3%AAn_ti%E1%BA%BFng_Vi%E1%BB%87t_qyscc0.png"
                    : "https://res.cloudinary.com/dyticflm3/image/upload/v1744628600/Logo_c%C3%B3_t%C3%AAn_ti%E1%BA%BFng_anh_uge7jj.png"
                }
                alt="Logo"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </motion.div>

          <motion.h2
            className="mt-6 text-center text-3xl font-bold tracking-tight text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {language === "vi" ? "Đăng ký tài khoản" : "Create your account"}
          </motion.h2>
          <motion.p
            className="mt-2 text-center text-sm text-gray-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {language === "vi"
              ? "Đã có tài khoản?"
              : "Already have an account?"}{" "}
            <Link
              href="/dang-nhap"
              className="font-medium text-teal-400 hover:text-teal-300"
            >
              {language === "vi" ? "Đăng nhập ngay" : "Log in now"}
            </Link>
          </motion.p>
        </div>

        <motion.div
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-black/60 backdrop-blur-md border border-gray-800 shadow-xl overflow-hidden">
            <CardHeader className="pb-0">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-600/10 z-0"></div>
            </CardHeader>
            <CardContent className="relative z-10 pt-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Name */}
                <div>
                  <Label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-200"
                  >
                    {language === "vi" ? "Tên" : "Name"}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => updateState("name", e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 bg-gray-900/60 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white"
                    placeholder={
                      language === "vi" ? "Ví dụ: John Doe" : "E.g., John Doe"
                    }
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-200"
                  >
                    {language === "vi" ? "Số điện thoại" : "Phone Number"}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formState.phone}
                    onChange={(e) => updateState("phone", e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 bg-gray-900/60 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white"
                    placeholder="0123456789"
                  />
                </div>

                {/* Email */}
                <div>
                  <Label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-200"
                  >
                    {language === "vi" ? "Email" : "Email Address"}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formState.email}
                    onChange={(e) => updateState("email", e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 bg-gray-900/60 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white"
                    placeholder="example@email.com"
                  />
                </div>

                {/* Password */}
                <div>
                  <Label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-200"
                  >
                    {language === "vi" ? "Mật khẩu" : "Password"}
                  </Label>
                  <div className="mt-1 relative">
                    <Input
                      id="password"
                      name="password"
                      type={formState.showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formState.password}
                      onChange={(e) => updateState("password", e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-700 bg-gray-900/60 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateState("showPassword", !formState.showPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                    >
                      {formState.showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
                {/* Confirm Password */}
                <div>
                  <Label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-200"
                  >
                    {language === "vi"
                      ? "Xác nhận mật khẩu"
                      : "Confirm Password"}
                  </Label>
                  <div className="mt-1 relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={formState.showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formState.confirmPassword}
                      onChange={(e) =>
                        updateState("confirmPassword", e.target.value)
                      }
                      className="appearance-none block w-full px-3 py-2 border border-gray-700 bg-gray-900/60 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateState(
                          "showConfirmPassword",
                          !formState.showConfirmPassword,
                        )
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                    >
                      {formState.showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Agree to Terms */}
                <div className="flex items-center">
                  <Checkbox
                    id="agree-terms"
                    checked={formState.agreeTerms}
                    onCheckedChange={(checked) =>
                      updateState("agreeTerms", checked)
                    }
                  />
                  <Label
                    htmlFor="agree-terms"
                    className="ml-2 block text-sm text-gray-200"
                  >
                    {language === "vi"
                      ? "Tôi đồng ý với các điều khoản và chính sách"
                      : "I agree to the terms and policies"}
                  </Label>
                </div>

                {/* Submit Button */}
                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={formState.isLoading}
                  >
                    {formState.isLoading
                      ? language === "vi"
                        ? "Đang đăng ký..."
                        : "Registering..."
                      : language === "vi"
                        ? "Đăng ký"
                        : "Register"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
