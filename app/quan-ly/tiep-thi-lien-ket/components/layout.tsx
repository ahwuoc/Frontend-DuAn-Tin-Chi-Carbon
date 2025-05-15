import type { ReactNode } from "react"
import DashboardSidebar from "@/components/dashboard/sidebar"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Trong môi trường thực tế, kiểm tra xác thực ở đây
  // const session = await getSession()
  // if (!session) redirect('/dang-nhap')

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
