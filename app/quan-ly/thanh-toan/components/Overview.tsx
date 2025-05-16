import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Invoice, IAffiliatePaymentMethod, IAffiliateDetail, Subscription } from "../type";
const Overview = ({
    user,
    invoices,
    subscriptions,
    paymentMethods,
    setActiveTab,
    formatDate,
    getInvoiceStatusBadge,
    getSubscriptionStatusBadge,
    getPaymentMethodIcon,
    getBillingCycleName,
}: {
    user: any;
    invoices: Invoice[];
    subscriptions: Subscription[];
    paymentMethods: IAffiliatePaymentMethod[];
    setActiveTab: (value: string) => void;
    formatDate: (date: string) => string;
    getInvoiceStatusBadge: (status: Invoice["status"]) => React.ReactNode;
    getSubscriptionStatusBadge: (status: Subscription["status"]) => React.ReactNode;
    getPaymentMethodIcon: (type: string) => React.ReactNode;
    getBillingCycleName: (cycle: Subscription["billingCycle"]) => string;
}) => (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Hóa đơn gần đây</CardTitle>
            </CardHeader>
            <CardContent>
                {invoices.length > 0 ? (
                    invoices.slice(0, 3).map((invoice) => (
                        <div key={invoice.id} className="p-4 border rounded-lg mb-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-medium">{invoice.amount.toLocaleString("vi-VN")} đ</h4>
                                    <p className="text-sm text-gray-500">
                                        Ngày đến hạn: {formatDate(invoice.dueDate)}
                                    </p>
                                </div>
                                {getInvoiceStatusBadge(invoice.status)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-center text-gray-500 border rounded-lg">
                        Không có hóa đơn gần đây.
                    </div>
                )}
                <Button variant="link" onClick={() => setActiveTab("invoices")}>
                    Xem tất cả hóa đơn
                </Button>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
                {paymentMethods.length > 0 ? (
                    paymentMethods.slice(0, 2).map((method) => (
                        <div key={method.id} className="p-4 border rounded-lg mb-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    {getPaymentMethodIcon(method.type)}
                                    <div className="ml-3">
                                        <h4 className="font-medium">{method.name || method.type}</h4>
                                        {method.type === "bank_transfer" && method.details && (
                                            <div className="text-sm text-gray-500">
                                                <p>Ngân hàng: {(method.details as IAffiliateDetail).bankName}</p>
                                                <p>Số tài khoản: {(method.details as IAffiliateDetail).accountNumber}</p>
                                            </div>
                                        )}
                                        {method.type === "paypal" && method.details && (
                                            <p className="text-sm text-gray-500">
                                                Email: {(method.details as { email: string }).email}
                                            </p>
                                        )}
                                        {method.type === "other" && method.details && (
                                            <p className="text-sm text-gray-500">
                                                Mô tả: {(method.details as { description: string }).description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {method.isDefault && <Badge variant="outline">Mặc định</Badge>}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-center text-gray-500 border rounded-lg">
                        Không có phương thức thanh toán.
                    </div>
                )}
                <Button variant="link" onClick={() => setActiveTab("payment_methods")}>
                    Quản lý phương thức
                </Button>
            </CardContent>
        </Card>
    </div>
);

export default Overview;