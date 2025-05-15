"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, Home, ShoppingBag } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export default function CarbonCalculator() {
  const { language, t } = useLanguage()
  const [activeTab, setActiveTab] = useState("transport")
  const [transportValues, setTransportValues] = useState({
    carKm: 50,
    flightHours: 2,
  })
  const [homeValues, setHomeValues] = useState({
    electricityKwh: 200,
    gasM3: 50,
  })
  const [foodValues, setFoodValues] = useState({
    meatConsumption: 3, // 0-7 days per week
    localFood: 50, // percentage
  })
  const [result, setResult] = useState<number | null>(null)

  const calculateCarbon = () => {
    // Simple calculation for demonstration
    const transportEmissions = transportValues.carKm * 0.12 + transportValues.flightHours * 90
    const homeEmissions = homeValues.electricityKwh * 0.5 + homeValues.gasM3 * 2
    const foodEmissions = foodValues.meatConsumption * 5 + (100 - foodValues.localFood) * 0.2

    const totalEmissions = transportEmissions + homeEmissions + foodEmissions
    setResult(Math.round(totalEmissions * 100) / 100)
  }

  // Translations
  const translations = {
    title: {
      vi: "Tính toán Carbon Footprint",
      en: "Carbon Footprint Calculator",
    },
    description: {
      vi: "Ước tính lượng khí thải carbon của bạn với công cụ tính toán đơn giản này",
      en: "Estimate your carbon emissions with this simple calculator",
    },
    transport: {
      vi: "Giao thông",
      en: "Transport",
    },
    home: {
      vi: "Nhà ở",
      en: "Home",
    },
    food: {
      vi: "Thực phẩm",
      en: "Food",
    },
    carKm: {
      vi: "Số km lái xe mỗi tuần",
      en: "Weekly car kilometers",
    },
    flightHours: {
      vi: "Số giờ bay mỗi năm",
      en: "Flight hours per year",
    },
    electricity: {
      vi: "Tiêu thụ điện hàng tháng (kWh)",
      en: "Monthly electricity consumption (kWh)",
    },
    gas: {
      vi: "Tiêu thụ gas hàng tháng (m³)",
      en: "Monthly gas consumption (m³)",
    },
    meat: {
      vi: "Số ngày ăn thịt mỗi tuần",
      en: "Days eating meat per week",
    },
    localFood: {
      vi: "Tỷ lệ thực phẩm địa phương (%)",
      en: "Local food percentage (%)",
    },
    calculate: {
      vi: "Tính toán",
      en: "Calculate",
    },
    estimatedEmissions: {
      vi: "Ước tính lượng khí thải CO₂ của bạn:",
      en: "Your estimated CO₂ emissions:",
    },
    perMonth: {
      vi: "kg CO₂e/tháng",
      en: "kg CO₂e/month",
    },
    disclaimer: {
      vi: "Đây chỉ là ước tính đơn giản. Liên hệ với chúng tôi để có đánh giá chi tiết hơn.",
      en: "This is just a simple estimate. Contact us for a more detailed assessment.",
    },
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-500 hover:shadow-xl">
      <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">
        {language === "vi" ? translations.title.vi : translations.title.en}
      </h3>
      <p className="text-gray-600 mb-6 text-center">
        {language === "vi" ? translations.description.vi : translations.description.en}
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="transport" className="flex items-center gap-2">
            <Car className="h-4 w-4" /> {language === "vi" ? translations.transport.vi : translations.transport.en}
          </TabsTrigger>
          <TabsTrigger value="home" className="flex items-center gap-2">
            <Home className="h-4 w-4" /> {language === "vi" ? translations.home.vi : translations.home.en}
          </TabsTrigger>
          <TabsTrigger value="food" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" /> {language === "vi" ? translations.food.vi : translations.food.en}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transport" className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="car-km">{language === "vi" ? translations.carKm.vi : translations.carKm.en}</Label>
              <span className="font-medium">{transportValues.carKm} km</span>
            </div>
            <Slider
              id="car-km"
              min={0}
              max={500}
              step={10}
              value={[transportValues.carKm]}
              onValueChange={(value) => setTransportValues({ ...transportValues, carKm: value[0] })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="flight-hours">
                {language === "vi" ? translations.flightHours.vi : translations.flightHours.en}
              </Label>
              <span className="font-medium">
                {transportValues.flightHours} {language === "vi" ? "giờ" : "hours"}
              </span>
            </div>
            <Slider
              id="flight-hours"
              min={0}
              max={50}
              step={1}
              value={[transportValues.flightHours]}
              onValueChange={(value) => setTransportValues({ ...transportValues, flightHours: value[0] })}
            />
          </div>
        </TabsContent>

        <TabsContent value="home" className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="electricity">
                {language === "vi" ? translations.electricity.vi : translations.electricity.en}
              </Label>
              <span className="font-medium">{homeValues.electricityKwh} kWh</span>
            </div>
            <Slider
              id="electricity"
              min={0}
              max={1000}
              step={10}
              value={[homeValues.electricityKwh]}
              onValueChange={(value) => setHomeValues({ ...homeValues, electricityKwh: value[0] })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="gas">{language === "vi" ? translations.gas.vi : translations.gas.en}</Label>
              <span className="font-medium">{homeValues.gasM3} m³</span>
            </div>
            <Slider
              id="gas"
              min={0}
              max={200}
              step={5}
              value={[homeValues.gasM3]}
              onValueChange={(value) => setHomeValues({ ...homeValues, gasM3: value[0] })}
            />
          </div>
        </TabsContent>

        <TabsContent value="food" className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="meat">{language === "vi" ? translations.meat.vi : translations.meat.en}</Label>
              <span className="font-medium">
                {foodValues.meatConsumption} {language === "vi" ? "ngày" : "days"}
              </span>
            </div>
            <Slider
              id="meat"
              min={0}
              max={7}
              step={1}
              value={[foodValues.meatConsumption]}
              onValueChange={(value) => setFoodValues({ ...foodValues, meatConsumption: value[0] })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="local-food">
                {language === "vi" ? translations.localFood.vi : translations.localFood.en}
              </Label>
              <span className="font-medium">{foodValues.localFood}%</span>
            </div>
            <Slider
              id="local-food"
              min={0}
              max={100}
              step={5}
              value={[foodValues.localFood]}
              onValueChange={(value) => setFoodValues({ ...foodValues, localFood: value[0] })}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button onClick={calculateCarbon} className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
          {language === "vi" ? translations.calculate.vi : translations.calculate.en}
        </Button>
      </div>

      {result !== null && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 text-center">
          <p className="text-gray-700 mb-2">
            {language === "vi" ? translations.estimatedEmissions.vi : translations.estimatedEmissions.en}
          </p>
          <p className="text-3xl font-bold text-green-700">
            {result}{" "}
            <span className="text-xl">{language === "vi" ? translations.perMonth.vi : translations.perMonth.en}</span>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {language === "vi" ? translations.disclaimer.vi : translations.disclaimer.en}
          </p>
        </div>
      )}
    </div>
  )
}
