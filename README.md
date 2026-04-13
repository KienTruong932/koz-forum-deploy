# KOZ Forum

## Giới thiệu về công nghệ sử dụng

- **Frontend**: Next.js 16 (App Router), React 19, Material UI (MUI) 9, CKEditor 5.
- **Backend**: Next.js Server Actions, NextAuth.js v5 (Auth.js).
- **Database**: MongoDB với Mongoose.
- **Lưu trữ hình ảnh**: Cloudinary.
- **Ngôn ngữ**: TypeScript.

---

## Hướng dẫn cài đặt và chạy máy local

Theo dõi các bước dưới đây để thiết lập dự án trên máy tính của bạn.

### 1. Clone dự án

Mở terminal và chạy lệnh:

```bash
git clone <url-cua-repo>
cd koz-forum
```

### 2. Cài đặt các gói phụ thuộc

Sử dụng npm để cài đặt tất cả các thư viện cần thiết:

```bash
npm install
```

### 3. Cấu hình môi trường (Environment Variables)

Dự án yêu cầu các biến môi trường để hoạt động. Hãy copy file `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Mở file `.env` và điền đầy đủ các thông tin sau:

| Biến                    | Mô tả                                                                                |
| :---------------------- | :----------------------------------------------------------------------------------- |
| `AUTH_TRUST_HOST`       | Đặt thành `true` nếu chạy trên môi trường production/vps. Ở local có thể để `false`. |
| `MONGODB_URI`           | Đường dẫn kết nối tới MongoDB của bạn (Local hoặc MongoDB Atlas).                    |
| `NEXT_PUBLIC_APP_URL`   | URL của ứng dụng (mặc định là `http://localhost:3000`).                              |
| `JWT_SECRET`            | Chuỗi bí mật bất kỳ để mã hóa JWT.                                                   |
| `AUTH_SECRET`           | Chuỗi bí mật cho Auth.js (có thể dùng lệnh `npx auth secret` để tạo).                |
| `AUTH_GOOGLE_ID`        | Client ID từ Google Cloud Console (cho tính năng Đăng nhập bằng Google).             |
| `AUTH_GOOGLE_SECRET`    | Client Secret từ Google Cloud Console.                                               |
| `CLOUDINARY_CLOUD_NAME` | Cloud Name từ tài khoản Cloudinary của bạn.                                          |
| `CLOUDINARY_API_KEY`    | API Key từ Cloudinary.                                                               |
| `CLOUDINARY_API_SECRET` | API Secret từ Cloudinary.                                                            |

### 4. Thiết lập Cơ sở dữ liệu (Database)

1. Đảm bảo bạn đã điền `MONGODB_URI` trong file `.env`.
2. Chạy script để tạo dữ liệu mẫu (Seeding):
   ```bash
   npm run seed
   ```
   _Lệnh này sẽ tạo các tài khoản mẫu (admin/member) và các khu vực/danh mục ban đầu._

### 5. Lấy API Keys từ các dịch vụ

#### Google OAuth (Đăng nhập Google)

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Tạo một Project mới.
3. Vào "APIs & Services" > "Credentials".
4. Tạo "OAuth client ID" (loại Web application).
5. Thêm `http://localhost:3000/api/auth/callback/google` vào **Authorized redirect URIs**.
6. Copy Client ID và Client Secret vào file `.env`.

#### Cloudinary (Upload ảnh)

1. Đăng ký tài khoản tại [Cloudinary](https://cloudinary.com/).
2. Trong Dashboard, bạn sẽ thấy **Cloud Name**, **API Key** và **API Secret**.
3. Copy chúng vào file `.env`.

---

## Chạy ứng dụng

### Chế độ Phát triển (Development)

Sử dụng lệnh sau để chạy với tính năng tự động tải lại khi sửa code:

```bash
npm run dev
```

Sau đó truy cập: [http://localhost:3000](http://localhost:3000)

### Chế độ Production (Build & Start)

Để chạy ứng dụng một cách tối ưu nhất (như trên server thật):

```bash
# Build ứng dụng
npm run build

# Chạy ứng dụng đã build
npm run start
```

---

## Cấu trúc thư mục chính

- `src/app`: Chứa các route (trang) và API của ứng dụng.
- `src/actions`: Chứa các Server Actions (logic xử lý backend).
- `src/components`:
  - `main/`: Các component chính của diễn đàn.
  - `admin/`: Các component dành cho trang quản trị.
  - `common/`: Các component dùng chung (Dialog, Toggle...).
  - `layout/`: Các component layout (Header, Footer...).
- `src/lib`: Chứa các cấu hình library (auth, mongodb, theme, proxy).
- `src/models`: Định nghĩa các Mongoose Schema.
- `src/utils`: Các hàm tiện ích bổ trợ.

---

## Giấy phép

Dự án này được phát triển cho mục đích học tập và đồ án cá nhân. Vui lòng ghi nguồn khi sử dụng.
