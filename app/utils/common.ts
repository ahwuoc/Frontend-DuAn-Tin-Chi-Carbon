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

export const formatDateUtil = (dateString?: string | Date) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
