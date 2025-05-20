"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import ParticlesBackground from "@/components/particles-background";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import loginTranslations from "./language";
import { useLanguage } from "@/context/language-context";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");
  const emailParam = searchParams.get("email") || "";
  const { language } = useLanguage();
  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: loginTranslations.loginSuccessful[language],
          description: loginTranslations.welcomeBack[language],
          variant: "success",
        });
        router.push(redirectPath || "quan-ly"); // Sử dụng redirectPath nếu có, nếu không thì về "quan-ly"
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      toast({
        title: loginTranslations.loginFailed[language],
        description: loginTranslations.invalidCredentials[language],
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: redirectPath || "/quan-ly" });
    } catch (error) {
      toast({
        title: loginTranslations.loginFailed[language],
        description: loginTranslations.googleLoginFailed[language],
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

      {/* Content */}
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
                src="https://res.cloudinary.com/dyticflm3/image/upload/v1744628600/Logo_c%C3%B3_t%C3%AAn_ti%E1%BA%BFng_anh_uge7jj.png"
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
            {loginTranslations.loginToAccount[language]}
          </motion.h2>
          <motion.p
            className="mt-2 text-center text-sm text-gray-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {language === "vi" ? "Hoặc " : "Or "}
            <Link
              href="/register-consultation"
              className="font-medium text-teal-400 hover:text-teal-300"
            >
              {loginTranslations.registerForConsultation[language]}
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
                <div>
                  <Label
                    htmlFor="email"
                    className="block text-sm font-medium tracking-tight text-gray-200"
                  >
                    {loginTranslations.emailAddress[language]}
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-700 bg-gray-900/60 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="block text-sm font-medium tracking-tight text-gray-200"
                    >
                      {loginTranslations.password[language]}
                    </Label>
                    <div className="text-sm">
                      <Link
                        href="/forget-password"
                        className="font-medium text-teal-400 hover:text-teal-300"
                      >
                        {loginTranslations.forgotPassword[language]}
                      </Link>
                    </div>
                  </div>
                  <div className="mt-1 relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-700 bg-gray-900/60 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked as boolean)
                      }
                      className="border-gray-600 bg-gray-800 text-teal-500 focus:ring-teal-500"
                    />
                    <Label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-200"
                    >
                      {loginTranslations.rememberMe[language]}
                    </Label>
                  </div>
                  <div className="text-sm">
                    <Label
                      htmlFor="register"
                      className="ml-2 block text-sm text-gray-200"
                    >
                      {loginTranslations.dontHaveAccount[language]}{" "}
                      <Link
                        href="/dang-ky"
                        className="font-medium text-teal-400 hover:text-teal-300"
                      >
                        {loginTranslations.register[language]}
                      </Link>
                    </Label>
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium tracking-tight text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-gray-900"
                  >
                    {isLoading
                      ? loginTranslations.loggingIn[language]
                      : loginTranslations.loginButton[language]}
                  </Button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-black text-gray-400">
                      {loginTranslations.orContinueWith[language]}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  <div>
                    <Button
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm bg-gray-900/60 text-sm font-medium text-gray-300 hover:bg-gray-800"
                    >
                      <span className="sr-only">Login with Google</span>
                      <svg
                        className="w-5 h-5 mr-2"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                      </svg>
                      Google
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-black/40 border-t border-gray-800 px-6 py-4">
              <p className="text-xs text-center text-gray-400 w-full">
                {loginTranslations.termsAndPrivacy[language]}
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}
