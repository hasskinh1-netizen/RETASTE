# Lalamove Integration Instructions

- Sử dụng Lalamove API để xử lý giao hàng tự động khi đơn hàng được xác nhận.
- Logic: Tính toán phí ship, tạo đơn giao hàng, và cập nhật trạng thái đơn hàng (tracking) theo thời gian thực.
- Xử lý lỗi: Luôn có cơ chế retry và log lỗi chi tiết khi gọi API bên thứ ba.
