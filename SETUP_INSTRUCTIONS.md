# 🚀 Hướng Dẫn Chạy Dự Án RETASTE

## 📋 Yêu Cầu Tiên Quyết

- Node.js v16+ (kiểm tra: `node --version`)
- npm v8+ (kiểm tra: `npm --version`)
- MySQL đang chạy trên localhost:3306
- MongoDB đang chạy trên localhost:27017

---

## 🔧 Bước 1: Cài Đặt Dependencies

### Backend
```bash
cd server
npm install
```

### Frontend
```bash
cd client
npm install
```

---

## ▶️ Bước 2: Chạy Dự Án

### Cách 1: Chạy từ 2 Terminal Riêng Biệt (Khuyến Nghị)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

Server sẽ chạy trên: **http://localhost:5000**

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Frontend sẽ chạy trên: **http://localhost:3000**

---

## 🛠️ Các Câu Lệnh Hữu Ích

### Backend

| Câu Lệnh | Mô Tả |
|----------|--------|
| `npm run dev` | Chạy server ở chế độ development (auto-reload) |
| `npm run build` | Build TypeScript thành JavaScript |
| `npm start` | Chạy server từ file build (production) |
| `npm run db:init` | Khởi tạo database |

### Frontend

| Câu Lệnh | Mô Tả |
|----------|--------|
| `npm run dev` | Chạy frontend ở chế độ development |
| `npm run build` | Build frontend cho production |
| `npm run preview` | Xem preview của build production |

---

## 📦 Cấu Trúc Dự Án

```
TS_MICRO/
├── server/                    # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── app.ts            # Main server file
│   │   ├── controllers/       # Controllers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Middlewares
│   │   ├── models/            # Database models
│   │   └── database/          # Database config
│   ├── package.json
│   └── tsconfig.json
│
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/             # Pages
│   │   ├── components/        # Components
│   │   ├── context/           # Context API
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # API services
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

## 🔐 Thông Tin Đăng Nhập Mặc Định

### Admin Account
- **Email:** admin@retaste.local
- **Password:** admin

---

## 🌐 Các Endpoint Chính

### Frontend
- **Trang Chủ:** http://localhost:3000/
- **Thực Đơn:** http://localhost:3000/menu
- **Gợi Ý:** http://localhost:3000/recommendations
- **Combo:** http://localhost:3000/combo
- **Khuyến Mãi:** http://localhost:3000/promotions
- **Đăng Nhập:** http://localhost:3000/login
- **Admin:** http://localhost:3000/admin/login

### API Backend
- **Base URL:** http://localhost:5000
- **Products:** GET /products
- **Recommendations:** GET /recommendations
- **Combos:** GET /combos
- **Promotions:** GET /promotions

---

## 🐛 Troubleshooting

### Lỗi: "Cannot find module"
```bash
# Cài đặt lại dependencies
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: Port 3000 hoặc 5000 đã được sử dụng
```bash
# Tìm process sử dụng port (Windows)
netstat -ano | findstr :3000
# Hoặc tìm theo port khác
# Backend: Thay đổi PORT trong server/.env
# Frontend: Thay đổi cấu hình trong client/vite.config.js
```

### Lỗi: Database connection failed
- Kiểm tra MySQL và MongoDB đang chạy
- Kiểm tra `.env` file có đúng thông tin database không
- Kiểm tra file `server/.env`:
```
MYSQL_HOST=127.0.0.1
MYSQL_USER=root
MYSQL_PASSWORD=123456
MYSQL_DATABASE=retaste
MONGO_URI=mongodb://127.0.0.1:27017/retaste
```

Nếu muốn bật đăng nhập bằng Google/Facebook, thêm các biến môi trường OAuth vào `server/.env`:
```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/v1/auth/facebook/callback
CLIENT_URL=http://localhost:3000
```

---

## 📝 Ghi Chú

- Frontend tự động reload khi có thay đổi code
- Backend sử dụng `ts-node-dev` để tự động reload TypeScript
- Cần browser mới nhất để hỗ trợ tất cả tính năng
- API documentation: Xem file `server/src/routes/` để biết chi tiết các endpoint

---

**Happy Coding! 🎉**
