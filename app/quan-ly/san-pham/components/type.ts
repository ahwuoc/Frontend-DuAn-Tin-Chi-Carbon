export interface Product {
  id: string;
  name: string;
  type: "carbon_credits" | "carbon_accounting" | "international_certificates";
  description: string;
  purchaseDate: string;
  status: "active" | "pending" | "expired";
  expiryDate?: string;
  image?: string;
  features?: string[];
  price?: number;
  usageStats?: {
    totalUsage: number;
    lastMonthUsage: number;
    trend: "up" | "down" | "stable";
  };
  certificationLevel?: string;
  projectLocation?: string;
  carbonAmount?: number;
  carbonUsed?: number;
  verificationStandard?: string;
  courseProgress?: number;
  lastAccessed?: string;
  nextPayment?: string;
  subscriptionTier?: "basic" | "professional" | "enterprise";
  issuer?: string;
}
