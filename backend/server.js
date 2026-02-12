// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const cron = require('node-cron');
// const User = require('./models/User');
// const { syncAllUsersData } = require('./controllers/userController'); 

// // 1. Config Loading
// dotenv.config();

// // 2. Initialize App & Database
// const app = express();
// connectDB();

// // 3. Middlewares
// // CORS setup deployment ke liye optimized
// app.use(cors({
//   origin: [
//     "http://localhost:3000", 
//     "https://algopulse-frontend.onrender.com"
//   ], 
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"]
// }));

// // IMAGE UPLOAD FIX: In do lines se hi base64 images upload hongi
// app.use(express.json({ limit: '50mb' })); 
// app.use(express.urlencoded({ limit: '50mb', extended: true }));

// // 4. Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/problems', require('./routes/problemRoutes'));
// app.use('/api/notifications', require('./routes/notificationRoutes'));
// app.use('/api/discussions', require('./routes/discussionRoutes'));

// app.get('/', (req, res) => {
//   res.send('🚀 AlgoPulse API is live and running...');
// });

// // 5. CRON JOBS

// // Job 1: Daily Maintenance (Penalty & Streak Reset) - Raat 12 baje
// cron.schedule('0 0 * * *', async () => {
//   try {
//     const today = new Date().toISOString().split('T')[0];
    
//     // Jin logo ne aaj solve nahi kiya unka streak 0 aur points -5
//     await User.updateMany(
//       { lastSolveDate: { $ne: today } },
//       { 
//         $inc: { points: -5 }, 
//         $set: { streak: 0 } 
//       }
//     );

//     // Points negative na ho jayein isliye check
//     await User.updateMany(
//       { points: { $lt: 0 } },
//       { $set: { points: 0 } }
//     );

//     console.log('✅ Daily maintenance: Streaks reset and penalties applied.');
//   } catch (err) {
//     console.error('❌ Cron Job Error (Daily):', err);
//   }
// });

// // Job 2: LeetCode Sync - Har 30 minute mein
// cron.schedule('*/30 * * * *', async () => {
//   try {
//     console.log('--- 🔄 Background Syncing LeetCode Data ---');
//     await syncAllUsersData();
//   } catch (err) {
//     console.error('❌ Sync Job Error:', err);
//   }
// });

// // Server start hote hi ek baar sync chalane ke liye
// syncAllUsersData();

// // 6. Server Listen
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`
//   ******************************************
//   🚀 Server Running on Port: ${PORT}
//   🛠️  Mode: Production/Deployment Ready
//   📁 Image Limit: 50MB
//   ******************************************
//   `);
// });

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const cron = require('node-cron');
const User = require('./models/User');
const { syncAllUsersData } = require('./controllers/userController'); 

// 1. Config Loading
dotenv.config();

// 2. Initialize App & Database
const app = express();
connectDB();

// 3. Middlewares
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://algopulse-frontend.onrender.com"
  ], 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

// IMAGE UPLOAD FIX: In do lines se hi base64 images upload hongi
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 4. Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/problems', require('./routes/problemRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/discussions', require('./routes/discussionRoutes'));

app.get('/', (req, res) => {
  res.send('🚀 AlgoPulse API is live and running...');
});

// 5. CRON JOBS

// Job 1: Daily Maintenance (Penalty & Streak Reset) - Raat 12 baje
cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Streak reset logic
    await User.updateMany(
      { lastSolveDate: { $ne: today } },
      { 
        $inc: { points: -5 }, 
        $set: { streak: 0 } 
      }
    );

    // Negative points check
    await User.updateMany(
      { points: { $lt: 0 } },
      { $set: { points: 0 } }
    );

    console.log('✅ Daily maintenance: Streaks reset and penalties applied.');
  } catch (err) {
    console.error('❌ Cron Job Error (Daily):', err);
  }
});

// Job 2: LeetCode Sync - Har 30 minute mein
cron.schedule('*/30 * * * *', async () => {
  try {
    console.log('--- 🔄 Background Syncing LeetCode Data ---');
    await syncAllUsersData();
  } catch (err) {
    console.error('❌ Sync Job Error:', err);
  }
});

// Server start hote hi sync chalane ke liye
syncAllUsersData();

// 6. Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ******************************************
  🚀 Server Running on Port: ${PORT}
  🛠️  Mode: Production/Deployment Ready
  📁 Image Limit: 50MB
  ******************************************
  `);
});