import React from "react";
import DashboardSidebar from "@/components/dashboard/sidebar";
interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-100 p-4">
        <DashboardSidebar />
      </div>
      {/* Nội dung chính */}
      <div className="flex-1 p-4 container mx-auto">{children}</div>
    </div>
  );
};

export default DashboardLayout;
