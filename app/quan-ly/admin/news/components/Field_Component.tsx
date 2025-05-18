import { Label } from "@radix-ui/react-label";


interface FieldProps {
    label: string;
    children: React.ReactNode;
    htmlFor?: string;
    required?: boolean;
    icon?: React.ReactNode;
    className?: string;
}

export function Field({ label, children, htmlFor, required, icon, className }: FieldProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            {/* Logic hiển thị icon */}
            <Label htmlFor={htmlFor} className="text-sm font-medium text-gray-700 flex items-center">
                {icon && <span className="mr-2 text-green-600">{icon}</span>}
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </Label>
            {/* Logic hiển thị children */}
            {children}
        </div>
    );
}