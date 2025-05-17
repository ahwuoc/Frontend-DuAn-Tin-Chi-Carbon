"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { ChevronDown, ChevronUp, Trees } from "lucide-react";
import type { Contributor } from "@/lib/types";

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
  const [isOpen, setIsOpen] = useState(false);


  const totalContributed = contributors.reduce(
    (sum, contributor) => sum + contributor.quantity,
    0,
  );
  return (
    <div className="absolute top-20 right-4 w-80 bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-xl z-10 border border-emerald-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-emerald-800 flex items-center gap-2">
          <Trees className="text-emerald-600" size={20} />
          Forest Stats 🌴
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
          <p className="text-emerald-800 font-medium">Tổng số cây đóng góp:</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">
            {totalStats.totalQuantity} cây
          </p>
          <p className="text-sm text-emerald-600 mt-1">
            Từ {totalStats.contributorCount} nhà hảo tâm
          </p>
          <p className="text-sm text-emerald-600">
            Cây đã trồng: {totalStats.totalTreeCount}
          </p>
        </div>

        {/* Danh sách người đóng góp */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <CollapsibleTrigger className="flex w-full items-center justify-between p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            <span className="font-medium">
              Danh sách người đóng góp ({contributors.length})
            </span>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-2">
            <ScrollArea className="h-60 rounded-md border border-emerald-100 p-2">
              <div className="space-y-2">
                {contributors.map((contributor) => (
                  <div
                    key={contributor._id}
                    className="p-2 bg-emerald-50 rounded-md flex justify-between items-center"
                  >
                    <span className="font-medium text-emerald-800 truncate">
                      {contributor.name}
                    </span>
                    <span className="text-sm bg-emerald-100 px-2 py-1 rounded-full text-emerald-700">
                      {contributor.quantity} cây
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
