// app/api/auth/google/callback/route.ts (or your specific path)
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";

// Ensure your environment variables are loaded and available
const googleClientId = process.env.GOOGLE_CLIENT_ID!;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET!;
const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI!;
const backendApiUrl = process.env.NEXT_PUBLIC_API_URL!;
const jwtSecret = process.env.JWT_SECRET!;
const jwtExpiresIn = process.env.JWT_CUSTOM_EXPIRES_IN || "1d"; // How long the custom JWT is valid

if (
  !googleClientId ||
  !googleClientSecret ||
  !googleRedirectUri ||
  !backendApiUrl ||
  !jwtSecret
) {
  console.error(
    "❌ Missing critical environment variables for Google OAuth callback or JWT signing."
  );
  // You might want to throw an error here during build or startup in a real app
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const oauthCode = params.get("code");
  const oauthError = params.get("error");

  if (oauthError) {
    console.error("❌ Google Login Error:", oauthError);
    // Redirect to a login page with an error message
    const loginErrorUrl = new URL("/dang-nhap", request.url); // Assuming /dang-nhap is your login page
    loginErrorUrl.searchParams.set("error", "google_oauth_failed");
    loginErrorUrl.searchParams.set("message", oauthError);
    return NextResponse.redirect(loginErrorUrl);
  }

  if (!oauthCode) {
    console.error("❌ No OAuth code provided by Google.");
    const loginErrorUrl = new URL("/dang-nhap", request.url);
    loginErrorUrl.searchParams.set("error", "no_oauth_code");
    return NextResponse.redirect(loginErrorUrl);
  }

  console.log("✅ Google OAuth Code received:", oauthCode);

  try {
    // 1. Exchange OAuth code for Google tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: oauthCode,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: googleRedirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error(
        "❌ Failed to exchange Google OAuth code for tokens:",
        errorData
      );
      throw new Error(
        errorData.error_description || "Google token exchange failed"
      );
    }

    const googleTokens = await tokenResponse.json();
    const googleAccessToken = googleTokens.access_token;
    // const googleIdToken = googleTokens.id_token; // You might also want to use/verify the ID token

    if (!googleAccessToken) {
      console.error("❌ No access_token received from Google.");
      throw new Error("Google did not return an access_token.");
    }
    console.log("✅ Google Access Token obtained.");

    // 2. Fetch user data from your backend using Google's access token
    // Your backend should verify this access_token with Google before creating/returning user data
    const serverResponse = await fetch(
      `${backendApiUrl}/login/email/${googleAccessToken}`, // Endpoint to your backend
      {
        method: "GET",
      }
    );

    if (!serverResponse.ok) {
      const errorData = await serverResponse.json();
      console.error("❌ Backend server failed to process login:", errorData);
      throw new Error(errorData.message || "Backend login processing failed");
    }

    const serverData = await serverResponse.json();

    if (serverData && serverData.success && serverData.userData) {
      console.log("✅ User data from backend:", serverData.userData);

      // 3. Create your custom JWT
      const userPayload = {
        userId: serverData.userData.id, // or _id, depending on your backend
        email: serverData.userData.email,
        name: serverData.userData.name,
        roles: serverData.userData.roles || [], // Example: ['user', 'editor']
        // Add any other relevant, non-sensitive user data
      };

      const customJwtToken = jwt.sign(userPayload, jwtSecret, {
        expiresIn: jwtExpiresIn,
      // This is just a fallback; use the first one
      });
      console.log("✅ Custom JWT created.");

      // 4. Serialize the custom JWT into an HttpOnly cookie
      const jwtCookie = serialize("token", customJwtToken, {
        httpOnly: true, // Crucial for security: client-side JS cannot access this cookie
        secure: process.env.NODE_ENV === "production", // Send only over HTTPS in production
        maxAge: parseInt(jwtExpiresIn) * 24 * 60 * 60, // Cookie expiry in seconds (e.g., 1 day for '1d')
        path: "/", // Cookie available for all paths
        sameSite: "lax", // Recommended for most cases
      });

      // (Optional) Cookie for non-sensitive user info for client-side display
      const userInfoCookie = serialize(
        "user_info",
        JSON.stringify({
          name: serverData.userData.name,
          email: serverData.userData.email,
          // any other non-sensitive info
        }),
        {
          httpOnly: false, // Client-side JS can access this
          secure: process.env.NODE_ENV === "production",
          maxAge: parseInt(jwtExpiresIn) * 24 * 60 * 60,
          path: "/",
          sameSite: "lax",
        }
      );

      // 5. Redirect to the desired page (e.g., dashboard) and set the cookies
      const redirectUrl = new URL("/quan-ly", request.url); // Your target redirect URL
      const response = NextResponse.redirect(redirectUrl);

      // Set multiple cookies
      response.headers.append("Set-Cookie", jwtCookie);
      response.headers.append("Set-Cookie", userInfoCookie); // If you use the optional user_info cookie

      console.log(
        "✅ Successfully logged in. Redirecting and setting cookies."
      );
      return response;
    } else {
      console.error(
        "❌ Backend server indicated failure or missing userData:",
        serverData
      );
      const loginErrorUrl = new URL("/dang-nhap", request.url);
      loginErrorUrl.searchParams.set("error", "backend_processing_failed");
      loginErrorUrl.searchParams.set(
        "message",
        serverData?.message || "Unknown backend error"
      );
      return NextResponse.redirect(loginErrorUrl);
    }
  } catch (err: any) {
    console.error("❌ An unexpected error occurred in Google callback:", err);
    const loginErrorUrl = new URL("/dang-nhap", request.url);
    loginErrorUrl.searchParams.set("error", "callback_exception");
    loginErrorUrl.searchParams.set(
      "message",
      err.message || "An internal error occurred."
    );
    return NextResponse.redirect(loginErrorUrl);
  }
}
