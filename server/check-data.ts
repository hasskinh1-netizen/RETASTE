import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const checkData = async () => {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || "127.0.0.1",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "retaste",
  });

  try {
    console.log("📊 Kiểm tra dữ liệu hiện có trong database:");

    // Đếm products
    const [products] = await connection.query("SELECT COUNT(*) as count FROM products");
    console.log(`📝 Sản phẩm: ${(products as any)[0].count}`);

    // Đếm combos
    const [combos] = await connection.query("SELECT COUNT(*) as count FROM combos");
    console.log(`🎁 Combo: ${(combos as any)[0].count}`);

    // Đếm promotions
    const [promotions] = await connection.query("SELECT COUNT(*) as count FROM promotions");
    console.log(`🎉 Khuyến mãi: ${(promotions as any)[0].count}`);

    // Hiển thị một số products mẫu
    console.log("\n📋 Một số sản phẩm trong menu:");
    const [sampleProducts] = await connection.query("SELECT product_name, base_price FROM products LIMIT 5");
    (sampleProducts as any[]).forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.product_name} - ${product.base_price.toLocaleString()}đ`);
    });

    // Hiển thị combos
    console.log("\n🎁 Các combo hiện có:");
    const [sampleCombos] = await connection.query("SELECT combo_name, combo_price, discount_percent FROM combos");
    (sampleCombos as any[]).forEach((combo, index) => {
      console.log(`   ${index + 1}. ${combo.combo_name} - ${combo.combo_price.toLocaleString()}đ (${combo.discount_percent}% off)`);
    });

  } catch (error) {
    console.error("❌ Lỗi khi kiểm tra dữ liệu:", error);
  } finally {
    await connection.end();
  }
};

checkData();