# Backend Instructions (Node.js + Express + TypeScript)

- Ngôn ngữ: TypeScript (yêu cầu định nghĩa Interface/Type rõ ràng cho mọi Request/Response).
- Cấu trúc thư mục: Controller - Service - Repository (hoặc Model).
- Database:
  - Sử dụng MySQL cho các dữ liệu quan hệ (Người dùng, Đơn hàng).
  - Sử dụng MongoDB cho các dữ liệu phi cấu trúc hoặc log gợi ý món ăn (nếu cần).
- RESTful API Rules:
  - Sử dụng đúng HTTP Methods (GET, POST, PUT, DELETE).
  - Status codes: 200 (Success), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error).
  - Response format: `{ "success": boolean, "data": any, "message": string }`.
