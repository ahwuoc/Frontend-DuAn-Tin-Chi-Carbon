import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useLanguage } from "@/context/language-context"; // Import language hook
import emptyStateTranslations from "./langaue-empty-state";

interface EmptyStateProps {
  resetFilters: () => void;
}

export function EmptyState({ resetFilters }: EmptyStateProps) {
  const { language } = useLanguage(); // Get current language

  return (
    <div className="text-center py-12 bg-white rounded-lg border">
      <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {emptyStateTranslations.title[language]}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {emptyStateTranslations.description[language]}
      </p>
      <Button
        onClick={resetFilters}
        className="bg-green-600 hover:bg-green-700"
      >
        {emptyStateTranslations.button[language]}
      </Button>
    </div>
  );
}
