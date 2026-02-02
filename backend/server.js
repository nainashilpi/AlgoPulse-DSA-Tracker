const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const cron = require('node-cron');
const User = require('./models/User');

dotenv.config();

// Initialize App
const app = express();

// Connect Database
connectDB();

// --- MIDDLEWARES ---
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://tera-frontend-name.onrender.com"
  ], 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/problems', require('./routes/problemRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

app.get('/', (req, res) => {
  res.send('AlgoPulse API is running...');
});

// --- CRON JOB ---
cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    await User.updateMany(
      { lastSolveDate: { $ne: today } },
      { 
        $inc: { points: -5 }, 
        $set: { streak: 0 } 
      }
    );

    await User.updateMany(
      { points: { $lt: 0 } },
      { $set: { points: 0 } }
    );

    console.log('Daily maintenance: Streaks reset and penalties applied.');
  } catch (err) {
    console.error('Cron Job Error:', err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
