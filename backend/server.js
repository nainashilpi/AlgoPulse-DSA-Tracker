const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const cron = require('node-cron');
const User = require('./models/User');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const users = await User.find({});
    
    for (let user of users) {
      if (user.lastSolveDate !== today) {
        user.points = Math.max(0, user.points - 5); 
        user.streak = 0; 
        await user.save();
      }
    }
    console.log('Daily maintenance finished.');
  } catch (err) {
    console.error('Cron Job Error:', err);
  }
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/problems', require('./routes/problemRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

app.get('/', (req, res) => {
  res.send('AlgoPulse API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
