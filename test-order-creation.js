const mysql = require('mysql2/promise');

async function testOrderCreation() {
  try {
    const mysqlPool = mysql.createPool({
      host: '127.0.0.1',
      user: 'root',
      password: 'admin123',
      database: 'retaste',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    const connection = await mysqlPool.getConnection();

    console.log('Got connection from pool');

    const items = [{
      product_id: 1,
      price: 50000,
      quantity: 1,
      selectedSize: null
    }];
    const customerInfo = {
      fullName: 'Test User',
      phoneNumber: '0123456789',
      address: '123 Test St',
      addressDetails: '',
      city: 'Hanoi'
    };
    const subtotal = 50000;
    const shippingFee = 15000;
    const total = 65000;
    const paymentMethod = 'cash';
    const user = { id: 3 };

    console.log('Starting validation...');

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Order items are required');
    }

    if (!customerInfo || !customerInfo.fullName || !customerInfo.phoneNumber || !customerInfo.address) {
      throw new Error('Customer information is required');
    }

    // Generate order number
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const orderNumber = 'ORD-' + dateStr + '-' + randomNum;

    console.log('Order number:', orderNumber);

    // Start transaction
    await connection.beginTransaction();
    console.log('Transaction started');

    // Insert order
    const [orderResult] = await connection.query(
      `INSERT INTO orders (
        user_id,
        order_number,
        total_amount,
        delivery_fee,
        shipping_address,
        order_status,
        payment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        orderNumber,
        total,
        shippingFee,
        customerInfo.address + ', ' + (customerInfo.addressDetails || '') + ', ' + customerInfo.city,
        'pending',
        paymentMethod === 'cash' ? 'unpaid' : 'pending',
      ]
    );

    const orderId = orderResult.insertId;
    console.log('Order inserted with ID:', orderId);

    // Insert order items
    for (const item of items) {
      console.log('Inserting item:', item);
      await connection.query(
        `INSERT INTO order_items (
          order_id,
          product_id,
          size_id,
          quantity,
          unit_price,
          subtotal
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          item.selectedSize || null,
          item.quantity,
          item.price,
          item.price * item.quantity,
        ]
      );
    }

    // Commit transaction
    await connection.commit();
    console.log('Transaction committed');

    connection.release();
    mysqlPool.end();

    console.log('Order created successfully');
  } catch (err) {
    console.error('Error:', err.message);
    console.error('Code:', err.code);
    console.error('SQL State:', err.sqlState);
    console.error('SQL Message:', err.sqlMessage);
  }
}

testOrderCreation();