import { INews } from "../../../../fetch/fetch.news";

const statuses: Array<{ value: INews["status"]; label: string }> = [
  { value: "draft", label: "Bản nháp" },
  { value: "published", label: "Đã xuất bản" },
  { value: "archived", label: "Lưu trữ" },
];
export default statuses;
