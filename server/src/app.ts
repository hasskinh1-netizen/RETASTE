import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables FIRST before importing anything else
dotenv.config();

import mongoose from 'mongoose';
import passport from 'passport';
import './passport';
import authRoutes from './routes/authRoutes';
import foodRoutes from './routes/foodRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import combRoutes from './routes/combRoutes';
import promotionRoutes from './routes/promotionRoutes';
import adminRoutes from './routes/adminRoutes';
import staffRoutes from './routes/staffRoutes';
import deliveryRoutes from './routes/deliveryRoutes';
import { ensureDefaultAdmin } from './services/seedService';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/retaste';

app.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, data: null, message: 'RETASTE backend is running' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/foods', foodRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);
app.use('/api/v1/combos', combRoutes);
app.use('/api/v1/promotions', promotionRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/delivery', deliveryRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ success: false, data: null, message: 'Internal server error' });
});

const startServer = async () => {
  // Connect to MongoDB asynchronously (non-blocking)
  mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.warn('MongoDB connection warning: MongoDB is unavailable. Recommendation features may be limited.'));

  // Ensure default admin asynchronously (non-blocking)
  ensureDefaultAdmin()
    .catch((error) => console.warn('Warning: Could not create default admin user. Check MySQL connection.'));

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

startServer();

export default app;
