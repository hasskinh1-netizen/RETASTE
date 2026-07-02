# RETASTE Project Guidelines

Bạn là một **Expert Software Engineer** chịu trách nhiệm xây dựng dự án "RETASTE" (Website kinh doanh đồ ăn & thức uống có gợi ý món yêu thích).

## 🌐 Quy tắc chung (General Rules)

- **Ngôn ngữ phản hồi:** LUÔN LUÔN trả lời bằng tiếng Việt.
- **Tuân thủ thiết kế:** Luôn bám sát file `detailed design` của dự án.
- **Phong cách Code:** Viết code sạch (Clean Code), dễ hiểu, có chú thích đầy đủ cho các logic phức tạp.

## 💻 Tech Stack & Kiến trúc

- **Frontend:** - React + Vite.
  - Ngôn ngữ: JavaScript (ES Modules + JSX).
  - UI: HTML, CSS (Tối ưu hóa Responsive cho thiết bị di động).
- **Backend:** - Node.js + Express.
  - Ngôn ngữ: **TypeScript** (Yêu cầu định nghĩa Interface/Type chặt chẽ).
  - Tích hợp: **Lalamove API** để vận chuyển.
- **Database:** - Ưu tiên **MySQL** cho dữ liệu quan hệ (Đơn hàng, Người dùng).
  - Sử dụng **MongoDB** cho các tính năng phi cấu trúc (Log gợi ý món ăn, sở thích).

## 🛠 Quy tắc Lập trình Chi tiết

### 1. RESTful API Design

- Sử dụng đúng phương thức: GET (lấy dữ liệu), POST (tạo mới), PUT (cập nhật), DELETE (xóa).
- Endpoint phải là danh từ số nhiều (Ví dụ: `/api/v1/orders`, `/api/v1/foods`).
- Cấu trúc trả về thống nhất: `{ "success": boolean, "data": ..., "message": ... }`.

### 2. Backend (Node.js + TS)

- Áp dụng kiến trúc 3 lớp: Controller -> Service -> Repository/Model.
- Xử lý lỗi tập trung bằng Middleware.

### 3. Frontend (React)

- Sử dụng Functional Components và Hooks (useState, useEffect, useMemo).
- Tách biệt Logic xử lý dữ liệu và UI (Container vs Presentational components).

### 4. DevOps & Deployment

- Sử dụng **GitHub Actions** để tự động hóa quy trình CI/CD.
- Triển khai trên **AWS Services** (EC2, S3, RDS).

## 🎯 Chức năng trọng tâm

- **Gợi ý món yêu thích:** Khi xử lý logic này, hãy ưu tiên các thuật toán lọc dữ liệu dựa trên lịch sử mua hàng và sở thích của người dùng.

## 🧪 Quy tắc Kiểm thử (Testing Rules)

- Luôn viết Unit Test (Jest/Vitest) đi kèm cho các Service và Controller mới.
- Nội dung test phải bám sát các kịch bản kiểm thử từ mục 4.2.1 đến 4.2.8 trong tài liệu.
- Đảm bảo độ bao phủ code (code coverage) tối thiểu 80% cho các logic nghiệp vụ quan trọng (Gợi ý món, Thanh toán Lalamove).
