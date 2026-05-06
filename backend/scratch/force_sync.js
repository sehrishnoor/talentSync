const { sequelize } = require('../src/models');

async function sync() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    await sequelize.sync({ alter: true });
    console.log('✅ Database Synced with alter:true');
  } catch (err) {
    console.error('❌ Sync failed:', err);
  } finally {
    process.exit();
  }
}

sync();
