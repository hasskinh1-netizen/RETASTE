const axios = require('axios');

async function run() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Login:', loginRes.data);

    const token = loginRes.data.data.token;
    const orderData = {
      items: [{
        product_id: 1,
        product_name: 'Test Product',
        price: 50000,
        quantity: 1,
        selectedSize: null
      }],
      customerInfo: {
        fullName: 'Test User',
        phoneNumber: '0123456789',
        address: '123 Test St',
        addressDetails: 'Floor 2',
        city: 'Hà Nội'
      },
      subtotal: 50000,
      shippingFee: 15000,
      total: 65000,
      paymentMethod: 'cash',
      status: 'pending'
    };

    const orderRes = await axios.post('http://localhost:5000/api/v1/orders', orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Order response:', orderRes.data);
  } catch (err) {
    if (err.response) {
      console.error('Order API error status:', err.response.status);
      console.error('Order API error data:', err.response.data);
    } else {
      console.error('Order API error:', err.message);
    }
  }
}

run();