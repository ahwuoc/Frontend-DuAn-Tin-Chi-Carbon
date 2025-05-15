import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

interface DecodedUserPayload extends JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

const PATH_CONFIG = {
  LOGIN: "/dang-nhap",
  REGISTER: "/dang-ky",
  FORBIDDEN: "/forbidden",
  DEFAULT_AUTHENTICATED_REDIRECT: "/quan-ly/",
  ADMIN_PREFIX: "/quan-ly/admin/users",
};

const GUEST_ONLY_PATHS = [PATH_CONFIG.LOGIN, PATH_CONFIG.REGISTER];

async function checkAuthLogic(
  request: NextRequest
): Promise<{ isAuthenticated: boolean; userPayload?: DecodedUserPayload }> {
  const tokenCookie = request.cookies.get("token");

  if (!tokenCookie || !tokenCookie.value) {
    return { isAuthenticated: false };
  }

  const token = tokenCookie.value;
  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    return { isAuthenticated: false };
  }

  try {
    const secret = new TextEncoder().encode(secretKey);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    return {
      isAuthenticated: true,
      userPayload: payload as DecodedUserPayload,
    };
  } catch (error: any) {
    return { isAuthenticated: false };
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { isAuthenticated, userPayload } = await checkAuthLogic(request);

  if (GUEST_ONLY_PATHS.includes(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(
        new URL(PATH_CONFIG.DEFAULT_AUTHENTICATED_REDIRECT, request.url)
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith(PATH_CONFIG.ADMIN_PREFIX)) {
    if (!isAuthenticated) {
      const loginUrl = new URL(PATH_CONFIG.LOGIN, request.url);
      loginUrl.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (userPayload && userPayload.role === "admin") {
      const response = NextResponse.next();
      const userPayloadString = JSON.stringify(userPayload);
      response.headers.set("x-user-payload", userPayloadString);
      return response;
    } else {
      return NextResponse.redirect(new URL(PATH_CONFIG.FORBIDDEN, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
