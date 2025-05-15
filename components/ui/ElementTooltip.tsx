"use client"

import { Html } from "@react-three/drei"
import { Trees, Leaf, Droplets, Compass, Users, X } from "lucide-react"
import type { ForestElement } from "@/lib/types"

interface ElementTooltipProps {
  element: ForestElement
  onClose: () => void
}

export function ElementTooltip({ element, onClose }: ElementTooltipProps) {
  return (
    <Html position={element.position}>
      <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-xl text-sm w-56 transform -translate-x-1/2 -translate-y-full mb-2 border border-emerald-100 select-none pointer-events-auto">
        <h3 className="font-bold text-emerald-800 flex items-center gap-2">
          {element.type.includes("Thông") && <Trees size={16} className="text-emerald-600" />}
          {element.type.includes("Cọ") && <Trees size={16} className="text-emerald-600" />}
          {element.type.includes("Chuối") && <Leaf size={16} className="text-emerald-600" />}
          {element.type.includes("Gù Hương") && <Trees size={16} className="text-emerald-600" />}
          {element.type.includes("Tre") && <Trees size={16} className="text-emerald-600" />}
          {element.type.includes("Đa") && <Trees size={16} className="text-emerald-600" />}
          {element.type.includes("Hồ") && <Droplets size={16} className="text-blue-600" />}
          {element.type.includes("Đường") && <Compass size={16} className="text-amber-600" />}
          {element.type}
        </h3>
        <p className="text-gray-700 mt-1">{element.description}</p>
        {element.contributor && (
          <div className="mt-2 pt-2 border-t border-emerald-100">
            <p className="font-medium text-emerald-700 flex items-center gap-1.5">
              <Users size={14} className="text-emerald-600" />
              Người đóng góp:
            </p>
            <div className="mt-1 bg-emerald-50 p-2 rounded-md">
              <p className="font-medium text-emerald-800">{element.contributor.name}</p>
              <p className="text-xs text-emerald-600 flex items-center gap-1 mt-0.5">
                <Trees size={12} />
                Đã trồng {element.contributor.trees} cây
              </p>
            </div>
          </div>
        )}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 transition-colors"
          onClick={onClose}
        >
          <X size={14} />
        </button>
      </div>
    </Html>
  )
}
