const axios = require('axios');

async function testOrder() {
  try {
    // Login first
    const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });

    if (loginRes.data.success) {
      const token = loginRes.data.data.token;
      console.log('Login successful, token:', token.substring(0, 20) + '...');

      // Create order
      const orderData = {
        items: [{
          product_id: 1,
          price: 50000,
          quantity: 1,
          selectedSize: null
        }],
        customerInfo: {
          fullName: 'Test User',
          phoneNumber: '0123456789',
          address: '123 Test St',
          addressDetails: '',
          city: 'Hanoi'
        },
        subtotal: 50000,
        shippingFee: 15000,
        total: 65000,
        paymentMethod: 'cash'
      };

      console.log('Sending order data:', JSON.stringify(orderData, null, 2));

      const orderRes = await axios.post('http://localhost:5000/api/v1/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Order creation response:', orderRes.data);
    }
  } catch (err) {
    console.error('Error:', err.response ? {
      status: err.response.status,
      data: err.response.data
    } : err.message);
  }
}

testOrder();