require('dotenv').config();
const { sequelize } = require('./src/models');
const seedDatabase = require('./src/utils/seedData');

const run = async () => {
    console.log('Synchronizing database schema and resetting data...');
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
        console.log('Database successfully dropped and re-synced.');
        await seedDatabase();
        process.exit(0);
    } catch(err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

run();
