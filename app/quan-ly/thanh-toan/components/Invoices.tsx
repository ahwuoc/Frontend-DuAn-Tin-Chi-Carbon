import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Invoice } from "../type";
import { CardTitle } from "@/components/ui/card";
const Invoices = ({
    invoices,
    formatDate,
    getInvoiceStatusBadge,
}: {
    invoices: Invoice[];
    formatDate: (date: string) => string;
    getInvoiceStatusBadge: (status: Invoice["status"]) => React.ReactNode;
}) => (
    <Card>
        <CardHeader>
            <CardTitle>Hóa đơn</CardTitle>
        </CardHeader>
        <CardContent>
            {invoices.length > 0 ? (
                invoices.map((invoice) => (
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
                    Bạn chưa có hóa đơn nào.
                </div>
            )}
        </CardContent>
    </Card>
);

export default Invoices;