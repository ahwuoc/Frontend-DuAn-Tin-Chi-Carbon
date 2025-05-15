import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface EmptyStateProps {
  resetFilters: () => void;
}

export function EmptyState({ resetFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-12 bg-white rounded-lg border">
      <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Không tìm thấy sản phẩm nào
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Không tìm thấy sản phẩm nào phù hợp với tiêu chí tìm kiếm của bạn.
      </p>
      <Button
        onClick={resetFilters}
        className="bg-green-600 hover:bg-green-700"
      >
        Xem tất cả sản phẩm
      </Button>
    </div>
  );
}
