import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

const googleClientId = process.env.GOOGLE_CLIENT_ID!;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET!;
const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI!;
const backendApiUrl = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const oauthCode = params.get("code");
  const oauthError = params.get("error");

  if (oauthError || !oauthCode) {
    const errorUrl = new URL("/dang-nhap", request.url);
    errorUrl.searchParams.set(
      "error",
      oauthError ? "google_oauth_failed" : "no_oauth_code",
    );
    if (oauthError) errorUrl.searchParams.set("message", oauthError);
    return NextResponse.redirect(errorUrl);
  }

  try {
    // 1. Đổi code sang access_token từ Google
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: oauthCode,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: googleRedirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const errorData = await tokenRes.json();
      console.error("Google Token API Error:", errorData);
      throw new Error(errorData.error_description || "Google token failed");
    }

    const { access_token } = await tokenRes.json();
    if (!access_token) throw new Error("Google không trả access_token.");
    const serverRes = await fetch(
      `${backendApiUrl}/auth/login/email/${access_token}`,
    );
    if (!serverRes.ok) {
      const errorData = await serverRes.json();
      console.error("Backend Auth Error:", errorData);
      throw new Error(errorData.message || "Backend xử lý thất bại");
    }

    const { success, token } = await serverRes.json();

    if (success && token) {
      const cookie = serialize("token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60,
        path: "/",
        sameSite: "lax",
      });

      const redirectUrl = new URL("/auth-processing", request.url);
      const response = NextResponse.redirect(redirectUrl);
      response.headers.append("Set-Cookie", cookie);
      return response;
    }
    const errorUrl = new URL("/dang-nhap", request.url);
    errorUrl.searchParams.set("error", "backend_processing_failed");
    errorUrl.searchParams.set("message", "No token returned");
    return NextResponse.redirect(errorUrl);
  } catch (err: any) {
    console.error("Callback Exception:", err);
    const errorUrl = new URL("/dang-nhap", request.url);
    errorUrl.searchParams.set("error", "callback_exception");
    errorUrl.searchParams.set("message", err.message || "Internal error");
    return NextResponse.redirect(errorUrl);
  }
}
