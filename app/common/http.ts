const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
type RequestOptions = Omit<RequestInit, "body" | "headers" | "signal"> & {
  body?: StrictObject;
  headers?: Record<string, string>;
  timeout?: number;
};

type TResponse<T> = {
  status: number;
  payload: T;
};

type StrictObject = Record<string, any>;

class HTTPError extends Error {
  constructor(
    public status: number,
    public message: string,
    public response?: any
  ) {
    super(message);
    this.name = "HTTPError";
  }
}

class TimeoutError extends Error {
  constructor(public timeout: number, public url: string) {
    super(`Request to ${url} timed out after ${timeout}ms`);
    this.name = "TimeoutError";
  }
}

class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

const DEFAULT_TIMEOUT = 5000;

async function request<T>(
  method: Method,
  endpoint: string,
  options?: RequestOptions,
): Promise<TResponse<T>> {
  // Kiểm tra API_URL khi thực sự thực hiện request
  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.warn("NEXT_PUBLIC_API_URL not defined, using fallback URL");
  }

  const fullPath = endpoint.startsWith("/")
    ? `${API_URL}${endpoint}`
    : `${API_URL}/${endpoint}`;

  console.log(`[HTTP ${method}] → ${fullPath}`);
  if (options?.body) {
    console.log("Request body:", options.body);
  }

  const controller = new AbortController();
  const signal = controller.signal;
  let timeoutId: NodeJS.Timeout | undefined;

  const currentTimeout = options?.timeout ?? DEFAULT_TIMEOUT;

  timeoutId = setTimeout(() => {
    console.warn(
      `[HTTP ${method}] Request to ${fullPath} timed out after ${currentTimeout}ms`,
    );
    controller.abort(); // Hủy yêu cầu khi timeout
  }, currentTimeout);

  try {
    const response = await fetch(fullPath, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      credentials: "include",
      body:
        options?.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal, // Truyền signal vào fetch
    });

    // Xóa timeout nếu yêu cầu thành công hoặc không phải lỗi timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    console.log(`[HTTP ${method}] ← Status: ${response.status}`);

    if (!response.ok) {
      let errorText = "";
      try {
        errorText = await response.text();
      } catch {
        errorText = "Unable to read error response";
      }
      
      // Ném lỗi HTTP với thông tin chi tiết
      throw new HTTPError(response.status, `HTTP Error ${response.status}: ${errorText}`);
    }

    let data: T;
    try {
      data = await response.json();
    } catch (error) {
      throw new HTTPError(response.status, "Invalid JSON response");
    }

    console.log(`[HTTP ${method}] ✅ Response:`, data);
    return {
      status: response.status,
      payload: data,
    };
  } catch (error: unknown) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Xử lý các loại lỗi khác nhau
    if (error instanceof HTTPError) {
      console.error(`[HTTP ${method}] ❌ HTTP Error:`, error.message);
      throw error;
    } else if (error instanceof Error && error.name === "AbortError") {
      console.error(
        `[HTTP ${method}] ❌ Request to ${fullPath} aborted due to timeout.`,
      );
      throw new TimeoutError(currentTimeout, fullPath);
    } else {
      // Ném lại các lỗi khác
      console.error(`[HTTP ${method}] ❌ Failed to fetch ${fullPath}:`, error);
      throw error;
    }
  }
}

const HTTP = {
  GET: <T>(url: string, options?: Omit<RequestOptions, "body">) =>
    request<T>("GET", url, options),
  POST: <T>(url: string, options?: RequestOptions) =>
    request<T>("POST", url, options),
  PUT: <T>(url: string, options?: RequestOptions) =>
    request<T>("PUT", url, options),
  PATCH: <T>(url: string, options?: RequestOptions) =>
    request<T>("PATCH", url, options),
  DELETE: <T>(url: string, options?: RequestOptions) =>
    request<T>("DELETE", url, options),
};

export default HTTP;
export { HTTPError, TimeoutError, ConfigError };
