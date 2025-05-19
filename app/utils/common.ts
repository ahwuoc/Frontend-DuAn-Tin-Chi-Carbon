interface UserLocalStorage {
  userId: string;
  name: string;
  email: string;
  role: string;
}
export const getUserFromLocalStorage = (): UserLocalStorage | null => {
  const data = localStorage.getItem("user");
  if (!data) return null;
  try {
    return JSON.parse(data) as UserLocalStorage;
  } catch {
    return null;
  }
};

export const formatNumberUtil = (
  num: number | undefined,
  currency?: string
): string => {
  if (num === undefined || num === null) return "N/A";
  try {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: currency ? "currency" : "decimal",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: currency ? 0 : 2,
    });
    return formatter.format(num);
  } catch (e) {
    console.error("Error formatting number:", e);
    return String(num);
  }
};

export const formatDateUtil = (dateString?: string | Date) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const reader = new FileReader();
  const base64 = await new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject("FileReader error");
    };
    reader.onerror = () => reject("FileReader error");
    reader.readAsDataURL(file);
  });

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file: base64 }),
  });

  const data = await res.json();
  if (!res.ok || !data.url) {
    throw new Error(data.message || "Upload failed");
  }

  return data.url;
};
