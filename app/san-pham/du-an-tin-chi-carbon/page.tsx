"use client"

import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Leaf, BarChart3, TrendingUp, Award, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import ImageComparison from "@/components/image-comparison"
import ProjectRegistrationForm from "@/components/project-registration-form"
import AnimatedButton from "@/components/animated-button"
import { useLanguage } from "@/context/language-context"

export default function CarbonProjectsPage() {
  const { language } = useLanguage()

  const translations = {
    en: {
      featuredProduct: "Featured Product",
      heroTitle: "CARBON CREDIT PROJECTS",
      heroSubtitle: "Developing high-quality carbon credit projects, optimizing value from planted forests",
      registerProject: "Register Project",
      registerNow: "Register Now!",
      learnMore: "Learn More",
      exploreMore: "Explore More!",
      overview: "Overview",
      whatIsCarbonProject: "What is a Carbon Credit Project?",
      projectDescription1:
        "TCCV is a pioneer in developing carbon credit projects, with a special focus on optimizing value from long-term timber forests. We particularly prioritize and have strengths in developing projects from newly planted forests, especially those planted within the last 5 years.",
      projectDescription2:
        "Carbon credit projects are activities aimed at reducing greenhouse gas emissions or enhancing carbon sequestration, thereby creating carbon credits that can be traded on the market. Each carbon credit is equivalent to 1 ton of CO2 reduced or absorbed.",
      projectFrom20ha: "Projects from 20ha or more",
      forestLandWithCertificate: "Production forest land with certificate",
      forestAgeLessThan5: "Forest age less than 5 years",
      plantMixOf3To5Species: "Mixed planting of 3-5 tree species",
      carbonCreditProject: "Carbon Credit Project",
      realImpact: "Real Impact",
      projectImpact: "Impact of Carbon Credit Projects",
      seeTheDifference: "See the difference before and after implementing a carbon credit project",
      beforeProject: "Before Project",
      afterProject: "After Project",
      benefits: "Benefits",
      participationBenefits: "Benefits of Participation",
      benefitsDescription:
        "Participating in carbon credit projects brings many benefits to forest owners and the environment",
      stableIncome: "Stable Income",
      stableIncomeDesc:
        "Receive income from selling carbon credits with an average value of about 8 million VND/ha/year",
      environmentalProtection: "Environmental Protection",
      environmentalProtectionDesc:
        "Contribute significantly to protecting and restoring forest ecosystems, mitigating climate change",
      timberHarvestingRights: "Timber Harvesting Rights",
      timberHarvestingRightsDesc:
        "After the carbon project period, you still have the right to harvest and use the timber resources of your forest",
      costSupport: "Cost Support",
      costSupportDesc: "TCCV covers all costs related to project setup, data collection, measurement, and verification",
      internationalCertification: "International Certification",
      internationalCertificationDesc:
        "Projects are certified according to reputable international standards such as VCS, Gold Standard, increasing the value of carbon credits",
      technicalSupport: "Technical Support",
      technicalSupportDesc:
        "Receive technical support throughout the project implementation process, from design to implementation and monitoring",
      process: "Process",
      projectImplementationProcess: "Project Implementation Process",
      processDescription: "Steps to implement a carbon credit project from survey to credit issuance",
      surveyAndAssessment: "Survey and Assessment",
      surveyAndAssessmentDesc: "Survey the project area, assess carbon credit potential and project feasibility",
      projectDesign: "Project Design",
      projectDesignDesc: "Develop project plan, select appropriate methodology and determine baseline",
      verificationAndApproval: "Verification and Approval",
      verificationAndApprovalDesc:
        "Project is verified by an independent entity and approved according to international standards",
      implementationAndMonitoring: "Implementation and Monitoring",
      implementationAndMonitoringDesc: "Implement project activities and establish continuous monitoring system",
      creditVerificationAndIssuance: "Credit Verification and Issuance",
      creditVerificationAndIssuanceDesc: "Verify emission reduction results and issue carbon credits on the market",
      tradingAndProfitSharing: "Trading and Profit Sharing",
      tradingAndProfitSharingDesc: "Sell carbon credits on the market and share profits according to agreement",
      registerProjectSection: "Register Project",
      registerCarbonProject: "Register Carbon Credit Project",
      registerProjectDesc:
        "Fill in your project information to receive consultation and support from our team of experts",
      faq: "FAQ",
      faqTitle: "Frequently Asked Questions",
      commonQuestions: "Common questions about carbon credit projects",
      faq1: "What specific benefits do I receive when participating in a carbon credit project?",
      faq1Answer:
        "By participating in this project, you not only have the opportunity to receive income from selling carbon credits with an average value of about 8 million VND/ha/year, but also contribute significantly to protecting and restoring forest ecosystems. Additionally, after the carbon project period for your forest, you still have the right to harvest and use the timber resources of your forest.",
      faq2: "What costs do I have to bear when participating in a carbon credit project?",
      faq2Answer:
        "We, TCCV, understand that the initial investment for a carbon credit project can be a burden. Therefore, we commit to covering all costs related to project setup, including data collection, measurement, and costs related to the verification process. Forest owners only need to continue performing familiar tasks of caring for and protecting their forests.",
      faq3: "How long will the project last?",
      faq3Answer:
        "This project is designed with a long-term implementation period, suitable for the natural growth cycle of forests and the requirements of the carbon credit market. The specific duration of the project will be clearly defined in the contract, depending on the type of forest and specific objectives of each project. We commit to continuous monitoring and supervision to ensure that carbon is effectively absorbed throughout the project period.",
      faq4: "What do I need to prepare to participate in this project?",
      faq4Answer:
        "To participate in the project, you only need to prepare information about the forest such as area, land type, forest certificate, and current planting status. Currently, TCCV supports projects from 20ha or more with production forest land, with certificate, bare land or land with existing trees, forest age less than 5 years, and need to plant a mix of 3-5 native Vietnamese tree species.",
      faq5: "Can acacia forests qualify for carbon credits?",
      faq5Answer:
        "We currently do not support carbon credits for acacia forests. Currently, TCCV supports projects from 20ha or more with production forest land, with certificate, bare land or land with existing trees, forest age less than 5 years, and need to plant a mix of 3-5 native Vietnamese tree species (e.g., Dipterocarpus alatus, Pterocarpus macrocarpus, pine, Hopea odorata, Erythrophleum fordii, Hopea ferrea, etc.). If you have another forest that meets the standards, please let us know for further inspection.",
      ctaQuestion: "Do you have a suitable forest for a carbon credit project?",
      ctaDescription: "Contact us today for free consultation.",
      startNow: "Start Now!",
      "3dVisualization": "3D Visualization",
      forestGrowthModel: "Forest Growth Model",
      exploreForestModel: "Explore our interactive 3D model showing how trees grow and sequester carbon over time",
      "3dModelDescription":
        "This 3D model illustrates how our technology measures and monitors tree growth to calculate carbon credits accurately.",
    },
    vi: {
      featuredProduct: "Sản phẩm nổi bật",
      heroTitle: "DỰ ÁN TÍN CHỈ CARBON",
      heroSubtitle: "Phát triển các dự án tín chỉ carbon chất lượng cao, tối ưu hóa giá trị từ các khu rừng trồng",
      registerProject: "Đăng ký dự án",
      registerNow: "Đăng ký ngay!",
      learnMore: "Tìm hiểu thêm",
      exploreMore: "Khám phá thêm!",
      overview: "Tổng quan",
      whatIsCarbonProject: "Dự án tín chỉ carbon là gì?",
      projectDescription1:
        "TCCV là đơn vị tiên phong trong phát triển các dự án tín chỉ carbon, đặc biệt chú trọng vào việc tối ưu hóa giá trị từ các khu rừng trồng gỗ lâu năm. Chúng tôi đặc biệt ưu tiên và có thế mạnh trong việc phát triển các dự án từ rừng trồng mới, nhất là những khu rừng được trồng trong vòng 5 năm gần đây.",
      projectDescription2:
        "Dự án tín chỉ carbon là các hoạt động nhằm giảm phát thải khí nhà kính hoặc tăng cường hấp thụ carbon, từ đó tạo ra các tín chỉ carbon có thể giao dịch trên thị trường. Mỗi tín chỉ carbon tương đương với 1 tấn CO2 được giảm thiểu hoặc hấp thụ.",
      projectFrom20ha: "Dự án từ 20ha trở lên",
      forestLandWithCertificate: "Đất rừng sản xuất có sổ",
      forestAgeLessThan5: "Tuổi rừng dưới 5 năm",
      plantMixOf3To5Species: "Trồng xen canh 3-5 loài cây",
      carbonCreditProject: "Dự án tín chỉ carbon",
      realImpact: "Tác động thực tế",
      projectImpact: "Tác động của dự án tín chỉ carbon",
      seeTheDifference: "Xem sự khác biệt trước và sau khi triển khai dự án tín chỉ carbon",
      beforeProject: "Trước dự án",
      afterProject: "Sau dự án",
      benefits: "Lợi ích",
      participationBenefits: "Lợi ích khi tham gia dự án",
      benefitsDescription: "Tham gia dự án tín chỉ carbon mang lại nhiều lợi ích cho chủ rừng và môi trường",
      stableIncome: "Thu nhập ổn định",
      stableIncomeDesc:
        "Nhận được nguồn thu nhập từ việc bán tín chỉ carbon với giá trị trung bình khoảng 8 triệu VND/ha/năm",
      environmentalProtection: "Bảo vệ môi trường",
      environmentalProtectionDesc:
        "Góp phần quan trọng vào việc bảo vệ và phục hồi hệ sinh thái rừng, giảm thiểu biến đổi khí hậu",
      timberHarvestingRights: "Quyền khai thác gỗ",
      timberHarvestingRightsDesc:
        "Sau thời gian làm dự án carbon, bạn vẫn có quyền khai thác và sử dụng tài nguyên gỗ của khu rừng",
      costSupport: "Hỗ trợ chi phí",
      costSupportDesc:
        "TCCV chi trả toàn bộ các chi phí liên quan đến việc thiết lập dự án, thu thập dữ liệu, đo đạc và xác minh",
      internationalCertification: "Chứng nhận quốc tế",
      internationalCertificationDesc:
        "Dự án được chứng nhận theo các tiêu chuẩn quốc tế uy tín như VCS, Gold Standard, tăng giá trị tín chỉ carbon",
      technicalSupport: "Hỗ trợ kỹ thuật",
      technicalSupportDesc:
        "Được hỗ trợ kỹ thuật trong suốt quá trình thực hiện dự án, từ thiết kế đến triển khai và giám sát",
      process: "Quy trình",
      projectImplementationProcess: "Quy trình thực hiện dự án",
      processDescription: "Các bước thực hiện dự án tín chỉ carbon từ khảo sát đến phát hành tín chỉ",
      surveyAndAssessment: "Khảo sát và đánh giá",
      surveyAndAssessmentDesc: "Khảo sát khu vực dự án, đánh giá tiềm năng tín chỉ carbon và tính khả thi của dự án",
      projectDesign: "Thiết kế dự án",
      projectDesignDesc: "Xây dựng kế hoạch dự án, lựa chọn phương pháp luận phù hợp và xác định đường cơ sở",
      verificationAndApproval: "Thẩm định và phê duyệt",
      verificationAndApprovalDesc: "Dự án được thẩm định bởi đơn vị độc lập và phê duyệt theo tiêu chuẩn quốc tế",
      implementationAndMonitoring: "Triển khai và giám sát",
      implementationAndMonitoringDesc: "Triển khai các hoạt động dự án và thiết lập hệ thống giám sát liên tục",
      creditVerificationAndIssuance: "Xác minh và phát hành tín chỉ",
      creditVerificationAndIssuanceDesc: "Xác minh kết quả giảm phát thải và phát hành tín chỉ carbon trên thị trường",
      tradingAndProfitSharing: "Giao dịch và phân chia lợi nhuận",
      tradingAndProfitSharingDesc: "Bán tín chỉ carbon trên thị trường và phân chia lợi nhuận theo thỏa thuận",
      registerProjectSection: "Đăng ký dự án",
      registerCarbonProject: "Đăng ký dự án tín chỉ carbon",
      registerProjectDesc:
        "Điền thông tin dự án của bạn để nhận được tư vấn và hỗ trợ từ đội ngũ chuyên gia của chúng tôi",
      faq: "Câu hỏi thường gặp",
      faqTitle: "Giải đáp thắc mắc",
      commonQuestions: "Những câu hỏi thường gặp về dự án tín chỉ carbon",
      faq1: "Lợi ích cụ thể mà tôi nhận được khi tham gia dự án tín chỉ carbon là gì?",
      faq1Answer:
        "Tham gia dự án này, bạn không chỉ có cơ hội nhận được nguồn thu nhập từ việc bán tín chỉ carbon với giá trị trung bình khoảng 8 triệu VND/ha/năm, mà còn góp phần quan trọng vào việc bảo vệ và phục hồi hệ sinh thái rừng. Ngoài ra, sau thời gian làm dự án carbon cho khu rừng của mình, bạn vẫn có quyền khai thác và sử dụng tài nguyên gỗ của khu rừng.",
      faq2: "Tôi phải chịu những chi phí nào khi tham gia dự án tín chỉ carbon?",
      faq2Answer:
        "Chúng tôi, TCCV, hiểu rằng việc đầu tư ban đầu cho một dự án tín chỉ carbon có thể là một gánh nặng. Vì vậy, chúng tôi cam kết sẽ chi trả toàn bộ các chi phí liên quan đến việc thiết lập dự án, bao gồm thu thập dữ liệu, đo đạc, và các chi phí liên quan đến quá trình xác minh. Quý chủ rừng chỉ cần tiếp tục thực hiện những công việc quen thuộc là chăm sóc và bảo vệ khu rừng của mình.",
      faq3: "Dự án sẽ kéo dài bao lâu?",
      faq3Answer:
        "Dự án này được thiết kế với thời gian thực hiện dài hạn, phù hợp với chu kỳ sinh trưởng tự nhiên của rừng và yêu cầu của thị trường tín chỉ carbon. Thời gian cụ thể của dự án sẽ được xác định rõ ràng trong hợp đồng, tùy thuộc vào loại rừng và mục tiêu cụ thể của từng dự án. Chúng tôi cam kết thực hiện việc theo dõi và giám sát liên tục để đảm bảo lượng carbon được hấp thụ hiệu quả trong suốt thời gian dự án.",
      faq4: "Tôi cần chuẩn bị gì để tham gia dự án này?",
      faq4Answer:
        "Để tham gia dự án, bạn chỉ cần chuẩn bị thông tin về khu rừng như diện tích, loại đất, giấy tờ sổ rừng, và tình trạng cây trồng hiện tại. Hiện tại TCCV hỗ trợ các dự án từ 20ha trở lên với đất rừng sản xuất, có sổ, đất trống hoặc đất đã có cây trồng, tuổi rừng dưới 5 năm, và cần trồng xen canh 3-5 loài cây bản địa Việt Nam.",
      faq5: "Rừng keo làm được tín chỉ không?",
      faq5Answer:
        "Rừng keo hiện nay chúng tôi chưa hỗ trợ làm tín chỉ. Hiện tại TCCV hỗ trợ thực hiện các dự án từ 20ha trở lên với đất rừng sản xuất, có sổ, đất trống hoặc đất đã có cây trồng, tuổi rừng dưới 5 năm, và cần trồng xen canh 3-5 loài cây bản địa Việt Nam (ví dụ: cây gù hương, giáng hương, thông, dổi, lim, sao đen,...). Nếu bạn có khu rừng khác đạt tiêu chuẩn, cứ báo chúng tôi để kiểm tra thêm.",
      ctaQuestion: "Bạn có khu rừng phù hợp cho dự án tín chỉ carbon?",
      ctaDescription: "Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí.",
      startNow: "Bắt đầu ngay!",
      "3dVisualization": "Mô phỏng 3D",
      forestGrowthModel: "Mô hình phát triển rừng",
      exploreForestModel:
        "Khám phá mô hình 3D tương tác của chúng tôi thể hiện cách cây phát triển và hấp thụ carbon theo thời gian",
      "3dModelDescription":
        "Mô hình 3D này minh họa cách công nghệ của chúng tôi đo lường và theo dõi sự phát triển của cây để tính toán tín chỉ carbon chính xác.",
    },
  }

  const getText = (key) => {
    return translations[language][key] || translations["vi"][key]
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/vietnam-farmer-639204_1920.jpg"
            alt={getText("heroTitle")}
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <span className="inline-block py-1 px-3 bg-green-600 text-white text-sm font-medium rounded-full mb-4">
            {getText("featuredProduct")}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">{getText("heroTitle")}</h1>
          <p className="text-white text-xl max-w-2xl mb-8">{getText("heroSubtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="#register-project">
              <AnimatedButton
                size="lg"
                className="border-green-600 text-black hover:bg-green-600 hover:text-white transition-all duration-150 px-8 py-6 text-lg border-2"
                hoverText={getText("registerNow")}
              >
                {getText("registerProject")}
              </AnimatedButton>
            </Link>
            <AnimatedButton
              variant="outline"
              size="lg"
              className="border-green-600 text-black hover:bg-green-600 hover:text-white transition-all duration-300 px-8 py-6 text-lg border-2"
              hoverText={getText("exploreMore")}
            >
              {getText("learnMore")}
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
                {getText("overview")}
              </span>
              <h2 className="text-4xl font-bold mb-6 text-gray-800">{getText("whatIsCarbonProject")}</h2>
              <p className="text-lg text-gray-600 mb-6">{getText("projectDescription1")}</p>
              <p className="text-lg text-gray-600 mb-8">{getText("projectDescription2")}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{getText("projectFrom20ha")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{getText("forestLandWithCertificate")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{getText("forestAgeLessThan5")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{getText("plantMixOf3To5Species")}</span>
                </div>
              </div>
            </div>
            <div className="relative h-[500px] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/images/cloud-4136344_1920.jpg"
                alt={getText("carbonCreditProject")}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3D Model Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {getText("3dVisualization")}
            </span>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">{getText("forestGrowthModel")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{getText("exploreForestModel")}</p>
          </div>

          <div className="relative w-full h-[600px] rounded-xl shadow-lg overflow-hidden">
            {/* Overlay màu xanh phía trên */}
            <div className="absolute top-0 left-0 right-0 h-[50px] z-10 bg-emerald-900 pointer-events-none"></div>

            {/* Overlay màu xanh phía dưới */}
            <div className="absolute bottom-0 left-0 right-0 h-[50px] z-10 bg-emerald-900 pointer-events-none"></div>

            <div className="sketchfab-embed-wrapper w-full h-full flex items-center justify-center">
              <iframe
                title="Wade Tree 18 Height Gradient"
                frameBorder="0"
                allowFullScreen
                mozallowfullscreen="true"
                webkitallowfullscreen="true"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                xr-spatial-tracking
                execution-while-out-of-viewport
                execution-while-not-rendered
                web-share
                src="https://sketchfab.com/models/ebe393edf83e4ac79005f4e9244e96d6/embed?autostart=1"
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Thông tin ở dưới cùng */}
            <div className="absolute bottom-[50px] left-0 right-0 p-4 bg-black/30 backdrop-blur-sm text-white z-20">
              <p className="text-sm font-medium">{getText("3dModelDescription")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Before-After Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {getText("realImpact")}
            </span>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">{getText("projectImpact")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{getText("seeTheDifference")}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <ImageComparison
              beforeImage="/images/before-reforestation.png"
              afterImage="/images/after-reforestation.png"
              beforeLabel={getText("beforeProject")}
              afterLabel={getText("afterProject")}
              height={500}
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {getText("benefits")}
            </span>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">{getText("participationBenefits")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{getText("benefitsDescription")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: getText("stableIncome"),
                description: getText("stableIncomeDesc"),
                icon: <DollarSign className="h-12 w-12 text-green-600" />,
              },
              {
                title: getText("environmentalProtection"),
                description: getText("environmentalProtectionDesc"),
                icon: <Leaf className="h-12 w-12 text-green-600" />,
              },
              {
                title: getText("timberHarvestingRights"),
                description: getText("timberHarvestingRightsDesc"),
                icon: <TrendingUp className="h-12 w-12 text-green-600" />,
              },
              {
                title: getText("costSupport"),
                description: getText("costSupportDesc"),
                icon: <BarChart3 className="h-12 w-12 text-green-600" />,
              },
              {
                title: getText("internationalCertification"),
                description: getText("internationalCertificationDesc"),
                icon: <Award className="h-12 w-12 text-green-600" />,
              },
              {
                title: getText("technicalSupport"),
                description: getText("technicalSupportDesc"),
                icon: <CheckCircle className="h-12 w-12 text-green-600" />,
              },
            ].map((benefit, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:bg-green-50">
                <CardContent className="p-8">
                  <div className="bg-green-100 p-4 rounded-full inline-block mb-6">{benefit.icon}</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {getText("process")}
            </span>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">{getText("projectImplementationProcess")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{getText("processDescription")}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-green-200"></div>

              {/* Timeline Items */}
              {[
                {
                  title: getText("surveyAndAssessment"),
                  description: getText("surveyAndAssessmentDesc"),
                  icon: <CheckCircle className="h-6 w-6 text-white" />,
                },
                {
                  title: getText("projectDesign"),
                  description: getText("projectDesignDesc"),
                  icon: <CheckCircle className="h-6 w-6 text-white" />,
                },
                {
                  title: getText("verificationAndApproval"),
                  description: getText("verificationAndApprovalDesc"),
                  icon: <CheckCircle className="h-6 w-6 text-white" />,
                },
                {
                  title: getText("implementationAndMonitoring"),
                  description: getText("implementationAndMonitoringDesc"),
                  icon: <CheckCircle className="h-6 w-6 text-white" />,
                },
                {
                  title: getText("creditVerificationAndIssuance"),
                  description: getText("creditVerificationAndIssuanceDesc"),
                  icon: <CheckCircle className="h-6 w-6 text-white" />,
                },
                {
                  title: getText("tradingAndProfitSharing"),
                  description: getText("tradingAndProfitSharingDesc"),
                  icon: <CheckCircle className="h-6 w-6 text-white" />,
                },
              ].map((step, index) => (
                <div key={index} className="relative z-10 mb-12">
                  <div className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                    {/* Timeline Content */}
                    <div className={`w-5/12 ${index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
                      <h3 className="text-xl font-bold mb-2 text-gray-800">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>

                    {/* Timeline Icon */}
                    <div className="w-2/12 flex justify-center">
                      <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center z-20">
                        {step.icon}
                      </div>
                    </div>

                    {/* Empty Space */}
                    <div className="w-5/12"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="register-project" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {getText("registerProjectSection")}
            </span>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">{getText("registerCarbonProject")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{getText("registerProjectDesc")}</p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <ProjectRegistrationForm />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {getText("faq")}
            </span>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">{getText("faqTitle")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{getText("commonQuestions")}</p>
          </div>

          <div className="max-w-3xl mx-auto">
            {[
              {
                question: getText("faq1"),
                answer: getText("faq1Answer"),
              },
              {
                question: getText("faq2"),
                answer: getText("faq2Answer"),
              },
              {
                question: getText("faq3"),
                answer: getText("faq3Answer"),
              },
              {
                question: getText("faq4"),
                answer: getText("faq4Answer"),
              },
              {
                question: getText("faq5"),
                answer: getText("faq5Answer"),
              },
            ].map((faq, index) => (
              <div key={index} className="mb-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer">
                      <h3 className="text-xl font-bold text-gray-800">{faq.question}</h3>
                      <div className="w-5 h-5 border-2 border-green-600 rounded-full flex items-center justify-center group-open:bg-green-600 transition-all duration-300">
                        <span className="transform group-open:rotate-180 transition-transform duration-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-600 group-open:text-white"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </span>
                      </div>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 animate-fadeIn">
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-2">{getText("ctaQuestion")}</h2>
              <p className="text-white/80 text-lg">{getText("ctaDescription")}</p>
            </div>
            <Link href="#register-project">
              <AnimatedButton
                className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 text-lg font-medium shadow-lg"
                hoverText={getText("startNow")}
              >
                {getText("registerProject")}
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
