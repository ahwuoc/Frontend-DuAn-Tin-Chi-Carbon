// src/app/quan-ly/affiliate/components/affiliate-payouts-language.ts

const affiliatePayoutsTranslations = {
  cardTitle: {
    vi: "Lịch sử thanh toán",
    en: "Payout History",
  },
  tableHeaders: {
    id: {
      vi: "ID",
      en: "ID",
    },
    date: {
      vi: "Ngày",
      en: "Date",
    },
    amount: {
      vi: "Số tiền",
      en: "Amount",
    },
    method: {
      vi: "Phương thức",
      en: "Method",
    },
    status: {
      vi: "Trạng thái",
      en: "Status",
    },
  },
  receiptButton: {
    vi: "Biên lai",
    en: "Receipt",
  },
  statusBadges: {
    paid: {
      vi: "Đã thanh toán",
      en: "Paid",
    },
    pending: {
      vi: "Đang chờ xử lý",
      en: "Pending",
    },
    // Thêm các trạng thái khác nếu có
  },
  nextPayout: {
    title: {
      vi: "Thanh toán tiếp theo",
      en: "Next Payout",
    },
    expectedDate: {
      vi: "Dự kiến: {{date}}", // Placeholder cho ngày
      en: "Expected: {{date}}",
    },
    currentBalance: {
      vi: "Số dư hiện tại",
      en: "Current Balance",
    },
  },
  currencyUnit: {
    vi: "đ",
    en: "$", // Hoặc "USD" tùy theo bạn muốn hiển thị
  },
};

export default affiliatePayoutsTranslations;
