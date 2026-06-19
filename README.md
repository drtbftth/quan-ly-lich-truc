# Quản Lý Lịch Trực Bác Sĩ

Hệ thống quản lý lịch trực bệnh viện toàn diện, xây dựng bằng Next.js 15, Tailwind CSS, Shadcn/UI, và Google Sheets làm cơ sở dữ liệu.

## Tính năng nổi bật

- 🏥 **Quản lý đa khoa**: Hỗ trợ chia khoa, quản lý danh sách bác sĩ chuyên nghiệp.
- 📅 **Lịch trực thông minh**: Xem lịch trực theo ngày, tháng.
- 🎨 **Giao diện hiện đại**: Sử dụng Tailwind CSS và Shadcn/UI (Hỗ trợ Dark mode).
- ⚡ **PWA**: Có thể cài đặt trên điện thoại, offline cache.
- 🔒 **Bảo mật**: Trang quản trị có mật khẩu bảo vệ.
- 📊 **Cơ sở dữ liệu linh hoạt**: Sử dụng Google Sheets API, cho phép cập nhật trực tiếp từ file Excel/Sheets.

## Hướng dẫn cài đặt

### 1. Clone repository
```bash
git clone https://github.com/yourusername/cal-app.git
cd cal-app
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình Google Sheets

Hệ thống lưu dữ liệu bằng Google Sheets API. Hãy thực hiện theo các bước sau:

1. Vào [Google Cloud Console](https://console.cloud.google.com/), tạo một project mới.
2. Bật **Google Sheets API**.
3. Tạo **Service Account**, tạo khóa (key) định dạng JSON và tải về.
4. Tạo một Google Spreadsheet. Share quyền Editor cho email của Service Account (`client_email` trong file JSON).
5. Đổi tên các Sheet (Tab) thành: `Doctors`, `Departments`, `Schedules`.
   - **Doctors** header: `id`, `name`, `department`, `title`
   - **Departments** header: `id`, `name`
   - **Schedules** header: `id`, `date`, `departmentId`, `doctorIds` (Cách nhau bằng dấu phẩy)
6. Lấy ID của file Google Sheet trên URL (vd: `1abcxyz...`).

Đổi tên file `.env.example` thành `.env` (hoặc `.env.local` nếu test local) và điền các thông tin:

```env
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_SHEETS_CLIENT_EMAIL="your-service-account@...gserviceaccount.com"
GOOGLE_SHEETS_SPREADSHEET_ID="your-spreadsheet-id"

ADMIN_PASSWORD="password_cua_ban"
```

### 4. Chạy Local (Môi trường phát triển)
```bash
npm run dev
```
Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

### 5. Kiểm thử (Testing)
```bash
# Unit & Component test (Vitest)
npm run test

# E2E test (Playwright)
npm run test:e2e
```

### 6. Deploy lên Vercel

1. Đẩy code lên GitHub.
2. Vào [Vercel](https://vercel.com/), chọn import project từ GitHub.
3. Trong phần **Environment Variables**, điền đầy đủ các biến môi trường giống như trong file `.env`.
4. Nhấn **Deploy**.

*Lưu ý: Nếu không cấu hình biến môi trường Google Sheets, ứng dụng sẽ dùng dữ liệu giả lập (fallback JSON) từ thư mục `data/`.*
