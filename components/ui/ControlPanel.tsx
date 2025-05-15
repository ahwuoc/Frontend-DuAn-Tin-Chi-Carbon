"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Minimize, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ControlPanelProps {
  minimizePanel: boolean;
  setMinimizePanel: (value: boolean) => void;
  setShowUI: (value: boolean) => void;
}

export function ControlPanel({
  minimizePanel,
  setMinimizePanel,
  setShowUI,
}: ControlPanelProps) {
  const [keyboardControlsOpen, setKeyboardControlsOpen] = useState(false);

  return (
    <div
      className={`absolute ${
        minimizePanel ? "bottom-10 left-0 right-0" : "bottom-4 left-4 w-80"
      } bg-white/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden transition-all duration-300 border border-emerald-100 z-10`}
    >
      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <h3 className="font-semibold">Hướng dẫn di chuyển</h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-white hover:text-white hover:bg-emerald-700/50 rounded-full"
            onClick={() => setMinimizePanel(!minimizePanel)}
          >
            {minimizePanel ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-white hover:text-white hover:bg-emerald-700/50 rounded-full"
            onClick={() => setShowUI(false)}
          >
            <Minimize size={14} />
          </Button>
        </div>
      </div>
      {!minimizePanel && (
        <div className="p-4">
          <div className="space-y-3 text-sm">
            <Collapsible
              open={keyboardControlsOpen}
              onOpenChange={setKeyboardControlsOpen}
              className="border border-emerald-100 rounded-lg overflow-hidden"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between p-3 bg-emerald-50 hover:bg-emerald-100 transition-colors">
                <div className="flex items-center gap-2">
                  <Keyboard size={16} className="text-emerald-600" />
                  <span className="font-medium text-emerald-800">
                    Điều khiển bàn phím
                  </span>
                </div>
                {keyboardControlsOpen ? (
                  <ChevronUp size={16} className="text-emerald-600" />
                ) : (
                  <ChevronDown size={16} className="text-emerald-600" />
                )}
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="p-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 p-2 rounded-lg">
                      <p className="font-semibold text-emerald-800 mb-1">
                        Di chuyển:
                      </p>
                      <ul className="space-y-1 text-gray-700">
                        <li className="flex items-center gap-1">
                          <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                            W
                          </span>{" "}
                          /
                          <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                            ↑
                          </span>
                          - Tiến
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                            S
                          </span>{" "}
                          /
                          <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                            ↓
                          </span>
                          - Lùi
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                            A
                          </span>{" "}
                          /
                          <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                            ←
                          </span>
                          - Trái
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                            D
                          </span>{" "}
                          /
                          <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                            →
                          </span>
                          - Phải
                        </li>
                      </ul>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-lg">
                      <p className="font-semibold text-emerald-800 mb-1">
                        Độ cao:
                      </p>
                      <ul className="space-y-1 text-gray-700">
                        <li className="flex items-center gap-1">
                          <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                            E
                          </span>
                          - Lên
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                            Q
                          </span>
                          - Xuống
                        </li>
                      </ul>
                      <p className="font-semibold text-emerald-800 mt-2 mb-1">
                        Tốc độ:
                      </p>
                      <ul className="space-y-1 text-gray-700">
                        <li className="flex items-center gap-1">
                          <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                            Shift
                          </span>
                          - Chạy
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="bg-emerald-50 p-3 rounded-lg">
              <p className="font-semibold text-emerald-800 mb-1">
                Điều khiển chuột:
              </p>
              <ul className="space-y-1 text-gray-700">
                <li>Kéo chuột - Nhìn xung quanh</li>
                <li>Giữ chuột phải - Phóng to</li>
                <li>Cuộn chuột - Phóng to/thu nhỏ</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
