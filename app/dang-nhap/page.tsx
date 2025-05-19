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

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");
  const emailParam = searchParams.get("email") || "";

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
          title: "Login successful",
          description: "Welcome back",
          variant: "success",
        });
        router.push("quan-ly");
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

      if (!redirectUri) throw new Error("redirectUri is required");

      const redirectPath = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent`;
      router.push(redirectPath);
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Google login failed",
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
            Login to your account
          </motion.h2>
          <motion.p
            className="mt-2 text-center text-sm text-gray-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Or{" "}
            <Link
              href="/register-consultation"
              className="font-medium text-teal-400 hover:text-teal-300"
            >
              register for consultation
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
                    Email address
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
                      Password
                    </Label>
                    <div className="text-sm">
                      <Link
                        href="/forget-password"
                        className="font-medium text-teal-400 hover:text-teal-300"
                      >
                        Forgot password?
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
                  </div>
                  <div className="flex justify-between w-full">
                    <Label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-200"
                    >
                      Remember me
                    </Label>
                    <Label
                      htmlFor="register"
                      className="ml-2 block text-sm text-blue-500"
                    >
                      <Link href="/dang-ky">
                        Don't have an account?
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
                    {isLoading ? "Logging in..." : "Login"}
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
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6  grid  gap-3">
                  <div>
                    <Button
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm bg-gray-900/60 text-sm font-medium text-gray-300 hover:bg-gray-800"
                    >
                      <span className="sr-only">Login with Google</span>
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-black/40 border-t border-gray-800 px-6 py-4">
              <p className="text-xs text-center text-gray-400 w-full">
                By logging in, you agree to our Terms of Service and Privacy Policy
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
