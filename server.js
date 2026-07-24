require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');
const Admin = require('./models/Admin');

const app = express();
const PORT = process.env.PORT || 5000;

// ──────────────────────────── Middleware ────────────────────────────

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ──────────────────────────── Routes ────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ──────────────────────────── Database & Server ────────────────────────────

/**
 * Seeds a default admin account if none exists in the database
 */
async function seedAdmin() {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const username = process.env.ADMIN_USERNAME || 'admin';
      const password = process.env.ADMIN_PASSWORD || 'Admin@123';

      await Admin.create({ username, password });
      console.log(`✅ Default admin seeded: username="${username}"`);
    } else {
      console.log(`ℹ️  Admin account already exists (${adminCount} found)`);
    }
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
  }
}

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  try {
    await mongoose.connect(uri, { autoIndex: true, serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB');
    return;
  } catch (err) {
    console.warn(`⚠️  Could not connect to MongoDB at "${uri}" — ${err.message}`);
  }

  // Fallback: use in-memory MongoDB for local development
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    console.log('⏳ Starting in-memory MongoDB (first run may download binaries)...');
    const mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    await mongoose.connect(memUri, { autoIndex: true });
    console.log('✅ Connected to in-memory MongoDB (data will not persist across restarts)');
  } catch (memErr) {
    console.error('❌ Failed to start in-memory MongoDB:', memErr.message);
    process.exit(1);
  }
}

async function startServer() {
  try {
    await connectDB();

    // Seed admin
    await seedAdmin();

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;
