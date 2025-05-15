import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";
import {
  CreditCard,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Receipt,
  Plus,
  ChevronDown,
  ExternalLink,
  ArrowUpRight,
  Wallet,
  Building,
  User,
  Settings,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentMethod } from "../page";
// Component: PaymentMethods
export const PaymentMethods = ({
  language,
  paymentMethods,
  getPaymentMethodIcon,
  handleSubmitPaymentMethod,
}: any) => {
  const [newMethod, setNewMethod] = useState({
    type: "credit_card",
    name: "",
    last4: "",
    expiryDate: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setNewMethod({ ...newMethod, [e.target.name]: e.target.value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === "vi" ? "Phương thức thanh toán" : "Payment Methods"}
        </CardTitle>
        <CardDescription>
          {language === "vi"
            ? "Quản lý các phương thức thanh toán của bạn"
            : "Manage your payment methods"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentMethods.map((method: PaymentMethod) => (
            <div key={method.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {getPaymentMethodIcon(method.type)}
                  <div className="ml-3">
                    <h4 className="font-medium">{method.name}</h4>
                    {method.type === "credit_card" && (
                      <p className="text-sm text-gray-500">
                        •••• {method.last4} |{" "}
                        {language === "vi" ? "Hết hạn" : "Expires"}:{" "}
                        {method.expiryDate}
                      </p>
                    )}
                    {method.type === "bank_transfer" && (
                      <p className="text-sm text-gray-500">
                        {language === "vi"
                          ? "Chuyển khoản ngân hàng"
                          : "Bank Transfer"}
                      </p>
                    )}
                    {method.isDefault && (
                      <Badge variant="outline" className="mt-1">
                        {language === "vi" ? "Mặc định" : "Default"}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!method.isDefault && (
                    <Button variant="outline" size="sm">
                      {language === "vi"
                        ? "Đặt làm mặc định"
                        : "Set as Default"}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    {language === "vi" ? "Xóa" : "Remove"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-4">
              {language === "vi"
                ? "Thêm phương thức thanh toán"
                : "Add Payment Method"}
            </h4>
            <form onSubmit={(e) => handleSubmitPaymentMethod(e, newMethod)}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">
                    {language === "vi" ? "Loại phương thức" : "Method Type"}
                  </Label>
                  <select
                    id="type"
                    name="type"
                    value={newMethod.type}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="credit_card">
                      {language === "vi" ? "Thẻ tín dụng" : "Credit Card"}
                    </option>
                    <option value="bank_transfer">
                      {language === "vi"
                        ? "Chuyển khoản ngân hàng"
                        : "Bank Transfer"}
                    </option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="name">
                    {language === "vi" ? "Tên phương thức" : "Method Name"}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newMethod.name}
                    onChange={handleInputChange}
                    placeholder={
                      language === "vi"
                        ? "Nhập tên phương thức"
                        : "Enter method name"
                    }
                  />
                </div>
                {newMethod.type === "credit_card" && (
                  <>
                    <div>
                      <Label htmlFor="last4">
                        {language === "vi" ? "4 số cuối" : "Last 4 Digits"}
                      </Label>
                      <Input
                        id="last4"
                        name="last4"
                        value={newMethod.last4}
                        onChange={handleInputChange}
                        placeholder="1234"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiryDate">
                        {language === "vi" ? "Ngày hết hạn" : "Expiry Date"}
                      </Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        value={newMethod.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                      />
                    </div>
                  </>
                )}
                <Button type="submit" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  {language === "vi" ? "Thêm phương thức" : "Add Method"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
