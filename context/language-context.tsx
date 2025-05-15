"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

interface LanguageContextType {
  language: "vi" | "en"
  setLanguage: (language: "vi" | "en") => void
  t: (key: string) => string | undefined
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<"vi" | "en">("vi")

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as "vi" | "en" | null
    if (storedLanguage) {
      setLanguage(storedLanguage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  const translations = {
    en: {
      home: "Home",
      about: "About",
      news: "News",
      contact: "Contact",
      company_name: "Carbon Credits Vietnam",
      company_description:
        "We provide comprehensive solutions for carbon credit development, helping businesses achieve sustainable development and environmental friendliness.",
      quick_links: "Quick Links",
      contact_info: "Contact Info",
      business_hours: "Business Hours",
      monday_friday: "Mon - Fri",
      saturday: "Saturday",
      sunday: "Sunday",
      closed: "Closed",
      privacy_policy: "Privacy Policy",
      terms_of_use: "Terms of Use",
      newsletter: "Subscribe to our newsletter",
      newsletter_desc: "Stay up to date with the latest news and trends in carbon credits.",
      email_placeholder: "Enter your email",
      submit: "Submit",
      about_page_title: "ABOUT US",
      about_page_subtitle: "Learn about our mission and vision",
      about_us_section: "About Us",
      about_us_content:
        "Carbon Credits Vietnam (CCV) is a leading provider of carbon credit solutions in Vietnam. We are committed to helping businesses reduce their carbon footprint and achieve their sustainability goals.",
      about_us_content_2:
        "We offer a range of services, including carbon footprint assessment, carbon reduction strategies, and carbon credit project development.",
      vision_mission: "Vision & Mission",
      vision: "Vision",
      vision_content: "To be the leading provider of carbon credit solutions in Vietnam and Southeast Asia.",
      mission: "Mission",
      mission_content:
        "To help businesses reduce their carbon footprint and achieve their sustainability goals through innovative and effective carbon credit solutions.",
      core_values: "Core Values",
      core_value_1: "Integrity",
      core_value_1_desc: "We are committed to honesty, transparency, and ethical behavior in all our dealings.",
      core_value_2: "Innovation",
      core_value_2_desc:
        "We are constantly seeking new and innovative ways to help our clients reduce their carbon footprint.",
      core_value_3: "Sustainability",
      core_value_3_desc: "We are committed to promoting sustainable development and environmental protection.",
      core_value_4: "Collaboration",
      core_value_4_desc: "We believe in working together with our clients and partners to achieve common goals.",
      contact_now: "Contact Us Now",
      sustainable_solutions: "Sustainable Solutions",
      register_now_button: "Register Now",
      learn_more_button: "Learn More",
      calculation_tools: "Calculation Tools",
      product_ecosystem: "Our Product Ecosystem",
      faq: "FAQ",
      faq_title: "Frequently Asked Questions",
      faq_description: "Find answers to common questions about our products and services",
      testimonials: "Testimonials",
      trusted_partners: "Trusted by Leading Partners",
      testimonials_description: "See what our clients are saying about us",
      registration_form: "Registration Form",
      registration_title: "Register for Consultation",
      registration_description: "Fill out the form below to receive a free consultation",
      benefits_title: "Benefits of Registration",
      benefit_1: "Expert Consultation",
      benefit_2: "Customized Solutions",
      benefit_3: "Sustainable Practices",
      benefit_4: "Long-Term Partnership",
      view_all_news: "View All News",
      latest_news: "Latest News",
      news_description: "Stay up-to-date with the latest news and insights",
      search_news: "Search news...",
      featured_article: "Featured Article",
      admin: "Admin",
      read_more: "Read More",
      categories: "Categories",
      recent_posts: "Recent Posts",
      tags: "Tags",
      tag_1: "Carbon Credits",
      tag_2: "ESG",
      tag_3: "Sustainability",
      tag_4: "Climate Change",
      tag_5: "Renewable Energy",
      tag_6: "Green Technology",
      tag_7: "Carbon Footprint",
      tag_8: "Net Zero",
      tag_9: "Carbon Offset",
      tag_10: "Sustainable Development",
      tag_11: "Environmental Protection",
      tag_12: "CSR",
      category_1: "Carbon Credits",
      category_2: "ESG",
      category_3: "Sustainability",
      category_4: "Climate Change",
      category_5: "Renewable Energy",
      category_6: "Green Technology",
      news_1_title: "The Future of Carbon Credits in Vietnam",
      news_1_desc:
        "Explore the potential of carbon credits in Vietnam and how they can contribute to sustainable development.",
      news_2_title: "New Regulations on Carbon Emissions",
      news_2_desc: "Learn about the latest regulations on carbon emissions and how they affect businesses.",
      news_3_title: "Sustainable Agriculture Practices",
      news_3_desc:
        "Discover sustainable agriculture practices that can reduce carbon emissions and improve crop yields.",
      contact_now_button: "Contact Us",
      search_results: "Search Results",
      search_placeholder: "Search...",
      search: "Search",
      active: "Active",
      pending: "Pending",
      expired: "Expired",
      newsletter_success: "Thank you for subscribing to our newsletter!",
      products_page_title: "PRODUCTS & SERVICES",
      products_page_subtitle:
        "Explore our comprehensive ecosystem of products designed to meet all your carbon credit needs - from in-depth knowledge to real project implementation",
      our_products: "Our Products",
      product_ecosystem_description:
        "Each of our products is designed to address a specific need in your sustainability journey. From in-depth knowledge to real project implementation, we accompany you every step of the way.",
      bestseller: "Bestseller",
      international_certificate_courses: "International Certificate Courses from CSU",
      problem_certificate:
        "Problem: While thousands of candidates are competing for ESG/Carbon positions, you need a clear competitive advantage to stand out.",
      solution_certificate:
        "Solution: International certification from South Columbia University (CSU) - a passport opening global career opportunities, taught by expert Charles Davis with 20 years of practical experience.",
      main_instructor: "Main Instructor",
      instructor_description: "Expert with 20 years of experience in Carbon Credits and ESG",
      benefit_interview: "70% increase in successful interview opportunities",
      benefit_interview_desc: "International certification helps your profile get priority consideration",
      benefit_expert: "Learn from leading experts with 20 years of experience",
      benefit_expert_desc:
        "Instead of just theory, you learn from someone who has implemented projects generating over $200 million in revenue",
      benefit_income: "Average 30% income increase after the course",
      benefit_income_desc:
        "Students report significant salary increases thanks to globally recognized professional skills",
      global_recognition: "Globally Recognized Certification:",
      global_recognition_desc:
        "Recognized by international organizations and leading companies in ESG and sustainable development.",
      carbon_credit_projects: "Carbon Credit Projects",
      high_profit: "High Profit",
      problem_project:
        "Problem: You have forest land but haven't optimized its economic value, while still wanting to protect the environment and retain logging rights for the future.",
      solution_project:
        "Solution: Carbon credit projects help you create a stable income from forest protection, with implementation costs 100% covered by us while you retain logging rights after the project.",
      benefit_cost: "Cover all project setup costs",
      benefit_cost_desc:
        "No initial investment needed, we cover all costs related to setup, measurement, and verification",
      benefit_tech: "Apply advanced monitoring technology",
      benefit_tech_desc:
        "Using remote sensing, GIS, and AI technologies to ensure transparency and accuracy in credit issuance",
      benefit_rights: "Retain logging rights after the project",
      benefit_rights_desc:
        "After the carbon project period, you still have the right to harvest and use the timber resources of the forest",
      minimum_requirements: "Minimum Requirements:",
      requirement_1: "• Area from 20ha or more",
      requirement_2: "• Production forest land with certificate",
      requirement_3: "• Forest age under 5 years",
      requirement_4: "• Mixed planting of 3-5 native tree species",
      carbon_encyclopedia: "Carbon Encyclopedia 4.0",
      ai_integrated: "AI Integrated",
      problem_encyclopedia:
        "Problem: You spend hundreds of hours searching for information about carbon credits from scattered, unreliable, and outdated sources.",
      solution_encyclopedia:
        "Solution: A comprehensive knowledge repository with over 600 utmost in-depth documents and the intelligent CarbonSeek AI assistant, helping you access all carbon credit knowledge quickly and efficiently.",
      benefit_ai: "CarbonSeek AI assistant works 24/7",
      benefit_ai_desc:
        "Answers all questions, personalizes information according to needs, and accurately calculates carbon stocks",
      benefit_docs: "Over 600 utmost in-depth documents updated continuously",
      benefit_docs_desc:
        "Including 10 exclusive document sets specifically for the Vietnamese market, not available anywhere else",
      benefit_time: "Save 70% research time",
      benefit_time_desc:
        "Instead of spending hundreds of hours searching for information, you can instantly access a comprehensive knowledge repository",
      user_reviews: "User Reviews:",
      user_review_content:
        '"Carbon Encyclopedia 4.0 has saved me hundreds of hours of research and provided the most accurate, up-to-date information on the carbon credit market. The CarbonSeek AI assistant is an indispensable tool!"',
      why_choose: "Why Choose Our Products?",
      why_choose_desc: "We are proud to provide comprehensive solutions with outstanding values",
      quality_assured: "Quality Assured",
      quality_assured_desc:
        "All our products are built based on reputable international standards such as IPCC, UNFCCC, VCS, and Gold Standard.",
      expert_team: "Expert Team",
      expert_team_desc:
        "Our experienced team of experts is always ready to support you at every stage of your project.",
      continuous_updates: "Continuous Updates",
      continuous_updates_desc:
        "We continuously update our products with the latest information on the carbon credit market and related regulations.",
      client_testimonials: "What our clients say about our products?",
      client_testimonials_desc:
        "Hundreds of customers have trusted and used our products. Here are some reviews from them.",
      faq_products: "Do you have questions?",
      faq_products_desc:
        "Below are some frequently asked questions about our products. If you don't find the answer, please contact us.",
      faq_1: "How do I choose the right product for my needs?",
      faq_1_answer: "We offer three main products to suit different needs:",
      faq_1_point1:
        "<strong>Carbon Encyclopedia 4.0:</strong> Suitable if you need in-depth knowledge about carbon credits.",
      faq_1_point2:
        "<strong>International certificate courses:</strong> Suitable if you want to enhance career opportunities and have a globally recognized certificate.",
      faq_1_point3:
        "<strong>Carbon credit projects:</strong> Suitable if you have forest land and want to create a stable income from forest protection.",
      faq_1_contact: "You can contact us for more detailed advice on the most suitable product for your needs.",
      faq_2: "What payment methods do you accept?",
      faq_2_answer: "We accept various payment methods:",
      faq_2_point1: "Bank transfer",
      faq_2_point2: "Payment via e-wallets (MoMo, ZaloPay, VNPay)",
      faq_2_point3: "Credit/debit card payment",
      faq_2_point4: "Installment payment (for high-value products)",
      faq_2_instructions: "After ordering, you will receive detailed payment instructions via email.",
      faq_3: "Do I get support after purchasing a product?",
      faq_3_answer: "Yes, we provide after-sales support for all products:",
      faq_3_point1:
        "<strong>Carbon Encyclopedia 4.0:</strong> Email support for 3 months (Research package) or priority 24/7 support for 6 months (Expert package).",
      faq_3_point2:
        "<strong>International certificate courses:</strong> Support throughout the course and for 3 months after completion.",
      faq_3_point3: "<strong>Carbon credit projects:</strong> Continuous support throughout the project period.",
      faq_3_commitment: "We are committed to accompanying you throughout your product usage journey.",
      need_consultation: "Need consultation about our products?",
      contact_for_free: "Contact us for free consultation",
      register_free_consultation: "Register for free consultation",
      view_faq: "View FAQ",
      view_all_faqs: "View All FAQs",
      select_consultation_type: "Select consultation type",
      enter_full_name: "Enter your full name",
      enter_age: "Enter your age",
      enter_location: "Enter your location",
      enter_forest_area: "Enter forest area (ha)",
      enter_phone: "Enter your phone number",
      enter_email: "Enter your email",
      enter_other_questions: "Enter other questions or requests",
      submitting: "Submitting...",
      thank_you_for_registering: "Thank you for registering!",
      contact_soon: "We will contact you as soon as possible.",
      register_another: "Register another",
      registration_successful: "Registration successful!",
      error_occurred: "An error occurred",
      could_not_submit: "Could not submit the form. Please try again later.",
      forest_carbon_credits: "Forest Carbon Credits",
      agricultural_carbon_credits: "Agricultural Carbon Credits",
      biochar_technology: "Biochar Technology",
      international_certificate_courses: "International Certificate Courses",
      carbon_encyclopedia: "Carbon Encyclopedia 4.0",
      other: "Other",
      forest_type: "Forest Type",
      select_forest_type: "Select forest type",
      agriculture_type: "Agriculture Type",
      select_agriculture_type: "Select agriculture type",
      biochar_interest: "Biochar Interest",
      select_biochar_interest: "Select your interest in biochar",
      certificate_level: "Certificate Level",
      select_certificate_level: "Select certificate level",
      encyclopedia_package: "Encyclopedia Package",
      select_encyclopedia_package: "Select encyclopedia package",
      consulting_services: "Our Consulting Services",
      consulting_services_desc:
        "We provide professional consulting services in various fields related to sustainable development and carbon emission reduction.",
      contact_information: "Contact Information",
      back_to_home: "Back to home",
      register_for_consultation: "Register for Consultation",
      fill_information:
        "Fill in your information to receive free consultation on carbon credits, agriculture, biochar and other products",
      start_journey: "Start Your Sustainable Development Journey Today",
      contact_within_24h: "We will contact you within 24 hours after receiving your registration information",
      learn_more_projects: "Learn more about projects",
      frequently_asked_questions: "Frequently Asked Questions",
      thank_you_message: "Thank you for your registration! We will contact you shortly.",
      privacy_commitment: "We respect your privacy and will never share your information with third parties.",
      submit_form: "Submit Registration",
      forest_consultation: "Forest Carbon Credits Consultation",
      agriculture_consultation: "Agricultural Carbon Credits Consultation",
      biochar_consultation: "Biochar Technology Consultation",
      certificate_consultation: "International Certificate Courses Consultation",
      encyclopedia_consultation: "Carbon Encyclopedia 4.0 Consultation",
      other_consultation: "Other Consultation",
    },
    vi: {
      home: "Trang chủ",
      about: "Giới thiệu",
      news: "Tin tức",
      contact: "Liên hệ",
      company_name: "Tín Chỉ Carbon Việt Nam",
      company_description:
        "Chúng tôi cung cấp các giải pháp toàn diện về tín chỉ carbon, giúp doanh nghiệp phát triển bền vững và thân thiện với môi trường.",
      quick_links: "Liên kết nhanh",
      contact_info: "Thông tin liên hệ",
      business_hours: "Giờ làm việc",
      monday_friday: "Thứ 2 - Thứ 6",
      saturday: "Thứ 7",
      sunday: "Chủ nhật",
      closed: "Đóng cửa",
      privacy_policy: "Chính sách quyền riêng tư",
      terms_of_use: "Điều khoản sử dụng",
      newsletter: "Đăng ký nhận bản tin",
      newsletter_desc: "Cập nhật tin tức và xu hướng mới nhất về tín chỉ carbon.",
      email_placeholder: "Nhập email của bạn",
      submit: "Gửi",
      about_page_title: "GIỚI THIỆU",
      about_page_subtitle: "Tìm hiểu về sứ mệnh và tầm nhìn của chúng tôi",
      about_us_section: "Về chúng tôi",
      about_us_content:
        "Tín Chỉ Carbon Việt Nam (CCV) là nhà cung cấp hàng đầu các giải pháp tín chỉ carbon tại Việt Nam. Chúng tôi cam kết giúp các doanh nghiệp giảm lượng khí thải carbon và đạt được các mục tiêu phát triển bền vững.",
      about_us_content_2:
        "Chúng tôi cung cấp một loạt các dịch vụ, bao gồm đánh giá dấu chân carbon, chiến lược giảm phát thải carbon và phát triển dự án tín chỉ carbon.",
      vision_mission: "Tầm nhìn & Sứ mệnh",
      vision: "Tầm nhìn",
      vision_content: "Trở thành nhà cung cấp hàng đầu các giải pháp tín chỉ carbon tại Việt Nam và Đông Nam Á.",
      mission: "Sứ mệnh",
      mission_content:
        "Giúp các doanh nghiệp giảm lượng khí thải carbon và đạt được các mục tiêu phát triển bền vững thông qua các giải pháp tín chỉ carbon sáng tạo và hiệu quả.",
      core_values: "Giá trị cốt lõi",
      core_value_1: "Liêm chính",
      core_value_1_desc: "Chúng tôi cam kết trung thực, minh bạch và hành vi đạo đức trong mọi giao dịch.",
      core_value_2: "Đổi mới",
      core_value_2_desc:
        "Chúng tôi không ngừng tìm kiếm những cách thức mới và sáng tạo để giúp khách hàng giảm lượng khí thải carbon.",
      core_value_3: "Bền vững",
      core_value_3_desc: "Chúng tôi cam kết thúc đẩy phát triển bền vững và bảo vệ môi trường.",
      core_value_4: "H���p tác",
      core_value_4_desc: "Chúng tôi tin vào việc hợp tác với khách hàng và đối tác để đạt được các mục tiêu chung.",
      contact_now: "Liên hệ ngay",
      sustainable_solutions: "Giải pháp bền vững",
      register_now_button: "Đăng ký ngay",
      learn_more_button: "Tìm hiểu thêm",
      calculation_tools: "Công cụ tính toán",
      product_ecosystem: "Hệ sinh thái sản phẩm",
      faq: "Câu hỏi thường gặp",
      faq_title: "Câu hỏi thường gặp",
      faq_description: "Giải đáp các thắc mắc về sản phẩm và dịch vụ của chúng tôi",
      testimonials: "Đánh giá",
      trusted_partners: "Đối tác tin cậy",
      testimonials_description: "Những đánh giá từ khách hàng của chúng tôi",
      registration_form: "Mẫu đăng ký",
      registration_title: "Đăng ký tư vấn",
      registration_description: "Điền thông tin của bạn để nhận tư vấn miễn phí",
      benefits_title: "Lợi ích khi đăng ký",
      benefit_1: "Tư vấn chuyên nghiệp",
      benefit_2: "Giải pháp tùy chỉnh",
      benefit_3: "Thực hành bền vững",
      benefit_4: "Quan hệ đối tác lâu dài",
      view_all_news: "Xem tất cả tin tức",
      latest_news: "Tin tức mới nhất",
      news_description: "Cập nhật tin tức mới nhất về tín chỉ carbon và phát triển bền vững",
      search_news: "Tìm kiếm tin tức...",
      featured_article: "Bài viết nổi bật",
      admin: "Quản trị viên",
      read_more: "Đọc thêm",
      categories: "Danh mục",
      recent_posts: "Bài viết gần đây",
      tags: "Thẻ",
      tag_1: "Tín chỉ carbon",
      tag_2: "ESG",
      tag_3: "Phát triển bền vững",
      tag_4: "Biến đổi khí hậu",
      tag_5: "Năng lượng tái tạo",
      tag_6: "Công nghệ xanh",
      tag_7: "Dấu chân carbon",
      tag_8: "Net Zero",
      tag_9: "Bù đắp carbon",
      tag_10: "Phát triển bền vững",
      tag_11: "Bảo vệ môi trường",
      tag_12: "CSR",
      category_1: "Tín chỉ carbon",
      category_2: "ESG",
      category_3: "Phát triển bền vững",
      category_4: "Biến đổi khí hậu",
      category_5: "Năng lượng tái tạo",
      category_6: "Công nghệ xanh",
      news_1_title: "Tương lai của tín chỉ carbon tại Việt Nam",
      news_1_desc:
        "Khám phá tiềm năng của tín chỉ carbon tại Việt Nam và cách chúng có thể đóng góp vào sự phát triển bền vững.",
      news_2_title: "Quy định mới về phát thải carbon",
      news_2_desc: "Tìm hiểu về các quy định mới nhất về phát thải carbon và cách chúng ảnh hưởng đến doanh nghiệp.",
      news_3_title: "Thực hành nông nghiệp bền vững",
      news_3_desc:
        "Khám phá các phương pháp thực hành nông nghiệp bền vững có thể giảm lượng khí thải carbon và cải thiện năng suất cây trồng.",
      contact_now_button: "Liên hệ tư vấn",
      search_results: "Kết quả tìm kiếm",
      search_placeholder: "Tìm kiếm...",
      search: "Tìm kiếm",
      active: "Đang hoạt động",
      pending: "Đang xử lý",
      expired: "Đã hết hạn",
      newsletter_success: "Cảm ơn bạn đã đăng ký nhận bản tin!",
      products_page_title: "SẢN PHẨM & DỊCH VỤ",
      products_page_subtitle:
        "Khám phá hệ sinh thái sản phẩm toàn diện của chúng tôi, được thiết kế để đáp ứng mọi nhu cầu về tín chỉ carbon - từ kiến thức chuyên sâu đến triển khai dự án thực tế",
      our_products: "Sản phẩm của chúng tôi",
      product_ecosystem_description:
        "Mỗi sản phẩm của chúng tôi được thiết kế để giải quyết một nhu cầu cụ thể trong hành trình phát triển bền vững của bạn. Từ kiến thức chuyên sâu đến triển khai dự án thực tế, chúng tôi đồng hành cùng bạn ở mọi bước đi.",
      bestseller: "Bán chạy nhất",
      international_certificate_courses: "Khóa học chứng chỉ quốc tế từ CSU",
      problem_certificate:
        "Vấn đề: Trong khi hàng nghìn ứng viên đang cạnh tranh vị trí ESG/Carbon, bạn cần một lợi thế cạnh tranh rõ ràng để nổi bật.",
      solution_certificate:
        "Giải pháp: Chứng chỉ quốc tế từ South Columbia University (CSU) - tấm hộ chiếu mở ra cơ hội nghề nghiệp toàn cầu, được giảng dạy bởi chuyên gia Charles Davis với 20 năm kinh nghiệm thực chiến.",
      main_instructor: "Giảng viên chính",
      instructor_description: "Chuyên gia với 20 năm kinh nghiệm trong lĩnh vực Carbon Credit và ESG",
      benefit_interview: "Tăng 70% cơ hội phỏng vấn thành công",
      benefit_interview_desc: "Chứng chỉ quốc tế giúp hồ sơ của bạn được ưu tiên xem xét",
      benefit_expert: "Học từ chuyên gia hàng đầu với 20 năm kinh nghiệm",
      benefit_expert_desc:
        "Thay vì học lý thuyết suông, bạn được học từ người đã triển khai dự án mang lại doanh thu hơn 200 triệu USD",
      benefit_income: "Tăng thu nhập trung bình 30% sau khóa học",
      benefit_income_desc: "Học viên báo cáo mức tăng lương đáng kể nhờ kỹ năng chuyên môn được công nhận toàn cầu",
      global_recognition: "Chứng chỉ được công nhận toàn cầu:",
      global_recognition_desc:
        "Được công nhận bởi các tổ chức quốc tế và doanh nghiệp hàng đầu trong lĩnh vực ESG và phát triển bền vững.",
      carbon_credit_projects: "Dự án tín chỉ carbon",
      high_profit: "Lợi nhuận cao",
      problem_project:
        "Vấn đề: Bạn có khu rừng nhưng chưa tối ưu hóa được giá trị kinh tế, trong khi vẫn muốn bảo vệ môi trường và có quyền khai thác gỗ sau này.",
      solution_project:
        "Giải pháp: Dự án tín chỉ carbon giúp bạn tạo ra nguồn thu nhập ổn định từ việc bảo vệ rừng, với chi phí triển khai do chúng tôi chi trả 100% và vẫn giữ quyền khai thác gỗ sau dự án.",
      benefit_cost: "Chi trả toàn bộ chi phí thiết lập dự án",
      benefit_cost_desc:
        "Không cần đầu tư ban đầu, chúng tôi chi trả mọi chi phí liên quan đến việc thiết lập, đo đạc và xác minh",
      benefit_tech: "Áp dụng công nghệ tiên tiến trong giám sát",
      benefit_tech_desc:
        "Sử dụng công nghệ viễn thám, GIS và AI để đảm bảo tính minh bạch và chính xác trong việc phát hành tín chỉ",
      benefit_rights: "Vẫn giữ quyền khai thác gỗ sau dự án",
      benefit_rights_desc:
        "Sau thời gian làm dự án carbon, bạn vẫn có quyền khai thác và sử dụng tài nguyên gỗ của khu rừng",
      minimum_requirements: "Yêu cầu tối thiểu:",
      requirement_1: "• Diện tích từ 20ha trở lên",
      requirement_2: "• Đất rừng sản xuất có sổ",
      requirement_3: "• Tuổi rừng dưới 5 năm",
      requirement_4: "• Trồng xen canh 3-5 loài cây bản địa",
      carbon_encyclopedia: "Carbon Toàn Thư 4.0",
      ai_integrated: "AI Tích hợp",
      problem_encyclopedia:
        "Vấn đề: Bạn mất hàng trăm giờ tìm kiếm thông tin về tín chỉ carbon từ nhiều nguồn phân tán, không đáng tin cậy và thiếu cập nhật.",
      solution_encyclopedia:
        "Giải pháp: Kho tàng tri thức toàn diện với hơn 600 tài liệu chuyên sâu nhất trên thị trường và trợ lý AI thông minh CarbonSeek, giúp bạn tiếp cận mọi kiến thức về tín chỉ carbon một cách nhanh chóng và hiệu quả.",
      benefit_ai: "Trợ lý AI CarbonSeek hoạt động 24/7",
      benefit_ai_desc:
        "Giải đáp mọi thắc mắc, cá nhân hóa thông tin theo nhu cầu và tính toán chính xác trữ lượng carbon",
      benefit_docs: "Hơn 600 tài liệu chuyên sâu nhất trên thị trường được cập nhật liên tục",
      benefit_docs_desc:
        "Bao gồm 10 bộ tài liệu độc quyền dành riêng cho thị trường Việt Nam, không có ở bất kỳ đâu khác",
      benefit_time: "Tiết kiệm 70% thời gian nghiên cứu",
      benefit_time_desc:
        "Thay vì mất hàng trăm giờ tìm kiếm thông tin, bạn có thể truy cập ngay lập tức vào kho tàng tri thức toàn diện",
      user_reviews: "Đánh giá từ người dùng:",
      user_review_content:
        '"Carbon Toàn Thư 4.0 đã giúp tôi tiết kiệm hàng trăm giờ nghiên cứu và cung cấp thông tin chính xác, cập nhật nhất về thị trường tín chỉ carbon. Trợ lý AI CarbonSeek là một công cụ không thể thiếu!"',
      why_choose: "Tại sao chọn sản phẩm của chúng tôi?",
      why_choose_desc: "Chúng tôi tự hào mang đến những giải pháp toàn diện với những giá trị vượt trội",
      quality_assured: "Chất lượng đảm bảo",
      quality_assured_desc:
        "Tất cả sản phẩm của chúng tôi đều được xây dựng dựa trên các tiêu chuẩn quốc tế uy tín như IPCC, UNFCCC, VCS và Gold Standard.",
      expert_team: "Đội ngũ chuyên gia",
      expert_team_desc:
        "Đội ngũ chuyên gia giàu kinh nghiệm của chúng tôi luôn sẵn sàng hỗ trợ bạn trong mọi giai đoạn của dự án.",
      continuous_updates: "Cập nhật liên tục",
      continuous_updates_desc:
        "Chúng tôi liên tục cập nhật sản phẩm với thông tin mới nhất về thị trường tín chỉ carbon và các quy định liên quan.",
      client_testimonials: "Họ nói gì về sản phẩm của chúng tôi?",
      client_testimonials_desc:
        "Hàng trăm khách hàng đã tin tưởng và sử dụng các sản phẩm của chúng tôi. Dưới đây là một số đánh giá từ họ.",
      faq_products: "Bạn còn thắc mắc?",
      faq_products_desc:
        "Dưới đây là một số câu hỏi thường gặp về sản phẩm của chúng tôi. Nếu bạn không tìm thấy câu trả lời, hãy liên hệ với chúng tôi.",
      faq_1: "Làm thế nào để chọn sản phẩm phù hợp với nhu cầu của tôi?",
      faq_1_answer: "Chúng tôi cung cấp ba sản phẩm chính phù hợp với các nhu cầu khác nhau:",
      faq_1_point1: "<strong>Carbon Toàn Thư 4.0:</strong> Phù hợp nếu bạn cần kiến thức chuyên sâu về tín chỉ carbon.",
      faq_1_point2:
        "<strong>Khóa học chứng chỉ quốc tế:</strong> Phù hợp nếu bạn muốn nâng cao cơ hội nghề nghiệp và có chứng chỉ được công nhận toàn cầu.",
      faq_1_point3:
        "<strong>Dự án tín chỉ carbon:</strong> Phù hợp nếu bạn có khu rừng và muốn tạo nguồn thu nhập ổn định từ việc bảo vệ rừng.",
      faq_1_contact:
        "Bạn có thể liên hệ với chúng tôi để được tư vấn chi tiết hơn về sản phẩm phù hợp nhất với nhu cầu của bạn.",
      faq_2: "Tôi có thể thanh toán bằng những phương thức nào?",
      faq_2_answer: "Chúng tôi chấp nhận nhiều phương thức thanh toán khác nhau:",
      faq_2_point1: "Chuyển khoản ngân hàng",
      faq_2_point2: "Thanh toán qua ví điện tử (MoMo, ZaloPay, VNPay)",
      faq_2_point3: "Thanh toán qua thẻ tín dụng/ghi nợ",
      faq_2_point4: "Thanh toán theo đợt (đối với các sản phẩm có giá trị cao)",
      faq_2_instructions: "Sau khi đặt hàng, bạn sẽ nhận được hướng dẫn thanh toán chi tiết qua email.",
      faq_3: "Tôi có được hỗ trợ sau khi mua sản phẩm không?",
      faq_3_answer: "Có, chúng tôi cung cấp hỗ trợ sau bán hàng cho tất cả các sản phẩm:",
      faq_3_point1:
        "<strong>Carbon Toàn Thư 4.0:</strong> Hỗ trợ qua email trong 3 tháng (gói Nghiên cứu) hoặc hỗ trợ ưu tiên 24/7 trong 6 tháng (gói Chuyên gia).",
      faq_3_point2:
        "<strong>Khóa học chứng chỉ quốc tế:</strong> Hỗ trợ trong suốt thời gian khóa học và 3 tháng sau khi hoàn thành.",
      faq_3_point3: "<strong>Dự án tín chỉ carbon:</strong> Hỗ trợ liên tục trong suốt thời gian dự án.",
      faq_3_commitment: "Chúng tôi cam kết đồng hành cùng bạn trong suốt quá trình sử dụng sản phẩm.",
      need_consultation: "Bạn cần tư vấn về sản phẩm?",
      contact_for_free: "Liên hệ với chúng tôi để được tư vấn miễn phí",
      register_free_consultation: "Đăng ký tư vấn miễn phí",
      view_faq: "Xem câu hỏi thường gặp",
      view_all_faqs: "Xem tất cả câu hỏi thường gặp",
      select_consultation_type: "Chọn loại tư vấn",
      enter_full_name: "Nhập họ và tên",
      enter_age: "Nhập tuổi",
      enter_location: "Nhập địa điểm",
      enter_forest_area: "Nhập diện tích rừng (ha)",
      enter_phone: "Nhập số điện thoại",
      enter_email: "Nhập email",
      enter_other_questions: "Nhập câu hỏi hoặc yêu cầu khác",
      submitting: "Đang gửi...",
      thank_you_for_registering: "Cảm ơn bạn đã đăng ký!",
      contact_soon: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
      register_another: "Đăng ký khác",
      registration_successful: "Đăng ký thành công!",
      error_occurred: "Đã xảy ra lỗi",
      could_not_submit: "Không thể gửi biểu mẫu. Vui lòng thử lại sau.",
      forest_carbon_credits: "Tín chỉ carbon từ rừng",
      agricultural_carbon_credits: "Tín chỉ nông nghiệp",
      biochar_technology: "Công nghệ Biochar",
      international_certificate_courses: "Khóa học chứng chỉ quốc tế",
      carbon_encyclopedia: "Carbon Toàn Thư 4.0",
      other: "Khác",
      forest_type: "Loại rừng",
      select_forest_type: "Chọn loại rừng",
      agriculture_type: "Loại nông nghiệp",
      select_agriculture_type: "Chọn loại nông nghiệp",
      biochar_interest: "Quan tâm về Biochar",
      select_biochar_interest: "Chọn lĩnh vực quan tâm về biochar",
      certificate_level: "Cấp độ chứng chỉ",
      select_certificate_level: "Chọn cấp độ chứng chỉ",
      encyclopedia_package: "Gói Carbon Toàn Thư",
      select_encyclopedia_package: "Chọn gói Carbon Toàn Thư",
      consulting_services: "Dịch Vụ Tư Vấn Của Chúng Tôi",
      consulting_services_desc:
        "Chúng tôi cung cấp dịch vụ tư vấn chuyên nghiệp trong nhiều lĩnh vực khác nhau liên quan đến phát triển bền vững và giảm phát thải carbon.",
      contact_information: "Thông Tin Liên Hệ",
      back_to_home: "Quay lại trang chủ",
      register_for_consultation: "Đăng Ký Tư Vấn",
      fill_information:
        "Điền thông tin của bạn để nhận tư vấn miễn phí về tín chỉ carbon, nông nghiệp, biochar và các sản phẩm khác",
      start_journey: "Bắt Đầu Hành Trình Phát Triển Bền Vững Ngay Hôm Nay",
      contact_within_24h: "Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ sau khi nhận được thông tin đăng ký",
      learn_more_projects: "Tìm hiểu thêm về dự án",
      frequently_asked_questions: "Câu hỏi thường gặp",
      thank_you_message: "Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
      privacy_commitment:
        "Chúng tôi tôn trọng quyền riêng tư của bạn và sẽ không bao giờ chia sẻ thông tin của bạn với bên thứ ba.",
      submit_form: "Gửi đăng ký",
      forest_consultation: "Tư vấn tín chỉ carbon từ rừng",
      agriculture_consultation: "Tư vấn tín chỉ nông nghiệp",
      biochar_consultation: "Tư vấn công nghệ Biochar",
      certificate_consultation: "Tư vấn khóa học chứng chỉ quốc tế",
      encyclopedia_consultation: "Tư vấn Carbon Toàn Thư 4.0",
      other_consultation: "Tư vấn khác",
    },
  }

  const t = (key: string): string | undefined => {
    return translations[language]?.[key]
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
