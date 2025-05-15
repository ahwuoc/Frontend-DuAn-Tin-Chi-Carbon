"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { useLanguage } from "@/context/language-context"

interface IslandDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  ownerName: string
  treeId: string
}

export default function IslandDetailsModal({ isOpen, onClose, ownerName, treeId }: IslandDetailsModalProps) {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState<"info" | "photos">("info")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold">
            {language === "vi" ? "Chi tiết hòn đảo" : "Island Details"} - {ownerName} (ID: {treeId})
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "info" ? "border-b-2 border-green-600 text-green-600" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("info")}
          >
            {language === "vi" ? "Thông tin dự án" : "Project Info"}
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "photos" ? "border-b-2 border-green-600 text-green-600" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("photos")}
          >
            {language === "vi" ? "Hình ảnh thực tế" : "Real Photos"}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "info" ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold mb-2">
                  {language === "vi" ? "Thông tin dự án" : "Project Information"}
                </h4>
                <p className="text-gray-700">
                  {language === "vi"
                    ? "Dự án trồng rừng này được thực hiện tại khu vực miền núi phía Bắc Việt Nam, nơi có nhu cầu tái trồng rừng cao. Mỗi cây xanh được trồng sẽ góp phần giảm thiểu tác động của biến đổi khí hậu và tạo ra môi trường sống tốt hơn cho các thế hệ tương lai."
                    : "This reforestation project is carried out in the mountainous region of Northern Vietnam, where there is a high need for reforestation. Each tree planted will help mitigate the impacts of climate change and create a better living environment for future generations."}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2">
                  {language === "vi" ? "Loại cây được trồng" : "Tree Species Planted"}
                </h4>
                <p className="text-gray-700">
                  {language === "vi"
                    ? "Cây Lim (Erythrophleum fordii): Là loài cây gỗ quý, có khả năng sinh trưởng tốt trong điều kiện khí hậu nhiệt đới, góp phần vào việc bảo tồn đa dạng sinh học và phát triển kinh tế địa phương."
                    : "Lim Tree (Erythrophleum fordii): A valuable timber species that grows well in tropical climate conditions, contributing to biodiversity conservation and local economic development."}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2">
                  {language === "vi" ? "Vị trí trồng cây" : "Planting Location"}
                </h4>
                <p className="text-gray-700">
                  {language === "vi"
                    ? "Tỉnh Hòa Bình, Việt Nam - Khu vực rừng đầu nguồn sông Đà, nơi có vai trò quan trọng trong việc điều tiết nguồn nước và bảo vệ đất."
                    : "Hoa Binh Province, Vietnam - Da River watershed forest area, which plays an important role in regulating water sources and protecting soil."}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2">
                  {language === "vi" ? "Tác động môi trường" : "Environmental Impact"}
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>
                    {language === "vi"
                      ? "Hấp thụ khoảng 21kg CO₂ mỗi năm"
                      : "Absorbs approximately 21kg of CO₂ annually"}
                  </li>
                  <li>
                    {language === "vi"
                      ? "Giảm xói mòn đất và ngăn chặn lũ lụt"
                      : "Reduces soil erosion and prevents flooding"}
                  </li>
                  <li>
                    {language === "vi" ? "Tạo môi trường sống cho động vật hoang dã" : "Creates habitat for wildlife"}
                  </li>
                  <li>
                    {language === "vi" ? "Cải thiện chất lượng không khí và nước" : "Improves air and water quality"}
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2">
                  {language === "vi" ? "Tác động xã hội" : "Social Impact"}
                </h4>
                <p className="text-gray-700">
                  {language === "vi"
                    ? "Dự án tạo công ăn việc làm cho người dân địa phương trong việc trồng và chăm sóc cây, đồng thời nâng cao nhận thức về bảo vệ môi trường và phát triển bền vững."
                    : "The project creates jobs for local people in planting and caring for trees, while raising awareness about environmental protection and sustainable development."}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700 italic">
                {language === "vi"
                  ? "Hình ảnh thực tế của cây sẽ được cập nhật sau khi cây được trồng. Dưới đây là một số hình ảnh minh họa từ dự án."
                  : "Real photos of the tree will be updated after the tree is planted. Below are some illustrative images from the project."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden">
                  <Image
                    src="/reforestation-project-1.jpg"
                    alt={language === "vi" ? "Dự án trồng rừng" : "Reforestation project"}
                    width={500}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {language === "vi" ? "Khu vực trồng cây mới" : "Newly planted area"}
                  </p>
                </div>

                <div className="rounded-lg overflow-hidden">
                  <Image
                    src="/reforestation-project-2.jpg"
                    alt={language === "vi" ? "Cây non mới trồng" : "Newly planted saplings"}
                    width={500}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {language === "vi" ? "Cây non sau 3 tháng" : "Saplings after 3 months"}
                  </p>
                </div>

                <div className="rounded-lg overflow-hidden">
                  <Image
                    src="/reforestation-project-3.jpg"
                    alt={language === "vi" ? "Hoạt động trồng cây" : "Tree planting activities"}
                    width={500}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {language === "vi" ? "Cộng đồng tham gia trồng cây" : "Community tree planting"}
                  </p>
                </div>

                <div className="rounded-lg overflow-hidden">
                  <Image
                    src="/reforestation-project-4.jpg"
                    alt={language === "vi" ? "Khu vực rừng phục hồi" : "Restored forest area"}
                    width={500}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {language === "vi" ? "Khu vực sau 2 năm trồng rừng" : "Area after 2 years of reforestation"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-500">
                {language === "vi" ? "Ngày đóng góp" : "Contribution date"}: 15/04/2023
              </span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              {language === "vi" ? "Đóng" : "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
