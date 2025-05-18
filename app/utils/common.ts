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

export const uploadToCloudinary = async (
  file: File,
  cloudName: string,
  uploadPreset: string
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file), formData.append("upload_preset", uploadPreset);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await res.json();
  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message || "Upload failed");
  }

  return data.secure_url;
};
