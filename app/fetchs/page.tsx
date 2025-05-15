import { Button } from "@/components/ui/button"
import Link from "next/link"
import FAQAccordion from "@/components/faq-accordion"

export default function FAQPage() {
  const carbonToànThưFAQs = [
    {
      question: "Carbon Toàn Thư 4.0, sản phẩm là gì?",
      answer:
        "Carbon Toàn Thư 4.0 là kho tri thức toàn diện với hơn 600 tài liệu PDF chuyên sâu về Carbon Credits, ESG & CSR, kết hợp với trợ lý AI hiện đại nhất hiện nay. Sản phẩm này giúp bạn giải đáp mọi thắc mắc, cá nhân hóa thông tin theo nhu cầu, tính toán chính xác trữ lượng carbon rừng và cập nhật tin tức mới nhất về thị trường Carbon.",
    },
    {
      question: "Giá bán của Carbon Toàn Thư 4.0 là bao nhiêu?",
      answer: "Hiện tại Carbon Toàn Thư 4.0 đang sử dụng trong 1 năm và update liên tục, có giá là 600.000 VNĐ.",
    },
    {
      question: "AI Chatbot – AI Carbon Assistant - CarbonSeek là gì và hoạt động như thế nào?",
      answer:
        "CarbonSeek là trợ lý ảo thông minh của TCCV, được phát triển để giải đáp mọi thắc mắc về tín chỉ carbon, hướng dẫn quy trình liên quan về tín chỉ carbon, tính toán trữ lượng carbon và cung cấp thông tin chuyên ngành và các thông tin cập nhật liên tục về thị trường Carbon. Trợ lý hoạt động 24/7 giúp bạn nhận câu trả lời nhanh chóng và chính xác.",
    },
    {
      question: "Sau khi mua, tôi có được cập nhật thêm tài liệu mới không?",
      answer:
        "Sau khi mua, bạn sẽ được cấp quyền truy cập vào đường link độc quyền, sản phẩm thường xuyên cập nhật các tài liệu mới, báo cáo và thông tin pháp lý liên quan đến tín chỉ carbon. Bạn sẽ luôn nhận được thông tin mới nhất.",
    },
    {
      question: "Tôi có thể áp dụng kiến thức từ Carbon Toàn Thư 4.0 vào thực tế như thế nào?",
      answer:
        "Bạn có thể ứng dụng kiến thức từ Carbon Toàn Thư 4.0 vào nhiều lĩnh vực như xây dựng chiến lược giảm phát thải, quản lý dự án tín chỉ carbon, triển khai chương trình CSR & ESG, cũng như nghiên cứu và đào tạo. Sản phẩm này giúp chuyển đổi lý thuyết thành thực tiễn một cách hiệu quả.",
    },
    {
      question: "Có bao nhiêu nội dung tài liệu được tích hợp trong Carbon Toàn Thư 4.0?",
      answer:
        "Sản phẩm có hơn 600 tài liệu chuyên sâu nhất trên thị trường, 10 bộ tài liệu độc quyền dành riêng cho thị trường Việt Nam, cùng với hệ thống Trợ lý AI CarbonSeek hỗ trợ chuyên biệt hỗ trợ hỏi đáp, tính toán và tra cứu thông tin cho riêng bạn 24/7. Mỗi module được thiết kế chi tiết nhằm cung cấp thông tin đầy đủ và bổ sung theo nhu cầu của bạn.",
    },
    {
      question: "Làm thế nào để tôi mua và nhận Carbon Toàn Thư 4.0?",
      answer:
        "Bạn chỉ cần liên hệ với TCCV qua hotline, email hoặc website để đặt mua sản phẩm. Sau khi xác nhận đơn hàng, bạn sẽ nhận được đường link tải toàn bộ tài liệu và hỗ trợ in ấn nếu cần.",
    },
    {
      question: "Carbon Toàn Thư 4.0 được biên soạn dựa trên những tiêu chuẩn hay nguồn tham khảo nào?",
      answer:
        "Sản phẩm được xây dựng dựa trên các tiêu chuẩn quốc tế uy tín như IPCC, UNFCCC, VCS và Gold Standard. Nhờ đó thông tin luôn chính xác, c���p nhật và phù hợp với xu hướng thị trường Carbon toàn cầu.",
    },
  ]

  const carbonProjectsFAQs = [
    {
      question: "Lợi ích cụ thể mà tôi nhận được khi tham gia dự án tín chỉ carbon là gì?",
      answer:
        "Tham gia dự án này, bạn không chỉ có cơ hội nhận được nguồn thu nhập từ việc bán tín chỉ carbon với giá trị trung bình khoảng 8 triệu VND/ha/năm, mà còn góp phần quan trọng vào việc bảo vệ và phục hồi hệ sinh thái rừng. Ngoài ra, sau thời gian làm dự án carbon cho khu rừng của mình, bạn vẫn có quyền khai thác và sử dụng tài nguyên gỗ của khu rừng. Không chỉ vậy, với độ uy tín của khu rừng, bạn sẽ có cơ hội được tiếp cận với những nguồn đầu tư từ trong nước đến quốc tế.",
    },
    {
      question: "Tôi phải chịu những chi phí nào?",
      answer:
        "Chúng tôi, TCCV, hiểu rằng việc đầu tư ban đầu cho một dự án tín chỉ carbon có thể là một gánh nặng. Vì vậy, chúng tôi cam kết sẽ chi trả toàn bộ các chi phí liên quan đến việc thiết lập dự án, bao gồm thu thập dữ liệu, đo đạc, và các chi phí liên quan đến quá trình xác minh. Quý chủ rừng chỉ cần tiếp tục thực hiện những công việc quen thuộc là chăm sóc và bảo vệ khu rừng của mình.",
    },
    {
      question: "Dự án sẽ kéo dài bao lâu?",
      answer:
        "Dự án này được thiết kế với thời gian thực hiện dài hạn, phù hợp với chu kỳ sinh trưởng tự nhiên của rừng và yêu cầu của thị trường tín chỉ carbon. Thời gian cụ thể của dự án sẽ được xác định rõ ràng trong hợp đồng, tùy thuộc vào loại rừng và mục tiêu cụ thể của từng dự án. Chúng tôi cam kết thực hiện việc theo dõi và giám sát liên tục để đảm bảo lượng carbon được hấp thụ hiệu quả trong suốt thời gian dự án.",
    },
    {
      question: "Tôi cần chuẩn bị gì để tham gia dự án này?",
      answer:
        "Để tham gia dự án, bạn chỉ cần chuẩn bị thông tin về khu rừng như diện tích, loại đất, giấy tờ sổ rừng, và tình trạng cây trồng hiện tại. Hiện tại TCCV hỗ trợ các dự án từ 20ha trở lên với đất rừng sản xuất, có sổ, đất trống hoặc đất đã có cây trồng, tuổi rừng dưới 5 năm, và cần trồng xen canh 3-5 loài cây bản địa Việt Nam. Nếu bạn đã có sẵn khu rừng, cứ báo chúng tôi để kiểm tra và hỗ trợ thêm.",
    },
    {
      question: "Tôi cần làm gì để đăng ký dự án tín chỉ carbon?",
      answer:
        "Để đăng ký dự án tín chỉ carbon, bạn cần liên hệ với đội ngũ tư vấn của TCCV, cung cấp thông tin về khu rừng và hoàn thành mẫu đăng ký trực tuyến trên website của chúng tôi. Sau đó, chúng tôi sẽ kiểm tra và xác nhận điều kiện tham gia dự án.",
    },
    {
      question: "Doanh thu từ việc bán tín chỉ carbon sẽ được phân chia như thế nào và tần suất ra sao?",
      answer:
        "Tỷ lệ phân chia doanh thu từ việc bán tín chỉ carbon sẽ được quy định minh bạch trong hợp đồng dự án, dựa trên thỏa thuận giữa các bên. Tần suất thanh toán sẽ phụ thuộc vào khối lượng tín chỉ carbon được tạo ra và các điều khoản cụ thể trong hợp đồng. Chúng tôi cam kết đảm bảo tính minh bạch trong quá trình phân chia doanh thu.",
    },
    {
      question: "Rừng keo làm được tín chỉ không?",
      answer:
        "Rừng keo hiện nay chúng tôi chưa hỗ trợ làm tín chỉ. Hiện tại TCCV hỗ trợ thực hiện các dự án từ 20ha trở lên với đất rừng sản xuất, có sổ, đất trống hoặc đất đã có cây trồng, tuổi rừng dưới 5 năm, và cần trồng xen canh 3-5 loài cây bản địa Việt Nam (ví dụ: cây gù hương, giáng hương, thông, dổi, lim, sao đen,...). Nếu bạn có khu rừng khác đạt tiêu chuẩn, cứ báo chúng tôi để kiểm tra thêm.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Câu hỏi thường gặp</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Giải đáp các thắc mắc về sản phẩm và dịch vụ của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 gap-16">
            <div>
              <FAQAccordion items={carbonToànThưFAQs} category="Carbon Toàn Thư 4.0 & Sản phẩm giáo dục" />
            </div>

            <div>
              <FAQAccordion items={carbonProjectsFAQs} category="Dự án tín chỉ carbon" />
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-lg text-gray-600 mb-6">
              Bạn có câu hỏi khác? Hãy liên hệ với chúng tôi để được tư vấn chi tiết.
            </p>
            <Link href="/lien-he">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">Liên hệ tư vấn</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
