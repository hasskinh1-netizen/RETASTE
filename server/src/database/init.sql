-- Create RETASTE Database
CREATE DATABASE IF NOT EXISTS retaste;
USE retaste;

-- 1. Bảng Người dùng (Users)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  role ENUM('customer', 'staff', 'admin') DEFAULT 'customer',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- 2. Danh mục (Categories)
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL,
  category_slug VARCHAR(120) UNIQUE NOT NULL,
  image_url TEXT,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (category_slug),
  INDEX idx_active (is_active)
);

-- 3. Sản phẩm (Products)
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  product_name VARCHAR(255) NOT NULL,
  product_slug VARCHAR(255) UNIQUE NOT NULL,
  base_price DECIMAL(12, 2) NOT NULL,
  description TEXT,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  best_seller BOOLEAN DEFAULT FALSE,
  special_tags JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_category (category_id),
  INDEX idx_slug (product_slug),
  INDEX idx_available (is_available)
);

-- 4. Kích thước (Sizes)
CREATE TABLE IF NOT EXISTS sizes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  size_name VARCHAR(50),
  price_modifier DECIMAL(12, 2) DEFAULT 0.00,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product (product_id)
);

-- 5. Đơn hàng (Orders)
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  order_number VARCHAR(50) UNIQUE,
  total_amount DECIMAL(12, 2) NOT NULL,
  order_status ENUM('pending', 'confirmed', 'shipping', 'completed', 'cancelled') DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'unpaid',
  delivery_fee DECIMAL(12, 2) DEFAULT 0.00,
  shipping_address VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_status (order_status)
);

-- 6. Chi tiết đơn hàng (Order Items)
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  size_id INT,
  quantity INT NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (size_id) REFERENCES sizes(id),
  INDEX idx_order (order_id),
  INDEX idx_product (product_id)
);

-- Insert sample categories
INSERT INTO categories (category_name, category_slug, display_order, is_active) VALUES
('Cơm', 'com', 1, TRUE),
('Phở', 'pho', 2, TRUE),
('Bánh Mì', 'banh-mi', 3, TRUE),
('Bún', 'bun', 4, TRUE),
('Gỏi', 'goi', 5, TRUE),
('Khai Vị', 'khai-vi', 6, TRUE),
('Thức Uống', 'thuc-uong', 7, TRUE);

-- Insert sample products
INSERT INTO products (category_id, product_name, product_slug, base_price, description, is_available, best_seller) VALUES
(1, 'Cơm Tấm Sườn Nước Mắm', 'com-tam-suon-nuoc-mam', 35000, 'Cơm tấm với sườn nướng, trứng, và dưa chuối', TRUE, TRUE),
(2, 'Phở Bò', 'pho-bo', 40000, 'Phở truyền thống với thịt bò mềm, nước dùng thơm ngon', TRUE, TRUE),
(3, 'Bánh Mì Thịt Nạc', 'banh-mi-thit-nac', 25000, 'Bánh mì giòn nhồi thịt nạc, pâté, và rau sống', TRUE, FALSE),
(4, 'Bún Bò Huế', 'bun-bo-hue', 38000, 'Bún với nước dùng cay, tơi bò và thịt heo', TRUE, FALSE),
(5, 'Gỏi Cuốn Tôm', 'goi-cuon-tom', 28000, 'Cuốn bánh tráng với tôm, thịt heo, và rau sống', TRUE, FALSE),
(6, 'Chả Giò', 'cha-gio', 22000, 'Chả giò chiên vàng ngoài, mập trong', TRUE, FALSE),
(7, 'Trà Đá Quán', 'tra-da-quan', 8000, 'Trà đá truyền thống, mát lạnh', TRUE, FALSE),
(7, 'Sinh Tố Xoài', 'sinh-to-xoai', 32000, 'Sinh tố xoài tươi ngon, chuối, sữa', TRUE, FALSE),
(7, 'Cà Phê Đen Đá', 'ca-phe-den-da', 18000, 'Cà phê đen đá nguyên chất', TRUE, FALSE);

