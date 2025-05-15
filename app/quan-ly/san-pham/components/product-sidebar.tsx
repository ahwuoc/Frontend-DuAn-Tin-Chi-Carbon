import {
  Package,
  Leaf,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

interface ProductSidebarProps {
  activeTypeTab: string;
  setActiveTypeTab: (type: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ProductSidebar({
  activeTypeTab,
  setActiveTypeTab,
  activeTab,
  setActiveTab,
}: ProductSidebarProps) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="font-medium text-lg mb-4">Loại sản phẩm</h3>
      <div className="space-y-2">
        <button
          onClick={() => setActiveTypeTab("all")}
          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            activeTypeTab === "all"
              ? "bg-green-50 text-green-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Package className="w-5 h-5 mr-3" />
          Tất cả sản phẩm
        </button>
        <button
          onClick={() => setActiveTypeTab("carbon_credits")}
          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            activeTypeTab === "carbon_credits"
              ? "bg-green-50 text-green-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Leaf className="w-5 h-5 mr-3" />
          Tín chỉ Carbon
        </button>
        <button
          onClick={() => setActiveTypeTab("carbon_accounting")}
          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            activeTypeTab === "carbon_accounting"
              ? "bg-green-50 text-green-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <BookOpen className="w-5 h-5 mr-3" />
          Carbon Toàn Thư
        </button>
        <button
          onClick={() => setActiveTypeTab("international_certificates")}
          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            activeTypeTab === "international_certificates"
              ? "bg-green-50 text-green-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Award className="w-5 h-5 mr-3" />
          Chứng chỉ Quốc tế
        </button>
      </div>

      <h3 className="font-medium text-lg mt-8 mb-4">Trạng thái</h3>
      <div className="space-y-2">
        <button
          onClick={() => setActiveTab("all")}
          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            activeTab === "all"
              ? "bg-green-50 text-green-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          Tất cả trạng thái
        </button>
        <button
          onClick={() => setActiveTab("active")}
          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            activeTab === "active"
              ? "bg-green-50 text-green-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
          Đang hoạt độngss
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            activeTab === "pending"
              ? "bg-green-50 text-green-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Clock className="w-4 h-4 mr-2 text-yellow-600" />
          Đang xử lý
        </button>
        <button
          onClick={() => setActiveTab("expired")}
          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            activeTab === "expired"
              ? "bg-green-50 text-green-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
          Hết hạn
        </button>
      </div>
    </div>
  );
}
