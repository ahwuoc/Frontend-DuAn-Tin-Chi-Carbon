"use client"

import Link from "next/link"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TreesIcon as Tree, Factory, Home, Info } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function CarbonCalculatorAdvanced() {
  const { language, t } = useLanguage()
  const [activeTab, setActiveTab] = useState("forest")
  const [loading, setLoading] = useState(false)

  // Forest calculation state
  const [forestValues, setForestValues] = useState({
    area: 10, // hectares
    age: 5, // years
    type: "pine",
    density: 1000, // trees per hectare
  })

  // Industry calculation state
  const [industryValues, setIndustryValues] = useState({
    electricityConsumption: 5000, // kWh per month
    fuelConsumption: 1000, // liters per month
    wasteProduction: 500, // kg per month
    employeeCount: 50,
  })

  // Personal calculation state
  const [personalValues, setPersonalValues] = useState({
    electricityConsumption: 200, // kWh per month
    carUsage: 100, // km per week
    flightHours: 10, // hours per year
    dietType: "mixed", // mixed, vegetarian, vegan
  })

  const [result, setResult] = useState<{
    value: number
    unit: string
    description: string
    potentialValue?: number
  } | null>(null)

  // Translations
  const translations = {
    title: {
      vi: "Công cụ tính toán Carbon",
      en: "Carbon Calculator Tool",
    },
    description: {
      vi: "Ước tính lượng carbon hấp thụ hoặc phát thải với công cụ tính toán chuyên nghiệp",
      en: "Estimate carbon sequestration or emissions with this professional calculator",
    },
    forest: {
      vi: "Rừng",
      en: "Forest",
    },
    industry: {
      vi: "Doanh nghiệp",
      en: "Industry",
    },
    personal: {
      vi: "Cá nhân",
      en: "Personal",
    },
    forestArea: {
      vi: "Diện tích rừng (ha)",
      en: "Forest area (ha)",
    },
    forestAreaTooltip: {
      vi: "Diện tích rừng tính bằng hecta (1 ha = 10.000 m²)",
      en: "Forest area measured in hectares (1 ha = 10,000 m²)",
    },
    forestAge: {
      vi: "Tuổi rừng (năm)",
      en: "Forest age (years)",
    },
    forestAgeTooltip: {
      vi: "Tuổi trung bình của cây trong khu rừng",
      en: "Average age of trees in the forest",
    },
    forestType: {
      vi: "Loại rừng",
      en: "Forest type",
    },
    pine: {
      vi: "Rừng thông",
      en: "Pine forest",
    },
    acacia: {
      vi: "Rừng keo",
      en: "Acacia forest",
    },
    eucalyptus: {
      vi: "Rừng bạch đàn",
      en: "Eucalyptus forest",
    },
    mixed: {
      vi: "Rừng hỗn giao",
      en: "Mixed forest",
    },
    forestDensity: {
      vi: "Mật độ (cây/ha)",
      en: "Density (trees/ha)",
    },
    forestDensityTooltip: {
      vi: "Số lượng cây trên một hecta",
      en: "Number of trees per hectare",
    },
    electricityConsumption: {
      vi: "Tiêu thụ điện hàng tháng (kWh)",
      en: "Monthly electricity consumption (kWh)",
    },
    fuelConsumption: {
      vi: "Tiêu thụ nhiên liệu hàng tháng (lít)",
      en: "Monthly fuel consumption (liters)",
    },
    wasteProduction: {
      vi: "Lượng chất thải hàng tháng (kg)",
      en: "Monthly waste production (kg)",
    },
    employeeCount: {
      vi: "Số lượng nhân viên",
      en: "Number of employees",
    },
    carUsage: {
      vi: "Số km lái xe mỗi tuần",
      en: "Weekly car kilometers",
    },
    flightHours: {
      vi: "Số giờ bay mỗi năm",
      en: "Flight hours per year",
    },
    dietType: {
      vi: "Chế độ ăn",
      en: "Diet type",
    },
    mixedDiet: {
      vi: "Ăn tạp (thịt, rau, cá...)",
      en: "Mixed diet (meat, vegetables, fish...)",
    },
    vegetarianDiet: {
      vi: "Ăn chay (có trứng, sữa)",
      en: "Vegetarian (with eggs, dairy)",
    },
    veganDiet: {
      vi: "Ăn thuần chay",
      en: "Vegan",
    },
    calculating: {
      vi: "Đang tính toán...",
      en: "Calculating...",
    },
    calculate: {
      vi: "Tính toán",
      en: "Calculate",
    },
    forestCO2Description: {
      vi: "Lượng CO₂ hấp thụ hàng năm của khu rừng",
      en: "Annual CO₂ absorption by the forest",
    },
    industryCO2Description: {
      vi: "Lượng phát thải CO₂ hàng năm của doanh nghiệp",
      en: "Annual CO₂ emissions by the industry",
    },
    personalCO2Description: {
      vi: "Lượng phát thải CO₂ hàng năm của cá nhân",
      en: "Annual CO₂ emissions by the individual",
    },
    tonsCO2PerYear: {
      vi: "tấn CO₂/năm",
      en: "tons CO₂/year",
    },
    tonsCO2ePerYear: {
      vi: "tấn CO₂e/năm",
      en: "tons CO₂e/year",
    },
    optimizationPotential: {
      vi: "Tiềm năng tối ưu:",
      en: "Optimization potential:",
    },
    sustainableForestManagement: {
      vi: "Với các biện pháp quản lý rừng bền vững, bạn có thể tăng khả năng hấp thụ carbon.",
      en: "With sustainable forest management practices, you can increase carbon sequestration capacity.",
    },
    estimateDisclaimer: {
      vi: "Đây là ước tính sơ bộ. Liên hệ với chúng tôi để được đánh giá chi tiết và chính xác hơn.",
      en: "This is a preliminary estimate. Contact us for a more detailed and accurate assessment.",
    },
    recalculate: {
      vi: "Tính toán lại",
      en: "Recalculate",
    },
    detailedConsultation: {
      vi: "Tư vấn chi tiết",
      en: "Detailed consultation",
    },
    ha: {
      vi: "ha",
      en: "ha",
    },
    years: {
      vi: "năm",
      en: "years",
    },
    treesPerHa: {
      vi: "cây/ha",
      en: "trees/ha",
    },
  }

  const calculateForestCarbon = () => {
    setLoading(true)

    // Simulate API call or complex calculation
    setTimeout(() => {
      // Simplified calculation logic
      let baseRate = 0

      switch (forestValues.type) {
        case "pine":
          baseRate = 5.2
          break
        case "acacia":
          baseRate = 4.8
          break
        case "eucalyptus":
          baseRate = 6.5
          break
        case "mixed":
          baseRate = 5.5
          break
        default:
          baseRate = 5.0
      }

      // Calculate carbon sequestration based on area, age, type and density
      const carbonSequestration =
        forestValues.area * baseRate * Math.min(forestValues.age * 0.8, 10) * (forestValues.density / 1000)

      // Calculate potential value (if optimized)
      const potentialValue = carbonSequestration * 1.3

      setResult({
        value: Math.round(carbonSequestration * 100) / 100,
        unit: language === "vi" ? translations.tonsCO2PerYear.vi : translations.tonsCO2PerYear.en,
        description: language === "vi" ? translations.forestCO2Description.vi : translations.forestCO2Description.en,
        potentialValue: Math.round(potentialValue * 100) / 100,
      })

      setLoading(false)
    }, 1500)
  }

  const calculateIndustryCarbon = () => {
    setLoading(true)

    // Simulate API call or complex calculation
    setTimeout(() => {
      // Simplified calculation logic
      const electricityEmissions =
        (industryValues.electricityConsumption === "" ? 0 : Number(industryValues.electricityConsumption)) * 0.5 // kg CO2 per kWh
      const fuelEmissions = (industryValues.fuelConsumption === "" ? 0 : Number(industryValues.fuelConsumption)) * 2.3 // kg CO2 per liter
      const wasteEmissions = (industryValues.wasteProduction === "" ? 0 : Number(industryValues.wasteProduction)) * 0.7 // kg CO2 per kg waste
      const employeeEmissions = (industryValues.employeeCount === "" ? 0 : Number(industryValues.employeeCount)) * 100 // kg CO2 per employee (transport, etc)

      const totalEmissions = (electricityEmissions + fuelEmissions + wasteEmissions + employeeEmissions) / 1000 // convert to tonnes

      setResult({
        value: Math.round(totalEmissions * 100) / 100,
        unit: language === "vi" ? translations.tonsCO2ePerYear.vi : translations.tonsCO2ePerYear.en,
        description:
          language === "vi" ? translations.industryCO2Description.vi : translations.industryCO2Description.en,
      })

      setLoading(false)
    }, 1500)
  }

  const calculatePersonalCarbon = () => {
    setLoading(true)

    // Simulate API call or complex calculation
    setTimeout(() => {
      // Simplified calculation logic
      const electricityEmissions =
        (personalValues.electricityConsumption === "" ? 0 : Number(personalValues.electricityConsumption)) * 0.5 // kg CO2 per kWh
      const carEmissions = (personalValues.carUsage === "" ? 0 : Number(personalValues.carUsage)) * 0.2 * 52 // kg CO2 per km per year
      const flightEmissions = (personalValues.flightHours === "" ? 0 : Number(personalValues.flightHours)) * 200 // kg CO2 per hour

      let dietFactor = 1.0
      switch (personalValues.dietType) {
        case "vegetarian":
          dietFactor = 0.7
          break
        case "vegan":
          dietFactor = 0.5
          break
        default:
          dietFactor = 1.0
      }

      const dietEmissions = 1000 * dietFactor // base of 1 tonne for mixed diet

      const totalEmissions = (electricityEmissions + carEmissions + flightEmissions + dietEmissions) / 1000 // convert to tonnes

      setResult({
        value: Math.round(totalEmissions * 100) / 100,
        unit: language === "vi" ? translations.tonsCO2ePerYear.vi : translations.tonsCO2ePerYear.en,
        description:
          language === "vi" ? translations.personalCO2Description.vi : translations.personalCO2Description.en,
      })

      setLoading(false)
    }, 1500)
  }

  const handleCalculate = () => {
    switch (activeTab) {
      case "forest":
        calculateForestCarbon()
        break
      case "industry":
        calculateIndustryCarbon()
        break
      case "personal":
        calculatePersonalCarbon()
        break
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6" style={{ position: "relative", width: "100%" }}>
      <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">
        {language === "vi" ? translations.title.vi : translations.title.en}
      </h3>
      <p className="text-gray-600 mb-6 text-center">
        {language === "vi" ? translations.description.vi : translations.description.en}
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 p-1 bg-gray-100">
          <TabsTrigger
            value="forest"
            className="flex items-center gap-2 py-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
          >
            <Tree className="h-4 w-4" /> {language === "vi" ? translations.forest.vi : translations.forest.en}
          </TabsTrigger>
          <TabsTrigger
            value="industry"
            className="flex items-center gap-2 py-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
          >
            <Factory className="h-4 w-4" /> {language === "vi" ? translations.industry.vi : translations.industry.en}
          </TabsTrigger>
          <TabsTrigger
            value="personal"
            className="flex items-center gap-2 py-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
          >
            <Home className="h-4 w-4" /> {language === "vi" ? translations.personal.vi : translations.personal.en}
          </TabsTrigger>
        </TabsList>

        {/* Forest Carbon Calculator */}
        <TabsContent value="forest" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="forest-area" className="flex items-center">
                        {language === "vi" ? translations.forestArea.vi : translations.forestArea.en}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-2 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px]">
                                {language === "vi"
                                  ? translations.forestAreaTooltip.vi
                                  : translations.forestAreaTooltip.en}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <span className="font-medium">
                        {forestValues.area} {language === "vi" ? translations.ha.vi : translations.ha.en}
                      </span>
                    </div>
                    <Slider
                      id="forest-area"
                      min={1}
                      max={1000}
                      step={1}
                      value={[forestValues.area]}
                      onValueChange={(value) => setForestValues({ ...forestValues, area: value[0] })}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="forest-age" className="flex items-center">
                        {language === "vi" ? translations.forestAge.vi : translations.forestAge.en}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-2 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px]">
                                {language === "vi"
                                  ? translations.forestAgeTooltip.vi
                                  : translations.forestAgeTooltip.en}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <span className="font-medium">
                        {forestValues.age} {language === "vi" ? translations.years.vi : translations.years.en}
                      </span>
                    </div>
                    <Slider
                      id="forest-age"
                      min={1}
                      max={50}
                      step={1}
                      value={[forestValues.age]}
                      onValueChange={(value) => setForestValues({ ...forestValues, age: value[0] })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forest-type">
                      {language === "vi" ? translations.forestType.vi : translations.forestType.en}
                    </Label>
                    <Select
                      value={forestValues.type}
                      onValueChange={(value) => setForestValues({ ...forestValues, type: value })}
                    >
                      <SelectTrigger id="forest-type">
                        <SelectValue placeholder={language === "vi" ? "Chọn loại rừng" : "Select forest type"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pine">
                          {language === "vi" ? translations.pine.vi : translations.pine.en}
                        </SelectItem>
                        <SelectItem value="acacia">
                          {language === "vi" ? translations.acacia.vi : translations.acacia.en}
                        </SelectItem>
                        <SelectItem value="eucalyptus">
                          {language === "vi" ? translations.eucalyptus.vi : translations.eucalyptus.en}
                        </SelectItem>
                        <SelectItem value="mixed">
                          {language === "vi" ? translations.mixed.vi : translations.mixed.en}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="forest-density" className="flex items-center">
                        {language === "vi" ? translations.forestDensity.vi : translations.forestDensity.en}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-2 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px]">
                                {language === "vi"
                                  ? translations.forestDensityTooltip.vi
                                  : translations.forestDensityTooltip.en}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <span className="font-medium">
                        {forestValues.density}{" "}
                        {language === "vi" ? translations.treesPerHa.vi : translations.treesPerHa.en}
                      </span>
                    </div>
                    <Slider
                      id="forest-density"
                      min={100}
                      max={2000}
                      step={100}
                      value={[forestValues.density]}
                      onValueChange={(value) => setForestValues({ ...forestValues, density: value[0] })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Industry Carbon Calculator */}
        <TabsContent value="industry" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="electricity-consumption">
                      {language === "vi"
                        ? translations.electricityConsumption.vi
                        : translations.electricityConsumption.en}
                    </Label>
                    <Input
                      id="electricity-consumption"
                      type="number"
                      value={industryValues.electricityConsumption}
                      onChange={(e) =>
                        setIndustryValues({
                          ...industryValues,
                          electricityConsumption: e.target.value === "" ? "" : Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fuel-consumption">
                      {language === "vi" ? translations.fuelConsumption.vi : translations.fuelConsumption.en}
                    </Label>
                    <Input
                      id="fuel-consumption"
                      type="number"
                      value={industryValues.fuelConsumption}
                      onChange={(e) =>
                        setIndustryValues({
                          ...industryValues,
                          fuelConsumption: e.target.value === "" ? "" : Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="waste-production">
                      {language === "vi" ? translations.wasteProduction.vi : translations.wasteProduction.en}
                    </Label>
                    <Input
                      id="waste-production"
                      type="number"
                      value={industryValues.wasteProduction}
                      onChange={(e) =>
                        setIndustryValues({
                          ...industryValues,
                          wasteProduction: e.target.value === "" ? "" : Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee-count">
                      {language === "vi" ? translations.employeeCount.vi : translations.employeeCount.en}
                    </Label>
                    <Input
                      id="employee-count"
                      type="number"
                      value={industryValues.employeeCount}
                      onChange={(e) =>
                        setIndustryValues({
                          ...industryValues,
                          employeeCount: e.target.value === "" ? "" : Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Carbon Calculator */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="personal-electricity">
                      {language === "vi"
                        ? translations.electricityConsumption.vi
                        : translations.electricityConsumption.en}
                    </Label>
                    <Input
                      id="personal-electricity"
                      type="number"
                      value={personalValues.electricityConsumption}
                      onChange={(e) =>
                        setPersonalValues({
                          ...personalValues,
                          electricityConsumption: e.target.value === "" ? "" : Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="car-usage">
                      {language === "vi" ? translations.carUsage.vi : translations.carUsage.en}
                    </Label>
                    <Input
                      id="car-usage"
                      type="number"
                      value={personalValues.carUsage}
                      onChange={(e) =>
                        setPersonalValues({
                          ...personalValues,
                          carUsage: e.target.value === "" ? "" : Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="flight-hours">
                      {language === "vi" ? translations.flightHours.vi : translations.flightHours.en}
                    </Label>
                    <Input
                      id="flight-hours"
                      type="number"
                      value={personalValues.flightHours}
                      onChange={(e) =>
                        setPersonalValues({
                          ...personalValues,
                          flightHours: e.target.value === "" ? "" : Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diet-type">
                      {language === "vi" ? translations.dietType.vi : translations.dietType.en}
                    </Label>
                    <Select
                      value={personalValues.dietType}
                      onValueChange={(value) => setPersonalValues({ ...personalValues, dietType: value })}
                    >
                      <SelectTrigger id="diet-type">
                        <SelectValue placeholder={language === "vi" ? "Chọn chế độ ăn" : "Select diet type"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mixed">
                          {language === "vi" ? translations.mixedDiet.vi : translations.mixedDiet.en}
                        </SelectItem>
                        <SelectItem value="vegetarian">
                          {language === "vi" ? translations.vegetarianDiet.vi : translations.vegetarianDiet.en}
                        </SelectItem>
                        <SelectItem value="vegan">
                          {language === "vi" ? translations.veganDiet.vi : translations.veganDiet.en}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button
          onClick={handleCalculate}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-medium"
          disabled={loading}
          style={{ cursor: loading ? "wait" : "pointer" }}
        >
          {loading
            ? language === "vi"
              ? translations.calculating.vi
              : translations.calculating.en
            : language === "vi"
              ? translations.calculate.vi
              : translations.calculate.en}
        </Button>
      </div>

      {result && (
        <div className="mt-6 p-6 bg-green-50 rounded-lg border border-green-200 text-center">
          <p className="text-gray-700 mb-2 font-medium">{result.description}:</p>
          <p className="text-4xl font-bold text-green-700 mb-2" style={{ lineHeight: 1.2 }}>
            {result.value} <span className="text-xl">{result.unit}</span>
          </p>

          {result.potentialValue && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-gray-700 mb-1 font-medium">
                {language === "vi" ? translations.optimizationPotential.vi : translations.optimizationPotential.en}
              </p>
              <p className="text-2xl font-bold text-blue-700" style={{ lineHeight: 1.2 }}>
                {result.potentialValue} <span className="text-lg">{result.unit}</span>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {language === "vi"
                  ? translations.sustainableForestManagement.vi
                  : translations.sustainableForestManagement.en}
              </p>
            </div>
          )}

          <p className="text-sm text-gray-600 mt-4">
            {language === "vi" ? translations.estimateDisclaimer.vi : translations.estimateDisclaimer.en}
          </p>

          <div className="mt-4 flex justify-center gap-3">
            <Button variant="outline" className="px-4 py-2" onClick={() => setResult(null)}>
              {language === "vi" ? translations.recalculate.vi : translations.recalculate.en}
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 px-4 py-2">
              <Link href="/lien-he">
                {language === "vi" ? translations.detailedConsultation.vi : translations.detailedConsultation.en}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
