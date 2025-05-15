import ProductCard from "@/components/dashboard/product-card";
import { Product } from "./type";

interface ProductGridViewProps {
  products: Product[];
}

export function ProductGridView({ products }: ProductGridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {products.map((product, index: number) => (
        <ProductCard key={product.index} product={product} viewMode="grid" />
      ))}
    </div>
  );
}
