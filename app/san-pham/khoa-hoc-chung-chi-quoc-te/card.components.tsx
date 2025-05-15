import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiCarbon } from "@/app/fetch/fetch.carbon";

// Interface từ bạn cung cấp
interface IFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface IAccountManager {
  name: string;
  email: string;
  phone: string;
}

interface IProduct {
  _id: string; // Giả sử có _id từ API
  name: string;
  type: "carbon_credits" | "carbon_accounting" | "international_certificates";
  description: string;
  purchaseDate: Date;
  status: "active" | "pending" | "expired";
  expiryDate?: Date;
  image?: string;
  price?: number;
  billingCycle: string;
  projectLocation?: string;
  carbonAmount?: number;
  carbonUsed?: number;
  verificationStandard?: string;
  usageStats?: {
    totalUsage: number;
    lastMonthUsage: number;
    trend: "up" | "down" | "stable";
  };
  features: IFeature[];
  subscriptionTier?: "basic" | "professional" | "enterprise";
  nextPayment?: Date;
  certificationLevel?: string;
  courseProgress?: number;
  lastAccessed?: Date;
  issuer?: string;
  accountManager: IAccountManager;
  area?: number;
}

// Component
export const PricingSection: FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiCarbon.getProductType(
          "international_certificates",
        );
        setProducts(response.data); // Giả sử API trả về { data: IProduct[] }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProduct();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.length === 0 ? (
        <p className="text-gray-600">Loading products...</p>
      ) : (
        products.map((plan, index) => (
          <Card
            key={plan._id || index} // Dùng _id nếu có, fallback về index
            className={`hover:shadow-xl transition-all duration-300 border-2 flex flex-col ${
              plan.subscriptionTier === "professional"
                ? "border-green-600 transform scale-105"
                : "border-gray-200"
            }`}
          >
            {plan.subscriptionTier === "professional" && (
              <div className="bg-green-600 text-white text-center py-2 text-sm font-medium">
                Most Popular
              </div>
            )}
            <CardContent className="p-8 flex-1 flex flex-col">
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                {plan.name}
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-800">
                  {plan.price ? `$${plan.price}` : "Contact Us"}
                </span>
                {plan.price && (
                  <span className="text-gray-500 line-through ml-2">
                    {plan.price ? `$${plan.price + 50}` : ""}{" "}
                    {/* Giả lập originalPrice */}
                  </span>
                )}
                <p className="text-sm text-gray-600 mt-1">
                  {plan.price ? "Limited Time Offer" : "Custom Pricing"}
                </p>
              </div>
              {plan.subscriptionTier && (
                <p className="text-sm text-gray-600 italic mb-3">
                  {plan.subscriptionTier === "enterprise"
                    ? "Everything in Professional"
                    : plan.subscriptionTier === "professional"
                      ? "Everything in Basic"
                      : ""}
                </p>
              )}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={feature.id || idx} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-700">{feature.title}</span>
                      <p className="text-xs text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {plan.subscriptionTier !== "enterprise" && (
                <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-green-800 font-medium">
                    Career Opportunities
                  </p>
                  <ul className="text-sm text-green-700 list-disc pl-5 mt-1">
                    <li>80% higher interview rate</li>
                    <li>
                      Up to{" "}
                      {plan.subscriptionTier === "professional" ? "40%" : "20%"}{" "}
                      salary increase
                    </li>
                  </ul>
                </div>
              )}
              {plan.subscriptionTier === "enterprise" && (
                <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-green-800 font-medium">
                    CBAM Compliance Included
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-500 mb-4">
                {plan.subscriptionTier === "enterprise"
                  ? "Best for companies and teams"
                  : plan.subscriptionTier === "professional"
                    ? "Ideal for professionals aiming high"
                    : "Perfect for self-learners"}
              </p>
              <Link
                href={`/thanh-toan?product=${plan._id}`}
                className="mt-auto w-full"
                passHref
                legacyBehavior
              >
                <a className="w-full">
                  <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-base font-medium">
                    {plan.subscriptionTier === "enterprise"
                      ? "Contact Us"
                      : "Register Now"}
                  </Button>
                </a>
              </Link>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default PricingSection;
