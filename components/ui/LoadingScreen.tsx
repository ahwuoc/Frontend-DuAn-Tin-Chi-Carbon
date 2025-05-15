"use client"

import { Trees } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-emerald-50 to-emerald-100">
      <div className="animate-bounce mb-4">
        <div className="bg-emerald-600 text-white p-4 rounded-full">
          <Trees size={32} />
        </div>
      </div>
      <h2 className="text-emerald-800 text-xl font-semibold mb-2">Đang tải khu rừng nhiệt đới</h2>
      <div className="w-64 h-2 bg-emerald-200 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-600 animate-pulse rounded-full"></div>
      </div>
      <p className="text-emerald-600 text-sm mt-4">Vui lòng đợi trong giây lát...</p>
    </div>
  )
}
