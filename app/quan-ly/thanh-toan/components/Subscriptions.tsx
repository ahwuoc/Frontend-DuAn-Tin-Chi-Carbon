import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Subscription } from "../type";
import { CardTitle } from "@/components/ui/card";
const Subscriptions = ({
    subscriptions,
    formatDate,
    getSubscriptionStatusBadge,
    getBillingCycleName,
    router,
}: {
    subscriptions: Subscription[];
    formatDate: (date: string) => string;
    getSubscriptionStatusBadge: (status: Subscription["status"]) => React.ReactNode;
    getBillingCycleName: (cycle: Subscription["billingCycle"]) => string;
    router: any;
}) => (
    <Card>
        <CardHeader>
            <CardTitle>Đăng ký</CardTitle>
        </CardHeader>
        <CardContent>
            {subscriptions.length > 0 ? (
                subscriptions.map((sub) => (
                    <div key={sub.id} className="p-4 border rounded-lg mb-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">{sub.planName}</h4>
                                <p className="text-sm text-gray-500">
                                    Chu kỳ: {getBillingCycleName(sub.billingCycle)} | Kế tiếp: {formatDate(sub.nextBillingDate)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {getSubscriptionStatusBadge(sub.status)}
                                <Button variant="outline" size="sm" onClick={() => router.push(`/subscriptions/${sub.id}`)}>
                                    Chi tiết
                                </Button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-4 text-center text-gray-500 border rounded-lg">
                    Bạn chưa có đăng ký nào.
                </div>
            )}
        </CardContent>
    </Card>
);

export default Subscriptions;