"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Trees } from "lucide-react";
import type { Contributor } from "@/lib/types";
import { useLanguage } from "@/context/language-context"; // Import useLanguage hook
import infoPanelTranslations from "../language-gopcay/info-panel-language";

interface InfoPanelProps {
  treeCount: number;
  contributors: Contributor[];
  totalStats: {
    totalQuantity: number;
    totalTreeCount: number;
    contributorCount: number;
  };
  onClose: () => void;
}

export function InfoPanel({
  treeCount,
  contributors,
  totalStats,
  onClose,
}: InfoPanelProps) {
  const { language } = useLanguage(); // Lấy ngôn ngữ hiện tại
  const [isOpen, setIsOpen] = useState(false);

  const totalTrees = contributors.reduce(
    (total, item) => total + item.trees,
    0,
  );

  return (
    <div className="absolute top-20 right-4 w-80 bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-xl z-10 border border-emerald-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-emerald-800 flex items-center gap-2">
          <Trees className="text-emerald-600" size={20} />
          {infoPanelTranslations.panelTitle[language]}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full hover:bg-emerald-100"
          onClick={onClose}
        >
          <X size={14} />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Tổng quan từ totalStats */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-100">
          <p className="text-emerald-800 font-medium">
            {infoPanelTranslations.totalTreesContributed.label[language]}
          </p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">
            {totalTrees}{" "}
            {infoPanelTranslations.totalTreesContributed.unit[language]}
          </p>
          <p className="text-sm text-emerald-600 mt-1">
            {infoPanelTranslations.fromContributors[language](
              contributors.length,
            )}
          </p>
          <p className="text-sm text-emerald-600">
            {infoPanelTranslations.plantedTrees.label[language]}{" "}
            {totalStats.totalTreeCount}
          </p>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <CollapsibleTrigger className="flex w-full items-center justify-between p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            <span className="font-medium">
              {infoPanelTranslations.contributorsList.title[language](
                contributors.length,
              )}
            </span>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-2">
            <ScrollArea className="h-60 rounded-md border border-emerald-100 p-2">
              <div className="space-y-2">
                {contributors.map((contributor) => (
                  <div
                    key={contributor.id}
                    className="p-2 bg-emerald-50 rounded-md flex justify-between items-center"
                  >
                    <span className="font-medium text-emerald-800 truncate">
                      {contributor.name}
                    </span>
                    <span className="text-sm bg-emerald-100 px-2 py-1 rounded-full text-emerald-700">
                      {contributor.trees}{" "}
                      {
                        infoPanelTranslations.contributorsList.treeUnit[
                          language
                        ]
                      }
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
