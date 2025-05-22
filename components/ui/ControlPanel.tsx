"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Minimize, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLanguage } from "@/context/language-context"; // Import useLanguage hook
import controlPanelTranslations from "../language-gopcay/control-panel-language";

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
  const { language } = useLanguage(); // Lấy ngôn ngữ hiện tại
  const [keyboardControlsOpen, setKeyboardControlsOpen] = useState(false);

  return (
    <div
      className={`absolute ${
        minimizePanel ? "bottom-10 left-0 right-0" : "bottom-4 left-4 w-80"
      } bg-white/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden transition-all duration-300 border border-emerald-100 z-10`}
    >
      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <h3 className="font-semibold">
          {controlPanelTranslations.panelTitle[language]}
        </h3>
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
                    {controlPanelTranslations.keyboardControls.title[language]}
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
                        {
                          controlPanelTranslations.keyboardControls.movement
                            .title[language]
                        }
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
                          -{" "}
                          {
                            controlPanelTranslations.keyboardControls.movement
                              .forward[language]
                          }
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                            S
                          </span>{" "}
                          /
                          <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                            ↓
                          </span>
                          -{" "}
                          {
                            controlPanelTranslations.keyboardControls.movement
                              .backward[language]
                          }
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                            A
                          </span>{" "}
                          /
                          <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                            ←
                          </span>
                          -{" "}
                          {
                            controlPanelTranslations.keyboardControls.movement
                              .left[language]
                          }
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                            D
                          </span>{" "}
                          /
                          <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                            →
                          </span>
                          -{" "}
                          {
                            controlPanelTranslations.keyboardControls.movement
                              .right[language]
                          }
                        </li>
                      </ul>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-lg">
                      <p className="font-semibold text-emerald-800 mb-1">
                        {
                          controlPanelTranslations.keyboardControls.height
                            .title[language]
                        }
                      </p>
                      <ul className="space-y-1 text-gray-700">
                        <li className="flex items-center gap-1">
                          <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                            E
                          </span>
                          -{" "}
                          {
                            controlPanelTranslations.keyboardControls.height.up[
                              language
                            ]
                          }
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                            Q
                          </span>
                          -{" "}
                          {
                            controlPanelTranslations.keyboardControls.height
                              .down[language]
                          }
                        </li>
                      </ul>
                      <p className="font-semibold text-emerald-800 mt-2 mb-1">
                        {
                          controlPanelTranslations.keyboardControls.speed.title[
                            language
                          ]
                        }
                      </p>
                      <ul className="space-y-1 text-gray-700">
                        <li className="flex items-center gap-1">
                          <span className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-xs font-medium">
                            Shift
                          </span>
                          -{" "}
                          {
                            controlPanelTranslations.keyboardControls.speed.run[
                              language
                            ]
                          }
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="bg-emerald-50 p-3 rounded-lg">
              <p className="font-semibold text-emerald-800 mb-1">
                {controlPanelTranslations.mouseControls.title[language]}
              </p>
              <ul className="space-y-1 text-gray-700">
                <li>
                  {controlPanelTranslations.mouseControls.lookAround[language]}
                </li>
                <li>
                  {controlPanelTranslations.mouseControls.zoomIn[language]}
                </li>
                <li>
                  {controlPanelTranslations.mouseControls.zoomInOut[language]}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
