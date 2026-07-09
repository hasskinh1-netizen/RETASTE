import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const addSampleData = async () => {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || "127.0.0.1",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "retaste",
  });

  try {
    console.log("🚀 Bắt đầu thêm dữ liệu mẫu cho menu và combo khuyến mãi...");

    // Thêm sản phẩm mới vào menu
    console.log("📝 Thêm sản phẩm mới vào menu...");
    const newProducts = [
      {
        category_id: 1, // Cơm
        product_name: "Cơm Chiên Dương Châu",
        product_slug: "com-chien-duong-chau",
        base_price: 45000,
        description: "Cơm chiên với tôm, thịt heo, trứng, rau củ",
        is_available: true,
        best_seller: true,
        special_tags: JSON.stringify(["hot", "spicy"])
      },
      {
        category_id: 1, // Cơm
        product_name: "Cơm Gà Xối Mỡ",
        product_slug: "com-ga-xoi-mo",
        base_price: 42000,
        description: "Cơm với gà xối mỡ, nước mắm chua ngọt",
        is_available: true,
        best_seller: false,
        special_tags: JSON.stringify(["traditional"])
      },
      {
        category_id: 2, // Phở
        product_name: "Phở Gà",
        product_slug: "pho-ga",
        base_price: 38000,
        description: "Phở gà với thịt gà mềm, nước dùng thanh",
        is_available: true,
        best_seller: true,
        special_tags: JSON.stringify(["healthy", "light"])
      },
      {
        category_id: 3, // Bánh Mì
        product_name: "Bánh Mì Chả Lụa",
        product_slug: "banh-mi-cha-lua",
        base_price: 28000,
        description: "Bánh mì với chả lụa, thịt nguội, rau sống",
        is_available: true,
        best_seller: false,
        special_tags: JSON.stringify(["classic"])
      },
      {
        category_id: 4, // Bún
        product_name: "Bún Riêu Cua",
        product_slug: "bun-rieu-cua",
        base_price: 35000,
        description: "Bún riêu với riêu cua, thịt heo, rau sống",
        is_available: true,
        best_seller: true,
        special_tags: JSON.stringify(["spicy", "traditional"])
      },
      {
        category_id: 5, // Gỏi
        product_name: "Gỏi Bò Bóp Thấu",
        product_slug: "goi-bo-bop-thau",
        base_price: 55000,
        description: "Gỏi bò với rau thơm, nước mắm chua ngọt",
        is_available: true,
        best_seller: false,
        special_tags: JSON.stringify(["premium", "fresh"])
      },
      {
        category_id: 6, // Khai Vị
        product_name: "Gỏi Ngó Sen Tôm",
        product_slug: "goi-ngo-sen-tom",
        base_price: 32000,
        description: "Gỏi ngó sen với tôm tươi, rau thơm",
        is_available: true,
        best_seller: false,
        special_tags: JSON.stringify(["fresh", "healthy"])
      },
      {
        category_id: 7, // Thức Uống
        product_name: "Nước Dừa Tươi",
        product_slug: "nuoc-dua-tuoi",
        base_price: 25000,
        description: "Nước dừa tươi nguyên chất",
        is_available: true,
        best_seller: true,
        special_tags: JSON.stringify(["natural", "healthy"])
      },
      {
        category_id: 7, // Thức Uống
        product_name: "Trà Ô Long Đá",
        product_slug: "tra-o-long-da",
        base_price: 22000,
        description: "Trà ô long đá thơm ngon",
        is_available: true,
        best_seller: false,
        special_tags: JSON.stringify(["premium"])
      }
    ];

    for (const product of newProducts) {
      await connection.query(
        `INSERT INTO products (category_id, product_name, product_slug, base_price, description, is_available, best_seller, special_tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.category_id,
          product.product_name,
          product.product_slug,
          product.base_price,
          product.description,
          product.is_available,
          product.best_seller,
          product.special_tags
        ]
      );
    }
    console.log("✅ Đã thêm 9 sản phẩm mới vào menu");

    // Thêm sizes cho một số sản phẩm mới
    console.log("📏 Thêm kích thước cho sản phẩm...");
    const newSizes = [
      { product_id: 10, size_name: "Nhỏ", price_modifier: -3000, is_default: false }, // Cơm Chiên Dương Châu
      { product_id: 10, size_name: "Vừa", price_modifier: 0, is_default: true },
      { product_id: 10, size_name: "Lớn", price_modifier: 5000, is_default: false },
      { product_id: 11, size_name: "Nhỏ", price_modifier: 0, is_default: true }, // Cơm Gà Xối Mỡ
      { product_id: 11, size_name: "Lớn", price_modifier: 4000, is_default: false },
      { product_id: 12, size_name: "Nhỏ", price_modifier: -2000, is_default: false }, // Phở Gà
      { product_id: 12, size_name: "Vừa", price_modifier: 0, is_default: true },
      { product_id: 12, size_name: "Lớn", price_modifier: 3000, is_default: false },
    ];

    for (const size of newSizes) {
      await connection.query(
        `INSERT INTO sizes (product_id, size_name, price_modifier, is_default) VALUES (?, ?, ?, ?)`,
        [size.product_id, size.size_name, size.price_modifier, size.is_default]
      );
    }
    console.log("✅ Đã thêm kích thước cho sản phẩm");

    // Thêm combo mới
    console.log("🎁 Thêm combo khuyến mãi mới...");
    const newCombos = [
      {
        combo_name: "Combo Gia Đình Cơm + Phở",
        combo_slug: "combo-gia-dinh-com-pho",
        description: "Combo 4 người: 2x Cơm Chiên Dương Châu + 2x Phở Gà + 2x Trà Ô Long",
        combo_price: 165000,
        original_price: 190000,
        discount_percent: 13,
        is_active: true,
        display_order: 4
      },
      {
        combo_name: "Combo Healthy Gỏi + Nước",
        combo_slug: "combo-healthy-goi-nuoc",
        description: "Combo healthy: Gỏi Ngó Sen Tôm + Gỏi Bò Bóp Thấu + Nước Dừa Tươi",
        combo_price: 95000,
        original_price: 112000,
        discount_percent: 15,
        is_active: true,
        display_order: 5
      },
      {
        combo_name: "Combo Văn Phòng Bánh Mì",
        combo_slug: "combo-van-phong-banh-mi",
        description: "Combo văn phòng: 3x Bánh Mì Chả Lụa + 3x Sinh Tố Xoài",
        combo_price: 135000,
        original_price: 153000,
        discount_percent: 12,
        is_active: true,
        display_order: 6
      },
      {
        combo_name: "Combo Đặc Biệt Bún Riêu",
        combo_slug: "combo-dac-biet-bun-rieu",
        description: "Combo đặc biệt: 2x Bún Riêu Cua + 2x Gỏi Cuốn Tôm + 2x Cà Phê Đen Đá",
        combo_price: 145000,
        original_price: 166000,
        discount_percent: 13,
        is_active: true,
        display_order: 7
      }
    ];

    const comboIds = [];
    for (const combo of newCombos) {
      const [result] = await connection.query(
        `INSERT INTO combos (combo_name, combo_slug, description, combo_price, original_price, discount_percent, is_active, display_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          combo.combo_name,
          combo.combo_slug,
          combo.description,
          combo.combo_price,
          combo.original_price,
          combo.discount_percent,
          combo.is_active,
          combo.display_order
        ]
      );
      comboIds.push((result as any).insertId);
    }
    console.log("✅ Đã thêm 4 combo khuyến mãi mới");

    // Thêm combo items cho combo mới
    console.log("🔗 Thêm chi tiết combo...");
    const comboItems = [
      // Combo Gia Đình Cơm + Phở (combo_id = comboIds[0])
      { combo_id: comboIds[0], product_id: 10, quantity: 2 }, // 2x Cơm Chiên Dương Châu
      { combo_id: comboIds[0], product_id: 12, quantity: 2 }, // 2x Phở Gà
      { combo_id: comboIds[0], product_id: 17, quantity: 2 }, // 2x Trà Ô Long

      // Combo Healthy Gỏi + Nước (combo_id = comboIds[1])
      { combo_id: comboIds[1], product_id: 15, quantity: 1 }, // 1x Gỏi Ngó Sen Tôm
      { combo_id: comboIds[1], product_id: 14, quantity: 1 }, // 1x Gỏi Bò Bóp Thấu
      { combo_id: comboIds[1], product_id: 16, quantity: 1 }, // 1x Nước Dừa Tươi

      // Combo Văn Phòng Bánh Mì (combo_id = comboIds[2])
      { combo_id: comboIds[2], product_id: 13, quantity: 3 }, // 3x Bánh Mì Chả Lụa
      { combo_id: comboIds[2], product_id: 8, quantity: 3 },  // 3x Sinh Tố Xoài

      // Combo Đặc Biệt Bún Riêu (combo_id = comboIds[3])
      { combo_id: comboIds[3], product_id: 4, quantity: 2 },  // 2x Bún Bò Huế (từ dữ liệu cũ)
      { combo_id: comboIds[3], product_id: 5, quantity: 2 },  // 2x Gỏi Cuốn Tôm (từ dữ liệu cũ)
      { combo_id: comboIds[3], product_id: 9, quantity: 2 },  // 2x Cà Phê Đen Đá
    ];

    for (const item of comboItems) {
      await connection.query(
        `INSERT INTO combo_items (combo_id, product_id, quantity) VALUES (?, ?, ?)`,
        [item.combo_id, item.product_id, item.quantity]
      );
    }
    console.log("✅ Đã thêm chi tiết cho các combo");

    // Thêm promotions mới
    console.log("🎉 Thêm mã khuyến mãi...");
    const newPromotions = [
      {
        promo_code: "NEWUSER10",
        promo_name: "Chào mừng khách hàng mới",
        description: "Giảm 10% cho đơn hàng đầu tiên",
        discount_type: "percent",
        discount_value: 10,
        min_order_value: 50000,
        max_discount: 20000,
        usage_limit: 100,
        start_date: "2024-01-01 00:00:00",
        end_date: "2024-12-31 23:59:59",
        is_active: true
      },
      {
        promo_code: "FAMILY20",
        promo_name: "Khuyến mãi gia đình",
        description: "Giảm 20% cho đơn hàng từ 200k trở lên",
        discount_type: "percent",
        discount_value: 20,
        min_order_value: 200000,
        max_discount: 50000,
        usage_limit: 50,
        start_date: "2024-01-01 00:00:00",
        end_date: "2024-12-31 23:59:59",
        is_active: true
      },
      {
        promo_code: "FLASH30K",
        promo_name: "Flash Sale",
        description: "Giảm 30k cho đơn hàng từ 150k",
        discount_type: "fixed",
        discount_value: 30000,
        min_order_value: 150000,
        max_discount: 30000,
        usage_limit: 200,
        start_date: "2024-04-01 00:00:00",
        end_date: "2024-04-30 23:59:59",
        is_active: true
      },
      {
        promo_code: "STUDENT15",
        promo_name: "Ưu đãi sinh viên",
        description: "Giảm 15% cho sinh viên (cần xác minh)",
        discount_type: "percent",
        discount_value: 15,
        min_order_value: 30000,
        max_discount: 25000,
        usage_limit: 500,
        start_date: "2024-01-01 00:00:00",
        end_date: "2024-12-31 23:59:59",
        is_active: true
      }
    ];

    for (const promo of newPromotions) {
      try {
        await connection.query(
          `INSERT INTO promotions (promo_code, promo_name, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, start_date, end_date, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            promo.promo_code,
            promo.promo_name,
            promo.description,
            promo.discount_type,
            promo.discount_value,
            promo.min_order_value,
            promo.max_discount,
            promo.usage_limit,
            promo.start_date,
            promo.end_date,
            promo.is_active
          ]
        );
      } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Mã khuyến mãi ${promo.promo_code} đã tồn tại, bỏ qua...`);
        } else {
          throw error;
        }
      }
    }
    console.log("✅ Đã thêm 4 mã khuyến mãi");

    console.log("🎊 Hoàn thành! Đã thêm dữ liệu mẫu thành công:");
    console.log("   📝 9 sản phẩm menu mới");
    console.log("   📏 Kích thước cho sản phẩm");
    console.log("   🎁 4 combo khuyến mãi mới");
    console.log("   🔗 Chi tiết combo");
    console.log("   🎉 4 mã khuyến mãi");

  } catch (error) {
    console.error("❌ Lỗi khi thêm dữ liệu mẫu:", error);
  } finally {
    await connection.end();
  }
};

addSampleData();