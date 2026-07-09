# RETASTE — Food & Beverage Recommendation Platform

## Mô tả
RETASTE là nền tảng bán hàng đồ ăn & thức uống kèm hệ thống gợi ý món yêu thích, quản lý đơn hàng, nhân viên và tích hợp dịch vụ vận chuyển (Lalamove).

## Tech Stack
- Backend: Node.js, Express, TypeScript
- Database: MySQL (chính), MongoDB (logs & recommendations)
- Auth: Passport (JWT, Google/Facebook OAuth)
- Frontend: React + Vite

## Cài đặt (Local)
1. Backend
```bash
cd server
npm install
npm run db:init   # (khởi tạo DB MySQL nếu cần)
npm run dev
```
2. Frontend
```bash
cd client
npm install
npm run dev
```

Server mặc định chạy trên `http://localhost:5000` và frontend trên `http://localhost:3000`.

## Biến môi trường (KHÔNG đẩy lên Git)
Tạo file `.env` ở `server/` với tối thiểu các biến sau:
```
MYSQL_HOST=127.0.0.1
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=retaste
MONGO_URI=mongodb://127.0.0.1:27017/retaste
JWT_SECRET=your_jwt_secret
# OAuth (nếu dùng)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
```

## Push server lên Git
- File `server/` hiện đã được thêm vào repo. Tuy nhiên, giữ `server/node_modules/` trong `.gitignore` để không commit dependency.
- Trước khi push, đảm bảo bạn đã cấu hình remote (`git remote add origin <url>`) và có quyền push.

## Góp ý & Bảo mật
- Không commit các file chứa API keys hoặc secrets.
- Sử dụng GitHub Secrets / CI để lưu biến môi trường khi deploy.

## Liên hệ
- Người phát triển: RETASTE team
