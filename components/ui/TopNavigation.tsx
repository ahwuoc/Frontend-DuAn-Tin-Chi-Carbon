"use client"

import type React from "react"

import { useState, type KeyboardEvent } from "react"
import { Trees, Sun, Moon, Info, Users, Search, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface TopNavigationProps {
  isNight: boolean
  setIsNight: (value: boolean) => void
  showInfo: boolean
  setShowInfo: (value: boolean) => void
  showNames: boolean
  setShowNames: (value: boolean) => void
  onSearch: (query: string) => void
  searchQuery: string
}

export function TopNavigation({
  isNight,
  setIsNight,
  showInfo,
  setShowInfo,
  showNames,
  setShowNames,
  onSearch,
  searchQuery,
}: TopNavigationProps) {
  const [inputValue, setInputValue] = useState(searchQuery)
  const [searchStatus, setSearchStatus] = useState<"idle" | "notFound" | "found">("idle")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    if (e.target.value === "") {
      setSearchStatus("idle")
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      performSearch()
    }
  }

  const handleSearchClick = () => {
    performSearch()
  }

  const performSearch = () => {
    if (!inputValue.trim()) {
      setSearchStatus("idle")
      onSearch("")
      return
    }

    // Pass the search to parent component
    onSearch(inputValue)

    // Set search status based on whether we found something
    // This is a simple approximation - in a real app, you'd get this from the search result
    setTimeout(() => {
      // We'll assume the search was successful if the query is at least 3 chars
      // In a real app, this would be based on actual search results
      setSearchStatus(inputValue.length >= 3 ? "found" : "notFound")
    }, 100)
  }

  return (
    <div className="absolute top-0 left-0 right-0 bg-white/80 backdrop-blur-md p-3 flex justify-between items-center shadow-md z-10 border-b border-emerald-100">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-600 text-white p-2 rounded-lg">
          <Trees size={20} />
        </div>
        <div>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-800 font-semibold border-emerald-200">
            Tropical Forest Explorer
          </Badge>
          <p className="text-xs text-emerald-700 mt-0.5">Khám phá khu rừng nhiệt đới</p>
        </div>
      </div>

      <div className="flex-1 mx-4 max-w-xs">
        <div className="relative">
          <Input
            type="text"
            placeholder="Tìm người đóng góp..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={`pl-9 pr-${inputValue ? "24" : "4"} py-1 h-9 text-sm ${
              searchStatus === "notFound"
                ? "border-red-500 focus-visible:ring-red-500"
                : searchStatus === "found"
                  ? "border-green-500 focus-visible:ring-green-500"
                  : ""
            }`}
          />
          <Search size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
          {inputValue && (
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-10 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              onClick={() => {
                setInputValue("")
                setSearchStatus("idle")
                onSearch("")
              }}
            >
              <X size={14} />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            onClick={handleSearchClick}
          >
            Tìm
          </Button>

          {searchStatus === "notFound" && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-red-50 text-red-700 text-xs p-1 rounded border border-red-200 flex items-center">
              <AlertCircle size={12} className="mr-1" />
              Không tìm thấy người đóng góp
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-1.5 transition-all duration-300 ${
            isNight
              ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200"
              : "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200"
          }`}
          onClick={() => setIsNight(!isNight)}
        >
          {isNight ? <Moon size={14} /> : <Sun size={14} />}
          {isNight ? "Night" : "Day"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200"
          onClick={() => setShowInfo(!showInfo)}
        >
          <Info size={14} />
          Info
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200"
          onClick={() => setShowNames(!showNames)}
        >
          <Users size={14} />
          {showNames ? "Hide Names" : "Show Names"}
        </Button>
      </div>
    </div>
  )
}
