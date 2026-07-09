# 🗄️ RETASTE Database Setup

## Prerequisites

1. **MySQL Server**: Đảm bảo MySQL đã được cài đặt và đang chạy
   - Windows: Cài đặt từ [mysql.com](https://dev.mysql.com/downloads/mysql/)
   - macOS: `brew install mysql`
   - Linux: `sudo apt-get install mysql-server`

2. **Verif MySQL is running**:
   ```bash
   mysql -u root -p
   ```
   Nếu thấy `mysql>` prompt là thành công. Gõ `exit` để thoát.

## Bước 1: Cấu hình MySQL Connection

Tạo file `.env` trong thư mục `server/` dựa trên `.env.example`:

```bash
cp .env.example .env
```

Chỉnh sửa `.env`:

```
MYSQL_HOST=127.0.0.1
MYSQL_USER=root
MYSQL_PASSWORD=123456
MYSQL_DATABASE=retaste
MONGO_URI=mongodb://127.0.0.1:27017/retaste
JWT_SECRET=your_jwt_secret_here
LALAMOVE_API_KEY=your_lalamove_api_key
LALAMOVE_SECRET_KEY=your_lalamove_secret_key
LALAMOVE_API_URL=https://rest.sandbox.lalamove.com/v3
ADMIN_SIGNUP_SECRET=your_admin_signup_secret
STAFF_SIGNUP_SECRET=your_staff_signup_secret
DEFAULT_ADMIN_NAME=Admin
DEFAULT_ADMIN_EMAIL=admin@retaste.local
DEFAULT_ADMIN_PASSWORD=admin
PORT=5000
```

## Bước 2: Khởi tạo Database

Chạy lệnh để tạo database, tables, và dữ liệu mẫu:

```bash
npm run db:init
```

Output thành công sẽ hiển thị:

```
Executing: CREATE DATABASE IF NOT EXISTS retaste...
Executing: CREATE TABLE IF NOT EXISTS users...
Executing: CREATE TABLE IF NOT EXISTS foods...
...
✅ Database initialized successfully!
```

## Bước 3: Kiểm tra Database

Dùng MySQL CLI để kiểm tra:

```bash
mysql -u root -p retaste
```

Xem danh sách tables:

```sql
SHOW TABLES;
```

Kiểm tra dữ liệu:

```sql
SELECT * FROM users;
SELECT * FROM foods;
```

## Database Schema

### users

- `id`: ID người dùng
- `name`: Tên
- `email`: Email (unique)
- `password`: Mật khẩu (bcrypt hashed)
- `role`: `customer`, `admin`, hoặc `staff`

### foods

- `id`: ID sản phẩm
- `name`: Tên món ăn
- `description`: Mô tả
- `price`: Giá
- `category`: Danh mục
- `is_available`: Có sẵn hay không

### orders

- `id`: ID đơn hàng
- `user_id`: ID khách hàng (FK)
- `total_price`: Tổng tiền
- `status`: `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`
- `shipping_address`: Địa chỉ giao
- `delivery_method`: `pickup` hoặc `delivery`
- `lalamove_order_id`: ID Lalamove (nếu có)

### order_items

- `id`: ID chi tiết đơn
- `order_id`: ID đơn hàng (FK)
- `food_id`: ID sản phẩm (FK)
- `quantity`: Số lượng
- `unit_price`: Giá đơn vị
- `subtotal`: Tổng cộng item

## Mẹo

- Nếu muốn reset database: Drop database rồi chạy `npm run db:init` lại
- Để xem chi tiết lỗi, kiểm tra file `.env` có đúng không
- Default admin: `admin@retaste.local` / `admin` (có thể thay đổi ở `.env`)
