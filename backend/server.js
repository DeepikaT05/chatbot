import 'dotenv/config';
import express from 'express';
import cors from 'cors';

console.log('🔍 Debug: MONGO_URI is', process.env.MONGO_URI);
if (!process.env.MONGO_URI) {
  console.error('❌ Critical: MONGO_URI is missing in process.env');
}

import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'AI Chatbot Backend is running (MongoDB)!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
