const API_URL = process.env.NEXT_PUBLIC_API_URL!;
type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
type RequestOptions = Omit<RequestInit, "body"> & {
  body?: any;
};
type TResponse<T> = {
  status: number;
  data: T;
};
async function request<T>(
  method: Method,
  endpoint: string,
  options?: RequestOptions
): Promise<TResponse<T>> {
  const fullPath = endpoint.startsWith("/")
    ? `${API_URL}${endpoint}`
    : `${API_URL}/${endpoint}`;
  const response = await fetch(fullPath, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    credentials: "include",
    body:
      options?.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error ${response.status}: ${error}`);
  }
  const data = await response.json();
  return {
    status: response.status,
    data: data as T,
  };
}
const HTTP = {
  GET: <T>(url: string) => request<T>("GET", url),
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
