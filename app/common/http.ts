const API_URL = process.env.NEXT_PUBLIC_API_URL!;
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
const DEFAULT_TIMEOUT = 5000;
async function request<T>(
  method: Method,
  endpoint: string,
  options?: RequestOptions,
): Promise<TResponse<T>> {
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

  // Sử dụng timeout được truyền vào hoặc giá trị mặc định
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
      const errorText = await response.text();
      // Ném lỗi HTTP với thông tin chi tiết
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(`[HTTP ${method}] ✅ Response:`, data);
    return {
      status: response.status,
      payload: data as T,
    };
  } catch (error: any) {
    // Xóa timeout nếu có bất kỳ lỗi nào xảy ra (đảm bảo không bị rò rỉ timeout)
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Kiểm tra xem lỗi có phải do AbortController (timeout) hay không
    if (error.name === "AbortError") {
      console.error(
        `[HTTP ${method}] ❌ Request to ${fullPath} aborted due to timeout.`,
      );
      throw new Error(
        `Request to ${fullPath} timed out after ${currentTimeout}ms.`,
      );
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