-- Insert sample sizes for some products
INSERT INTO sizes (product_id, size_name, price_modifier, is_default) VALUES
(2, 'Nhỏ (Small)', -5000, FALSE),
(2, 'Vừa (Medium)', 0, TRUE),
(2, 'Lớn (Large)', 5000, FALSE),
(7, 'Nhỏ (Small)', 0, TRUE),
(7, 'Lớn (Large)', 8000, FALSE);

-- 7. Combos (Gói combo khuyến mãi)
CREATE TABLE IF NOT EXISTS combos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  combo_name VARCHAR(255) NOT NULL,
  combo_slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  combo_price DECIMAL(12, 2) NOT NULL,
  original_price DECIMAL(12, 2) NOT NULL,
  discount_percent INT DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active (is_active),
  INDEX idx_slug (combo_slug)
);

-- 8. Combo Items (Chi tiết sản phẩm trong combo)
CREATE TABLE IF NOT EXISTS combo_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  combo_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (combo_id) REFERENCES combos(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_combo (combo_id),
  INDEX idx_product (product_id)
);

-- 9. Promotions (Khuyến mãi / Promosion)
CREATE TABLE IF NOT EXISTS promotions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  promo_code VARCHAR(50) UNIQUE,
  promo_name VARCHAR(255) NOT NULL,
  description TEXT,
  discount_type ENUM('percent', 'fixed') DEFAULT 'percent',
  discount_value DECIMAL(12, 2) NOT NULL,
  min_order_value DECIMAL(12, 2) DEFAULT 0,
  max_discount DECIMAL(12, 2),
  usage_limit INT,
  used_count INT DEFAULT 0,
  start_date DATETIME,
  end_date DATETIME,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_code (promo_code),
  INDEX idx_active (is_active),
  INDEX idx_end_date (end_date)
);

-- Insert sample combos
INSERT INTO combos (combo_name, combo_slug, description, combo_price, original_price, discount_percent, is_active) VALUES
('Combo Cơm + Phở + Nước', 'combo-com-pho-nuoc', 'Gói combo 3 món ưu đãi: 1x Cơm Tấm Sườn + 1x Phở Bò + 1x Trà Đá', 75000, 83000, 10, TRUE),
('Combo Bánh Mì + Nước + Tráng Miệng', 'combo-banh-mi-nuoc-trang', 'Bữa sáng hoàn hảo với Bánh Mì + Nước + Chả Giò', 50000, 55000, 9, TRUE),
('Combo Bún Bò Huế + Gỏi + Nước', 'combo-bun-bo-goi-nuoc', 'Combo chua cay ngon miệng', 70000, 78000, 10, TRUE);

-- Insert sample combo items
INSERT INTO combo_items (combo_id, product_id, quantity) VALUES
(1, 1, 1),  -- Cơm Tấm Sườn Nước Mắm vào combo 1
(1, 2, 1),  -- Phở Bò vào combo 1
(1, 7, 1),  -- Trà Đá Quán vào combo 1
(2, 3, 1),  -- Bánh Mì Thịt Nạc vào combo 2
(2, 7, 1),  -- Trà Đá Quán vào combo 2
(2, 6, 1),  -- Chả Giò vào combo 2
(3, 4, 1),  -- Bún Bò Huế vào combo 3
(3, 5, 1),  -- Gỏi Cuốn Tôm vào combo 3
(3, 7, 1);  -- Trà Đá Quán vào combo 3

-- Insert sample promotions
INSERT INTO promotions (promo_code, promo_name, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, start_date, end_date, is_active) VALUES
('WELCOME10', 'Khuyến mãi tân khách', 'Giảm 10% cho khách hàng mới tối đa 50k', 'percent', 10, 0, 50000, 1000, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), TRUE),
('SUMMER30', 'Promosion hè 2026', 'Giảm 30k cho đơn hàng trên 100k', 'fixed', 30000, 100000, 30000, 500, NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), TRUE),
('FREESHIP', 'Miễn phí vận chuyển', 'Miễn phí giao hàng cho đơn từ 50k', 'fixed', 0, 50000, 50000, 999, NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY), TRUE);
