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
