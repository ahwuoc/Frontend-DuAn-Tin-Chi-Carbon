import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        <h3 className="text-lg font-medium text-gray-900">Đang tải...</h3>
      </div>
    </div>
  )
}
