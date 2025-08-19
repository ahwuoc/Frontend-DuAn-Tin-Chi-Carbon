"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { forbiddenLanguage } from "./language";
import { useLocalLanguage } from "@/hooks/use-local-language";

export default function ForbiddenPage() {
    const { lang } = useLocalLanguage(forbiddenLanguage);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-600 dark:text-red-500">
                    {lang.title}
                </h1>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-4">
                    {lang.heading}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {lang.description}
                </p>
                <div className="mt-6">
                    <Link href="/" passHref>
                        <Button>
                            {lang.backButton}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}