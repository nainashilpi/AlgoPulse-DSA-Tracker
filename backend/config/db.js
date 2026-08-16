const mongoose = require('mongoose');

const sanitizeUri = (uri) => {
  try {
    const u = new URL(uri);
    u.password = '****';
    return u.href;
  } catch {
    return '[INVALID_URI_FORMAT]';
  }
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('❌ FATAL: MONGO_URI is missing in .env');
    process.exit(1);
  }

  if (!/^mongodb(\+srv)?:\/\//.test(uri)) {
    console.error('❌ FATAL: MONGO_URI has invalid scheme. Expected mongodb:// or mongodb+srv://');
    console.error(`   Received prefix: ${uri.split('://')[0] || '(empty)'}`);
    process.exit(1);
  }

  // Connection lifecycle logging (fires for every connection, drop and reconnect)
  mongoose.connection.on('connected', () => {
    const host = mongoose.connection.host;
    console.log(`✅ MongoDB connected | host=${host} | db=${mongoose.connection.name} | cluster=${host?.split('.')[0]}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB runtime error:');
    console.error(`   - name: ${err.name}`);
    console.error(`   - message: ${err.message}`);
    console.error(`   - code: ${err.code}`);
    console.error(`   - codeName: ${err.codeName}`);
    console.error(`   - uri: ${sanitizeUri(process.env.MONGO_URI)}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔁 MongoDB reconnected');
  });

  mongoose.connection.on('close', () => {
    console.warn('⚠️ MongoDB connection closed');
  });

  // Retry with backoff so transient network issues don't kill the server
  const MAX_ATTEMPTS = 5;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        autoIndex: true,
      });
      console.log(`🚀 Neural Link Established: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`❌ MongoDB connect attempt ${attempt}/${MAX_ATTEMPTS} failed: ${error.message}`);
      console.error(`   - uri: ${sanitizeUri(uri)}`);
      if (attempt < MAX_ATTEMPTS) {
        const delay = attempt * 3000;
        console.log(`   - retrying in ${delay / 1000}s...`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  console.error('🛑 FATAL: All MongoDB connection attempts failed.');
  process.exit(1);
};

module.exports = connectDB;