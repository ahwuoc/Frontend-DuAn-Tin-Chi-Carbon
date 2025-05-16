export const invoices = [
  {
    id: "inv1",
    number: "INV-2025-001",
    date: "2025-03-15",
    dueDate: "2025-04-15",
    amount: "5.600.000",
    status: "paid",
    items: [
      {
        name: "Carbon Toàn Thư 4.0 - Gói Doanh Nghiệp",
        quantity: 1,
        price: "5.600.000",
      },
    ],
  },
  {
    id: "inv2",
    number: "INV-2025-002",
    date: "2025-02-10",
    dueDate: "2025-03-10",
    amount: "4.500.000",
    status: "paid",
    items: [
      {
        name: "Chứng chỉ Quản lý Carbon Quốc tế",
        quantity: 1,
        price: "4.500.000",
      },
    ],
  },
  {
    id: "inv3",
    number: "INV-2025-003",
    date: "2025-04-01",
    dueDate: "2025-05-01",
    amount: "1.200.000",
    status: "pending",
    items: [
      {
        name: "Phí duy trì Carbon Toàn Thư 4.0 - Q2/2025",
        quantity: 1,
        price: "1.200.000",
      },
    ],
  },
];

// Dữ liệu mẫu cho phương thức thanh toán
export const paymentMethods = [
  {
    id: "pm1",
    type: "credit_card",
    name: "Visa",
    last4: "4242",
    expiryDate: "03/2027",
    isDefault: true,
  },
  {
    id: "pm2",
    type: "bank_transfer",
    name: "Vietcombank",
    isDefault: false,
  },
];

// Dữ liệu mẫu cho đăng ký
export const subscriptions = [
  {
    id: "sub1",
    name: "Carbon Toàn Thư 4.0 - Gói Doanh Nghiệp",
    status: "active",
    startDate: "2025-03-15",
    endDate: "2026-03-15",
    amount: "5.600.000",
    billingCycle: "annually",
    autoRenew: true,
  },
  {
    id: "sub2",
    name: "Chứng chỉ Quản lý Carbon Quốc tế",
    status: "active",
    startDate: "2025-02-10",
    endDate: "2027-02-10",
    amount: "4.500.000",
    billingCycle: "annually",
    autoRenew: false,
  },
];
