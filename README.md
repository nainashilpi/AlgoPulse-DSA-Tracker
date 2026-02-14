# 🚀 AlgoPulse - Real-Time College Club Management Portal

**AlgoPulse** is a robust MERN stack platform designed for college coding clubs to automate student activity tracking, gamify competitive programming, and foster a collaborative learning environment.

---

## 🌟 Key Features

### 🔄 Automated Activity Sync
- **Real-Time Polling:** Integrated `node-cron` to automatically fetch LeetCode statistics (solve counts, ratings, and streaks) every 30 minutes via external APIs.
- **Zero Manual Entry:** Eliminates the need for manual progress tracking by club leads.

### 🏆 Gamified Leaderboard
- **Live Ranking:** Dynamically ranks club members based on their coding consistency and performance.
- **Streak & Penalty System:** Automated midnight scripts that reset streaks and deduct points for inactive users to ensure daily accountability.

### 💬 Community Discussion Hub
- **Signal Broadcasting:** A social space for members to share solutions, doubts, and screenshots.
- **Image Optimization:** Implemented client-side image compression (Canvas API) to handle high-resolution uploads efficiently while reducing server payload by 60%.

### 🛡️ Secure Infrastructure
- **Authentication:** Secure login/signup using **JWT (JSON Web Tokens)**.
- **Role-Based Access (RBAC):** Admin-specific moderation tools to maintain community decorum and manage posts.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Framer Motion, Lucide React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Task Scheduling:** Node-cron
- **API Client:** Axios

---

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/algopulse.git](https://github.com/your-username/algopulse.git)
2. Install Backend Dependencies:
   ```
   cd server
   npm install
3. Install Frontend Dependencies:
   ```
   cd client
   npm install
4. Environment Variables:
    Create a .env file in the server directory and add:
   ```
   Code snippet
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
5. Environment Variables:
    Create a .env file in the server directory and add:
   ```
   # Start Backend (from server folder)
   npm start

   # Start Frontend (from client folder)
   npm start
  
  🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.




