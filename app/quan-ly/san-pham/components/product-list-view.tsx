import ProductCard from "@/components/dashboard/product-card";
import { Product } from "./type";

interface ProductListViewProps {
  products: Product[];
}

export function ProductListView({ products }: ProductListViewProps) {
  return (
    <div className="space-y-4">
      {products.map((product, index: number) => (
        <ProductCard key={product.id} {...product} viewMode="list" />
      ))}
    </div>
  );
}
