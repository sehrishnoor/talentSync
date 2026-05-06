const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./src/models');
const seedDatabase = require('./src/utils/seedData');

const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const skillRoutes = require('./src/routes/skill.routes');
const projectRoutes = require('./src/routes/project.routes');
const ratingRoutes = require('./src/routes/rating.routes');
const dropoutRoutes = require('./src/routes/dropout.routes');
const recommendationRoutes = require('./src/routes/recommendation.routes');
const analyticsRoutes = require('./src/routes/analytics.routes');
const connectionRoutes = require('./src/routes/connection.routes');
const messageRoutes = require('./src/routes/message.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/dropouts', dropoutRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/messages', messageRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected.');

    // Sync database (Use { force: true } carefully if you want to drop tables and recreate)
    // Here we'll use alter to keep data but update schema if needed
    const shouldSeed = process.argv.includes('--seed');
    
    if (shouldSeed) {
      await sequelize.sync({ force: true });
      console.log('✅ Database synced (force: true)');
      await seedDatabase();
    } else {
      await sequelize.sync({ alter: true }); 
      console.log('✅ Database synced');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

startServer();
