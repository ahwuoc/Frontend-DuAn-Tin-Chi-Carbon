"use client"
import Image from "next/image"
import { X } from "lucide-react"
import { useLanguage } from "@/context/language-context"

interface TreeDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  ownerName: string
  treeId: string
  realTreeImage?: string
  projectInfo?: {
    name: string
    location: string
    description: string
    plantedDate: string
  }
}

export default function TreeDetailsModal({
  isOpen,
  onClose,
  ownerName,
  treeId,
  realTreeImage = "/solitary-oak.png",
  projectInfo = {
    name: "Dự án trồng rừng",
    location: "Tỉnh Lào Cai, Việt Nam",
    description: "Dự án trồng rừng nhằm phục hồi hệ sinh thái và giảm thiểu tác động của biến đổi khí hậu.",
    plantedDate: "15/04/2023",
  },
}: TreeDetailsModalProps) {
  const { language } = useLanguage()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">
            {language === "vi" ? "Chi tiết cây của " : "Tree details for "} {ownerName}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                <Image
                  src={realTreeImage || "/placeholder.svg"}
                  alt={`${language === "vi" ? "Cây thật của" : "Real tree for"} ${ownerName}`}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 italic">
                {language === "vi" ? "Hình ảnh thực tế của cây" : "Actual image of the tree"}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                {language === "vi" ? "Thông tin dự án" : "Project Information"}
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="font-medium">{language === "vi" ? "Tên dự án:" : "Project name:"}</p>
                  <p>{language === "vi" ? projectInfo.name : "Reforestation Project"}</p>
                </div>

                <div>
                  <p className="font-medium">{language === "vi" ? "Vị trí:" : "Location:"}</p>
                  <p>{language === "vi" ? projectInfo.location : "Lao Cai Province, Vietnam"}</p>
                </div>

                <div>
                  <p className="font-medium">{language === "vi" ? "Mô tả:" : "Description:"}</p>
                  <p>
                    {language === "vi"
                      ? projectInfo.description
                      : "Reforestation project aimed at restoring ecosystems and mitigating climate change impacts."}
                  </p>
                </div>

                <div>
                  <p className="font-medium">{language === "vi" ? "Ngày trồng:" : "Planting date:"}</p>
                  <p>{projectInfo.plantedDate}</p>
                </div>

                <div>
                  <p className="font-medium">{language === "vi" ? "ID cây:" : "Tree ID:"}</p>
                  <p>{treeId}</p>
                </div>

                <div>
                  <p className="font-medium">{language === "vi" ? "Người đóng góp:" : "Contributor:"}</p>
                  <p>{ownerName}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-800">
                  {language === "vi"
                    ? "Cảm ơn bạn đã đóng góp cho dự án trồng cây. Mỗi cây xanh góp phần làm giảm 21kg CO2 mỗi năm."
                    : "Thank you for contributing to the tree planting project. Each tree helps reduce 21kg of CO2 annually."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
