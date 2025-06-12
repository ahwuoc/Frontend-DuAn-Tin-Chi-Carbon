import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, JWTPayload, decodeJwt } from "jose";
import { Buffer } from "buffer"; // cần để encode base64

// =======================
// ⚙️ Config Paths
// =======================
export const PATH_CONFIG = {
  LOGIN: "/dang-nhap",
  REGISTER: "/dang-ky",
  FORBIDDEN: "/forbidden",
  DEFAULT_AUTHENTICATED_REDIRECT: "/quan-ly/",
};

export const GUEST_ONLY_PATHS = [PATH_CONFIG.LOGIN, PATH_CONFIG.REGISTER];
export const AUTH_REQUIRED_PATHS = ["/quan-ly"];
export const ROLE_BASED_PATHS = {
  ADMIN_ONLY: ["/quan-ly/admin/"],
};

// =======================
// 👤 Token + Payload
// =======================
interface DecodedUserPayload extends JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export function checkAuthLogicNoVerify(request: NextRequest): {
  isAuthenticated: boolean;
  userPayload?: DecodedUserPayload;
} {
  const token = request.cookies.get("token")?.value;
  if (!token) return { isAuthenticated: false };
  try {
    const payload = decodeJwt(token);
    return {
      isAuthenticated: true,
      userPayload: payload as DecodedUserPayload,
    };
  } catch {
    return { isAuthenticated: false };
  }
}
// =======================
// 🛡️ Middleware Logic
// =======================
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { isAuthenticated, userPayload } =
    await checkAuthLogicNoVerify(request);

  if (GUEST_ONLY_PATHS.includes(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(
        new URL(PATH_CONFIG.DEFAULT_AUTHENTICATED_REDIRECT, request.url),
      );
    }
    return NextResponse.next();
  }

  // 2. Trang cần login mà chưa login -> chuyển về login
  const requireAuth = AUTH_REQUIRED_PATHS.some((path) =>
    pathname.startsWith(path),
  );
  if (requireAuth && !isAuthenticated) {
    const loginUrl = new URL(PATH_CONFIG.LOGIN, request.url);
    loginUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Trang chỉ admin mới vào được
  const isAdminRoute = ROLE_BASED_PATHS.ADMIN_ONLY.some((path) =>
    pathname.startsWith(path),
  );
  if (isAdminRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL(PATH_CONFIG.LOGIN, request.url);
      loginUrl.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (userPayload?.role !== "admin") {
      return NextResponse.redirect(new URL(PATH_CONFIG.FORBIDDEN, request.url));
    }

    // ✅ Inject payload (base64) nếu là admin
    const response = NextResponse.next();
    const encodedPayload = Buffer.from(JSON.stringify(userPayload)).toString(
      "base64",
    );
    response.headers.set("x-user-payload", encodedPayload);
    return response;
  }

  // ✅ Mọi thứ OK, cho qua
  return NextResponse.next();
}

// =======================
// 🔍 Match Route
// =======================
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
