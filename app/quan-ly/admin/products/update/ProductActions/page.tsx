import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    ChartPie,
    RefreshCw,
    Clock,
    Gift,
    Settings,
    Star,
    ArrowRight,
} from "lucide-react";

// Tách ra ngoài cho dễ quản lý
const relatedActionsData = [
    { href: "report", icon: <ChartPie />, label: "Báo cáo dự án" },
    { href: "credit", icon: <RefreshCw />, label: "Cập nhật tín chỉ" },
    { href: "timeline", icon: <Clock />, label: "Dòng thời gian" },
    { href: "benefits", icon: <Gift />, label: "Lợi ích" },
    { href: "feature", icon: <Settings />, label: "Tính năng" },
    { href: "certificate", icon: <Star />, label: "Chứng chỉ", outline: false },
];

type Props = {
    id: string;
    carbonCredit?: {
        type?: string;
    };
};

export default function RelatedActions({ id, carbonCredit }: Props) {
    return (
        <div>
            <h3 className="text-lg font-semibold text-center mb-6">Chức năng liên quan</h3>
            <div className="flex flex-col gap-3 max-w-md mx-auto">
                {relatedActionsData.map(({ href, icon, label, outline }) => (
                    <Button
                        key={href}
                        asChild
                        size="sm"
                        className={
                            outline
                                ? "w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                                : "w-full bg-green-600 hover:bg-green-700 text-white"
                        }
                    >
                        <Link
                            href={`/quan-ly/admin/products/update/${carbonCredit?.type || "default"}/${id}/${href}`}
                            className="flex items-center justify-between px-4"
                        >
                            <span className="flex items-center gap-2">
                                {React.cloneElement(icon, { className: "h-4 w-4" })}
                                {label}
                            </span>
                            <ArrowRight
                                className={outline ? "h-4 w-4 text-green-600" : "h-4 w-4 text-green-200"}
                            />
                        </Link>
                    </Button>
                ))}
            </div>
        </div>
    );
}
