"use client";
import { Button } from "@/components/ui/button";
import {
  Play,
  FileText,
  Brain,
  Database,
  RefreshCw,
  Download,
  CheckCircle,
  Users,
  BookOpen,
  BarChart3,
  CheckSquare,
  FileBarChart,
  ScrollText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import CardComponents from "./card";
import HTTP from "@/app/common/http";
interface FreeProduct {
  _id: number
}
import useEmblaCarousel from "embla-carousel-react";
export default function CarbonToanThuPage() {
  const { language, t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [FreeProduct, setFreeProduct] = useState<FreeProduct>();
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleClick = () => {
      video.muted = false;
      video.volume = 0.5;
      if (video.paused) {
        video.play();
      }
    };
    video.addEventListener("click", handleClick);
    return () => {
      video.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    const fetchFreeProduct = async () => {
      const response = await HTTP.GET<any>("/products/free/trial");
      if (response && response.payload) {
        setFreeProduct(response.payload);
      }
    };
    fetchFreeProduct();
  }, []);

  const handleDownload = () => {
    const fileUrl =
      "https://drive.google.com/file/d/1Q5VsUIkjx_Gc5ss153Fr_HUp7bebEsN3/view?usp=sharing";
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute(
      "download",
      language === "en"
        ? "CARBON_ENCYCLOPEDIA_TABLE_OF_CONTENTS.pdf"
        : "CARBON_TOAN_THU_MUC_LUC.pdf",
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const translations = {
    en: {
      heroTitle: "CARBON ENCYCLOPEDIA 4.0",
      heroSubtitle:
        "Comprehensive knowledge repository on carbon credits with over 600 in-depth researchs, documents on Carbon Credits, ESG & CSR, and intelligent CarbonSeek AI assistant",
      featuredProduct: "Featured Product",
      registerNow: "Register Now",
      tryFree: "Try for free",
      productIntro: "Product Introduction",
      exploreTitle: "Explore Carbon Encyclopedia 4.0",
      exploreDesc:
        "Watch the introduction video to learn more about the product and its key features",
      comprehensiveSolution: "Comprehensive Knowledge Solution",
      comprehensiveDesc:
        "Carbon Encyclopedia 4.0 is a comprehensive knowledge repository with over 600 in-depth researchs, documents on Carbon Credits, ESG & CSR, combined with the most advanced AI assistant available today. This product helps you answer all questions, personalize information according to your needs, accurately calculate forest carbon stocks, and stay updated with the latest news on the Carbon market.",
      over600Docs: "Over 600 in-depth researches, documents",
      carbonSeekAI: "CarbonSeek AI 24/7",
      continuousUpdates: "Continuous updates",
      internationalStandards: "International standards",
      aiAssistant: "AI Intelligent Assistant",
      carbonSeekTitle: "CarbonSeek - Carbon AI Assistant",
      carbonSeekDesc:
        "Intelligent virtual assistant answering all carbon credit questions, guiding processes, and providing industry information",
      carbonSeekIntro:
        "CarbonSeek is TCCV's intelligent virtual assistant, developed to answer all questions about carbon credits, guide carbon credit-related processes, calculate carbon stocks, and provide industry information and continuous updates on the Carbon market.",
      smartAnswers: "Smart 24/7 Responses",
      smartAnswersDesc: "Answer all carbon credit questions anytime",
      massiveDatabase: "Massive Database",
      massiveDatabaseDesc:
        "Trained on over 600 in-depth researches, documents on carbon credits",
      accurateCalculations: "Accurate Calculations",
      accurateCalculationsDesc:
        "Support for calculating forest carbon stocks according to international standards",
      contentOverview: "Rich Content",
      tableOfContents: "Carbon Encyclopedia 4.0 Table of Contents",
      tableOfContentsDesc:
        "Explore the comprehensive knowledge repository with over 600 in-depth researches, documents scientifically categorized",
      diverseContent: "Diverse and Comprehensive Content",
      diverseContentDesc:
        "Carbon Encyclopedia 4.0 includes in-depth content categorized into main sections:",
      basicKnowledge: "Basic Knowledge of Carbon Credits",
      basicKnowledgeDesc:
        "Concepts, definitions, and basic principles of carbon credits",
      internationalStandardsRegs: "International Standards and Regulations",
      internationalStandardsRegsDesc:
        "Standards such as VCS, Gold Standard, CDM, and related regulations",
      measurementMethods: "Measurement and Calculation Methods",
      measurementMethodsDesc:
        "Methods for measuring, calculating, and inventorying greenhouse gases",
      projectDevelopment: "Carbon Credit Project Development",
      projectDevelopmentDesc:
        "Detailed guidance on the carbon credit project development process",
      marketUpdates: "Market Updates",
      marketUpdatesDesc:
        "Latest information on domestic and international carbon credit markets",
      successfulProjects: "Successful Real Projects",
      successfulProjectsDesc:
        "Successful carbon credit projects in Vietnam and internationally",
      comprehensiveESG: "Comprehensive ESG Reports",
      comprehensiveESGDesc:
        "Guidelines for building ESG reports according to international standards",
      latestRegulations: "Latest Legal Regulations",
      latestRegulationsDesc:
        "All the latest legal regulations on the carbon market in Vietnam and internationally",
      downloadTOC: "Download detailed table of contents",
      tryReport: "Try sample report",
      keyFeatures: "Key Features",
      exploreEncyclopedia: "Explore Carbon Encyclopedia 4.0",
      featuresDesc:
        "The product is designed with many modern features to help you easily access knowledge about carbon credits",
      comprehensiveLibrary: "Comprehensive Document Library",
      comprehensiveLibraryDesc:
        "Over 600 in-depth research, documents and reports on Carbon Credits, ESG & CSR, scientifically categorized and organized",
      carbonSeekAssistant: "CarbonSeek AI Assistant",
      carbonSeekAssistantDesc:
        "Intelligent virtual assistant working 24/7, answering all questions and providing accurate information",
      carbonCalculationTools: "Carbon Calculation Tools",
      carbonCalculationToolsDesc:
        "Accurately calculate forest carbon stocks and emissions according to international standards",
      continuousUpdatesFeature: "Continuous Updates",
      continuousUpdatesFeatureDesc:
        "Market information and new documents are updated regularly, ensuring timeliness",
      exclusiveDocuments: "Exclusive Documents",
      exclusiveDocumentsDesc:
        "10 exclusive document sets specifically for the Vietnamese market, not available anywhere else",
      multiPlatformSupport: "Multi-Platform Support",
      multiPlatformSupportDesc:
        "Access documents and use AI assistant on various devices and platforms",
      pricing: "Pricing",
      investInKnowledge: "Invest in Knowledge",
      pricingDesc:
        "Choose a product package that suits your needs - One-time investment, lifetime value",
      trial: "Trial",
      free: "Free",
      trialDays: "14-day experience",
      forStudents: "For students and beginners",
      noDocsInTrial: "No documents in trial",
      noDocsInTrialDesc: "Only experience basic features.",
      basicAI: "Basic CarbonSeek AI",
      basicAIDesc: "Basic knowledge Q&A.",
      monthlyUpdates: "Monthly updates",
      monthlyUpdatesDesc: "Basic market information.",
      trialBenefits: "Benefits of using:",
      trialBenefit1: "Get familiar with carbon credits",
      trialBenefit2: "Experience AI assistant",
      trialBenefit3: "Access basic knowledge",
      trialSuitableFor:
        "Suitable for students and beginners who want to learn about carbon credits before deciding to invest.",
      tryNow: "Try Now",
      research: "Research",
      researchPrice: "20 USD",
      promoUntil: "Promotional price",
      forStudentsDiscount: "Exclusively for students at a discounted price",
      access300Docs: "Access to 300+ documents",
      access300DocsDesc: "Basic and advanced documents.",
      advancedAI: "Advanced CarbonSeek AI",
      advancedAIDesc: "Support for research and learning.",
      updatesFor1Year: "Updates for 1 year",
      updatesFor1YearDesc: "Regular market information.",
      emailSupport: "Email support",
      emailSupportDesc: "Answering questions in learning.",
      researchBenefits: "Benefits of using:",
      researchBenefit1: "Save research time",
      researchBenefit2: "Support for thesis, projects",
      researchBenefit3: "Enhance professional knowledge",
      researchBenefit4: "10% discount for groups of 5+",
      researchSuitableFor:
        "Suitable for students in environmental, economic, resource management, sustainable development, and related fields.",
      expert: "Expert",
      expertPrice: "23 USD",
      forProfessionals: "For experts and professionals",
      accessAllDocs: "Access to all 600+ researches, documents",
      accessAllDocsDesc: "Including research reports and case study.",
      advancedCarbonSeek: "Advanced CarbonSeek AI",
      advancedCarbonSeekDesc:
        "Strategic advice and advanced analysis customized for each business.",
      quarterlyMarketReports: "Quarterly market reports",
      quarterlyMarketReportsDesc: "Updates on trends and actual data.",
      oneOnOneConsultation: "One-on-one consultation with experts",
      oneOnOneConsultationDesc:
        "1 direct consultation sessions (30 minutes/session).",
      quarterlyWebinars: "Quarterly webinars",
      quarterlyWebinarsDesc: "With leading industry experts.",
      prioritySupport: "Priority 24/7 support",
      prioritySupportDesc: "Via live chat or email.",
      expertBenefits: "Benefits of using:",
      expertBenefit1: "Save 70% research time",
      expertBenefit2: "Direct consultation from experts",
      expertBenefit3: "Specific project data analysis",
      expertBenefit4: "Enhance professional capacity",
      expertSuitableFor:
        "For ESG experts, project managers, environmental consultants, investors, and those working in sustainable development.",
      enterprise: "Enterprise",
      contactForPrice: "Contact Us",
      customPricing: "Custom pricing based on needs",
      comprehensiveSolutionForBusiness: "Comprehensive solution for businesses",
      allExpertFeatures: "All Expert package features",
      allExpertFeaturesDesc: "For multiple users in the business.",
      departmentUserManagement: "Department-based user management",
      departmentUserManagementDesc: "Permission and access management.",
      customInHouseTraining: "Custom in-house training",
      customInHouseTrainingDesc: "Dedicated training program for employees.",
      carbonAndCBAMStrategy: "Carbon & CBAM strategy consulting",
      carbonAndCBAMStrategyDesc:
        "Ensuring compliance with international regulations.",
      carbonSeekAPIIntegration: "CarbonSeek API integration",
      carbonSeekAPIIntegrationDesc:
        "Connection with internal business systems.",
      industrySpecificReports: "Industry-specific reports",
      industrySpecificReportsDesc:
        "Analysis according to specific business fields.",
      cbamComplianceESG:
        "CBAM compliance and enhancing business ESG reputation",
      enterpriseSuitableFor:
        "Suitable for medium and large businesses wanting to enhance team capacity, meet international legal requirements, and implement carbon inventory and ESG projects comprehensively.",
      contactForConsultation: "Contact for consultation",
      groupRegistration: "Register as a group and receive special offers",
      groupDiscounts:
        "10% discount for groups of 5+, 15% discount for groups of 10+, and 20% discount for groups of 20+. Contact us for quotes on large quantity orders.",
      registerAsGroup: "Register as a group",
      faqSection: "Frequently Asked Questions",
      commonQuestions: "Common questions about Carbon Encyclopedia 4.0",
      faq1: "What is Carbon Encyclopedia 4.0?",
      faq1Answer:
        "Carbon Encyclopedia 4.0 is a comprehensive knowledge repository with over 600 in-depth researchs, documents and reports on Carbon Credits, ESG & CSR, combined with the most advanced AI assistant available today. This product helps you answer all questions, personalize information according to your needs, accurately calculate forest carbon stocks, and stay updated with the latest news on the Carbon market.",
      faq2: "How much does Carbon Encyclopedia 4.0 cost?",
      faq2Answer:
        "Currently, Carbon Encyclopedia 4.0 is used for 1 year with continuous updates, priced at 600,000 VND",
      faq3: "What is AI Chatbot – AI Carbon Assistant - CarbonSeek and how does it work?",
      faq3Answer:
        "CarbonSeek is TCCV's intelligent virtual assistant, developed to answer all questions about carbon credits, guide carbon credit-related processes, calculate carbon stocks, and provide industry information and continuous updates on the Carbon market. The assistant works 24/7 to help you get quick and accurate answers.",
      faq4: "After purchasing, will I receive updates with new documents?",
      faq4Answer:
        "After purchasing, you will be granted access to an exclusive link. The product is regularly updated with new documents, reports, and legal information related to carbon credits. You will always receive the latest information.",
      faq5: "How can I apply knowledge from Carbon Encyclopedia 4.0 in practice?",
      faq5Answer:
        "You can apply knowledge from Carbon Encyclopedia 4.0 in various fields such as building emission reduction strategies, managing carbon credit projects, implementing CSR & ESG programs, as well as research and training. This product helps effectively transform theory into practice.",
      readyToEnhance: "Ready to enhance your knowledge about carbon credits?",
      signUpToday:
        "Sign up for Carbon Encyclopedia 4.0 today and receive special offers.",
      mostPopular: "MOST POPULAR",
      fullTableOfContents: "Complete Table of Contents",
      viewFullTOC: "View the complete table of contents",
      section1: "I. Basic Knowledge of Carbon Credits",
      section2: "II. International Standards and Regulations",
      section3: "III. Measurement and Calculation Methods",
      section4: "IV. Carbon Credit Project Development",
      section5: "V. Carbon Credit Market",
      section6: "VI. ESG and Sustainability Reporting",
      section7: "VII. Industry-specific In-depth Documents",
      section8: "VIII. Case Studies and Lessons Learned",
    },
    vi: {
      heroTitle: "CARBON TOÀN THƯ 4.0",
      heroSubtitle:
        "Kho tàng tri thức toàn diện về tín chỉ carbon với hơn 600 tài liệu, nghiên cứu, báo cáo chuyên sâu và trợ lý AI thông minh CarbonSeek",
      featuredProduct: "Sản phẩm nổi bật",
      registerNow: "Đăng ký ngay",
      tryFree: "Dùng thử",
      productIntro: "Giới thiệu sản phẩm",
      exploreTitle: "Khám phá Carbon Toàn Thư 4.0",
      exploreDesc:
        "Xem video giới thiệu để hiểu rõ hơn về sản phẩm và các tính năng nổi bật",
      comprehensiveSolution: "Giải pháp tri thức toàn diện",
      comprehensiveDesc:
        "Carbon Toàn Thư 4.0 là kho tri thức toàn diện với hơn 600 tài liệu, nghiên cứu, báo cáo chuyên sâu về Carbon Credits, ESG & CSR, kết hợp với trợ lý AI hiện đại nhất hiện nay. Sản phẩm này giúp bạn giải đáp mọi thắc mắc, cá nhân hóa thông tin theo nhu cầu, tính toán chính xác trữ lượng carbon rừng và cập nhật tin tức mới nhất về thị trường Carbon.",
      over600Docs: "Hơn 600 tài liệu, nghiên cứu, báo cáo chuyên sâu",
      carbonSeekAI: "Trợ lý AI CarbonSeek 24/7",
      continuousUpdates: "Cập nhật liên tục",
      internationalStandards: "Tiêu chuẩn quốc tế",
      aiAssistant: "Trợ lý AI thông minh",
      carbonSeekTitle: "CarbonSeek - Trợ lý AI Carbon Assistant",
      carbonSeekDesc:
        "Trợ lý ảo thông minh giải đáp mọi thắc mắc về tín chỉ carbon, hướng dẫn quy trình và cung cấp thông tin chuyên ngành",
      carbonSeekIntro:
        "CarbonSeek là trợ lý ảo thông minh của TCCV, được phát triển để giải đáp mọi thắc mắc về tín chỉ carbon, hướng dẫn quy trình liên quan về tín chỉ carbon, tính toán trữ lượng carbon và cung cấp thông tin chuyên ngành và các thông tin cập nhật liên tục về thị trường Carbon.",
      smartAnswers: "Trả lời thông minh 24/7",
      smartAnswersDesc:
        "Giải đáp mọi thắc mắc về tín chỉ carbon bất kỳ lúc nào",
      massiveDatabase: "Kho dữ liệu khổng lồ",
      massiveDatabaseDesc:
        "Được huấn luyện trên hơn 600 tài liệu, nghiên cứu, báo cáo chuyên sâu về tín chỉ carbon",
      accurateCalculations: "Tính toán chính xác",
      accurateCalculationsDesc:
        "Hỗ trợ tính toán trữ lượng carbon rừng theo các tiêu chuẩn quốc tế",
      contentOverview: "Nội dung phong phú",
      tableOfContents: "Mục lục Carbon Toàn Thư 4.0",
      tableOfContentsDesc:
        "Khám phá kho tàng tri thức toàn diện với hơn 600 tài liệu, nghiên cứu, báo cáo chuyên sâu được phân loại khoa học",
      diverseContent: "Nội dung đa dạng và toàn diện",
      diverseContentDesc:
        "Carbon Toàn Thư 4.0 bao gồm các nội dung chuyên sâu được phân loại thành các mục chính:",
      basicKnowledge: "Kiến thức cơ bản về tín chỉ carbon",
      basicKnowledgeDesc:
        "Các khái niệm, định nghĩa và nguyên lý cơ bản về tín chỉ carbon",
      internationalStandardsRegs: "Tiêu chuẩn và quy định quốc tế",
      internationalStandardsRegsDesc:
        "Các tiêu chuẩn như VCS, Gold Standard, CDM và quy định liên quan",
      measurementMethods: "Phương pháp đo lường và tính toán",
      measurementMethodsDesc:
        "Các phương pháp đo lường, tính toán và kiểm kê khí nhà kính",
      projectDevelopment: "Phát triển dự án tín chỉ carbon",
      projectDevelopmentDesc:
        "Hướng dẫn chi tiết về quy trình phát triển dự án tín chỉ carbon",
      marketUpdates: "Cập nhật thị trường",
      marketUpdatesDesc:
        "Thông tin mới nhất về thị trường tín chỉ carbon trong nước và quốc tế",
      successfulProjects: "Dự án thực tế thành công",
      successfulProjectsDesc:
        "Các dự án thực tế thành công về tín chỉ carbon tại Việt Nam và quốc tế",
      comprehensiveESG: "Báo cáo ESG toàn diện",
      comprehensiveESGDesc:
        "Hướng dẫn xây dựng và mẫu báo cáo ESG theo tiêu chuẩn quốc tế",
      latestRegulations: "Nghị định pháp lý mới nhất",
      latestRegulationsDesc:
        "Toàn bộ các nghị định pháp lý mới nhất về thị trường carbon tại Việt Nam và quốc tế",
      downloadTOC: "Tải mục lục chi tiết",
      tryReport: "Trải nghiệm thử báo cáo",
      keyFeatures: "Tính năng nổi bật",
      exploreEncyclopedia: "Khám phá Carbon Toàn Thư 4.0",
      featuresDesc:
        "Sản phẩm được thiết kế với nhiều tính năng hiện đại giúp bạn tiếp cận dễ dàng với kiến thức về tín chỉ carbon",
      comprehensiveLibrary: "Thư viện tài liệu toàn diện",
      comprehensiveLibraryDesc:
        "Hơn 600 nghiên cứu, tài liệu và báo cáo chuyên sâu về Carbon Credits, ESG & CSR, được phân loại và tổ chức khoa học",
      carbonSeekAssistant: "Trợ lý AI CarbonSeek",
      carbonSeekAssistantDesc:
        "Trợ lý ảo thông minh hoạt động 24/7, giải đáp mọi thắc mắc và cung cấp thông tin chính xác",
      carbonCalculationTools: "Công cụ tính toán carbon",
      carbonCalculationToolsDesc:
        "Tính toán chính xác trữ lượng carbon rừng và lượng phát thải theo các tiêu chuẩn quốc tế",
      continuousUpdatesFeature: "Cập nhật liên tục",
      continuousUpdatesFeatureDesc:
        "Thông tin thị trường và tài liệu mới được cập nhật thường xuyên, đảm bảo tính thời sự",
      exclusiveDocuments: "Tài liệu độc quyền",
      exclusiveDocumentsDesc:
        "10 bộ tài liệu độc quyền dành riêng cho thị trường Việt Nam, không có ở bất kỳ đâu khác",
      multiPlatformSupport: "Hỗ trợ đa nền tảng",
      multiPlatformSupportDesc:
        "Truy cập tài liệu và sử dụng trợ lý AI trên nhiều thiết bị và nền tảng khác nhau",
      pricing: "Bảng giá",
      investInKnowledge: "Đầu tư cho kiến thức",
      pricingDesc:
        "Lựa chọn gói sản phẩm phù hợp với nhu cầu ca bạn - Đầu tư một lần, giá trị trọn đời",
      trial: "Dùng thử",
      free: "Miễn phí",
      trialDays: "14 ngày trải nghiệm",
      forStudents: "Dành cho sinh viên và người mới bắt đầu",
      noDocsInTrial: "Không có tài liệu khi dùng thử",
      noDocsInTrialDesc: "Chỉ trải nghiệm các tính năng cơ bản.",
      basicAI: "AI CarbonSeek cơ bản",
      basicAIDesc: "Hỏi đáp kiến thức cơ bản.",
      monthlyUpdates: "Cập nhật hàng tháng",
      monthlyUpdatesDesc: "Thông tin thị trường cơ bản.",
      trialBenefits: "Lợi ích khi sử dụng:",
      trialBenefit1: "Làm quen với tín chỉ carbon",
      trialBenefit2: "Trải nghiệm trợ lý AI",
      trialBenefit3: "Tiếp cận kiến thức cơ bản",
      trialSuitableFor:
        "Phù hợp cho sinh viên và người mới bắt đầu muốn tìm hiểu về tín chỉ carbon trước khi quyết định đầu tư.",
      tryNow: "Dùng thử ngay",
      research: "Nghiên cứu",
      researchPrice: "480.000 đ",
      promoUntil: "Giá khuyến mãi đến 04/03",
      forStudentsDiscount: "Dành riêng cho sinh viên với giá ưu đãi",
      access300Docs: "Truy cập 300+ tài liệu",
      access300DocsDesc: "Tài liệu cơ bản và nâng cao.",
      advancedAI: "AI CarbonSeek nâng cao",
      advancedAIDesc: "Hỗ trợ nghiên cứu và học tập.",
      updatesFor1Year: "Cập nhật trong 1 năm",
      updatesFor1YearDesc: "Thông tin thị trường định kỳ.",
      emailSupport: "Hỗ trợ qua email",
      emailSupportDesc: "Giải đáp thắc mắc trong học tập.",
      researchBenefits: "Lợi ích khi sử dụng:",
      researchBenefit1: "Tiết kiệm thời gian nghiên cứu",
      researchBenefit2: "Hỗ trợ làm luận văn, đồ án",
      researchBenefit3: "Nâng cao kiến thức chuyên môn",
      researchBenefit4: "Giảm 10% khi đăng ký nhóm 5+",
      researchSuitableFor:
        "Phù hợp cho sinh viên các ngành môi trường, kinh tế, quản lý tài nguyên, phát triển bền vững và các ngành liên quan.",
      expert: "Chuyên gia",
      expertPrice: "560.000 đ",
      forProfessionals: "Dành cho chuyên gia và người đi làm",
      accessAllDocs: "Truy cập toàn bộ 600+ tài liệu, nghiên cứu, báo cáo",
      accessAllDocsDesc: "Bao gồm báo cáo nghiên cứu và case study.",
      advancedCarbonSeek: "AI CarbonSeek chuyên sâu",
      advancedCarbonSeekDesc:
        "Tư vấn chiến lược và phân tích nâng cao theo cá nhân hóa từng doanh nghiệp.",
      quarterlyMarketReports: "Báo cáo thị trường hàng quý",
      quarterlyMarketReportsDesc: "Cập nhật xu hướng và số liệu thực tế.",
      oneOnOneConsultation: "Tư vấn 1-1 với chuyên gia",
      oneOnOneConsultationDesc: "1 buổi tư vấn trực tiếp (30 phút/buổi).",
      quarterlyWebinars: "Hội thảo trực tuyến hàng quý",
      quarterlyWebinarsDesc: "Với các chuyên gia đầu ngành.",
      prioritySupport: "Hỗ trợ ưu tiên 24/7",
      prioritySupportDesc: "Qua live chat hoặc email.",
      expertBenefits: "Lợi ích khi sử dụng:",
      expertBenefit1: "Tiết kiệm 70% thời gian nghiên cứu",
      expertBenefit2: "Tư vấn trực tiếp từ chuyên gia",
      expertBenefit3: "Phân tích dữ liệu dự án cụ thể",
      expertBenefit4: "Nâng cao năng lực chuyên môn",
      expertSuitableFor:
        "Dành cho chuyên gia ESG, quản lý dự án, tư vấn môi trường, nhà đầu tư và những người làm việc trong lĩnh vực phát triển bền vững.",
      enterprise: "Doanh nghiệp",
      contactForPrice: "Liên hệ",
      customPricing: "Giá tùy chỉnh theo nhu cầu",
      comprehensiveSolutionForBusiness: "Giải pháp toàn diện cho doanh nghiệp",
      allExpertFeatures: "Tất cả tính năng gói Chuyên gia",
      allExpertFeaturesDesc: "Cho nhiều người dùng trong doanh nghiệp.",
      departmentUserManagement: "Quản lý người dùng theo phòng ban",
      departmentUserManagementDesc: "Phân quyền và quản lý truy cập.",
      customInHouseTraining: "Đào tạo nội bộ tùy chỉnh",
      customInHouseTrainingDesc: "Chương trình đào tạo riêng cho nhân viên.",
      carbonAndCBAMStrategy: "Tư vấn chiến lược carbon & CBAM",
      carbonAndCBAMStrategyDesc: "Đảm bảo tuân thủ quy định quốc tế.",
      carbonSeekAPIIntegration: "Tích hợp API CarbonSeek",
      carbonSeekAPIIntegrationDesc:
        "Kết nối với hệ thống nội bộ của doanh nghiệp.",
      industrySpecificReports: "Báo cáo chuyên ngành riêng",
      industrySpecificReportsDesc: "Phân tích theo lĩnh vực kinh doanh cụ thể.",
      cbamComplianceESG:
        "Tuân thủ quy định CBAM và nâng cao uy tín ESG của doanh nghiệp",
      enterpriseSuitableFor:
        "Phù hợp cho các doanh nghiệp vừa và lớn muốn nâng cao năng lực đội ngũ, đáp ứng yêu cầu pháp lý quốc tế, đồng thời triển khai các dự án kiểm kê carbon, ESG một cách toàn diện.",
      contactForConsultation: "Liên hệ tư vấn",
      groupRegistration: "Đăng ký theo nhóm và nhận ưu đãi đặc biệt",
      groupDiscounts:
        "Giảm 10% cho nhóm 5+ người, giảm 15% cho nhóm 10+ người, và giảm 20% cho nhóm 20+ người. Liên hệ với chúng tôi để nhận báo giá cho đơn hàng số lượng lớn.",
      registerAsGroup: "Đăng ký theo nhóm",
      faqSection: "Câu hỏi thường gặp",
      commonQuestions: "Những câu hỏi thường gặp về Carbon Toàn Thư 4.0",
      faq1: "Carbon Toàn Thư 4.0, sản phẩm là gì?",
      faq1Answer:
        "Carbon Toàn Thư 4.0 là kho tri thức toàn diện với hơn 600 nghiên cứu, tài liệu và báo cáo chuyên sâu về Carbon Credits, ESG & CSR, kết hợp với trợ lý AI hiện đại nhất hiện nay. Sản phẩm này giúp bạn giải đáp mọi thắc mắc, cá nhân hóa thông tin theo nhu cầu, tính toán chính xác trữ lượng carbon rừng và cập nhật tin tức mới nhất về thị trường Carbon.",
      faq2: "Giá bán của Carbon Toàn Thư 4.0 là bao nhiêu?",
      faq2Answer:
        "Hiện tại Carbon Toàn Thư 4.0 đang sử dụng trong 1 năm và update liên tục, có giá là 600.000 VNĐ",
      faq3: "AI Chatbot – AI Carbon Assistant - CarbonSeek là gì và hoạt động như thế nào?",
      faq3Answer:
        "CarbonSeek là trợ lý ảo thông minh của TCCV, được phát triển để giải đáp mọi thắc mắc về tín chỉ carbon, hướng dẫn quy trình liên quan về tín chỉ carbon, tính toán trữ lượng carbon và cung cấp thông tin chuyên ngành và các thông tin cập nhật liên tục về thị trường Carbon. Trợ lý hoạt động 24/7 giúp bạn nhận câu trả lời nhanh chóng và chính xác.",
      faq4: "Sau khi mua, tôi có được cập nhật thêm tài liệu mới không?",
      faq4Answer:
        "Sau khi mua, bạn sẽ được cấp quyền truy cập vào đường link độc quyền, sản phẩm thường xuyên cập nhật các tài liệu mới, báo cáo và thông tin pháp lý liên quan đến tín chỉ carbon. Bạn sẽ luôn nhận được thông tin mới nhất.",
      faq5: "Tôi có thể áp dụng kiến thức từ Carbon Toàn Thư 4.0 vào thực tế như thế nào?",
      faq5Answer:
        "Bạn có thể ứng dụng kiến thức từ Carbon Toàn Thư 4.0 vào nhiều lĩnh vực như xây dựng chiến lược giảm phát thải, quản lý dự án tín chỉ carbon, triển khai chương trình CSR & ESG, cũng như nghiên cứu và đào tạo. Sản phẩm này giúp chuyển đổi lý thuyết thành thực tiễn một cách hiệu quả.",
      readyToEnhance: "Sẵn sàng nâng cao kiến thức về tín chỉ carbon?",
      signUpToday:
        "Đăng ký Carbon Toàn Thư 4.0 ngay hôm nay và nhận ưu đãi đặc biệt.",
      mostPopular: "ĐƯỢC LỰA CHỌN NHIỀU NHẤT",
      fullTableOfContents: "Mục lục đầy đủ",
      viewFullTOC: "Xem mục lục đầy đủ",
      section1: "I. Kiến thức cơ bản về tín chỉ carbon",
      section2: "II. Tiêu chuẩn và quy định quốc tế",
      section3: "III. Phương pháp đo lường và tính toán",
      section4: "IV. Phát triển dự án tín chỉ carbon",
      section5: "V. Thị trường tín chỉ carbon",
      section6: "VI. ESG và Báo cáo bền vững",
      section7: "VII. Tài liệu chuyên sâu theo ngành",
      section8: "VIII. Nghiên cứu tình huống và bài học kinh nghiệm",
    },
  };

  const getText = (key: string) => {
    return translations[language][key as keyof typeof translations["vi"]] || translations["vi"][key as keyof typeof translations["vi"]];
  };

  // Complete table of contents data
  const completeTableOfContents = {
    en: [
      {
        section: "I. Basic Knowledge of Carbon Credits",
        items: [
          {
            title: "1. Carbon Credit Concepts and Definitions",
            subitems: [
              "1.1. Carbon credit definition and measurement units",
              "1.2. Distinguishing between carbon offset and carbon credit",
              "1.3. Basic industry terminology",
            ],
          },
          {
            title: "2. History of Carbon Market Development",
            subitems: [
              "2.1. Kyoto Protocol and the birth of the carbon market",
              "2.2. Development stages of the global carbon market",
              "2.3. Carbon market in Vietnam - History and prospects",
            ],
          },
          {
            title: "3. Types of Carbon Credits",
            subitems: [
              "3.1. Carbon credits from forestry projects",
              "3.2. Carbon credits from renewable energy",
              "3.3. Carbon credits from agriculture",
              "3.4. Carbon credits from waste management",
            ],
          },
          {
            title: "4. Carbon Cycle and Climate Change",
            subitems: [
              "4.1. Natural carbon cycle",
              "4.2. Human impact on the carbon cycle",
              "4.3. Relationship between carbon and climate change",
            ],
          },
          {
            title: "5. Greenhouse Gases and Global Warming Potential",
            subitems: [
              "5.1. CO2 and main greenhouse gases",
              "5.2. Global Warming Potential (GWP) index",
              "5.3. Converting greenhouse gases to CO2e",
            ],
          },
        ],
      },
      {
        section: "II. International Standards and Regulations",
        items: [
          {
            title: "1. Verified Carbon Standard (VCS)",
            subitems: [
              "1.1. VCS verification and certification process",
              "1.2. Additionality requirements",
              "1.3. Methodologies accepted in VCS",
            ],
          },
          {
            title: "2. Gold Standard",
            subitems: [
              "2.1. Sustainable development requirements",
              "2.2. Community consultation process",
              "2.3. Comparison of Gold Standard with other standards",
            ],
          },
          {
            title: "3. Clean Development Mechanism (CDM)",
            subitems: [
              "3.1. CDM project approval process",
              "3.2. CDM methodologies",
              "3.3. Future of CDM after the Paris Agreement",
            ],
          },
          {
            title: "4. Paris Agreement and NDCs",
            subitems: [
              "4.1. Article 6 and market mechanisms",
              "4.2. Nationally Determined Contributions (NDCs)",
              "4.3. Impact of the Paris Agreement on the carbon market",
            ],
          },
          {
            title: "5. CORSIA Regulations in the Aviation Industry",
            subitems: [
              "5.1. Objectives and scope of application",
              "5.2. Implementation phases",
              "5.3. Impact on the carbon credit market",
            ],
          },
          {
            title: "6. EU CBAM Regulations",
            subitems: [
              "6.1. Carbon Border Adjustment Mechanism",
              "6.2. Implementation roadmap and affected industries",
              "6.3. Impact on Vietnam's exports",
            ],
          },
        ],
      },
      {
        section: "III. Measurement and Calculation Methods",
        items: [
          {
            title: "1. Greenhouse Gas Inventory Methods",
            subitems: [
              "1.1. GHG Protocol standard",
              "1.2. ISO 14064 standard",
              "1.3. IPCC methodology",
            ],
          },
          {
            title: "2. Carbon Footprint Calculation",
            subitems: [
              "2.1. Product Carbon Footprint (PCF)",
              "2.2. Organizational Carbon Footprint (OCF)",
              "2.3. Life Cycle Assessment (LCA)",
            ],
          },
          {
            title: "3. Measuring and Monitoring Carbon in Forestry",
            subitems: [
              "3.1. Biomass measurement methods",
              "3.2. Using remote sensing and GIS technology",
              "3.3. Establishing sample plots and monitoring",
            ],
          },
          {
            title: "4. MRV (Measurement, Reporting, Verification) Methods",
            subitems: [
              "4.1. Designing MRV systems",
              "4.2. Data collection and management",
              "4.3. Independent verification process",
            ],
          },
          {
            title: "5. Sector-specific Carbon Calculation Tools",
            subitems: [
              "5.1. Tools for the energy sector",
              "5.2. Tools for the forestry sector",
              "5.3. Tools for the agriculture sector",
              "5.4. Tools for the construction sector",
            ],
          },
        ],
      },
      {
        section: "IV. Carbon Credit Project Development",
        items: [
          {
            title: "1. Carbon Credit Project Development Process",
            subitems: [
              "1.1. Initial feasibility study",
              "1.2. Project design and baseline scenario development",
              "1.3. Stakeholder consultation",
              "1.4. Project registration and verification",
              "1.5. Monitoring and credit issuance",
            ],
          },
          {
            title: "2. REDD+ and Forestry Projects",
            subitems: [
              "2.1. REDD+ mechanism and key activities",
              "2.2. Afforestation and Reforestation (AR) projects",
              "2.3. Improved Forest Management (IFM) projects",
              "2.4. Agroforestry projects",
            ],
          },
          {
            title: "3. Renewable Energy Projects",
            subitems: [
              "3.1. Solar energy projects",
              "3.2. Wind energy projects",
              "3.3. Small hydropower projects",
              "3.4. Biomass projects",
            ],
          },
          {
            title: "4. Sustainable Agriculture Projects",
            subitems: [
              "4.1. Agricultural land management",
              "4.2. Agricultural waste management",
              "4.3. Sustainable rice cultivation",
              "4.4. Sustainable livestock management",
            ],
          },
          {
            title: "5. Waste Management Projects",
            subitems: [
              "5.1. Landfill methane recovery",
              "5.2. Wastewater treatment",
              "5.3. Recycling and reuse",
            ],
          },
          {
            title: "6. Project Design Document (PDD) Development",
            subitems: [
              "6.1. PDD structure and content",
              "6.2. Baseline scenario development",
              "6.3. Emission reduction calculation",
              "6.4. Monitoring plan",
            ],
          },
        ],
      },
      {
        section: "V. Carbon Credit Market",
        items: [
          {
            title: "1. Compliance and Voluntary Markets",
            subitems: [
              "1.1. EU Emissions Trading System (EU ETS)",
              "1.2. Global voluntary market",
              "1.3. Comparison between the two markets",
            ],
          },
          {
            title: "2. Carbon Pricing Mechanisms",
            subitems: [
              "2.1. Carbon tax",
              "2.2. Cap-and-trade systems",
              "2.3. Factors affecting carbon credit prices",
            ],
          },
          {
            title: "3. Carbon Credit Trading",
            subitems: [
              "3.1. Carbon exchanges",
              "3.2. Brokers and intermediaries",
              "3.3. Emission Reduction Purchase Agreements (ERPAs)",
              "3.4. Blockchain and tokenization in carbon trading",
            ],
          },
          {
            title: "4. Global Market Trends",
            subitems: [
              "4.1. Market analysis for 2020-2025",
              "4.2. Market forecast to 2030",
              "4.3. Challenges and opportunities",
            ],
          },
          {
            title: "5. Carbon Market in Vietnam",
            subitems: [
              "5.1. Current legal framework",
              "5.2. Roadmap for domestic carbon market development",
              "5.3. Opportunities for Vietnamese businesses",
            ],
          },
        ],
      },
      {
        section: "VI. ESG and Sustainability Reporting",
        items: [
          {
            title: "1. ESG Reporting Frameworks",
            subitems: [
              "1.1. SASB standards",
              "1.2. IIRC framework",
              "1.3. CDP standards",
            ],
          },
          {
            title: "2. GRI Standards",
            subitems: [
              "2.1. GRI report structure",
              "2.2. Climate-related GRI indicators",
              "2.3. GRI reporting process",
            ],
          },
          {
            title: "3. Scope 1, 2, 3 Emissions Reporting",
            subitems: [
              "3.1. Definition and classification of Scope 1, 2, 3",
              "3.2. Calculation methods for each Scope",
              "3.3. Emission reduction strategies by Scope",
            ],
          },
          {
            title: "4. Net Zero Strategy",
            subitems: [
              "4.1. Net Zero definition and timeframe",
              "4.2. Building a Net Zero roadmap",
              "4.3. Role of carbon credits in Net Zero strategy",
              "4.4. Global corporate Net Zero commitments",
            ],
          },
          {
            title:
              "5. Task Force on Climate-related Financial Disclosures (TCFD)",
            subitems: [
              "5.1. The four pillars of TCFD",
              "5.2. Climate risk assessment",
              "5.3. Integrating TCFD into corporate reporting",
            ],
          },
        ],
      },
      {
        section: "VII. Industry-specific In-depth Documents",
        items: [
          {
            title: "1. Energy Sector",
            subitems: [
              "1.1. Transition from fossil fuels to renewable energy",
              "1.2. Energy efficiency and emission reduction",
              "1.3. Carbon Capture and Storage (CCS) technology",
            ],
          },
          {
            title: "2. Forestry Sector",
            subitems: [
              "2.1. Sustainable forest management",
              "2.2. Forest ecosystem restoration",
              "2.3. Responsible timber supply chains",
              "2.4. Biodiversity conservation",
            ],
          },
          {
            title: "3. Agriculture Sector",
            subitems: [
              "3.1. Climate-smart agriculture",
              "3.2. Soil management and soil carbon",
              "3.3. Reducing emissions from livestock",
              "3.4. Water and fertilizer management",
            ],
          },
          {
            title: "4. Industrial Sector",
            subitems: [
              "4.1. Steel and cement industries",
              "4.2. Chemical industry",
              "4.3. Textile industry",
              "4.4. Electronics industry",
            ],
          },
          {
            title: "5. Construction Sector",
            subitems: [
              "5.1. Green buildings and certification",
              "5.2. Environmentally friendly construction materials",
              "5.3. Energy efficiency in buildings",
            ],
          },
          {
            title: "6. Transportation Sector",
            subitems: [
              "6.1. Electric and hybrid vehicles",
              "6.2. Biofuels and hydrogen",
              "6.3. Sustainable aviation and maritime transport",
              "6.4. Urban planning and public transportation",
            ],
          },
        ],
      },
      {
        section: "VIII. Case Studies and Lessons Learned",
        items: [
          {
            title: "1. Successful Carbon Credit Projects in Vietnam",
            subitems: [],
          },
          {
            title: "2. Successful Carbon Credit Projects Worldwide",
            subitems: [],
          },
          {
            title: "3. Lessons from Failed Projects",
            subitems: [],
          },
          {
            title: "4. Net Zero Strategies of Major Corporations",
            subitems: [],
          },
          {
            title: "5. Innovative Business Models in the Carbon Sector",
            subitems: [],
          },
        ],
      },
    ],
    vi: [
      {
        section: "I. Kiến thức cơ bản về tín chỉ carbon",
        items: [
          {
            title: "1. Khái niệm và định nghĩa tín chỉ carbon",
            subitems: [
              "1.1. Định nghĩa tín chỉ carbon và đơn vị đo lường",
              "1.2. Phân biệt giữa carbon offset và carbon credit",
              "1.3. Các thuật ngữ chuyên ngành cơ bản",
            ],
          },
          {
            title: "2. Lịch sử phát triển thị trường carbon",
            subitems: [
              "2.1. Nghị định thư Kyoto và sự ra đời của thị trường carbon",
              "2.2. Các giai đoạn phát triển của thị trường carbon toàn cầu",
              "2.3. Thị trường carbon tại Việt Nam - Lịch sử và triển vọng",
            ],
          },
          {
            title: "3. Các loại tín chỉ carbon",
            subitems: [
              "3.1. Tín chỉ carbon từ dự án lâm nghiệp",
              "3.2. Tín chỉ carbon từ năng lượng tái tạo",
              "3.3. Tín chỉ carbon từ nông nghiệp",
              "3.4. Tín chỉ carbon từ xử lý chất thải",
            ],
          },
          {
            title: "4. Chu trình carbon và biến đổi khí hậu",
            subitems: [
              "4.1. Chu trình carbon trong tự nhiên",
              "4.2. Tác động của con người đến chu trình carbon",
              "4.3. Mối liên hệ giữa carbon và biến đổi khí hậu",
            ],
          },
          {
            title: "5. Các khí nhà kính và tiềm năng gây nóng toàn cầu",
            subitems: [
              "5.1. CO2 và các khí nhà kính chính",
              "5.2. Chỉ số GWP (Global Warming Potential)",
              "5.3. Quy đổi các khí nhà kính sang CO2e",
            ],
          },
        ],
      },
      {
        section: "II. Tiêu chuẩn và quy định quốc tế",
        items: [
          {
            title: "1. Tiêu chuẩn VCS (Verified Carbon Standard)",
            subitems: [
              "1.1. Quy trình xác minh và chứng nhận VCS",
              "1.2. Yêu cầu về tính bổ sung (Additionality)",
              "1.3. Phương pháp luận được chấp nhận trong VCS",
            ],
          },
          {
            title: "2. Tiêu chuẩn Gold Standard",
            subitems: [
              "2.1. Các yêu cầu về phát triển bền vững",
              "2.2. Quy trình tham vấn cộng đồng",
              "2.3. So sánh Gold Standard với các tiêu chuẩn khác",
            ],
          },
          {
            title: "3. Cơ chế phát triển sạch (CDM)",
            subitems: [
              "3.1. Quy trình phê duyệt dự án CDM",
              "3.2. Phương pháp luận CDM",
              "3.3. Tương lai của CDM sau Hiệp định Paris",
            ],
          },
          {
            title: "4. Hiệp định Paris và NDCs",
            subitems: [
              "4.1. Điều 6 và cơ chế thị trường",
              "4.2. Đóng góp do quốc gia tự quyết định (NDCs)",
              "4.3. Tác động của Hiệp định Paris đến thị trường carbon",
            ],
          },
          {
            title: "5. Quy định CORSIA trong ngành hàng không",
            subitems: [
              "5.1. Mục tiêu và phạm vi áp dụng",
              "5.2. Các giai đoạn thực hiện",
              "5.3. Tác động đến thị trường tín chỉ carbon",
            ],
          },
          {
            title: "6. Quy định CBAM của Liên minh Châu Âu",
            subitems: [
              "6.1. Cơ chế điều chỉnh biên giới carbon",
              "6.2. Lộ trình áp dụng và các ngành bị ảnh hưởng",
              "6.3. Tác động đến xuất khẩu của Việt Nam",
            ],
          },
        ],
      },
      {
        section: "III. Phương pháp đo lường và tính toán",
        items: [
          {
            title: "1. Phương pháp kiểm kê khí nhà kính",
            subitems: [
              "1.1. Tiêu chuẩn GHG Protocol",
              "1.2. Tiêu chuẩn ISO 14064",
              "1.3. Phương pháp IPCC",
            ],
          },
          {
            title: "2. Tính toán carbon footprint",
            subitems: [
              "2.1. Carbon footprint của sản phẩm (PCF)",
              "2.2. Carbon footprint của tổ chức (OCF)",
              "2.3. Phân tích vòng đời sản phẩm (LCA)",
            ],
          },
          {
            title: "3. Đo lường và giám sát carbon trong lâm nghiệp",
            subitems: [
              "3.1. Phương pháp đo lường sinh khối",
              "3.2. Sử dụng công nghệ viễn thám và GIS",
              "3.3. Thiết lập ô mẫu và quan trắc",
            ],
          },
          {
            title: "4. Phương pháp MRV (Đo lường, Báo cáo, Thẩm định)",
            subitems: [
              "4.1. Thiết kế hệ thống MRV",
              "4.2. Thu thập và quản lý dữ liệu",
              "4.3. Quy trình thẩm định độc lập",
            ],
          },
          {
            title: "5. Công cụ tính toán carbon theo ngành",
            subitems: [
              "5.1. Công cụ cho ngành năng lượng",
              "5.2. Công cụ cho ngành lâm nghiệp",
              "5.3. Công cụ cho ngành nông nghiệp",
              "5.4. Công cụ cho ngành xây dựng",
            ],
          },
        ],
      },
      {
        section: "IV. Phát triển dự án tín chỉ carbon",
        items: [
          {
            title: "1. Quy trình phát triển dự án tín chỉ carbon",
            subitems: [
              "1.1. Nghiên cứu khả thi ban đầu",
              "1.2. Thiết kế dự án và xây dựng kịch bản cơ sở",
              "1.3. Tham vấn các bên liên quan",
              "1.4. Đăng ký và xác minh dự án",
              "1.5. Giám sát và phát hành tín chỉ",
            ],
          },
          {
            title: "2. Dự án REDD+ và lâm nghiệp",
            subitems: [
              "2.1. Cơ chế REDD+ và các hoạt động chính",
              "2.2. Dự án trồng rừng và tái trồng rừng (AR)",
              "2.3. Dự án quản lý rừng bền vững (IFM)",
              "2.4. Dự án nông lâm kết hợp",
            ],
          },
          {
            title: "3. Dự án năng lượng tái tạo",
            subitems: [
              "3.1. Dự án năng lượng mặt trời",
              "3.2. Dự án năng lượng gió",
              "3.3. Dự án thủy điện nhỏ",
              "3.4. Dự án sinh khối",
            ],
          },
          {
            title: "4. Dự án nông nghiệp bền vững",
            subitems: [
              "4.1. Quản lý đất nông nghiệp",
              "4.2. Quản lý chất thải nông nghiệp",
              "4.3. Canh tác lúa bền vững",
              "4.4. Chăn nuôi bền vững",
            ],
          },
          {
            title: "5. Dự án xử lý chất thải",
            subitems: [
              "5.1. Thu hồi khí metan từ bãi chôn lấp",
              "5.2. Xử lý nước thải",
              "5.3. Tái chế và tái sử dụng",
            ],
          },
          {
            title: "6. Phát triển PDD (Tài liệu thiết kế dự án)",
            subitems: [
              "6.1. Cấu trúc và nội dung của PDD",
              "6.2. Xây dựng kịch bản cơ sở",
              "6.3. Tính toán giảm phát thải",
              "6.4. Kế hoạch giám sát",
            ],
          },
        ],
      },
      {
        section: "V. Thị trường tín chỉ carbon",
        items: [
          {
            title: "1. Thị trường bắt buộc và tự nguyện",
            subitems: [
              "1.1. Hệ thống giao dịch phát thải EU ETS",
              "1.2. Thị trường tự nguyện toàn cầu",
              "1.3. So sánh giữa hai loại thị trường",
            ],
          },
          {
            title: "2. Cơ chế định giá carbon",
            subitems: [
              "2.1. Thuế carbon",
              "2.2. Hệ thống cap-and-trade",
              "2.3. Các yếu tố ảnh hưởng đến giá tín chỉ carbon",
            ],
          },
          {
            title: "3. Giao dịch tín chỉ carbon",
            subitems: [
              "3.1. Sàn giao dịch carbon",
              "3.2. Môi giới và trung gian",
              "3.3. Hợp đồng mua bán tín chỉ carbon (ERPA)",
              "3.4. Blockchain và tokenization trong giao dịch carbon",
            ],
          },
          {
            title: "4. Xu hướng thị trường toàn cầu",
            subitems: [
              "4.1. Phân tích thị trường giai đoạn 2020-2025",
              "4.2. Dự báo thị trường đến năm 2030",
              "4.3. Các thách thức và cơ hội",
            ],
          },
          {
            title: "5. Thị trường carbon tại Việt Nam",
            subitems: [
              "5.1. Khung pháp lý hiện tại",
              "5.2. Lộ trình phát triển thị trường carbon nội địa",
              "5.3. Cơ hội cho doanh nghiệp Việt Nam",
            ],
          },
        ],
      },
      {
        section: "VI. ESG và Báo cáo bền vững",
        items: [
          {
            title: "1. Khung báo cáo ESG",
            subitems: [
              "1.1. Tiêu chuẩn SASB",
              "1.2. Khung báo cáo IIRC",
              "1.3. Tiêu chuẩn CDP",
            ],
          },
          {
            title: "2. Tiêu chuẩn GRI",
            subitems: [
              "2.1. Cấu trúc báo cáo GRI",
              "2.2. Các chỉ số GRI liên quan đến khí hậu",
              "2.3. Quy trình xây dựng báo cáo GRI",
            ],
          },
          {
            title: "3. Báo cáo phát thải Scope 1, 2, 3",
            subitems: [
              "3.1. Định nghĩa và phân loại Scope 1, 2, 3",
              "3.2. Phương pháp tính toán cho từng Scope",
              "3.3. Chiến lược giảm phát thải theo Scope",
            ],
          },
          {
            title: "4. Chiến lược Net Zero",
            subitems: [
              "4.1. Định nghĩa và khung thời gian Net Zero",
              "4.2. Xây dựng lộ trình Net Zero",
              "4.3. Vai trò của tín chỉ carbon trong chiến lược Net Zero",
              "4.4. Các cam kết Net Zero của doanh nghiệp toàn cầu",
            ],
          },
          {
            title:
              "5. Công bố thông tin tài chính liên quan đến khí hậu (TCFD)",
            subitems: [
              "5.1. Bốn trụ cột của TCFD",
              "5.2. Đánh giá rủi ro khí hậu",
              "5.3. Tích hợp TCFD vào báo cáo doanh nghiệp",
            ],
          },
        ],
      },
      {
        section: "VII. Tài liệu chuyên sâu theo ngành",
        items: [
          {
            title: "1. Ngành năng lượng",
            subitems: [
              "1.1. Chuyển đổi từ nhiên liệu hóa thạch sang năng lượng tái tạo",
              "1.2. Hiệu quả năng lượng và giảm phát thải",
              "1.3. Công nghệ thu giữ và lưu trữ carbon (CCS)",
            ],
          },
          {
            title: "2. Ngành lâm nghiệp",
            subitems: [
              "2.1. Quản lý rừng bền vững",
              "2.2. Phục hồi hệ sinh thái rừng",
              "2.3. Chuỗi cung ứng gỗ có trách nhiệm",
              "2.4. Bảo tồn đa dạng sinh học",
            ],
          },
          {
            title: "3. Ngành nông nghiệp",
            subitems: [
              "3.1. Nông nghiệp thông minh với khí hậu",
              "3.2. Quản lý đất và carbon trong đất",
              "3.3. Giảm phát thải từ chăn nuôi",
              "3.4. Quản lý nước và phân bón",
            ],
          },
          {
            title: "4. Ngành công nghiệp",
            subitems: [
              "4.1. Công nghiệp thép và xi măng",
              "4.2. Công nghiệp hóa chất",
              "4.3. Công nghiệp dệt may",
              "4.4. Công nghiệp điện tử",
            ],
          },
          {
            title: "5. Ngành xây dựng",
            subitems: [
              "5.1. Tòa nhà xanh và chứng nhận",
              "5.2. Vật liệu xây dựng thân thiện với môi trường",
              "5.3. Hiệu quả năng lượng trong tòa nhà",
            ],
          },
          {
            title: "6. Ngành giao thông vận tải",
            subitems: [
              "6.1. Phương tiện điện và hybrid",
              "6.2. Nhiên liệu sinh học và hydrogen",
              "6.3. Vận tải hàng không và hàng hải bền vững",
              "6.4. Quy hoạch đô thị và giao thông công cộng",
            ],
          },
        ],
      },
      {
        section: "VIII. Nghiên cứu tình huống và bài học kinh nghiệm",
        items: [
          {
            title: "1. Dự án tín chỉ carbon thành công tại Việt Nam",
            subitems: [],
          },
          {
            title: "2. Dự án tín chỉ carbon thành công trên thế giới",
            subitems: [],
          },
          {
            title: "3. Bài học từ các dự án thất bại",
            subitems: [],
          },
          {
            title: "4. Chiến lược Net Zero của các tập đoàn lớn",
            subitems: [],
          },
          {
            title: "5. Mô hình kinh doanh sáng tạo trong lĩnh vực carbon",
            subitems: [],
          },
        ],
      },
    ],
  };

  // Function to get the appropriate table of contents based on language
  const getTableOfContents = () => {
    return language === "en"
      ? completeTableOfContents.en
      : completeTableOfContents.vi;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hrn4pkuebnmvy1ev.public.blob.vercel-storage.com/Carbon%20To%C3%A0n%20Th%C6%B0/Robot%20Amidst%20Book%20Towers-KeRfZnQaScMRtcXGAsv3EngWL2iBb2.png"
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
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            {getText("heroTitle")}
          </h1>
          <p className="text-white text-xl max-w-2xl mb-8">
            {getText("heroSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/thanh-toan?product=${FreeProduct?._id ?? ""}`}>
              <Button
                variant="outline"
                size="lg"
                className="border-green-600 bg-white text-green-600 hover:bg-green-600 hover:text-white px-8 py-6 text-lg"
              >
                {getText("tryFree")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Video Introduction Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {getText("productIntro")}
            </span>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              {getText("exploreTitle")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {getText("exploreDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-video">
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                controls
                poster="/images/mother-1505000_1280.jpg"
                className="w-full h-full object-cover"
              >
                <source
                  src="https://res.cloudinary.com/dyticflm3/video/upload/v1744624786/Video_b%C3%A1n_h%C3%A0ng_c%C3%B3_nh%E1%BA%A1c_lrohij.mp4"
                  type="video/mp4"
                />
                {language === "en"
                  ? "Your browser does not support the video tag."
                  : "Trình duyệt của bạn không hỗ trợ thẻ video."}
              </video>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                <div className="bg-green-600 rounded-full p-4">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-6 text-gray-800">
                {getText("comprehensiveSolution")}
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                {getText("comprehensiveDesc")}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    {getText("over600Docs")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    {getText("carbonSeekAI")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    {getText("continuousUpdates")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    {getText("internationalStandards")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CarbonSeek AI Assistant Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {getText("aiAssistant")}
            </span>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              {getText("carbonSeekTitle")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {getText("carbonSeekDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-gray-800">
                {getText("carbonSeekTitle")}
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                {getText("carbonSeekIntro")}
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                    <Brain className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {getText("smartAnswers")}
                    </h4>
                    <p className="text-gray-600">
                      {getText("smartAnswersDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                    <Database className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {getText("massiveDatabase")}
                    </h4>
                    <p className="text-gray-600">
                      {getText("massiveDatabaseDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {getText("accurateCalculations")}
                    </h4>
                    <p className="text-gray-600">
                      {getText("accurateCalculationsDesc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="relative rounded-xl overflow-hidden shadow-xl aspect-video">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster="/images/mother-1505000_1280.jpg"
                  className="w-full h-full object-cover"
                >
                  <source
                    src="https://res.cloudinary.com/dyticflm3/video/upload/v1744624626/CarbonSeek_video_2_fast_wl4vd2.mp4"
                    type="video/mp4"
                  />
                  {language === "en"
                    ? "Your browser does not support the video tag."
                    : "Trình duyệt của bạn không hỗ trợ thẻ video."}
                </video>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-xl aspect-video">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster="/images/mother-1505000_1280.jpg"
                  className="w-full h-full object-cover"
                >
                  <source
                    src="https://res.cloudinary.com/dyticflm3/video/upload/v1744624649/Carbon_To%C3%A0n_Th%C6%B0_4.0_video_folder_jhhuon.mp4"
                    type="video/mp4"
                  />
                  {language === "en"
                    ? "Your browser does not support the video tag."
                    : "Trình duyệt của bạn không hỗ trợ thẻ video."}
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Overview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {getText("contentOverview")}
            </span>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              {getText("tableOfContents")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {getText("tableOfContentsDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-xl shadow-2xl p-6 h-[500px] overflow-auto">
              <h3 className="text-2xl font-bold mb-4 text-green-700 border-b pb-2">
                {getText("tableOfContents")}
              </h3>

              <div className="space-y-6">
                {getTableOfContents().map((section, sectionIndex) => (
                  <div key={sectionIndex}>
                    <h4 className="text-lg font-semibold text-green-600">
                      {section.section}
                    </h4>
                    <ul className="ml-5 space-y-1 mt-2 text-gray-700">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          {item.title}
                          {item.subitems && item.subitems.length > 0 && (
                            <ul className="ml-5 text-gray-600 text-sm mt-1">
                              {item.subitems.map((subitem, subitemIndex) => (
                                <li key={subitemIndex}>{subitem}</li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-6 text-gray-800">
                {getText("diverseContent")}
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                {getText("diverseContentDesc")}
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {getText("basicKnowledge")}
                    </h4>
                    <p className="text-gray-600">
                      {getText("basicKnowledgeDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {getText("internationalStandardsRegs")}
                    </h4>
                    <p className="text-gray-600">
                      {getText("internationalStandardsRegsDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {getText("measurementMethods")}
                    </h4>
                    <p className="text-gray-600">
                      {getText("measurementMethodsDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {getText("projectDevelopment")}
                    </h4>
                    <p className="text-gray-600">
                      {getText("projectDevelopmentDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                    <RefreshCw className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {getText("marketUpdates")}
                    </h4>
                    <p className="text-gray-600">
                      {getText("marketUpdatesDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                    <CheckSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {getText("successfulProjects")}
                    </h4>
                    <p className="text-gray-600">
                      {getText("successfulProjectsDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                    <FileBarChart className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {getText("comprehensiveESG")}
                    </h4>
                    <p className="text-gray-600">
                      {getText("comprehensiveESGDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                    <ScrollText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {getText("latestRegulations")}
                    </h4>
                    <p className="text-gray-600">
                      {getText("latestRegulationsDesc")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleDownload}
                >
                  <Download className="h-5 w-5 mr-2" /> {getText("downloadTOC")}
                </Button>
                <a
                  href="https://docs.google.com/document/d/1YhxvNui8_8x7Pp3m4kmRkjYKi8SlQ5Mva-lBHb4OZ8o/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-50">
                    <FileText className="h-5 w-5 mr-2" /> {getText("tryReport")}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {getText("keyFeatures")}
            </span>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              {getText("exploreEncyclopedia")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {getText("featuresDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: getText("comprehensiveLibrary"),
                description: getText("comprehensiveLibraryDesc"),
                icon: <BookOpen className="h-12 w-12 text-green-600" />,
              },
              {
                title: getText("carbonSeekAssistant"),
                description: getText("carbonSeekAssistantDesc"),
                icon: <Brain className="h-12 w-12 text-green-600" />,
              },
              {
                title: getText("carbonCalculationTools"),
                description: getText("carbonCalculationToolsDesc"),
                icon: <BarChart3 className="h-12 w-12 text-green-600" />,
              },
              {
                title: getText("continuousUpdatesFeature"),
                description: getText("continuousUpdatesFeatureDesc"),
                icon: <RefreshCw className="h-12 w-12 text-green-600" />,
              },
              {
                title: getText("exclusiveDocuments"),
                description: getText("exclusiveDocumentsDesc"),
                icon: <Download className="h-12 w-12 text-green-600" />,
              },
              {
                title: getText("multiPlatformSupport"),
                description: getText("multiPlatformSupportDesc"),
                icon: <CheckCircle className="h-12 w-12 text-green-600" />,
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 hover:bg-green-50"
              >
                <CardContent className="p-8">
                  <div className="bg-green-100 p-4 rounded-full inline-block mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {getText("pricing")}
            </span>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              {getText("investInKnowledge")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {getText("pricingDesc")}
            </p>
          </div>

          <div className="md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* ditmia */}
            <CardComponents />
          </div>

          <div className="max-w-3xl mx-auto mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              {getText("groupRegistration")}
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              {getText("groupDiscounts")}
            </p>
            <Link href="/thanh-toan?product=carbon-toan-thu-nhom">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                {getText("registerAsGroup")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
              {getText("faqSection")}
            </span>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              {getText("faqSection")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {getText("commonQuestions")}
            </p>
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
                      <h3 className="text-xl font-bold text-gray-800">
                        {faq.question}
                      </h3>
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
              <h2 className="text-3xl font-bold mb-2">
                {getText("readyToEnhance")}
              </h2>
              <p className="text-white/80 text-lg">{getText("signUpToday")}</p>
            </div>
            <Link href="/thanh-toan?product=carbon-toan-thu-chuyen-gia">
              <Button className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 text-lg font-medium">
                {getText("registerNow")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
