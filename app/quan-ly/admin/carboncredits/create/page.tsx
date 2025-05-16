"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCarbonCreditPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalCredits, setTotalCredits] = useState(0);
  const [usedCredits, setUsedCredits] = useState(0);
  const [projectManager, setProjectManager] = useState("");
  const [projectPhone, setProjectPhone] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Fake API call
    console.log({
      title,
      status,
      location,
      area,
      startDate,
      endDate,
      totalCredits,
      usedCredits,
      remainingCredits: totalCredits - usedCredits,
      projectManager,
      projectPhone,
      description,
      image,
    });

    alert("Đã thêm mới thành công!");
    router.push("/quan-ly/admin/carboncredits");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Thêm mới Carbon Credit</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 600 }}>
        <input placeholder="Tiêu đề" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input placeholder="Trạng thái" value={status} onChange={(e) => setStatus(e.target.value)} required />
        <input placeholder="Vị trí" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <input placeholder="Diện tích" value={area} onChange={(e) => setArea(e.target.value)} required />
        <label>
          Thời gian bắt đầu
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </label>
        <label>
          Thời gian kết thúc
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </label>
        <input
          type="number"
          placeholder="Tổng Credits"
          value={totalCredits}
          onChange={(e) => setTotalCredits(Number(e.target.value))}
          required
          min={0}
        />
        <input
          type="number"
          placeholder="Đã dùng Credits"
          value={usedCredits}
          onChange={(e) => setUsedCredits(Number(e.target.value))}
          required
          min={0}
          max={totalCredits}
        />
        <input
          placeholder="Quản lý dự án"
          value={projectManager}
          onChange={(e) => setProjectManager(e.target.value)}
          required
        />
        <input
          placeholder="Số điện thoại quản lý"
          value={projectPhone}
          onChange={(e) => setProjectPhone(e.target.value)}
          required
        />
        <textarea
          placeholder="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
        />
        <input
          placeholder="URL ảnh"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <button type="submit" style={{ padding: "8px 12px" }}>
          Thêm mới
        </button>
      </form>
    </div>
  );
}
