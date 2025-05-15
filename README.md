# Tinchicarbon Website

Website chính thức của Tinchicarbon - Nền tảng quản lý và giao dịch tín chỉ carbon tại Việt Nam.

## Giới thiệu

Tinchicarbon là nền tảng kết nối các dự án trồng rừng, bảo vệ môi trường với các doanh nghiệp và cá nhân muốn bù đắp lượng khí thải carbon của họ. Chúng tôi cung cấp giải pháp toàn diện cho việc quản lý, giao dịch và chứng nhận tín chỉ carbon.

## Tính năng chính

- Khám phá rừng 3D tương tác
- Tính toán lượng khí thải carbon
- Đăng ký và quản lý dự án trồng rừng
- Mua bán tín chỉ carbon
- Chứng chỉ quốc tế
- Tiếp thị liên kết

## Công nghệ sử dụng

- Next.js 14 (App Router)
- TypeScript
- Three.js / React Three Fiber
- Tailwind CSS
- Supabase

## Cài đặt

1. Clone repository:
\`\`\`bash
git clone https://github.com/your-username/tinchicarbon-website.git
cd tinchicarbon-website
\`\`\`

2. Cài đặt dependencies:
\`\`\`bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
\`\`\`

3. Tạo file .env.local từ .env.example và cập nhật các biến môi trường

4. Chạy development server:
\`\`\`bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
\`\`\`

5. Mở [http://localhost:3000](http://localhost:3000) để xem website

## Liên hệ

- Website: [tinchicarbon.com](https://tinchicarbon.com)
- Email: info@tinchicarbon.com
\`\`\`

## 2. Tạo file .env.example

Tạo file .env.example để hướng dẫn cài đặt biến môi trường:

```plaintext file=".env.example"
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Next.js
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google Auth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Vercel Blob (for image uploads)
BLOB_READ_WRITE_TOKEN=your-blob-read-write-token

# Unsplash (for placeholder images)
UNSPLASH_ACCESS_KEY=your-unsplash-access-key
